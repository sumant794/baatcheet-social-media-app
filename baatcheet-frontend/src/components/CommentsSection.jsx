import { useState, useEffect, useRef } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/useAuth.js";
import { instaTimeAgo } from "../utils/timeAgo.js";
import "../styles/comments.css"

export default function CommentsSection({ postId, onCommentAdded, onCommentDeleted, onClose }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchComments();
        setTimeout(() => inputRef.current?.focus(), 300);
    }, [postId]);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const fetchComments = async () => {
        try {
            setFetchingComments(true);
            const res = await api.get(`/comments/${postId}`);
            setComments(res.data.data);
        } catch (error) {
            setComments([]);
        } finally {
            setFetchingComments(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setLoading(true);
        try {
            const res = await api.post(`/comments/${postId}/add`, { text: commentText });
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
            setComments(comments.filter(c => c._id !== commentId));
            onCommentDeleted?.();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <>
            <div className="comments-backdrop" onClick={onClose} />
            <div className="comments-modal">
                <div className="comments-modal-header">
                    <span>Comments</span>
                    <button className="comments-close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="comments-list">
                    {fetchingComments ? (
                        <div className="comments-loading">
                            <div className="comments-spinner" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="comments-empty">
                            <p className="comments-empty-icon">💬</p>
                            <p>No comments yet</p>
                            <span>Be the first to comment!</span>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="comment-item">
                                <img
                                    src={comment.userId?.avatar || "/default-avatar.png"}
                                    alt={comment.userId?.username}
                                    className="comment-avatar"
                                />
                                <div className="comment-body">
                                    <p className="comment-text">
                                        <strong>{comment.userId?.username}</strong> {comment.text}
                                    </p>
                                    <span className="comment-time">{instaTimeAgo(comment.createdAt)}</span>
                                </div>
                                {user._id === comment.userId?._id && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="comment-delete-btn"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="comments-input-row">
                    <img src={user?.avatar || "/default-avatar.png"} alt="you" className="comment-input-avatar" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleAddComment(); }}
                        className="comment-input"
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={loading || !commentText.trim()}
                        className="comment-post-btn"
                    >
                        {loading ? "..." : "Post"}
                    </button>
                </div>
            </div>
        </>
    );
}

