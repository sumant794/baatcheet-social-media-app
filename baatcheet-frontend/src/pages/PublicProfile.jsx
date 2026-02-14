import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useEffect } from "react";
import "../styles/publicprofile.css"
import { FaArrowLeft } from "react-icons/fa";

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
        setPosts(res.data.data)
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
        <div className="public-profile-page">
            {user && (
                <div className="public-profile-container">

                    <div className="arrow-and-username">
                        <span>
                            <Link to="/home">
                                <FaArrowLeft />
                            </Link>
                        </span>
                        <h2>{user.username}</h2>
                    </div>

                    <div className="image-fullname-stats">

                        <div className="img">
                            <img 
                                src={user.avatar}
                                alt=""
                            />
                        </div>

                        <div className="fullname-stats">

                            <div className="fullname">
                                {user.fullName}
                            </div>

                            <div className="stats">
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

                    </div>

                    <div className="Bio">
                        {user.bio || "Hey 👋 I'm using Baatcheet"}
                    </div>

                    <div className="public-profile-actions">
                        <button
                            onClick={handleFollow}
                        >
                            {isFollowing 
                                ? "Following"  
                                : "Follow"
                            }
                        </button>
                        <button>Message</button>
                    </div>

                    <h3>Posts By {user.fullName}</h3>

                    <div className="public-profile-posts">

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
                
            )}

        </div>
    )
}