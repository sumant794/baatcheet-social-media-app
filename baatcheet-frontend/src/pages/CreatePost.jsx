import MobilePostcard from "../components/MobilePostCard.jsx";
import NavbarBottom from "../components/NavbarBottom.jsx";
import "../styles/createpost.css"
export default function CreatePost(){
    return(
        <div className="create-post-page">
            <h2>Create a post.. here</h2>
            <MobilePostcard />
            <NavbarBottom />
        </div>
        
    )
}