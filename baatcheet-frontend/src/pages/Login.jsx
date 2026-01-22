import { Link } from "react-router-dom"
import "../styles/login.css"

export default function Login(){
    return(
        <div className="login-container" >

            <div className="login-card">

                <div className="logo">
                  💬<span>Baatcheet</span>
                </div>

                <h2>😊 Welcome Back!</h2>
                <p>Login to continue</p>

                <form className="login-form">
                    <input type="email" placeholder="Enter Your email"></input>
                    <input type="password" placeholder="Enter Your password"></input>

                    <button type="submit">Login</button>
                </form>

                <p className="forgot">Forgot password?</p>

                <p className="signup">
                    Don't have an account? <span><Link to="/register">Sign Up</Link></span>
                </p>

            </div>
        </div>
    )
}