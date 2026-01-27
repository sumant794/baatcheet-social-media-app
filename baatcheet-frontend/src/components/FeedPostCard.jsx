import "../styles/feedpost.css"
import { FaRegHeart, FaRegCommentDots, FaShare } from "react-icons/fa"

export default function FeedPostCard({ post }) {
    console.log("Sumant", post)
    return (
        <div className="feed-post-card">

            <div className="feed-post-header">
                <div className="avatar-and-username">
                    <img src= {post.owner.avatar ? post.owner.avatar : "/default-avatar.png"} alt="user"/>
                    <span>{post.owner.username}</span>
                </div>
                <button>Follow</button>
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