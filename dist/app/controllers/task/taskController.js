"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTasks = exports.filterTasks = exports.deleteTask = exports.updateTask = exports.getAllTasks = exports.getTasks = exports.createTask = void 0;
const zod_1 = require("zod");
const throwError_1 = __importDefault(require("../../helpers/throwError"));
const prismaClient_1 = __importDefault(require("../../db/prismaClient"));
const successResponse_1 = __importDefault(require("../../helpers/successResponse"));
// Creating a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusEnum = zod_1.z.enum(["TODO", "IN_PROGRESS", "DONE"]);
    const priorityEnum = zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]);
    const taskBody = zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        due_date: zod_1.z.string(),
        user_id: zod_1.z.number()
    });
    const { success, error, data } = taskBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        const newTask = yield prismaClient_1.default.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                due_date: data.due_date,
                user_id: data.user_id,
            }
        });
        return (0, successResponse_1.default)(res, 200, "Task Created Successfully", newTask);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.createTask = createTask;
// Get all Tasks from User
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getTasksBody = zod_1.z.object({
        userId: zod_1.z.number()
    });
    const { success, error, data } = getTasksBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        const tasks = yield prismaClient_1.default.task.findMany({
            where: {
                user_id: data.userId
            }
        });
        return (0, successResponse_1.default)(res, 200, "Fetched tasks of user", tasks);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.getTasks = getTasks;
// Get all created tasks (pagination)
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.keys(req.query).length === 0) {
        return (0, throwError_1.default)(res, 400, "Please pass the pagination params");
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1) {
        return (0, throwError_1.default)(res, 400, 'Page and limit must be positive integers');
    }
    // Calculate the offset
    const offset = (page - 1) * limit;
    try {
        // Fetch the tasks with pagination
        const allTasks = yield prismaClient_1.default.task.findMany({
            skip: offset,
            take: limit,
        });
        const totalTasks = yield prismaClient_1.default.task.count();
        return (0, successResponse_1.default)(res, 200, `Fetched ${totalTasks} task(s)`, allTasks);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.getAllTasks = getAllTasks;
// Update a Task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusEnum = zod_1.z.enum(["TODO", "IN_PROGRESS", "DONE"]);
    const priorityEnum = zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]);
    const updateTaskBody = zod_1.z.object({
        taskId: zod_1.z.number(),
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        due_date: zod_1.z.string().optional(),
        userId: zod_1.z.number().optional()
    });
    const { success, error, data } = updateTaskBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        // Check if task exists
        const task = yield prismaClient_1.default.task.findUnique({
            where: {
                id: data.taskId
            }
        });
        if (!task) {
            return (0, throwError_1.default)(res, 400, "Task does not exist with the given id");
        }
        const updatedTask = yield prismaClient_1.default.task.update({
            where: {
                id: data.taskId
            },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                due_date: data.due_date,
                user_id: data.userId,
            }
        });
        return (0, successResponse_1.default)(res, 200, "Updated Task Successfully", updatedTask);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.updateTask = updateTask;
// Delete a task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteTaskBody = zod_1.z.object({
        taskId: zod_1.z.number(),
    });
    const { success, error, data } = deleteTaskBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        // Check if task exists
        const task = yield prismaClient_1.default.task.findUnique({
            where: {
                id: data.taskId
            }
        });
        if (!task) {
            return (0, throwError_1.default)(res, 400, "Task does not exist with the given id");
        }
        const deletedTask = yield prismaClient_1.default.task.delete({
            where: {
                id: data.taskId
            }
        });
        return (0, successResponse_1.default)(res, 200, "Deleted task successfully", deletedTask);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.deleteTask = deleteTask;
// Filtering Tasks
const filterTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusEnum = zod_1.z.enum(["todo", "in_progress", "done"]);
    const priorityEnum = zod_1.z.enum(["low", "medium", "high"]);
    const filterTasksBody = zod_1.z.object({
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        due_date: zod_1.z.string().optional(),
    });
    if (Object.keys(req.query).length === 0) {
        return (0, throwError_1.default)(res, 400, "Please pass the filter params");
    }
    const { success, error, data } = filterTasksBody.safeParse(req.query);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        const whereCondition = {};
        if (data.status) {
            whereCondition.status = data.status.toUpperCase();
        }
        if (data.priority) {
            whereCondition.priority = data.priority.toUpperCase();
        }
        if (data.due_date) {
            whereCondition.due_date = new Date(data.due_date);
        }
        const filteredTasks = yield prismaClient_1.default.task.findMany({
            where: whereCondition,
        });
        return (0, successResponse_1.default)(res, 200, "Filtered Tasks Successfully", filteredTasks);
    }
    catch (error) {
        console.error(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.filterTasks = filterTasks;
// Searching Tasks
const searchTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTasks = zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional()
    });
    if (Object.keys(req.query).length === 0) {
        return (0, throwError_1.default)(res, 400, "Please pass the filter params");
    }
    const { success, error, data } = searchTasks.safeParse(req.query);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        const searchedTasks = yield prismaClient_1.default.task.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: data.title,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: data.description,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
        });
        return (0, successResponse_1.default)(res, 200, "Searched Tasks Successfully", searchedTasks);
    }
    catch (error) {
        console.error(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.searchTasks = searchTasks;
