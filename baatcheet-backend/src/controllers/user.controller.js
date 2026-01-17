import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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







export {
    registerUser,
    loginUser,
    logoutUser
}