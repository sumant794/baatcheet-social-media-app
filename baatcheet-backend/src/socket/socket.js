import { Server } from "socket.io";
import { Message } from "../models/message.model";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://10.179.197.252:5173",
        "https://your-frontend-domain.com", // later replace
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("✅ Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("mark_seen", async (conversationId) => {
      await Message.updateMany(
        {
          conversationId,
          isSeen: false
        },
        {isSeen: true}
      )
      io.to(conversationId).emit("messages_seen", conversationId)
    })
    
  });
};

// 🔹 use anywhere
export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};