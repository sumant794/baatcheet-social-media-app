import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate postId
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Validate text
    if (!text || !text.trim()) {
        throw new ApiError(400, "Comment text is required");
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Create comment
    const comment = await Comment.create({
        postId,
        userId,
        text: text.trim()
    });

    // Populate user details
    const populatedComment = await Comment.findById(comment._id).populate("userId", "username avatar fullName");

    // Increment comment count on post
    await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentCount: 1 } },
        { new: true }
    );

    return res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment added successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Validate commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if user is comment owner
    if (comment.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    // Get postId before deleting
    const postId = comment.postId;

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    // Decrement comment count on post
    await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentCount: -1 } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});

const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post ID");
    }

    // Get all comments for a post
    const comments = await Comment.find({ postId })
        .populate("userId", "username avatar fullName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
});

export { addComment, deleteComment, getPostComments };
