//import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import './App.css'
import { useAuth } from "./context/useAuth.js"
import Profile from "./pages/Profile.jsx"
import CreatePost from "./pages/CreatePost.jsx"

function App() {
  const { loading } = useAuth()
  console.log(loading)
  if(loading) {
    return <div style={{textAlign: "center", marginTop:"100px"}}>Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-post" element={<CreatePost />} />
    </Routes>
  )
}

export default App
