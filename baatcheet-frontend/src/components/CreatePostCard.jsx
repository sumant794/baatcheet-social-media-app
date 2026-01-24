import { useState } from "react"
import { FaImage } from "react-icons/fa"
import "../styles/createPost.css"
export default function CreatePostcard(){
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handlePost = () => {
        if(!caption.trim() || !image){
            alert("Image and caption is required")
        }
        console.log("Raady to send->", caption, image)
    }

    return(
        <div className="create-post-card">

            <div className="create-post-left">

                <div className="create-post-header">
                    <img 
                        src="https://i.pravatar.cc/40"
                        className="create-post-avatar"
                        alt="user"
                    />
                    <span className="create-post-username">Sumant Kumar</span>
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