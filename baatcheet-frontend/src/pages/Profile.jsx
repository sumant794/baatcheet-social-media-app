import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import api from "../api/axios.js";
import NavbarBottom from "../components/NavbarBottom.jsx";
import { FaPlus } from "react-icons/fa";

export default function Profile() {
    const {user} = useAuth()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const isMobile = window.innerWidth <= 480;
    const navigate = useNavigate();
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
            {!isMobile && <Navbar />}
            <div className="profile-container">

                <div className="profile-nav">
                    <div className="create-icon" onClick={() => navigate("/create-post")}><FaPlus /></div>
                    <div><h2>{user.username || "username"}</h2></div>
                </div>

                <div className="profile-header">

                    <div className="profile-avatar">
                        <img 
                            src={user?.avatar || "/default-avatar.png"} 
                            alt="avatar" 
                        />
                    </div>

                    <div className="profile-info">
                        <h2>@{user?.username || "username"}</h2>
                        <p className="username">{user?.fullName || "User"}</p>

                        <p className="bio">
                            {user?.bio || "Hey 👋 I'm using Baatcheet"}
                        </p>

                        <div className="profile-stats">
                            <span><b>{posts.length}</b> Posts</span>
                            <span><b>{user.followers.length}</b> Followers</span>
                            <span><b>{user.following.length}</b> Following</span>
                        </div>


                        <div className="profile-btns">
                            <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>
                                Edit Profile
                            </button>

                            <button className="edit-profile-btn">
                                Delete Profile
                            </button>
                        </div>
                        
                    </div>

                </div>

                <p className="bio-mobile">
                    {user?.bio || "Hey 👋 I'm using Baatcheet"}
                </p>

                <div className="mobile-profile-btns">
                    <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>
                        Edit Profile
                    </button>
                    
                    <button className="edit-profile-btn">
                        Delete Profile
                    </button>
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

            <NavbarBottom />
        </>
    )
}