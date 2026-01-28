import { useState } from "react"
import { FaImage } from "react-icons/fa"
import "../styles/createPost.css"
import api from "../api/axios.js"
import { useAuth } from "../context/useAuth.js"


export default function CreatePostcard({ onPostCreated }){
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const { user } = useAuth()
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
            alert("Image and caption is required")
            return
        }
        try {
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

            setCaption("")
            setImage(null)
            setImagePreview(null)
            onPostCreated()
            alert("Post uploaded successfully ✅")
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Post upload failed")
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
                    <button onClick={handlePost}>Post</button>
                </div>

            </div>

            <div className="create-post-right">
                {imagePreview ? (
                    <img src={imagePreview} alt="preview" />
                ):(
                    <div className="image-placeholder">
                        Image Preview
                    </div>
                )}
            </div>
        </div>
    )
}