import { Router } from "express";
import userRouter from "./user/userRoutes";
import taskRouter from "./task/taskRoutes";

const rootRouter = Router();

// User Router 
rootRouter.use("/user",userRouter)

// Task Router
rootRouter.use("/tasks", taskRouter)

export default rootRouter;
