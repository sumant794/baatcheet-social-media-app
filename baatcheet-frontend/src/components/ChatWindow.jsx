import { useState,useEffect } from "react";
import api from "../api/axios.js";
import "../styles/chatwindow.css"
import MessageInput from "./MessageInput.jsx";

export default function ChatWindow ({ activeChat }){
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
                {messages.map((msg) => {
                    return(
                        <div
                            key={msg._id}
                            className="message"
                        >
                            <b>
                                {msg.senderId.username}
                            </b>
                            <p>{msg.text}</p>
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