import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ChatWindow({ activeChat }) {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!activeChat) return;

    try {
      const res = await api.get(
        `/chat/messages/${activeChat._id}`
      );
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeChat]);

  if (!activeChat) {
    return (
      <div className="w-2/3 flex items-center justify-center">
        Select a chat
      </div>
    );
  }

  return (
    <div className="w-2/3 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg._id}>
            <b>{msg.senderId.username}</b>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
