import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    // Validate postId
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
        // Unlike: Delete the like and decrement count
        await Like.deleteOne({ postId, userId });
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likesCount: -1 } },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, 
                { 
                    isLiked: false, 
                    likesCount: updatedPost.likesCount 
                }, 
                "Post unliked successfully"
            )
        );
    } else {
        // Like: Create like and increment count
        await Like.create({ postId, userId });
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { likesCount: 1 } },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, 
                { 
                    isLiked: true, 
                    likesCount: updatedPost.likesCount 
                }, 
                "Post liked successfully"
            )
        );
    }
});

const checkUserLiked = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    const like = await Like.findOne({ postId, userId });

    return res.status(200).json(
        new ApiResponse(200, 
            { isLiked: !!like }, 
            "Like status fetched successfully"
        )
    );
});

export { toggleLike, checkUserLiked };
