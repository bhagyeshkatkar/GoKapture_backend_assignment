import { Request, Response } from "express";
import { z } from "zod";
import throwError from "../../helpers/throwError";
import prisma from "../../db/prismaClient";
import successResponse from "../../helpers/successResponse";

// Creating a new task
export const createTask = async(req: Request, res: Response) => {
    const statusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
    const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

    const taskBody = z.object({
        title: z.string(),
        description: z.string(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        due_date: z.string(),
        user_id: z.number()
    })

    const {success, error, data} = taskBody.safeParse(req.body)

    if(!success){
        return throwError(res, 400, error)
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                due_date: data.due_date,
                user_id: data.user_id,
            }
        })
        return successResponse(res, 200, "Task Created Successfully", newTask)
    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}


// Get all Tasks from User
export const getTasks = async(req: Request, res: Response) => {
    const getTasksBody = z.object({
        userId: z.number()
    })

    const {success, error, data} = getTasksBody.safeParse(req.body)

    if(!success){
        return throwError(res, 400, error)
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                user_id: data.userId
            }
        })
        return successResponse(res, 200, "Fetched tasks of user", tasks)
    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}

// Get all created tasks (pagination)
export const getAllTasks = async(req: Request, res: Response) => {
    if(Object.keys(req.query).length === 0){
        return throwError(res, 400, "Please pass the pagination params")
      }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
        return throwError(res, 400, 'Page and limit must be positive integers')
    }

    // Calculate the offset
    const offset = (page - 1) * limit;

    try {
        // Fetch the tasks with pagination
        const allTasks = await prisma.task.findMany({
        skip: offset,
        take: limit,
    });
        const totalTasks = await prisma.task.count();

        return successResponse(res, 200, `Fetched ${totalTasks} task(s)`, allTasks)
        
    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}

// Update a Task
export const updateTask = async(req: Request, res: Response) => {
    const statusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
    const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

    const updateTaskBody = z.object({
        taskId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: statusEnum.optional(),
        priority: priorityEnum.optional(),
        due_date: z.string().optional(),
        userId: z.number().optional()
    })

    const {success, error, data} = updateTaskBody.safeParse(req.body)

    if(!success){
        return throwError(res, 400, error)
    }

    try {
         // Check if task exists
         const task = await prisma.task.findUnique({
            where: {
                id: data.taskId
            }
        })

        if(!task) {
            return throwError(res, 400, "Task does not exist with the given id")
        }

         const updatedTask = await prisma.task.update({
            where: {
                id: data.taskId
            }, 
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                due_date: data.due_date,
                user_id: data.userId,
            }
         })

         return successResponse(res, 200, "Updated Task Successfully", updatedTask)
    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}

// Delete a task
export const deleteTask = async(req: Request, res: Response) => {
    const deleteTaskBody = z.object({
        taskId: z.number(),
    })

    const {success, error, data} = deleteTaskBody.safeParse(req.body)

    if(!success){
        return throwError(res, 400, error)
    }

    try {
        // Check if task exists
        const task = await prisma.task.findUnique({
            where: {
                id: data.taskId
            }
        })

        if(!task) {
            return throwError(res, 400, "Task does not exist with the given id")
        }

        const deletedTask = await prisma.task.delete({
            where: {
                id: data.taskId
            }
        })

        return successResponse(res, 200, "Deleted task successfully", deletedTask)
    } catch (error) {
        console.log(error)
        throwError(res, 500, "Internal Server Error")
    }
}

// Filtering Tasks
export const filterTasks = async (req: Request, res: Response) => {
  const statusEnum = z.enum(["todo", "in_progress", "done"]);
  const priorityEnum = z.enum(["low", "medium", "high"]);

  const filterTasksBody = z.object({
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    due_date: z.string().optional(),
  });

  if(Object.keys(req.query).length === 0){
    return throwError(res, 400, "Please pass the filter params")
  }

  const { success, error, data } = filterTasksBody.safeParse(req.query);

  if (!success) {
    return throwError(res, 400, error);
  }

  try {
    const whereCondition: any = {};

    if (data.status) {
      whereCondition.status = data.status.toUpperCase();
    }

    if (data.priority) {
      whereCondition.priority = data.priority.toUpperCase();
    }

    if (data.due_date) {
      whereCondition.due_date = new Date(data.due_date);
    }

    const filteredTasks = await prisma.task.findMany({
      where: whereCondition,
    });

    return successResponse(res, 200, "Filtered Tasks Successfully", filteredTasks)
  } catch (error) {
    console.error(error);
    throwError(res, 500, "Internal Server Error")
  }
};


// Searching Tasks
export const searchTasks = async(req: Request, res: Response) => {
    const searchTasks = z.object({
        title: z.string().optional(),
        description: z.string().optional()
    })

    if(Object.keys(req.query).length === 0){
        return throwError(res, 400, "Please pass the filter params")
    }

    const {success, error, data} = searchTasks.safeParse(req.query)

    if (!success) {
        return throwError(res, 400, error);
    }

    try {
        const searchedTasks = await prisma.task.findMany({
            where: {
                OR: [
                    {
                      title: {
                        contains: data.title,
                        mode: 'insensitive', 
                      },
                    },
                    {
                      description: {
                        contains: data.description,
                        mode: 'insensitive', 
                      },
                    },
                  ],
            }
        })

        return successResponse(res, 200, "Searched Tasks Successfully", searchedTasks)
    } catch (error) {
        console.error(error);
        throwError(res, 500, "Internal Server Error")
    }
}