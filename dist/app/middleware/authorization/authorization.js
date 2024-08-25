"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const throwError_1 = __importDefault(require("../../helpers/throwError"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return (0, throwError_1.default)(res, 401, "Authorization header is missing");
        }
        // Removing the "bearer" from the token
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            return (0, throwError_1.default)(res, 401, "Bearer token is missing");
        }
        const decoded = jsonwebtoken_1.default.verify(token, "gokapture-jwt-password");
        if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
            req.userId = decoded.id;
            req.role = decoded.role;
        }
        next();
    }
    catch (error) {
        console.log(error);
        (0, throwError_1.default)(res, 403, "Unauthorized Access");
    }
};
exports.default = authMiddleware;
