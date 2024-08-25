"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse = (res, statusCode, successMessage, data) => {
    return res.status(statusCode).json({
        message: successMessage,
        data: data
    });
};
exports.default = successResponse;
