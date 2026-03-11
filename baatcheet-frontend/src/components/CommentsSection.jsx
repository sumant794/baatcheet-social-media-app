import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";
import "../styles/comments.css";
import { instaTimeAgo } from "../utils/timeAgo.js";

export default function CommentsSection({ postId, onCommentAdded, onCommentDeleted }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setFetchingComments(true);
            const res = await api.get(`/comments/${postId}`);
            setComments(res.data.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        } finally {
            setFetchingComments(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(`/comments/${postId}/add`, {
                text: commentText
            });

            // Add new comment to the list
            setComments([res.data.data, ...comments]);
            setCommentText("");
            onCommentAdded?.();
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}/delete`);
            setComments(comments.filter(comment => comment._id !== commentId));
            onCommentDeleted?.();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="comments-section">
            <div className="comment-input-wrapper">
                <img 
                    src={user?.avatar || "/default-avatar.png"} 
                    alt="user" 
                    className="comment-input-avatar"
                />
                <div className="comment-input-container">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleAddComment();
                            }
                        }}
                        className="comment-input"
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={loading || !commentText.trim()}
                        className="comment-submit-btn"
                    >
                        Post
                    </button>
                </div>
            </div>

            <div className="comments-list">
                {fetchingComments ? (
                    <p className="loading-text">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <img
                                src={comment.userId?.avatar || "/default-avatar.png"}
                                alt={comment.userId?.username}
                                className="comment-avatar"
                            />
                            <div className="comment-content">
                                <div className="comment-header">
                                    <strong className="comment-username">
                                        {comment.userId?.username}
                                    </strong>
                                    <span className="comment-time">
                                        {instaTimeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                            </div>

                            {user._id === comment.userId._id && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="comment-delete-btn"
                                    title="Delete comment"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
