import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/users/current-user")
        setUser(res.data.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
