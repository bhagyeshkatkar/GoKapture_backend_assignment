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
exports.userSignIn = exports.userSignUp = void 0;
const zod_1 = require("zod");
const throwError_1 = __importDefault(require("../../helpers/throwError"));
const prismaClient_1 = __importDefault(require("../../db/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const successResponse_1 = __importDefault(require("../../helpers/successResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// New User Registration
const userSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleEnum = zod_1.z.enum(["ADMIN", "USER"]);
    const signUpBody = zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
        role: roleEnum.optional().default("USER")
    });
    const { success, error, data } = signUpBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        // Checking for existing user
        const existingUser = yield prismaClient_1.default.user.findUnique({
            where: {
                username: data.username
            }
        });
        if (existingUser) {
            return (0, throwError_1.default)(res, 409, "User with this username already exists");
        }
        // Hashing the Password
        const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
        // Saving the new user
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: data.role
            }
        });
        return (0, successResponse_1.default)(res, 200, "User Created Successfully", newUser);
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.userSignUp = userSignUp;
// User Login
const userSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signInBody = zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string()
    });
    const { success, error, data } = signInBody.safeParse(req.body);
    if (!success) {
        return (0, throwError_1.default)(res, 400, error);
    }
    try {
        // Checking if user exists or not 
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                username: data.username
            }
        });
        if (!user) {
            return (0, throwError_1.default)(res, 510, "This user does not exist");
        }
        // Checking the password if username is correct
        const passwordMatch = yield bcrypt_1.default.compare(data.password, user.password);
        if (!passwordMatch) {
            return (0, throwError_1.default)(res, 401, "Password is incorrect");
        }
        // Creating a jwt token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: user.role
        }, "gokapture-jwt-password", { expiresIn: "3d" });
        return (0, successResponse_1.default)(res, 200, "Sign In Successful", { token: `Bearer ${token}` });
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 500, "Internal Server Error");
    }
});
exports.userSignIn = userSignIn;
