import axios from "axios"

const api = axios.create({
  baseURL: "https://baatcheet-social-media-app.onrender.com/api/v1",
  withCredentials: true
})

export default api
