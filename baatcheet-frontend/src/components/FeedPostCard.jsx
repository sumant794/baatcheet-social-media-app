import "../styles/feedpost.css"
import { FaRegHeart, FaRegCommentDots, FaShare } from "react-icons/fa"

export default function FeedPostCard() {
    return (
        <div className="feed-post-card">

            <div className="feed-post-header">
                <div className="avatar-and-username">
                    <img src="https://i.pravatar.cc/40"alt="user"/>
                    <span>Sumant Kumar</span>
                </div>
                <button>Follow</button>
            </div>

            <img className="feed-post-image" src="public/login-bg.png" alt="post" />

            <div className="feed-post-actions">
                <FaRegHeart />
                <FaRegCommentDots />
                <FaShare />
            </div>

            <p className="feed-post-caption">
                <strong>Sumant Kumar  </strong>
                 I think i am mindless
            </p>

        </div>
    )
}