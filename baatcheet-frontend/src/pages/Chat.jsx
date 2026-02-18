import { useState } from "react";
import "../styles/chat.css";
import { useAuth } from "../context/useAuth.js";
import ChatSidebar from "../components/ChatSidebar.jsx";

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useAuth()

  const loggedInUserId = user._id

  return (
    <div className="chat-container">

      {/* Sidebar */}
      <div className="chat-sidebar">
        <ChatSidebar 
            setActiveChat={setActiveChat}
            loggedInUserId={loggedInUserId}
        />
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {activeChat ? (
          <p>Chat Open</p>
        ) : (
          <p className="empty-text">
            Select a chat to start messaging
          </p>
        )}
      </div>

    </div>
  );
}
