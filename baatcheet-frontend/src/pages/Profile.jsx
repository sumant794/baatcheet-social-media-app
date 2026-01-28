import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/useAuth.js";
import "../styles/profile.css"
import api from "../api/axios.js";

export default function Profile() {
    const {user} = useAuth()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    //console.log("Profile", user)
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await api.get(`/post/user/${user._id}`)
                //console.log(res)
                setPosts(res.data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserPosts()
    }, [user])

    if(!user) return null

    return (
        <>
            <Navbar />
            
            <div className="profile-container">

                <div className="profile-header">

                <div className="profile-avatar">
                    <img 
                        src={user?.avatar || "/default-avatar.png"} 
                        alt="avatar" 
                    />
                </div>

                <div className="profile-info">
                    <h2>{user?.fullName || "User"}</h2>
                    <p className="username">@{user?.username || "username"}</p>

                    <p className="bio">
                        {user?.bio || "Hey 👋 I'm using Baatcheet"}
                    </p>

                    <div className="profile-stats">
                        <span><b>0</b> Posts</span>
                        <span><b>0</b> Followers</span>
                        <span><b>0</b> Following</span>
                    </div>

                    <button className="edit-profile-btn">
                        Edit Profile
                    </button>
                </div>

                </div>

                <div className="profile-posts">
                <h3>Posts</h3>

                <div className="posts-grid">
                    {loading && <p>Loading posts...</p>}

                    {!loading && posts.length === 0 && (
                        <div className="post-placeholder">No posts yet</div>
                    )}
                    
                    {!loading && posts.map((post) => (
                        <div className="profile-post-card" key={post._id}>
                            <img
                                src={post.image}
                                alt="post"
                                className="profile-post-image"
                            />
                        </div>
                    ))}
                </div>
                </div>

            </div>
        </>
    )
}