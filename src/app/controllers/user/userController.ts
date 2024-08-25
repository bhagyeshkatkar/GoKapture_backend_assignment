import { Request, Response } from "express";
import { z } from "zod";
import throwError from "../../helpers/throwError";
import prisma from "../../db/prismaClient";
import bcrypt from "bcrypt"
import successResponse from "../../helpers/successResponse";
import jwt from "jsonwebtoken"

// New User Registration
export const userSignUp = async(req: Request, res: Response) => {
    const roleEnum = z.enum(["ADMIN", "USER"])

    const signUpBody = z.object({
        username: z.string(),
        password: z.string(),
        role: roleEnum.optional().default("USER")
    })

    const {success, error, data} = signUpBody.safeParse(req.body)

    if(!success) {
        return throwError(res, 400, error)
    }

    try {
        // Checking for existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })

        if(existingUser) {
            return throwError(res, 409, "User with this username already exists")
        }

        // Hashing the Password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Saving the new user
        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: data.role
            }
        })

        return successResponse(res, 200, "User Created Successfully", newUser)

    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
    
}

// User Login
export const userSignIn = async(req: Request, res: Response) => {
    const signInBody = z.object({
        username: z.string(),
        password: z.string()
    })

    const {success, error, data} = signInBody.safeParse(req.body)

    if(!success) {
        return throwError(res, 400, error)
    }

    try {
    // Checking if user exists or not 
    const user = await prisma.user.findUnique({
        where: {
            username: data.username
        }
    })

    if(!user) {
        return throwError(res, 510, "This user does not exist")
    }

    // Checking the password if username is correct
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if(!passwordMatch) {
        return throwError(res, 401, "Password is incorrect")
    }

    // Creating a jwt token
    const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        "gokapture-jwt-password",
        { expiresIn: "3d" }
      );

      return successResponse(res, 200, "Sign In Successful", {token: `Bearer ${token}`})


    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}