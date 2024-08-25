import { Request, Response, NextFunction } from "express";
import throwError from "../../helpers/throwError";

const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.role;
    
        if(!userRole || !roles.includes(userRole)){
            return throwError(res, 403, 'Forbidden: Insufficient permissions')
        }
    
        next()
    }
};

export default checkRole;

