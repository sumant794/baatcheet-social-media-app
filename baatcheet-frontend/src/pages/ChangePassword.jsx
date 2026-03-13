import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import NavbarBottom from "../components/NavbarBottom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import "../styles/changepassword.css"

export default function ChangePassword() {

    const navigate = useNavigate()
    const isMobile = window.innerWidth <= 480

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {

            setLoading(true)
            setError("")

            await api.post("/users/change-password", {
                oldPassword,
                newPassword
            })

            setSuccess("Password changed successfully")

            setTimeout(() => {
                navigate("/profile")
            }, 1500)

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to change password"
            )

        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="change-password-page">

            {!isMobile && <Navbar />}

            <div className="password-wrapper">

                <div className="password-card">

                    <h2>Change Password</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Current Password</label>

                            <div className="password-input">
                                <input
                                    type={showOld ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />

                                <span onClick={() => setShowOld(!showOld)}>
                                    {showOld ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                        </div>

                        <div className="form-group">
                            <label>New Password</label>

                            <div className="password-input">
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />

                                <span onClick={() => setShowNew(!showNew)}>
                                    {showNew ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>

                            <div className="password-input">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />

                                <span onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                        </div>

                        {error && <p className="error-text">{error}</p>}
                        {success && <p className="success-text">{success}</p>}

                        <div className="password-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/profile")}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <NavbarBottom />

        </div>
    )
}