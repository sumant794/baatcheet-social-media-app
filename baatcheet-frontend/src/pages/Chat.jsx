import { useState, useEffect } from "react";
import "../styles/chat.css";
import { useAuth } from "../context/useAuth.js";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useLocation } from "react-router-dom";

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useAuth()

  const loggedInUserId = user._id
  console.log("Active-chat: ", activeChat)
  const location = useLocation()

  useEffect(() => {
    if (location?.state?.conversation) {
      setActiveChat(location.state.conversation)
    }
  }, [location])

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
        <ChatWindow
          activeChat={activeChat}
          loggedInUserId={loggedInUserId}
        />
      </div>

    </div>
  );
}
