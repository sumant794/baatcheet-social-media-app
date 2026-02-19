import { useState,useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css"
import MessageInput from "./MessageInput.jsx";

export default function ChatWindow ({ activeChat, loggedInUserId }){
    const [messages, setMessages] = useState([])

    const fetchMessages = async () => {
        if(!activeChat) return;

        try {
            const res = await api.get(`chat/messages/${activeChat._id}`)
            console.log("Mesaages-response: ", res)
            setMessages(res.data.data)
            console.log("Messages: ",messages)
        } catch (error) {
            "Messages fetch error:", error
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [activeChat])

    useEffect(() => {
  console.log("Messages-Effect:", messages);
}, [messages]);


    if(!activeChat) {
        return (
            <div className="chat-window-empty">
                Select a chat to start messaging
            </div>
        )
    }

    return(
        <div className="chatwindow-wrapper">
            <div className="chatwindow-container">

                <div className="chat-header">
                    <img
                        src={
                            activeChat.members[0].avatar || "default-avatar.png"
                        }
                    />

                    <h3>{activeChat.members[0].fullName}</h3>
                </div>
                {messages.map((msg) => {
                    const isMe = msg.senderId?._id === loggedInUserId
                    return(
                        <div
                            key={msg._id}
                            className={`message-row ${
                                isMe ? "me" : "other"
                            }`}
                        >
                            <div className="bubble">
                                <p>{msg.text}</p>
                            </div>
                        </div>
                )})}
            </div>

            <MessageInput
                activeChat={activeChat}
                setMessages={setMessages}
            />

        </div>
    )
}