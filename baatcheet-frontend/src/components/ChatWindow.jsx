import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css";
import MessageInput from "./MessageInput.jsx";
import { socket } from "../socket/socket.js";

export default function ChatWindow({ activeChat,loggedInUserId }) {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        if (!activeChat) return;

        try {
        const res = await api.get(
            `chat/messages/${activeChat._id}`
        );

        setMessages(res.data.data);
        } catch (error) {
        console.error(
            "Messages fetch error:",
            error
        );
        }
    };

    useEffect(() => {
        fetchMessages()
    }, [activeChat])

    useEffect(() => {
        if(!activeChat?._id) return;

        socket.emit("join_chat", activeChat._id)

        console.log("Joined room:",activeChat._id)

        return () => {
            socket.emit("leave_chat", activeChat._id)
        }
    }, [activeChat])

    useEffect(() => {
        const el =
        document.querySelector(
            ".messages-container"
        );

        if (el) {
        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
        });
        }
    }, [messages]);

    useEffect(() => {
        socket.on("receive_message", (message) => {
            if(message.conversationId !== activeChat?._id) return

            setMessages((prev) => [...prev, message])
        })

        return () => {
            socket.off("receive_message")
        }
    }, [activeChat])

    if (!activeChat) {
    return (
        <div className="chatwindow-wrapper">
        <div className="chat-window-empty">
            <p>Select a chat to start messaging</p>
        </div>
        </div>
    );
    }


    return (
        <div className="chatwindow-wrapper">

        <div className="chat-header">
            <img
            src={
                activeChat.members[1]
                ?.avatar ||
                "default-avatar.png"
            }
            className="chat-header-avatar"
            />

            <h3>
            {
                activeChat.members[1]
                ?.fullName
            }
            </h3>
        </div>

        <div className="messages-container">
            {messages.map((msg) => {
            const isMe =
                msg.senderId?._id ===
                loggedInUserId;

            return (
                <div
                key={msg._id}
                className={`message-row ${
                    isMe
                    ? "me"
                    : "other"
                }`}
                >
                <div className="bubble">
                    <p>{msg.text}</p>
                </div>
                </div>
            );
            })}
        </div>

        <MessageInput
            activeChat={activeChat}
            setMessages={setMessages}
        />

        </div>
    );
}
