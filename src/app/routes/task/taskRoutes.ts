import { Router } from "express";
import { createTask, deleteTask, filterTasks, getAllTasks, getTasks, searchTasks, updateTask } from "../../controllers/task/taskController";
import authMiddleware from "../../middleware/authorization/authorization";
import checkRole from "../../middleware/roles/checkRole";

const taskRouter = Router()

// Create new task
taskRouter.post("/create", authMiddleware, createTask)

// Get Tasks of User
taskRouter.get("/all", authMiddleware, getTasks)

// Get All Created Tasks With Pagination
taskRouter.get("/bulk", authMiddleware, checkRole(['ADMIN']), getAllTasks)

// Update a Task
taskRouter.patch("/update", authMiddleware, updateTask)

// Delete a Task
taskRouter.delete("/delete", authMiddleware, checkRole(['ADMIN']) ,deleteTask)

// Filtering Tasks
taskRouter.get("/filter", authMiddleware, filterTasks)

// Searching Tasks
taskRouter.get("/search", authMiddleware,searchTasks)

export default taskRouter