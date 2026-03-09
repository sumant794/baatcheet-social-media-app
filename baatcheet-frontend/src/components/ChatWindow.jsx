import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css";
import MessageInput from "./MessageInput.jsx";
import { socket } from "../socket/socket.js";
import { formatDateSeparator, formatMessageTime } from "../utils/timeAgo.js";


export default function ChatWindow({ activeChat, loggedInUserId }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false)

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
        if(!activeChat?._id) return

        socket.emit("mark_seen", activeChat._id)
    }, [activeChat?._id])

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

    // useEffect(() => {
    //     socket.on("receive_message", (message) => {
    //         if(message.conversationId !== activeChat?._id) return

    //         setMessages((prev) => [...prev, message])
    //     })

    //     return () => {
    //         socket.off("receive_message")
    //     }
    // }, [activeChat])

    useEffect(() => {

        const handleReceive = (message) => {
            if (message.conversationId !== activeChat?._id) return;
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receive_message", handleReceive);

        return () => {
            socket.off("receive_message", handleReceive);
        };

    }, [activeChat?._id]);

    useEffect(() => {
        const handleSeen = (conversationId) => {
            if(conversationId !== activeChat?._id) return
            
            setMessages((prev) =>
                prev.map((msg) =>({
                    ...msg,
                    isSeen:true
                }))
            )
        }

        socket.on("messages_seen", handleSeen)

        return () => {
            socket.off("messages_seen", handleSeen)
        }
    }, [activeChat?._id])

    useEffect(() => {
        const handleTyping = () => {
            setIsTyping(true)
        }

        const handleStopTyping = () => {
            setIsTyping(false)
        }

        socket.on("user_typing", handleTyping)
        socket.on("user_stop_typing", handleStopTyping)

        return () => {
            socket.off("user_typing", handleTyping)
            socket.off("user_stop_typing", handleStopTyping)
        }

    }, [])

    if (!activeChat) {
    return (
        <div className="chatwindow-wrapper">
        <div className="chat-window-empty">
            <p>Select a chat to start messaging</p>
        </div>
        </div>
    );
    }

    const otherUser = activeChat?.members?.find(
        (member) => member._id !== loggedInUserId
    )

    return (
        <div className="chatwindow-wrapper">

        <div className="chat-header">
            <img
            src={
                otherUser
                ?.avatar ||
                "default-avatar.png"
            }
            className="chat-header-avatar"
            />

            <h3>
            {
                otherUser
                ?.fullName
            }
            </h3>
        </div>

        <div className="messages-container">
            {messages.map((msg, index) => {
                const currentDate = new Date(msg.createdAt).toDateString()
                const prevDate = 
                    index > 0
                        ? new Date(messages[index - 1].createdAt).toDateString()
                        : null

                const showDateSeparator = currentDate !== prevDate
                const isMe = msg.senderId?._id === loggedInUserId;

            return (
                <div key={msg._id}>
                    {showDateSeparator && (
                        <div className="date-separator">
                            {formatDateSeparator(msg.createdAt)}
                        </div>
                    )}
                    <div
                    className={`message-row ${
                        isMe
                        ? "me"
                        : "other"
                    }`}
                    >
                    <div className="bubble">
                        <p>{msg.text}</p>
                        <p className="msg-time">
                            {formatMessageTime(msg.createdAt)}
                        </p>
                        {isMe && msg.isSeen && (
                            <p className="seen-status">Seen</p>
                        )}
                    </div>
                    </div>
                </div>
            );
            })} 
        </div>

        {isTyping && (
            <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        )}

        <MessageInput
            activeChat={activeChat}
            setMessages={setMessages}
        />

        </div>
    );
}
