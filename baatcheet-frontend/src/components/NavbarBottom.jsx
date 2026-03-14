import { FaSearch, FaHome, FaUser, FaPlus, FaPowerOff, FaRegCommentDots } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import "../styles/navbarbottom.css"
import { useAuth } from "../context/useAuth.js";
export default function NavbarBottom(){
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate("/")
    }

    return (
        <div className="navbar-bottom">

            <div className="bottom-nav-item" onClick={() => navigate("/chat")}>
                <FaRegCommentDots className="bottom-nav-icon"/>
            </div>

            <div className="bottom-nav-item" onClick={() => navigate("/home")}>
                <FaHome className="bottom-nav-icon"/>
            </div>

            <div className="bottom-nav-item" onClick={() => navigate("/profile")}>
                <FaUser className="bottom-nav-icon"/>
            </div>

            <button onClick={handleLogout}>
                <FaPowerOff />
            </button>
        </div>
    )
}