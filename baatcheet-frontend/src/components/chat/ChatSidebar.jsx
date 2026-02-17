import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ChatSidebar({ setActiveChat }) {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await api.get(
        "/chat/conversations"
      );
      setConversations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="w-1/3 border-r h-screen overflow-y-auto">
      {conversations.map((convo) => {
        const otherUser = convo.members[1]; // adjust later

        return (
          <div
            key={convo._id}
            onClick={() => setActiveChat(convo)}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
          >
            <img
              src={otherUser.avatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <h4>{otherUser.username}</h4>
            <p>{convo.lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
}
