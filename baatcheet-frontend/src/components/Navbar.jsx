import { Link } from "react-router-dom"
import "../styles/navbar.css"
import { FaSearch, FaHome, FaUser, FaPlusSquare, FaPowerOff, FaRegCommentDots } from "react-icons/fa"
export default function Navbar(){
    return(
        <nav className="navbar">
        
            <div className="left-section">
                <img src="public/nav-img.webp"/>
                <div className="nav-logo">
                    <h2>Baatcheet</h2>
                    <span>Sumant Kumar</span>
                </div>
            </div>

            <div className="middle-section">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search users..."/>
            </div>

            <div className="right-section"> 
                <div className="nav-item">
                    <FaHome className="nav-icon"/>
                    <Link to="home">Home</Link>
                </div>

                <div className="nav-item">
                    <FaRegCommentDots className="nav-icon"/>
                    <Link to="/mesages">Messages</Link>
                </div>

                <div className="nav-item">
                    <FaUser className="nav-icon"/>
                    <Link to="profile">Profile</Link>
                </div>

                <button><FaPowerOff /></button>
            </div>
                
                
        </nav>
    )
}