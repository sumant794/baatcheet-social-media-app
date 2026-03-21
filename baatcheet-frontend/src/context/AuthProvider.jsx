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
        const {loggedInUSer, isNewUser} = res.data.data
        console.log("Current user fetched:", res.data.data)
        setUserState({
          ...loggedInUSer,
          isNewUser
        })
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

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout")
    } catch (error) {
      console.log("Logout failed:", error)
    } finally {
      setUserState(null)
    }
  }, [])

  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading,
    logout
  }), [user, setUser, loading, logout])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
