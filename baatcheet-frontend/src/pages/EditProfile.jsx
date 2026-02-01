import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth.js"
import { useEffect, useState } from "react"
import api from "../api/axios.js"
import "../styles/editprofile.css"
import Navbar from "../components/Navbar.jsx"
import NavbarBottom from "../components/NavbarBottom.jsx"

export default function EditProfile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const isMobile = window.innerWidth <= 480;

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setBio(user.bio || "")
      setAvatarPreview(user.avatar || "/default-avatar.png")
    }
  }, [user])

  if (!user) return null

  const isChanged =
    fullName !== user.fullName ||
    bio !== user.bio ||
    avatar !== null

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!isChanged) return

    try {
      setLoading(true)

      if (fullName !== user.fullName) {
        await api.patch("/users/update-fullname", { fullName })
      }

      if (bio !== user.bio) {
        await api.patch("/users/update-bio", { bio })
      }

      if (avatar) {
        const fd = new FormData()
        fd.append("avatar", avatar)
        await api.patch("/users/update-avatar", fd)
      }

      const res = await api.get("/users/current-user")
      setUser(res.data.data)
      navigate("/profile")
    } catch (err) {
      console.log(err)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-profile-page">
    {!isMobile && <Navbar />}
    <div className="edit-wrapper">

      <div className="edit-card">

        {/* HEADER */}
        <div className="edit-card-header">
          <h2>Edit Profile</h2>
        </div>

        {/* AVATAR */}
        <div className="edit-avatar">
          {avatarPreview && <img src={avatarPreview} alt="avatar" />}
          <label>
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="edit-card-body">

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={`@${user.username}`}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              className="edit-profile-textarea"
              maxLength={150}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about you"
            />
            <span className="char-count">{bio.length}/150</span>
          </div>


          {/* FOOTER BUTTONS */}
        <div className="edit-card-footer">
          <button
            className="cancel-btn"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            disabled={!isChanged || loading}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        </div>

        {/* CHANGE PASSWORD LINK */}
          <p className="change-password-text">
            Want to change password?{" "}
            <span onClick={() => navigate("/change-password")}>
              Click here
            </span>
          </p>

      </div>
    </div>
    <NavbarBottom />
    </div>
  )
}
