import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://10.179.197.252:5173"
//     ],
//     credentials: true
//   })
// );

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import chatRouter from "./routes/chat.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter) //http://localhost:8000/api/v1/users/register
app.use("/api/v1/post", postRouter)
app.use("/api/v1/chat", chatRouter)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Something went wrong"

  return res.status(statusCode).json({
    success: false,
    message
  })
})


export { app }