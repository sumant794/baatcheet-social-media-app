import { useState } from "react";
import api from "../api/axios";
import "../styles/messageinput.css"

export default function MessageInput({ activeChat, setMessages}){
    const [text, setText] = useState("")

    const sendMessage = async () => {
        if(!text.trim()) return;

        try {
            const res = await api.post(
                "/chat/messages",
                {
                    conversationId: activeChat._id,
                    text
                }
            )
                setMessages((prev) => [
                    ...prev,
                    res.data.data
                ])

                setText("")
        } catch (error) {
            console.error(
                "Send message error:", error
            )
        }
    }

    return (
        <div clasName="message-input-container">
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="message-input"
            />

            <button
                onClick={sendMessage}
                className="send-btn"
            >
                Send
            </button>
        </div>
    )
}