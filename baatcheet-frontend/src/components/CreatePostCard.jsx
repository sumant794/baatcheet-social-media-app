import { useState } from "react"
import { FaImage } from "react-icons/fa"
import "../styles/createpostcard.css"
import api from "../api/axios.js"
import { useAuth } from "../context/useAuth.js"
import { useToast } from "../context/useToast.js"


export default function CreatePostcard({ onPostCreated }){
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [postSuccess, setPostSuccess] = useState(false)
    const { user } = useAuth()
    const { showToast } = useToast()
    console.log("CreatePostCard rendering with user:", user)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handlePost = async () => {
        if(!caption.trim() || !image){
            showToast("Image and caption is required", "error")
            return
        }
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("image", image)

            const response = await api.post("/post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log(response)
            console.log("Post Created:", response.data)

            setPostSuccess(true)
            showToast("Post uploaded successfully ✅", "success")

            setTimeout(() => {
                setCaption("")
                setImage(null)
                setImagePreview(null)
                setPostSuccess(false)
                onPostCreated()
            }, 2000)

        } catch (error) {
            console.log(error)
            showToast(
                error.response?.data?.message || "Post upload failed",
                "error"
            )

        } finally {
            setLoading(false)
        }
    }

    
    return(
        <div className="create-post-card">

            <div className="create-post-left">

                <div className="create-post-header">
                    <img 
                        src={user?.avatar || "/default-avatar.png"}
                        className="create-post-avatar"
                        alt="user"
                    />
                    <span className="create-post-username">{user?.fullName || "User"}</span>
                </div>

                <textarea 
                    placeholder="What's on your mind?"
                    value={caption} 
                    onChange={(e)=>setCaption(e.target.value)}
                />

                <div className="create-post-actions">
                    <label className="image-upload-btn">
                        <div className="image-upload-text">
                            <FaImage className="img-icon"/>
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
                        className={loading ? "posting" : ""}
                    >
                        {loading && <span className="spinner"></span>}
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>

            </div>

            <div className="create-post-right">
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
                    <div className="image-placeholder">
                        Image Preview
                    </div>
                )}
            </div>
        </div>
    )
}