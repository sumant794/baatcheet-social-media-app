import "../styles/loading.css"

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="logo">💬</div>
      <h2>Baatcheet</h2>
      <div className="spinner"></div>
      <p>Loading your conversations...</p>
    </div>
  )
}