import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const {username, email, fullName, password} = req.body

    if([username, email, fullName, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(400, "User with this email or username already exists")
    }

    const user = await User.create({
        username:username.toLowercase(),
        email,
        fullName,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password, -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User registered succesfully")
    )

})

const loginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or:[{ username }, { email }]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User Logged In Succesfully")
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accesToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Succesfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
              .status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", refreshToken, options)
              .json(
                   new ApiResponse(
                        200,
                        {
                             accessToken, refreshToken
                        },
                        "Access Token Refreshed"
                        )
                    )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const { oldPassword, newPassword } = req.body
    
    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(404, "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched Succesfully"))
})

const updateEmail = asyncHandler(async(req, res) => {
    const { email } = req.body

    if(!email.trim()){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                email:email
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Email updated Succesfully"))

})

const updateFullName = asyncHandler(async(req, res) => {
    const { fullName } = req.body

    if(!fullName.trim()){
        throw new ApiError(400, "FullName is  required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fullName:fullName
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "FullName updated Succesfully"))

})

const updateBio = asyncHandler(async(req, res) => {
    const { bio } = req.body

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                bio:bio || ""
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Bio updated Succesfully"))

})

const updateAvatar = asyncHandler(async(req, res) => {
    const localFilePath = req.file?.path
    
    if(!localFilePath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(localFilePath)

    if(!avatar.url){
        throw new ApiError(500, "Something went wrong while uploading on cloudinary")
    }

    if(req.user.avatar !== "https://res.cloudinary.com/.../default-avatar.png"){
        const deletedAvatar = await deleteFromCloudinary(localFilePath)

        if(!deletedAvatar){
            throw new ApiError(500, "Cloudinary delete error")
        }
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        { new: true } 
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json( new ApiResponse(200, user, "Avatar updated succesfully"))

})

const removeAvatar = asyncHandler(async(req, res) => {
    const oldAvatar = req.user.avatar

    if(!oldAvatar){
        throw new ApiError(400, "Avatar File is missing")
    }

    if(oldAvatar !== "https://res.cloudinary.com/.../default-avatar.png"){
        const deletedAvatar = await deleteFromCloudinary(oldAvatar)

        if(!deletedAvatar){
            throw new ApiError(500, "Cloudinary delete error")
        }
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: "https://res.cloudinary.com/.../default-avatar.png"
            }
        },
        { new: true } 
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json( new ApiResponse(200, user, "Avatar removed  succesfully"))

})










export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateEmail,
    updateFullName,
    updateBio,
    updateAvatar,
    removeAvatar
}