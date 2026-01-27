import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken()
        
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })
        
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    console.log("register")
    const {username, email, fullName, password} = req.body
    console.log(req.body)
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
        username: username.toLowerCase(),
        email,
        fullName,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
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
    console.log("login" ,req.body)
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
        throw new ApiError(401, "Invalid Pasword")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password"
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
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Succesfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
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
    console.log("getcurrentuser")
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

    const deletedAvatar = await deleteFromCloudinary(req.user.avatar)
    
    if(!deletedAvatar){
        throw new ApiError(500, "Cloudinary delete error")
    }
 
    const avatar = await uploadOnCloudinary(localFilePath)
    
    if(!avatar.url){
        throw new ApiError(500, "Something went wrong while uploading on cloudinary")
    }


    const user = await User.findByIdAndUpdate(
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

    const deletedAvatar = await deleteFromCloudinary(oldAvatar)
    
    if(!deletedAvatar){
        throw new ApiError(500, "Cloudinary delete error")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: ""
            }
        },
        { new: true } 
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json( new ApiResponse(200, user, "Avatar removed  succesfully"))

})

const toggleFollow = asyncHandler(async (req, res) => {
    const { accountId } = req.params
    
    const userId = req.user._id

    if (!mongoose.isValidObjectId(accountId)) {
    throw new ApiError(400, "Invalid account id")
    }

    if (accountId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot follow yourself")
    }

    const account = await User.findById(accountId)
   
    if (!account) {
    throw new ApiError(404, "Account not found")
    }

    const isFollowing = account.followers.includes(userId)
    
    if (!isFollowing) {
        const account = await User.findByIdAndUpdate(
            accountId,
            {
                $addToSet: { followers: userId }  
            },
            { new:true }
        )
        
        const user = await User.findByIdAndUpdate(
            userId, 
            {
                $addToSet: { following: accountId }
            },
            { new:true }
        )
        
        return res.status(200).json(
        new ApiResponse(200, {account, user}, "Followed successfully")
        )
    } 
    else {
        const account = await User.findByIdAndUpdate(
            accountId, 
            {
                $pull: { followers: userId }
            },
            { new:true }
        )

        const user = await User.findByIdAndUpdate(
            userId, 
            {
                $pull: { following: accountId }
            },
            { new:true }
        )

        return res.status(200).json(
        new ApiResponse(200, {account, user}, "Unfollowed successfully")
        )
    }
})

const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query
   
    if(!query || !query.trim()){
        return res
        .status(200).json(
            new ApiResponse(200, [], "No Query")
        )
    }

    const users = await User.find({
        username:{ $regex: query, $options:"i" }
    })
    .select("username avatar fullName")
    .limit(10)
    
    //validate users

    return res
    .status(200)
    .json(
        new ApiResponse(200, users, "Users fetched Successfully")
    )
})

const getUserProfile = asyncHandler(async(req, res) => {
    const { userId } = req.params
    
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User Id")
    }

    const user = await User.findById(userId)
        .select("-password -refreshToken")
        .populate("followers", "username avatar fullName")
        .populate("following", "username avatar fullName")
    
    if(!user){
        throw new ApiError(404, "User Not Found")
    }

    const isFollowing = user.followers.some(
        (follower) => follower._id.toString() === userId.toString()
    )
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, { user, isFollowing}, "User Profile Fetched Successfully")
    )

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
    removeAvatar,
    toggleFollow,
    searchUsers,
    getUserProfile
}