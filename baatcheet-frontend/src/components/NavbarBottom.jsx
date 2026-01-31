import { FaSearch, FaHome, FaUser, FaPlus, FaPowerOff, FaRegCommentDots } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import "../styles/navbarbottom.css"
export default function NavbarBottom(){
    const navigate = useNavigate()
    return (
        <div className="navbar-bottom">

            <div className="bottom-nav-item" onClick={() => navigate("/messages")}>
                <FaRegCommentDots className="bottom-nav-icon"/>
            </div>

            <div className="bottom-nav-item" onClick={() => navigate("/home")}>
                <FaHome className="bottom-nav-icon"/>
            </div>

            <div className="bottom-nav-item" onClick={() => navigate("/profile")}>
                <FaUser className="bottom-nav-icon"/>
            </div>

            <button><FaPowerOff /></button>
        </div>
    )
}