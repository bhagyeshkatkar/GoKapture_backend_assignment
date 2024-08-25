# GoKapture_backend_assignment
Create a task management RESTful API with user authentication, task CRUD operations, filtering, Dockerization, and PostgreSQL integration.

## Instruction to run application locally

**Install dependencies**

`npm install`

**Install docker desktop**

run the below command in project's directory to create docker's postgres image

```
docker-compose up -d
```

_or_

```
docker run --name GoKapture_db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=root -d postgres
```

**Create `.env` file and below environment variables**

```
     POSTGRES_USER = root
     POSTGRES_PASSWORD = root
     POSTGRES_DB = root
     JWT_SECRET = GoKapture@123
     PORT = 3000
```

**Run the project**

`npm run dev`
# API documentation

1.  #### User Registration (Method : POST) http://localhost:3000/api/register

    username : **string**

    password : **string**

    role : **stirng enum** (admin or user)

    ```
    {
        "username": "<username>",
        "password": "<password>",
        "role" : "<role>"
    }
    ```

2.  #### User Login (Method : POST) http://localhost:3000/api/login

    username : **string**

    password : **string**

    ```
       {
        "username": "<username>",
        "password": "<password>",
        }
    ```

3.  #### Create Task (Method : POST) http://localhost:3000/api/tasks

    _only admin can create task and assigne to users_

    title : **string**

    description : **string**

    status : **string enum** (Todo , In Progress , Done)

    priority : **string enum** (Low , Medium , High)

    dueDate : **date**

    userId : **number** reference from user info

    ```
     {
        "title": "<title>",
        "description": "<description>",
        "status": "<status>",
        "priority": "<priority>",
        "dueDate": "<dueDate>",
        "userId" : <userId>
      }
    ```

4.  #### Get all Tasks (Method : GET) http://localhost:3000/api/tasks?page=1

    _admin can view all tasks and user can see tasks assigned to them_

    **page is query number to get tasks as per pagination default tasks in a single page is 3**

5.  #### Update task (Method : PUT) http://localhost:3000/api/tasks/${taskId}

    _will update the task details (only admin or respectively assigned user can update the task)_

    ```
    {
      "title": "<title>",
      "description": "<description>",
      "status": "<status>",
      "priority": "<priority>",
      "dueDate": "<dueDate>",
      "userId" : <userId>
    }
    ```

6.  #### Delete task (Method : DELETE) http://localhost:3000/api/tasks/${taskId}

    _only admin can delete the task by its respective taskId_

7.  #### Filter tasks (Method : POST) http://localhost:3000/api/filterTasks

    status : **string enum** (Todo , In Progress , Done)

    priority : **string enum** (Low , Medium , High)

    dueDate : **date**

    ```
    {
       "status" : <status>,
       "priority" : <priority>,
       "dueDate" : <dueDate>
    }
    ```

8.  #### Search tasks (Method : POST) http://localhost:3000/api/searchTasks

    title : **string**

    description : **string**

    ```
    {
       "title": "<title>",
       "description": "<description>",
    }
    ```
# Approach and Assumptions

### Roles
- Roles are defined during registration as either **admin** or **user**.

### Task Management
- Only **admin** can create and delete tasks for users.
- **Users** can update task status and priority.

### Pagination
- Pagination is set to 5 tasks per page.
- The page number is passed as a query parameter, e.g., `/?page=2`.

## Task Endpoints

**Get all tasks of a user:** GET /api/tasks/all

**Create a new task**: POST /api/tasks/create

**Get All Created Tasks With Pagination**: GET /api/tasks/bulk

**Update a task:** PATCH /api/tasks/update

**Delete a task:** DELETE /api/tasks/delete

