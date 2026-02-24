import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css";
import MessageInput from "./MessageInput.jsx";

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
        fetchMessages();
    }, [activeChat]);

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
                activeChat.members[0]
                ?.avatar ||
                "default-avatar.png"
            }
            className="chat-header-avatar"
            />

            <h3>
            {
                activeChat.members[0]
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
