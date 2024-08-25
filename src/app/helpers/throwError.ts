import { Response } from "express";

const throwError = (res: Response, statusCode: number, errorMessage: object|string): Response => {
    return res.status(statusCode).json({
        message: errorMessage
    })
}

export default throwError