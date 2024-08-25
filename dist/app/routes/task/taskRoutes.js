"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../../controllers/task/taskController");
const authorization_1 = __importDefault(require("../../middleware/authorization/authorization"));
const checkRole_1 = __importDefault(require("../../middleware/roles/checkRole"));
const taskRouter = (0, express_1.Router)();
// Create new task
taskRouter.post("/create", authorization_1.default, taskController_1.createTask);
// Get Tasks of User
taskRouter.get("/all", authorization_1.default, taskController_1.getTasks);
// Get All Created Tasks With Pagination
taskRouter.get("/bulk", authorization_1.default, (0, checkRole_1.default)(['ADMIN']), taskController_1.getAllTasks);
// Update a Task
taskRouter.patch("/update", authorization_1.default, taskController_1.updateTask);
// Delete a Task
taskRouter.delete("/delete", authorization_1.default, (0, checkRole_1.default)(['ADMIN']), taskController_1.deleteTask);
// Filtering Tasks
taskRouter.get("/filter", authorization_1.default, taskController_1.filterTasks);
// Searching Tasks
taskRouter.get("/search", authorization_1.default, taskController_1.searchTasks);
exports.default = taskRouter;
