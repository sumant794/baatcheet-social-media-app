import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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







export {registerUser}