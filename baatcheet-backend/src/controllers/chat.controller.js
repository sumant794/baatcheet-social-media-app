import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createConversation = asyncHandler(async(req, res) => {
    const senderId = req.user?._id
    const { receiverId } = req.body;

    if(!receiverId) {
        throw new ApiError(400, "ReceiverId is required")
    }
    
    if(!mongoose.isValidObjectId(receiverId)){
        throw new ApiError(400, "Invalid Receiver Object Id")
    }

    let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] }
    })

    if(conversation) {
        return res.status(200).json(
            new ApiResponse(
                200,
                conversation,
                "Conversation fetched Succcesfully"
            )
        )  
    }

    conversation = await Conversation.create({
        menbers: [senderId, receiverId]
    })

    return res.status(201).json(
        new ApiResponse(201).json(
            new ApiResponse(
                201,
                conversation,
                "Conversation created successfully"
            )
        )
    )


})

const getUserConversations = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Innvalid User Id")
    }

    const conversations = await Conversation.find({
        members: userId
    })
    .populate("members", "username fullName avatar")
    .sort({ lastMessageAt: -1, updatedAt: -1})

    return res.status(200).json(
        new ApiResponse(200, conversations, "Conversations fetched Successfully")
    )
})

export {
    createConversation,
    getUserConversations
}