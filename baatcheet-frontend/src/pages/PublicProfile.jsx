import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useEffect } from "react";
import "../styles/publicprofile.css"
import Navbar from "../components/Navbar.jsx";

export default function PublicProfile(){
    const { userId } = useParams()
    console.log("User Id: ",userId)

    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        const res = await api.get(`/users/u/${userId}`)
        console.log(res)
        setUser(res.data.data.user)
        console.log(user)
        setIsFollowing(res.data.data.isFollowing)
    }

    const fetchPosts = async () => {
        const res = await api.get(`/post/user/${userId}`)
        console.log("Public-Profile Posts: ",res)
        setPosts(res.data.dat)
        setLoading(false)
    }

    useEffect(() => {
        fetchProfile()
        fetchPosts()
    }, [userId])

    const handleFollow = async () => {
        const res = await api.post(`/users/f/${userId}`)

        setIsFollowing(res.data.data.isFollowing)

        setUser(prev => ({
            ...prev,
            followers: res.data.data.isFollowing
            ? [...prev.followers, "temp"]
            : prev.followers.slice(0, -1)
        }))
    }

    return (
        <div className="profile-page">

        {/* Navbar */}
        <Navbar />

        {/* ================= PROFILE HEADER ================= */}
        <div className="profile-header">

            {/* Top Section */}
            <div className="profile-top">

            {/* Avatar */}
            <div className="profile-avatar">
                <img
                src={
                    user.avatar ||
                    "/default-avatar.png"
                }
                alt=""
                />
            </div>

            {/* Stats */}
            <div className="profile-stats">

                <div>
                <h3>{posts.length}</h3>
                <span>Posts</span>
                </div>

                <div>
                <h3>{user.followers.length}</h3>
                <span>Followers</span>
                </div>

                <div>
                <h3>{user.following.length}</h3>
                <span>Following</span>
                </div>

            </div>

            </div>

            {/* Name + Bio */}
            <div className="profile-info">

            <h2>{user.fullName}</h2>

            <p className="username">
                @{user.username}
            </p>

            {user.bio && (
                <p className="bio">
                {user.bio}
                </p>
            )}

            </div>

            {/* Action Buttons */}
            <div className="profile-actions">

            <button
                className="follow-btn"
                onClick={handleFollow}
            >
                {isFollowing
                ? "Following"
                : "Follow"}
            </button>

            <button className="message-btn">
                Message
            </button>

            </div>

        </div>

        {/* ================= STORY HIGHLIGHTS ================= */}

        <div className="profile-highlights">

            <div className="highlight">
            <div className="circle"></div>
            <span>Highlight</span>
            </div>

            <div className="highlight">
            <div className="circle"></div>
            <span>Trips</span>
            </div>

            <div className="highlight">
            <div className="circle"></div>
            <span>Friends</span>
            </div>

        </div>

        {/* ================= POSTS GRID ================= */}

        <div className="profile-posts">

            {posts.map(post => (

            <div
                key={post._id}
                className="post-card"
            >
                <img
                src={post.image}
                alt=""
                />
            </div>

            ))}

        </div>

        </div>

    )
}