import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/sidebar.css"
import { socket } from "../socket/socket.js"
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function ChatSidebar({ setActiveChat, loggedInUserId, activeChat }) {
    const [conversations, setConversations] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [unreadMap, setUnreadMap] = useState({})
    const [showDeleteMenu, setShowDeleteMenu] = useState(null)

    const fetchConversations = async () => {
        try {
            const res = await api.get("/chat/conversations")
            setConversations(res.data.data)

        } catch (error) {
            console.error(
                "conversation fetch error: ", error
            )
        }
    }

    const deleteConversation = async (conversationId, e) => {
        e.stopPropagation()

        try {
            await api.delete(`/chat/conversation/${conversationId}`)
            setConversations((prev) =>
                prev.filter((convo) => convo._id !== conversationId)
            )
            setShowDeleteMenu(null)
        } catch (error) {
            console.error("Delete conversation error:", error)
        }
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    useEffect(() => {

        socket.on("sidebar_update", (data) => {

            setConversations((prev) =>
                prev.map((convo) =>
                    convo._id === data.conversationId
                        ? {
                            ...convo,
                            lastMessage: data.lastMessage,
                            lastMessageAt: data.lastMessageAt
                        }
                        : convo
                )
            );

            // Increment unread only if this conversation is NOT active and message is not from current user
            const isActiveConvo = activeChat && 
                (
                    activeChat._id == data.conversationId || String(activeChat._id) === String(data.conversationId)
                );
            if (!isActiveConvo && data.senderId !== loggedInUserId) {
                setUnreadMap((prev) => ({
                    ...prev,
                    [data.conversationId]: (prev[data.conversationId] || 0) + 1
                }))
            }

        });

        return () => {
            socket.off("sidebar_update");
        };

    }, [activeChat, loggedInUserId]);

    useEffect(() => {
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users)
        }

        socket.on("online_users", handleOnlineUsers)

        return () => {
            socket.off("online_users", handleOnlineUsers)
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.convo-delete-btn') && !event.target.closest('.convo-delete-dropdown')) {
                setShowDeleteMenu(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const getOtherUser = (members) => {
        return members.find(
            (m) => m._id !== loggedInUserId
        )
    }



    return (
        <div className="sidebar-container">
            <div className="sidebar-title">
                <div className="arrow"><Link to="/home"><FaArrowLeft /></Link></div>
                <h3>Chats</h3>
            </div>
            {conversations.map((convo) => {
                const otherUser = getOtherUser(convo.members)
                const isOnline = onlineUsers.includes(otherUser?._id)
                const unreadCount = unreadMap[convo._id] || 0

                return (
                    <div
                        key={convo._id}
                        className="sidebar-user"
                        onClick={() => {
                            setActiveChat(convo)
                            setUnreadMap((prev) => ({
                                ...prev,
                                [convo._id.toString()]: 0
                            }))
                        }}
                    >
                        <div className="avatar-wrapper">
                            <img
                                src={otherUser?.avatar || "default-avatar.png"}
                                alt=""
                                className="sidebar-avatar"
                            />
                            {isOnline && <span className="online-dot"></span>}
                        </div>

                        <div>
                            <h4>{otherUser?.username}</h4>
                            <p className="last-msg">
                                {convo.lastMessage || "Start Chatting"}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <div className="unread-badge">
                                {unreadCount}
                            </div>
                        )}

                        <div className="convo-delete-wrapper">
                            <button
                                className="convo-delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteMenu(showDeleteMenu === convo._id ? null : convo._id)
                                }}
                                title="Delete conversation"
                            >
                                ▼
                            </button>
                            {showDeleteMenu === convo._id && (
                                <div className="convo-delete-dropdown">
                                    <button
                                        className="convo-delete-item"
                                        onClick={(e) => deleteConversation(convo._id, e)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}