//require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import http from "http";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { initSocket } from "./socket/socket.js";

dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    const server = http.createServer(app)

    initSocket(server)

    server.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

