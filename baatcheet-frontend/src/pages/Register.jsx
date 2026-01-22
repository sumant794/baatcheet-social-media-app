import { Link } from "react-router-dom"
import "../styles/register.css"

export default function Register(){
    return(
        <div className="register-container">

            <div className="register-card">

                <div className="logo">
                  💬<span>Baatcheet</span>
                </div>

                <h2>Register</h2>

                <form className="register-form">
                    <input type="email" placeholder="Enter your email"></input>
                    <input type="text" placeholder="Enter your username"></input>
                    <input type="text" placeholder="Enter your fullname"></input>
                    <input type="password" placeholder="Create a strong password"></input>
                    
                    <button type="submit">Register</button>
                </form>

                <p className="login">
                    Already registerd? <span><Link to="/">Log In Then</Link></span>
                </p>
            </div>
        </div>
    )
}