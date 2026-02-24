import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { getIO } from "..../socket/socket.js";

const createConversation = asyncHandler(async(req, res) => {
    console.log("CreateConversation is hit")
    const senderId = req.user?._id
    console.log(senderId)
    const { receiverId } = req.body;
    console.log(req.body)

    if(!receiverId) {
        throw new ApiError(400, "ReceiverId is required")
    }
    
    if(!mongoose.isValidObjectId(receiverId)){
        throw new ApiError(400, "Invalid Receiver Object Id")
    }

    let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] }
    }).populate("members", "username fullName avatar")

    console.log(conversation)

    if(conversation) {
        console.log("heyy")
        return res.status(200).json(
            new ApiResponse(
                200,
                conversation,
                "Conversation fetched Succcesfully"
            )
        )  
    }

    conversation = await Conversation.create({
        members: [senderId, receiverId]
    })

    const populatedConversation = await Conversation.findById(conversation._id).populate(
        "members",
        "username fullName avatar"
    )

    console.log("conversation-2: ", populatedConversation)

    return res.status(201).json(
            new ApiResponse(
                201,
                populatedConversation,
                "Conversation created successfully"
            )
    )


})

const getUserConversations = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    console.log(userId)
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Innvalid User Id")
    }

    const conversations = await Conversation.find({
        members: userId
    })
    .populate("members", "username fullName avatar")
    .sort({ lastMessageAt: -1, updatedAt: -1})

    console.log("user-conversation: ",conversations)

    return res.status(200).json(
        new ApiResponse(200, conversations, "Conversations fetched Successfully")
    )
})

const getMessages =  asyncHandler(async(req, res) => {

    const { conversationId } = req.params
    console.log(req.params)
    const userId = req.user?._id
    console.log(userId)
    if(!mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid Convesation Id");
    }

    const conversation = await Conversation.findById(conversationId)
    console.log(conversation)
    if(!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    if(!conversation.members.includes(userId)){
        throw new ApiError(403, "You are not part of this conversation")
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        conversationId
    })
    .populate("senderId", "username fullName avatar")
    .sort({ createdAt: 1})
    .skip(skip)
    .limit(limit)

    console.log(messages)

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
    console.log(senderId)
    const { conversationId, text } = req.body
    console.log(req.body)
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
    console.log("Message: ",conversation)

    if(!conversation) {
        throw new ApiError(404, "Conversation not found")
    }

    const isMember = conversation.members.some(
        (member) => member.toString() === senderId.toString()
    )

    console.log(isMember)

    if(!isMember){
        throw new ApiError(403, "You are not allowed to send message in this conversation")
    }

    const message = await Message.create({
        conversationId,
        senderId,
        text,
        messageType: "text"
    })
    console.log("created-message: ", message)
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date()

    await conversation.save()

    const populatedMessage = await Message.findById(
        message._id
    )
    .populate("senderId", "username fullName avatar")

    const io = getIO()

    io.to(conversationId.toString()).emit("receive_message", populatedMessage)

    io.to(conversationId.toString()).emit("sidebar_update", {
        conversationId,
        lastMessage: text,
        lastMessageAt: conversation.lastMessageAt
    })

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