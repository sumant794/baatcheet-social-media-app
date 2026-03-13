import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import LoadingScreen from "./LoadingScreen"

export default function PublicRoute({ children }) {

  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}