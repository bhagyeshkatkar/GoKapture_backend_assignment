"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const throwError_1 = __importDefault(require("../../helpers/throwError"));
const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.role;
        if (!userRole || !roles.includes(userRole)) {
            return (0, throwError_1.default)(res, 403, 'Forbidden: Insufficient permissions');
        }
        next();
    };
};
exports.default = checkRole;
