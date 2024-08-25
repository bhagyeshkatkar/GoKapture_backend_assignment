"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/user/userController");
const userRouter = (0, express_1.Router)();
// User Registration
userRouter.post("/register", userController_1.userSignUp);
// User Login
userRouter.post("/login", userController_1.userSignIn);
exports.default = userRouter;
