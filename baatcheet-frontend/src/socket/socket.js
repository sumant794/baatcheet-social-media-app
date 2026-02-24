import { io } from "socket.io-client";

const URL = "https://baatcheet-social-media-app.onrender.com"

export const socket = io(URL, {
    withCredentials: true,
    autoConnect: true,
})
