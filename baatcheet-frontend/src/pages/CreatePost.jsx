import CreatePostcard from "../components/CreatePostCard.jsx";
import MobilePostcard from "../components/MobilePostCard.jsx";
import "../styles/createpost.css"
export default function CreatePost(){
    return(
        <div className="create-post-page">
            <MobilePostcard />
        </div>
        
    )
}