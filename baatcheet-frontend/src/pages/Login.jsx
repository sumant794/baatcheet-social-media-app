import { Link, useNavigate } from "react-router-dom"
import "../styles/login.css"
import { useState } from "react"
import api from "../api/axios.js"

export default function Login(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            console.log(formData)
            await api.post("/users/login", formData)
            navigate("/home")
        } catch (error) {
            setError(error.response?.data?.message || "Login failed")
            console.log(error.response)
            setTimeout(() => setError(""), 3000)
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="login-container" >

            <div className="login-card">

                <div className="logo">
                  💬<span>Baatcheet</span>
                </div>

                <h2>😊 Welcome Back!</h2>
                <p>Login to continue</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter Your email"
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Enter Your password"
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && <p className="error-text">{error}</p>}

                <p className="forgot">Forgot password?</p>

                <p className="signup">
                    Don't have an account? <span><Link to="/register">Sign Up</Link></span>
                </p>

            </div>
        </div>
    )
}