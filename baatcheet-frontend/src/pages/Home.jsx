import { useEffect, useState } from "react"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"
import CreatePostCard from "../components/CreatePostCard.jsx"
import FeedPostCard from "../components/FeedPostCard.jsx"
import NavbarBottom from "../components/NavbarBottom.jsx"
import LoadingScreen from "../components/LoadingScreen.jsx"
import { useAuth } from "../context/useAuth.js"
import "../styles/homepage.css"

export default function Home() {
	const { user } = useAuth()
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)

	const fetchFeed = async () => {
		try {
			const response = await api.get("/post/f/feed")
			console.log("Feed from home: ", response)
			setPosts(response.data.data)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
  	}


	useEffect(() => {
		fetchFeed()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
    

    return(
    <div className="home-page">
      <Navbar />
	  <div className="create-post-wrapper">
			<CreatePostCard onPostCreated={fetchFeed}/>
	  </div>
	  {loading && <LoadingScreen />}

	{user?.isNewUser ? (
  <div className="empty-home">
    <h2>👋 Welcome to Baatcheet</h2>
    <p>Start by posting something</p>
  </div>
) : (
  posts.map(post => (
    <FeedPostCard key={post._id} post={post} onFollow={fetchFeed}/>
  ))
)} 

	<NavbarBottom />
    </div>
    )
}
