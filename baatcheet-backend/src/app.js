import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use((req, res, next) => {
  console.log("BACKEND HIT:", req.method, req.url);
  console.log("Cookies:", req.cookies);
  next();
});


const allowedOrigins = [
"http://localhost:5173",
"http://10.179.197.252:5173"
];

app.use(
cors({
origin: function (origin, callback) {
// Postman / mobile app / server-to-server
if (!origin) return callback(null, true);

if (allowedOrigins.includes(origin)) {
  callback(null, true);
} else {
  callback(new Error("Not allowed by CORS"));
}
},
credentials: true
})
);


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter) //http://localhost:8000/api/v1/users/register
app.use("/api/v1/post", postRouter)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Something went wrong"

  return res.status(statusCode).json({
    success: false,
    message
  })
})


export { app }