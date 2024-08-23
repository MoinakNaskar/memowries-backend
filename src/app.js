import express from "express" ;
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import kycRouter from './routes/kyc.routes.js'
import storyRouter from './routes/story.routes.js'
import bookingRouter from './routes/booking.routes.js'
import commentRouter from './routes/comment.routes.js'



app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/kyc", kycRouter)
app.use("/api/v1/story", storyRouter)
app.use("/api/v1/booking", bookingRouter)
app.use("/api/v1/comment", commentRouter)

export{app}