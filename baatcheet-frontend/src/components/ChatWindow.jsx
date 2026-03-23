import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css";
import MessageInput from "./MessageInput.jsx";
import { socket } from "../socket/socket.js";
import { formatDateSeparator, formatMessageTime } from "../utils/timeAgo.js";
import { FaArrowLeft } from "react-icons/fa"


export default function ChatWindow({ activeChat, loggedInUserId, setActiveChat }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false)
    const [showMessageMenu, setShowMessageMenu] = useState(null)

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

    const deleteMessage = async (messageId, e) => {
        e.stopPropagation()

        try {
            await api.delete(`/chat/message/${messageId}`)
            setMessages((prev) =>
                prev.filter((msg) => msg._id !== messageId)
            )
        } catch (error) {
            console.error("Delete message error:", error)
        }
    }

    useEffect(() => {
        if (!activeChat?._id) return;

        fetchMessages()
        socket.emit("join_chat", activeChat._id)

        return () => {
            socket.emit("leave_chat", activeChat._id)
        }
    }, [activeChat])

    useEffect(() => {
        if (!activeChat?._id) return

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
    }, [messages, isTyping]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.msg-menu-btn') && !event.target.closest('.msg-menu-dropdown')) {
                setShowMessageMenu(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])


    useEffect(() => {

        const handleReceive = (message) => {
            if (message.conversationId !== activeChat?._id) return;
            setMessages((prev) => {
                const existingIndex = prev.findIndex((msg) => msg._id === message._id);
                if (existingIndex !== -1) {
                    // Update existing message
                    const updated = [...prev];
                    updated[existingIndex] = message;
                    return updated;
                } else {
                    // Add new message
                    return [...prev, message];
                }
            });
        };

        socket.on("receive_message", handleReceive);

        return () => {
            socket.off("receive_message", handleReceive);
        };

    }, [activeChat?._id]);

    useEffect(() => {
        const handleSeen = (conversationId) => {
            if (conversationId !== activeChat?._id) return

            setMessages((prev) =>
                prev.map((msg) => ({
                    ...msg,
                    isSeen: msg.senderId._id === loggedInUserId ? true : msg.isSeen
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

    useEffect(() => {
        const handleMessageDeleted = (data) => {
            if (data.conversationId !== activeChat?._id) return
            setMessages((prev) =>
                prev.filter((msg) => msg._id !== data.messageId)
            )
        }

        socket.on("message_deleted", handleMessageDeleted)

        return () => {
            socket.off("message_deleted", handleMessageDeleted)
        }
    }, [activeChat?._id])

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

                <button
                    className="chat-back-btn"
                    onClick={() => setActiveChat(null)}
                >
                    <FaArrowLeft />
                </button>

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
                                className={`message-row ${isMe
                                        ? "me"
                                        : "other"
                                    }`}
                            >
                                <div className="bubble">
                                    <p>{msg.text}</p>
                                    <div className="msg-footer">
                                        <p className="msg-time">
                                            {formatMessageTime(msg.createdAt)}
                                        </p>
                                        {isMe && msg.isSeen && (
                                            <p className="seen-status">Seen</p>
                                        )}
                                    </div>
                                    {isMe && (
                                        <div className="msg-menu-wrapper">
                                            <button
                                                className="msg-menu-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowMessageMenu(showMessageMenu === msg._id ? null : msg._id)
                                                }}
                                                title="Delete message"
                                            >
                                                ▼
                                            </button>
                                            {showMessageMenu === msg._id && (
                                                <div className="msg-menu-dropdown">
                                                    <button
                                                        className="msg-menu-item delete-msg-option"
                                                        onClick={(e) => deleteMessage(msg._id, e)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="typing-area">
                        <div className="typing-wrapper">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                )}

            </div>


            <MessageInput
                activeChat={activeChat}
                setMessages={setMessages}
            />

        </div>
    );
}
