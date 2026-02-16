import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/postfeed.css";
import Navbar from "../components/Navbar.jsx";
import FeedPostCard from "../components/FeedPostCard";
import { FaRegHeart, FaRegCommentDots, FaShare, FaArrowLeft } from "react-icons/fa"

export default function PostFeed() {

    const { userId, index } = useParams();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const postRefs = useRef([]);
    const isMobile = window.innerWidth <= 480

    const fetchPosts = async () => {
        try {
            const res = await api.get(`/post/user/${userId}`);
            console.log("PostFeed: ", res)
            setPosts(res.data.data);
        } catch (err) {
            console.error("Feed fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    useEffect(() => {
        const startIndex = Number(index);

        if (posts.length > 0) {
            postRefs.current[startIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [posts, index]);

    if (loading) {
        return <div className="feed-loading">Loading Feed...</div>;
    }

    return (
        <div className="feed-page">
            {!isMobile && <Navbar /> }
            
            <div className="arrow-and-title">
                <span>
                    <Link to="/home">
                        <FaArrowLeft />
                    </Link>
                </span>
                <h2>Posts</h2>
            </div>

            {posts.map((post, i) => {
                return (
                    <div className="feed-post-card" key={post._id} ref={(el) => (postRefs.current[i] = el)}>

                        <div className="feed-post-header">
                            <div className="avatar-and-username">
                                <img src={post.owner.avatar ? post.owner.avatar : "/default-avatar.png"} alt="user" />
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
            })}
        </div>
    );
}
