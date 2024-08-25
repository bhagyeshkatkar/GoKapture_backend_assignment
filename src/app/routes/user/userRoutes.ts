import { Router } from "express";
import { userSignIn, userSignUp } from "../../controllers/user/userController";

const userRouter = Router()

// User Registration
userRouter.post("/register", userSignUp)

// User Login
userRouter.post("/login", userSignIn)

export default userRouter