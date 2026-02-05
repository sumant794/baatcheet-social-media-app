import { useEffect, useState, useMemo, useCallback } from "react"
import api from "../api/axios.js"
import AuthContext from "./AuthContext.jsx"

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/users/current-user")
        console.log("Current user fetched:", res.data.data)
        setUserState(res.data.data)
      } catch (error) {
        console.log("No active session")
      } finally {
        setLoading(false)
      }
    }
    getCurrentUser()
  }, [])

  const setUser = useCallback((userData) => {
    console.log("setUser called with:", userData)
    setUserState(userData)
  }, [])

  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading
  }), [user, setUser, loading])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
