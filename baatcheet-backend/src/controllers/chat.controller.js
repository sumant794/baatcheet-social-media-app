import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";

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

const getMessages =  asyncHandler(async(req, res) => {

    const { conversationId } = req.params
    const userId = req.user?._id

    if(!mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid Convesation Id");
    }

    const conversation = await Conversation.findById(conversationId)

    if(!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    if(!conversation.members.includes(userId)){
        throw new ApiError(403, "You are not part of this conversation")
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseint(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        conversationId
    })
    .populate("senderId", "username fullName avatar")
    .sort({ createdAt: 1})
    .skip(skip)
    .limit(limit)

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    )
})

const sendMessage = asyncHandler(async(req, res) => {
    const senderId = req.user?._id
    const { conversationId, text } = req.body

    if(!conversationId) {
        throw new ApiError(400, "conversation Id is required")
    }

    if(!mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid Object Id")
    }

    if(!text) {
        throw new ApiError(400, "Message text is required");
    }

    const conversation = await Conversation.findById(conversationId)

    if(!conversation) {
        throw new ApiError(404, "Conversation not found")
    }

    const isMember = conversation.members.some(
        (member) => member.toString() === senderId.toString()
    )

    if(!isMember){
        throw new ApiError(403, "You are not allowed to send message in this conversation")
    }

    const message = await Message.create({
        conversationId,
        senderId,
        text,
        messageType: "text"
    })

    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date()

    await conversation.save()

    const populatedMessage = await Message.findById(
        message._id
    )
    .populate("senderId", "username fullName avatar")

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedMessage,
            "Message sent successfully"
        )
    )
})

export {
    createConversation,
    getUserConversations,
    getMessages,
    sendMessage
}