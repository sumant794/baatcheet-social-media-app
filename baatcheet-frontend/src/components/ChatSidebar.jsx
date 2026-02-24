import { useState, useEffect } from "react";
import api from "../api/axios.js";
import "../styles/sidebar.css"
export default function ChatSidebar({setActiveChat, loggedInUserId}) {
    const [conversations, setConversations] = useState([])

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
                console.log("Other-User: ", otherUser)
                return (
                    <div
                        key={convo._id}
                        className="sidebar-user"
                        onClick={() => setActiveChat(convo)}
                    >
                        <img
                            src={otherUser.avatar || "default-avatar.png"}
                            alt=""
                            className="sidebar-avatar"
                        />

                        <div>
                            <h4>{otherUser?.username}</h4>
                            <p className="last-msg">
                                {convo.lastMessage || "Start Chatting"}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}