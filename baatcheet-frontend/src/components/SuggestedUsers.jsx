import { useEffect, useState } from "react"
import api from "../api/axios.js"
import "../styles/suggestedUsers.css"
import { useNavigate } from "react-router-dom"

export default function SuggestedUsers() {
  const [users, setUsers] = useState([])
  const [following, setFollowing] = useState({})
  const navigate = useNavigate()

  // 🔹 Fetch Suggested Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/suggested")
        setUsers(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUsers()
  }, [])

  // 🔹 Message Handler
  const handleMessage = async (receiverId) => {
    try {
      const res = await api.post("/chat/conversation", {
        receiverId
      })

      const conversationId = res.data.data._id

      // 🔥 Navigate to chat page
      navigate(`/chat?conversationId=${conversationId}`)

    } catch (error) {
      console.log("Message error:", error)
    }
  }

  // 🔹 Follow Handler
  const handleFollow = async (userId) => {
    try {
      const res = await api.post(`/users/f/${userId}`)

      setFollowing((prev) => ({
        ...prev,
        [userId]: res.data.data.isFollowing
      }))

    } catch (error) {
      console.log("Follow error:", error)
    }
  }

  return (
    <div className="suggested-users">
      <h3 className="suggested-title">👥 Suggested Users</h3>

      <div className="suggested-list">
        {users.map(user => (
          <div key={user._id} className="suggested-card">

            {/* LEFT */}
            <div className="user-info">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="user"
                className="user-avatar"
              />

              <div className="user-text">
                <p className="user-name">{user.fullName}</p>
                <span className="user-username">@{user.username}</span>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="user-actions">

              <button
                className="message-btn"
                onClick={() => handleMessage(user._id)}
              >
                Message
              </button>

              <button
                className={`follow-btn ${
                  following[user._id] ? "following" : ""
                }`}
                onClick={() => handleFollow(user._id)}
              >
                {following[user._id] ? "Following" : "Follow"}
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  )
}