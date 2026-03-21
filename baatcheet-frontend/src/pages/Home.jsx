import { useEffect, useState } from "react"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"
import CreatePostCard from "../components/CreatePostCard.jsx"
import FeedPostCard from "../components/FeedPostCard.jsx"
import NavbarBottom from "../components/NavbarBottom.jsx"
import LoadingScreen from "../components/LoadingScreen.jsx"
import { useAuth } from "../context/useAuth.js"
import SuggestedUsers from "../components/SuggestedUsers.jsx"
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


	return (
		<div className="home-page">
			<Navbar />
			<div className="create-post-wrapper">
				<CreatePostCard onPostCreated={fetchFeed} />
			</div>
			{loading && <LoadingScreen />}

			{user?.isNewUser ? (
				<div className="empty-home">

					{/* 👋 Dynamic Welcome */}
					<h2 className="welcome-text">
						👋 Hey {user?.fullName?.split(" ")[0]}, Welcome to Baatcheet
					</h2>

					{/* 🎬 Animation */}
					<div className="welcome-animation">
						<div className="pulse-circle"></div>
						<div className="pulse-circle delay"></div>
					</div>

					{/* 📄 Description */}
					<p className="welcome-subtext">
						Create a post or follow and chat people below
					</p>

					{/* 👥 Suggested Users */}
					<SuggestedUsers />

				</div>
			) : (
				posts.map(post => (
					<FeedPostCard key={post._id} post={post} onFollow={fetchFeed} />
				))
			)}

			<NavbarBottom />
		</div>
	)
}
