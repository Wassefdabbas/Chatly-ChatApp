import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { connectDB } from './lib/db.js'
import cors from "cors";
import path from "path"

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // allow frintend send cookies
}));


app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5555

const __dirname = path.resolve();



// each request start with /api/auth will call authRoutes
app.use(`/api/auth`, authRoutes)
app.use(`/api/users`, userRoutes)
app.use(`/api/chat`, chatRoutes)

if (process.env.MODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`)
  connectDB()
})