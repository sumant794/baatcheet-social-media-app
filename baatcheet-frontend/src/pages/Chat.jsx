import { useState, useEffect } from "react";
import "../styles/chat.css";
import { useAuth } from "../context/useAuth.js";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useLocation } from "react-router-dom";
import { socket } from "../socket/socket"

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
  const { user } = useAuth()

  const loggedInUserId = user._id
  console.log("Active-chat: ", activeChat)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (location?.state?.conversation) {
      setActiveChat(location.state.conversation)
    }
  }, [location])

  useEffect(() => {
    if (!user?._id) return

    socket.emit("user_online", user._id)
  }, [user?._id])

  return (
    <div className="chat-container">

      {(!isMobile || !activeChat) && (
        <div className="chat-sidebar">
          <ChatSidebar
            setActiveChat={setActiveChat}
            loggedInUserId={loggedInUserId}
            activeChat={activeChat}
          />
        </div>
      )}

      {(!isMobile || activeChat) && (
        <div className="chat-window">
          <ChatWindow
            activeChat={activeChat}
            loggedInUserId={loggedInUserId}
            setActiveChat={setActiveChat}
          />
        </div>
      )}

    </div>
  );
}
