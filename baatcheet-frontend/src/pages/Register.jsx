import { Link, useNavigate } from "react-router-dom"
import "../styles/register.css"
import { useState } from "react"
import api from "../api/axios.js"

export default function Register(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email:"",
        username:"",
        fullName:"",
        password:""
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async(e) => {
        e.preventDefault()
        setLoading(true)

        try {
            console.log(formData)
            await api.post("/users/register", formData)

            alert("Registered Succesfully")
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }
    return(
        <div className="register-container">

            <div className="register-card">

                <div className="logo">
                  💬<span>Baatcheet</span>
                </div>

                <h2>Register</h2>

                <form className="register-form" onSubmit={handleRegister}>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Enter your username"
                        onChange={handleChange}
                    />
                    <input 
                        type="text" 
                        name="fullName"
                        placeholder="Enter your fullname"
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Create a strong password"
                        onChange={handleChange}
                    />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering...": "Register"}
                    </button>
                </form>

                <p className="login">
                    Already registerd? <span><Link to="/">Log In Then</Link></span>
                </p>
            </div>
        </div>
    )
}