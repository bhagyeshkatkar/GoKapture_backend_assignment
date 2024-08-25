import { Response } from "express";

const successResponse = (res: Response, statusCode: number, successMessage: string, data: object): Response => {
    return res.status(statusCode).json({
        message: successMessage,
        data: data
    })
}

export default successResponse