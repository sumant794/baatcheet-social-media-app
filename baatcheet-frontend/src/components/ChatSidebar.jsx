import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/sidebar.css"
import { socket } from "../socket/socket.js"

export default function ChatSidebar({setActiveChat, loggedInUserId, activeChat}) {
    const [conversations, setConversations] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [unreadMap, setUnreadMap] = useState({})

    const fetchConversations = async () => {
        try {
            const res = await api.get("/chat/conversations")
            //console.log("chat-sidebar: ",res)

            setConversations(res.data.data)
            
        } catch (error) {
            console.error(
                "conversation fetch error: ", error
            )
        }
    }

    useEffect(() => {
        fetchConversations()
        //console.log("ChatSidebar: ",conversations)
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

            // Increment unread if not active chat
            if (data.conversationId !== activeChat?._id?.toString()) {
                setUnreadMap((prev) => ({
                    ...prev,
                    [data.conversationId]: (prev[data.conversationId] || 0) + 1
                }))
            }

        });

        return () => {
            socket.off("sidebar_update");
        };

    }, []);

   useEffect(() => {
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users)
        }

        socket.on("online_users", handleOnlineUsers)

        return () => {
            socket.off("online_users", handleOnlineUsers)
        }
    }, [])

    const  getOtherUser = (members) => {
        return members.find(
            (m) => m._id !== loggedInUserId
        )
    }



    return (
        <div className="sidebar-container">
            <h3 className="sidebar-title">
                Chats
            </h3>
            {conversations.map((convo) => {
                console.log("ChatSidebar: ",conversations)
                const otherUser = getOtherUser(convo.members)
                const isOnline = onlineUsers.includes(otherUser?._id)
                const unreadCount = unreadMap[convo._id] || 0

                console.log("Other-User: ", otherUser)
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

                    </div>
                )
            })}
        </div>
    )
}