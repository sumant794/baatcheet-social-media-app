//import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import './App.css'
import { useAuth } from "./context/useAuth.js"
import { ToastProvider } from "./context/ToastContext.jsx"
import Profile from "./pages/Profile.jsx"
import CreatePost from "./pages/CreatePost.jsx"
import EditProfile from "./pages/EditProfile.jsx"

function App() {

  const { loading } = useAuth()
  console.log(loading)
  if(loading) {
    return <div style={{textAlign: "center", marginTop:"100px"}}>Loading...</div>
  }

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
