"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./user/userRoutes"));
const taskRoutes_1 = __importDefault(require("./task/taskRoutes"));
const rootRouter = (0, express_1.Router)();
// User Router 
rootRouter.use("/user", userRoutes_1.default);
// Task Router
rootRouter.use("/tasks", taskRoutes_1.default);
exports.default = rootRouter;
