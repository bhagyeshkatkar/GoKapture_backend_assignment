import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import throwError from "../../helpers/throwError"

// Extend the Express Request interface to include a user property
declare global {
    namespace Express {
      interface Request {
        userId?: number;
        role: string;
      }
    }
  }

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.headers.authorization

        if(!authHeader){
            return throwError(res, 401, "Authorization header is missing")
        }

        // Removing the "bearer" from the token
        const token = authHeader?.split(" ")[1]

        if(!token){
            return throwError(res, 401, "Bearer token is missing")
        }

        const decoded = jwt.verify(token, "gokapture-jwt-password")

        if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
            req.userId = (decoded as any).id;
            req.role = (decoded as any).role
          }

        next()

    } catch (error) {
        console.log(error)
        throwError(res, 403, "Unauthorized Access")
    }
}

export default authMiddleware