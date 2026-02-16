import api from "../api/axios";
import "../styles/feedpost.css"
import { FaRegHeart, FaRegCommentDots, FaShare } from "react-icons/fa"
import { useAuth } from "../context/useAuth.js"
import { useState } from "react";

export default function FeedPostCard({ post }) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(null)
    console.log("Sumant", post)

    const handleFollow = async () => {
        const res = await api.post(`/users/f/${post.owner._id}`)
        setIsFollowing(res.data.data.isFollowing)
        console.log("Resposne from follow btn in feedpost: ", res) 
    }

    return (
        <div className="feed-post-card">

            <div className="feed-post-header">
                <div className="avatar-and-username">
                    <img src= {post.owner.avatar ? post.owner.avatar : "/default-avatar.png"} alt="user"/>
                    <span>{post.owner.username}</span>
                </div>
                {post.owner._id != user._id && (
                    <button
                        onClick={handleFollow}
                    >
                        {isFollowing ? "Following": "Follow"}
                    </button>
                )}
                
            </div>

            <img className="feed-post-image" src={post.image} alt="post" />

            <div className="feed-post-actions">
                <FaRegHeart />
                <FaRegCommentDots />
                <FaShare />
            </div>

            <p className="feed-post-caption">
                <strong>{post.owner.username}  </strong>
                {post.caption}
            </p>

        </div>
    )
}