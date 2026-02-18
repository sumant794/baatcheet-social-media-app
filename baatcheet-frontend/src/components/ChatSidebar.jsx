import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ChatSidebar({setActiveChat, loggedInUserId}) {
    const [conversations, setConversations] = useState([])

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

    useEffect(() => {
        fetchConversations()
    })

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
                const otherUser = getOtherUser(convo.members)
                return (
                    <div
                        key={convo._id}
                        className="sidebar-user"
                        onClick={setActiveChat(convo)}
                    >
                        <img 
                            src= ""
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