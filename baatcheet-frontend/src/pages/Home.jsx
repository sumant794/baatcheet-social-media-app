import Navbar from "../components/Navbar.jsx"
import CreatePostCard from "../components/CreatePostCard.jsx"
import FeedPostCard from "../components/FeedPostCard.jsx"
export default function Home() {
  return(
    <>
      <Navbar/>
      <CreatePostCard />
      <FeedPostCard />
     </>
  )
}
