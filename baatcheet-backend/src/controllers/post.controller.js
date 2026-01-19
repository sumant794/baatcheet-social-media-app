import mongoose, {isValidObjectId} from "mongoose";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const createPost = asyncHandler(async(req, res) => {
    const { caption } = req.body

    if(!caption || !caption.trim()){
        throw new ApiError(400, "Caption is required")
    }

    const imageLocalPath = req.file?.path
    if(!imageLocalPath){
        throw new ApiError(400, "Image file is missing")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image?.url){
        throw new ApiError(500, "Image upload failed")
    }

    const post = await Post.create({
        caption,
        image: image.url,
        owner: req.user._id
    })

    const createdPost = await Video.findById(post._id)

    if(!createdPost){
        throw new ApiError(500, "Something went wrong while creating post")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdPost, "Post created Successfully")
    )

})

const getPostById = asyncHandler(async(req, res) => {
    const { postId } = req.params

    if(!mongoose.isValidObjectId(postId)){
        throw new ApiError(400, "Invalid object id")
    }

    const post = await Post.findById(postId).populate(
        "owner", "username avatar"
    )

    if(!post){
        throw new ApiError(404, "Post does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "Post fetched successfully")
    )
})

const getUserPosts = asyncHandler(async(req, res) => {
  const { userId } = req.params

  if(!mongoose.isValidObjectId(userId)){
    throw new ApiError(400, "Invalid user id")
  }

  const posts = await Post.find({ owner: userId })
    .populate("owner", "username avatar fullName")
    .sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(200, posts, "User posts fetched successfully")
  )
})

const updatePost = asyncHandler(async(req, res) =>{
    const { caption } = req.body
    const { postId }  = req.params

    if(!mongoose.isValidObjectId(postId)){
        throw new ApiError(400, "Invalid Post Id")
    }
    
    if(!caption.trim()){
        throw new ApiError(400, "Caption is Required")
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError(404, "Post not found")
    }

    if(post.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You cannot edit this post")
    }

    post.caption = caption
    await post.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "Post updated successfully")
    )

})

const getFeed = asyncHandler(async(req, res) =>{
    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const followingIds = user.followingIds
    followingIds.push(req.user._id)

    const feedPosts = await Post.find({
        owner: { $in: followingIds }
    })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })

    return res
    .status(200)
    .json(
        new ApiResponse(200, feedPosts, "Feedposts fetched successfully")
    )

})

const deletePost = asyncHandler(async(req, res) => {
    const { postId }  = req.params

    if(!mongoose.isValidObjectId(postId)){
        throw new ApiError(400, "Invalid Post Id")
    }

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError(404, "Post not found")
    }

    if(post.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You cannot delete this post")
    }

    await Post.findByIdAndDelete(commentId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Post delted successfully")
    )
})





export {
    createPost,
    getPostById,
    getUserPosts,
    updatePost,
    getFeed,
    deletePost
}