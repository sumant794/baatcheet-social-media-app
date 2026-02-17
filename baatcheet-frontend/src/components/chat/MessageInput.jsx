import { useState } from "react";
import api from "../../api/axios";

export default function MessageInput({
  activeChat,
  setMessages,
}) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post(
        "/chat/message",
        {
          conversationId: activeChat._id,
          text,
        }
      );

      setMessages((prev) => [
        ...prev,
        res.data.data,
      ]);

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-3 border-t flex">
      <input
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        className="flex-1 border p-2"
        placeholder="Type message..."
      />

      <button
        onClick={sendMessage}
        className="ml-2 px-4 bg-blue-500 text-white"
      >
        Send
      </button>
    </div>
  );
}
