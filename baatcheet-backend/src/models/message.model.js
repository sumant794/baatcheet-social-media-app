import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        text: {
            type: String,
            trim: true,
            default: ""
        },
        messageType: {
            type: String,
            enum: ["text", "image", "video", "audio", "file"],
            default: "text"
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
        }
    }, 
    { timestamps: true}
)

export const Message = mongoose.model("Message", messageSchema);