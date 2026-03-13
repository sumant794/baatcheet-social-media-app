import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      " http://10.61.232.42:5173"
    ],
    credentials: true
  })
);

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { success: false, message: "Too many login attempts, please try again later." }
})

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
// Apply general limiter to all routes
app.use(generalLimiter)

//routes import 
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import chatRouter from "./routes/chat.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"

//routes declaration
app.use("/api/v1/users", authLimiter, userRouter) 
app.use("/api/v1/post", postRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Something went wrong"

  return res.status(statusCode).json({
    success: false,
    message
  })
})


export { app }