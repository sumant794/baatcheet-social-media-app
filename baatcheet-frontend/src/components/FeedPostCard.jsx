// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { FaRegHeart, FaHeart, FaRegCommentDots, FaShare } from "react-icons/fa"
// import { useAuth } from "../context/useAuth.js"
// import "../styles/feedpost.css"
// import { instaTimeAgo } from "../utils/timeAgo.js";
// import CommentsSection from "./CommentsSection.jsx";


// export default function FeedPostCard({ post, onFollow }) {
//     const { user } = useAuth();
//     const [isFollowing, setIsFollowing] = useState(post.isFollowing)
//     const [isLiked, setIsLiked] = useState(false);
//     const [likesCount, setLikesCount] = useState(post.likesCount || 0);
//     const [loading, setLoading] = useState(false);
//     const [showComments, setShowComments] = useState(false);
//     const [commentCount, setCommentCount] = useState(post.commentCount || 0);

//     useEffect(() => {
//         setIsFollowing(post.isFollowing)
//         setLikesCount(post.likesCount || 0)
//         setCommentCount(post.commentCount || 0)
//         checkUserLiked();
//     }, [post._id])

//     const checkUserLiked = async () => {
//         try {
//             const res = await api.get(`/likes/${post._id}/status`);
//             setIsLiked(res.data.data.isLiked);
//         } catch (error) {
//             // If endpoint doesn't exist yet, user hasn't liked
//             setIsLiked(false);
//         }
//     };

//     const handleFollow = async () => {
//         const res = await api.post(`/users/f/${post.owner._id}`)
//         setIsFollowing(res.data.data.isFollowing)
//         onFollow()
//     }

//     const handleToggleLike = async () => {
//         setLoading(true);
//         try {
//             const res = await api.post(`/likes/${post._id}/toggle`);
//             setIsLiked(res.data.data.isLiked);
//             setLikesCount(res.data.data.likesCount);
//         } catch (error) {
//             console.error("Error toggling like:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const handleCommentAdded = () => {
//         setCommentCount(prev => prev + 1);
//     }

//     const handleCommentDeleted = () => {
//         setCommentCount(prev => Math.max(0, prev - 1));
//     }

//     return (
//         <div className="feed-post-card">

//             <div className="feed-post-header">
//                 <div className="avatar-and-username">
//                     <img src= {post.owner.avatar ? post.owner.avatar : "/default-avatar.png"} alt="user"/>
//                     <span>{post.owner.username}</span>
//                 </div>
//                 {post.owner._id != user._id && (
//                     <button
//                         onClick={handleFollow}
//                     >
//                         {isFollowing ? "Following": "Follow"}
//                     </button>
//                 )}
                
//             </div>

//             <img className="feed-post-image" src={post.image} alt="post" />

//             <div className="feed-post-actions">
//                 <button 
//                     className={`like-btn ${isLiked ? 'liked' : ''}`}
//                     onClick={handleToggleLike}
//                     disabled={loading}
//                     title="Like"
//                 >
//                     {isLiked ? <FaHeart /> : <FaRegHeart />}
//                 </button>
//                 <button 
//                     className="comment-btn"
//                     onClick={() => setShowComments(!showComments)}
//                     title="Comments"
//                 >
//                     <FaRegCommentDots />
//                 </button>
//                 <FaShare />
//             </div>

//             {likesCount > 0 && (
//                 <p className="likes-count">
//                     {likesCount} {likesCount === 1 ? 'like' : 'likes'}
//                 </p>
//             )}

//             <p className="feed-post-caption">
//                 <strong>{post.owner.username}  </strong>
//                 {post.caption}
//             </p>

//             {commentCount > 0 && (
//                 <button 
//                     className="view-comments-btn"
//                     onClick={() => setShowComments(!showComments)}
//                 >
//                     View {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
//                 </button>
//             )}

//             {showComments && (
//                 <CommentsSection 
//                     postId={post._id}
//                     onCommentAdded={handleCommentAdded}
//                     onCommentDeleted={handleCommentDeleted}
//                 />
//             )}

//             <p className="time">
//                 {instaTimeAgo(post.createdAt)}
//             </p>

//         </div>
//     )
// }


import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaRegHeart, FaHeart, FaRegCommentDots, FaShare } from "react-icons/fa"
import { useAuth } from "../context/useAuth.js"
import "../styles/feedpost.css"
import { instaTimeAgo } from "../utils/timeAgo.js";
import CommentsSection from "./CommentsSection.jsx";

export default function FeedPostCard({ post, onFollow }) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(post.isFollowing)
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(post.commentCount || 0);

    useEffect(() => {
        setIsFollowing(post.isFollowing)
        setLikesCount(post.likesCount || 0)
        setCommentCount(post.commentCount || 0)
        checkUserLiked();
    }, [post._id])

    const checkUserLiked = async () => {
        try {
            const res = await api.get(`/likes/${post._id}/status`);
            setIsLiked(res.data.data.isLiked);
        } catch (error) {
            setIsLiked(false);
        }
    };

    const handleFollow = async () => {
        const res = await api.post(`/users/f/${post.owner._id}`)
        setIsFollowing(res.data.data.isFollowing)
        onFollow()
    }

    const handleToggleLike = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/likes/${post._id}/toggle`);
            setIsLiked(res.data.data.isLiked);
            setLikesCount(res.data.data.likesCount);
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCommentAdded = () => setCommentCount(prev => prev + 1);
    const handleCommentDeleted = () => setCommentCount(prev => Math.max(0, prev - 1));

    return (
        <>
            <div className="feed-post-card">
                <div className="feed-post-header">
                    <div className="avatar-and-username">
                        <img src={post.owner.avatar ? post.owner.avatar : "/default-avatar.png"} alt="user" />
                        <span>{post.owner.username}</span>
                    </div>
                    {post.owner._id != user._id && (
                        <button onClick={handleFollow}>
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                <img className="feed-post-image" src={post.image} alt="post" />

                <div className="feed-post-actions">
                    <button
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleToggleLike}
                        disabled={loading}
                        title="Like"
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </button>

                    <button className="comment-btn" onClick={() => setShowComments(true)} title="Comments">
                        <FaRegCommentDots />
                        {commentCount > 0 && <span className="comment-count-badge">{commentCount}</span>}
                    </button>

                    <FaShare className="share-icon" />
                </div>

                {likesCount > 0 && (
                    <p className="likes-count">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
                )}

                <p className="feed-post-caption">
                    <strong>{post.owner.username}  </strong>{post.caption}
                </p>

                <p className="time">{instaTimeAgo(post.createdAt)}</p>
            </div>

            {showComments && (
                <CommentsSection
                    postId={post._id}
                    onCommentAdded={handleCommentAdded}
                    onCommentDeleted={handleCommentDeleted}
                    onClose={() => setShowComments(false)}
                />
            )}
        </>
    )
}