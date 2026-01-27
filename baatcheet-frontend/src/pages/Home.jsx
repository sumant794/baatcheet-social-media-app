import { useEffect, useState } from "react"
import api from "../api/axios.js"
import Navbar from "../components/Navbar.jsx"
import CreatePostCard from "../components/CreatePostCard.jsx"
import FeedPostCard from "../components/FeedPostCard.jsx"
export default function Home() {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)

	const fetchFeed = async () => {
		try {
			const response = await api.get("/post/f/feed")
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
    <>
      <Navbar />
      <CreatePostCard onPostCreated={fetchFeed}/>
	  {loading && <p style={{ textAlign:"center" }}>Loading feed...</p>}

      {posts.map(post => (
        <FeedPostCard key={post._id} post={post}/>
	))}
    </>
    )
}
