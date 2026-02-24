import { Link } from "react-router-dom"
import "../styles/navbar.css"
import { FaSearch, FaHome, FaUser, FaPlus, FaPowerOff, FaRegCommentDots } from "react-icons/fa"
import { useAuth } from "../context/useAuth.js"
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js"
import { useState, useEffect } from "react";

export default function Navbar(){
    const { user } = useAuth()
    const navigate = useNavigate()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    console.log("Navbar rendering with user:", user)

    useEffect(() => {
        const delay = setTimeout(() => {
            if(!query.trim()) {
                setResults([])
                return
            }

            fetchUsers()
        }, 400)

        return () => clearTimeout(delay)

    }, [query])

    const fetchUsers = async () => {
        try {
            setLoading(true)

            const res = await api.get(`users/search?query=${query}`)
            setResults(res.data.data)
            console.log("Results for you search: ", results)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return(
        <nav className="navbar">
        
            <div className="left-section">
                <div className="mobile-logo">B</div>
                <img src={user?.avatar ? user.avatar : "/default-avatar.png"}/>
                <div className="nav-logo">
                    <h2>Baatcheet</h2>
                    <span>{user?.fullName || "user"}</span>
                </div>
            </div>

            <div className="middle-section">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {query && (
                    <div className="search-dropdown">
                        {loading && (
                            <p className="search-status">
                                Searching...
                            </p>
                        )}

                        {!loading && results.length === 0 && (
                            <p className="search-status">
                                No users found
                            </p>
                        )}

                        {results.map(user => (
                            <div
                                key={user._id}
                                className="search-item"
                                onClick={() => {
                                    if(!user?._id) return
                                    navigate(`/profile/${user._id}`)
                                    setQuery("")
                                    setResults([])
                                }}
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        "/default-avatar.png"
                                    }
                                />

                                <div>
                                    <p>{user.fullName}</p>
                                    <span>@{user.username}</span>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>

            <div className="right-section"> 
                <div className="nav-item">
                    <FaHome className="nav-icon"/>
                    <Link to="/home">Home</Link>
                </div>

                <div className="nav-item">
                    <FaRegCommentDots className="nav-icon"/>
                    <Link to="/chat">Messages</Link>
                </div>

                <div className="nav-item">
                    <FaUser className="nav-icon"/>
                    <Link to="/profile">Profile</Link>
                </div>

                <button><FaPowerOff /></button>

                <div className="nav-item-5" onClick={() => navigate("/create-post")}>
                    <FaPlus  />
                </div>
            </div> 
                
                
        </nav>
    )
}