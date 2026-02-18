import { useState,useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css"

export default function ChatWindow ({ activeChat }){
    const [messages, setMessages] = useState([])
    console.log("Active-chat: ",activeChat._id)

    const fetchMessages = async () => {
        if(!activeChat) return;

        try {
            const res = await api.get(`chat/messages/${activeChat._id}`)
            setMessages(res.data.data)
        } catch (error) {
            "Messages fetch error: ", error
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [activeChat])

    if(!activeChat) {
        return (
            <div className="chat-window-empty">
                Select a chat to start messaging
            </div>
        )
    }

    return(
        <div className="chatwindow-container">
            {messages.map((msg) => {
                <div
                    key={msg._id}
                    className="message"
                >
                    <b>
                        {msg.senderId.username}
                    </b>
                    <p>{msg.text}</p>
                </div>
            })}
        </div>
    )
}