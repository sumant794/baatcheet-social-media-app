import { useState } from "react"
import { FaImage } from "react-icons/fa"
import "../styles/mobilepostcard.css"
import api from "../api/axios.js"
import { useAuth } from "../context/useAuth.js"
import { useToast } from "../context/useToast.js"

export default function MobilePostcard({ onPostCreated }) {
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePost = async () => {
    if (!caption.trim() || !image) {
      showToast("Image and caption is required", "error")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append("image", image)

      await api.post("/post/create", formData)
      
      setLoading(false)
      setPostSuccess(true)
      showToast("Post uploaded successfully ✅", "success")

      setTimeout(() =>{
        setCaption("")
        setImage(null)
        setImagePreview(null)
        setPostSuccess(false)
        onPostCreated?.()
      }, 3000)
    } catch (error) {
      showToast(
        error.response?.data?.message || "Post upload failed",
        "error"
      )
    }
  }

  return (
    
    <div className="mobile-post-card">

      <div className="mobile-post-header">
        <img
          src={user?.avatar || "/default-avatar.png"}
          className="mobile-post-avatar"
          alt="user"
        />
        <span className="mobile-post-username">
          {user?.fullName || "User"}
        </span>
      </div>


      <div className="mobile-post-image">
        {imagePreview ? (
          <div className="preview-wrapper">
              <img src={imagePreview} alt="preview" />

              {loading && (
                <div className="preview-overlay">
                  <span className="spinner"></span>
                </div>
              )}

              {postSuccess && (
                  <div className="success-overlay">
                      <div className="tick">✔</div>
                      <p>Post Successful</p>
                  </div>
              )}
          </div>
        ):(
          <div className="mobile-image-placeholder">
            Image Preview
          </div>
        )}
      </div>

      <textarea
        className="mobile-post-textarea"
        placeholder="What's on your mind? Just type..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />


      <div className="mobile-post-actions">
        <label className="mobile-upload-btn">
            <div className="upload-text">
                <FaImage className="mobile-img-icon" />
                <span>Choose from gallery</span>
            </div>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <button 
          onClick={handlePost}
          disabled={loading}
          className={loading ? "posting": ""}
        >
          {loading && <span className="spinner"></span>}
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

    </div>
  )
}
