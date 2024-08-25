"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throwError = (res, statusCode, errorMessage) => {
    return res.status(statusCode).json({
        message: errorMessage
    });
};
exports.default = throwError;
