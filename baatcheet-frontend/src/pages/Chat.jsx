import { useState } from "react";
import "../styles/chat.css";
import { useAuth } from "../context/useAuth.js";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const { user } = useAuth()

  const loggedInUserId = user._id
  console.log("Active-chat: ", activeChat)

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
