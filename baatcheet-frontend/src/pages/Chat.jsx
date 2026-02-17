import { useState } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";

export default function Chat() {
  const [activeChat, setActiveChat] =
    useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex">
      <ChatSidebar
        setActiveChat={setActiveChat}
      />

      <div className="w-2/3 flex flex-col">
        <ChatWindow
          activeChat={activeChat}
          messages={messages}
          setMessages={setMessages}
        />

        {activeChat && (
          <MessageInput
            activeChat={activeChat}
            setMessages={setMessages}
          />
        )}
      </div>
    </div>
  );
}
