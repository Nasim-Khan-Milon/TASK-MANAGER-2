# Advanced Task Manager API (Profile-Based)

This project is a **backend-only Task Manager API** where users can create and manage their own tasks, and admins can control the whole system.
It’s built using **Node.js, Express, MySQL**, and **JWT authentication**, following a clean **MVC structure**.

The main goal of this project is to show how authentication, authorization, and database integration work together in a real-world backend.


##  What This Project Does

* Users can register and log in securely
* Each user can create, update, and delete **their own tasks only**
* Admins have extra power (like viewing all users and tasks)
* All data is stored in a **MySQL database (using raw queries)**
* Authentication is handled using **JWT tokens**


## uthentication & Security

* Passwords are hashed using **bcrypt**
* Login returns:

  * **Access Token** (short time)
  * **Refresh Token** (long time)
* Users stay logged in using refresh tokens
* Logout removes the stored refresh token


## Roles (Authorization)

There are two roles in the system:

### User

* Can manage only their own tasks
* Cannot access other users' data

### Admin

* Can view all users
* Can view all tasks
* Can delete any task
* Can promote other users to admin

---

## Task Features

* Create task
* Get all tasks (only your own)
* Update task
* Delete task
* Get single task

### Extra Features

* Search tasks by keyword
* Filter by status: `Pending`, `Ongoing`, `Complete`
* Pagination (limit & page)
* Latest tasks first (sorting)

---

## Project Structure

```
TASK-MANAGER-2/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   └── adminController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── adminRoutes.js
│
├── utils/
│   └── token.js
│
├── .env
├── app.js
├── package.json
```


## Technologies Used

* Node.js
* Express.js
* MySQL (mysql2/promise)
* jsonwebtoken (JWT)
* bcrypt


## Database Design

### Users Table

* id
* username (unique)
* email (unique)
* password (hashed)
* role (admin/user)
* refresh_token

### Tasks Table

* id
* title
* description
* status (Pending / Ongoing / Complete)
* user_id (linked to user)
* created_at


## How to Run This Project

### 1. Clone the project

```
git clone https://github.com/Nasim-Khan-Milon/TASK-MANAGER-2.git
cd TASK-MANAGER-2
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Create `.env` file

```
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=task_manager

ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
```


### 4. Setup database

Run this in MySQL:

```
CREATE DATABASE task_manager;
USE task_manager;
```

Then create tables (users & tasks).


### 5. Start server

```
node app.js
```

Server will run at:

```
http://localhost:3000
```


## API Overview

### Auth

* `POST /auth/register` → register user
* `POST /auth/login` → login
* `POST /auth/refresh` → get new access token
* `POST /auth/logout` → logout


### Tasks (Protected)

* `POST /tasks` → create task
* `GET /tasks` → get your tasks
* `GET /tasks/:id` → get single task
* `PUT /tasks/:id` → update
* `DELETE /tasks/:id` → delete


### Admin (Protected)

* `GET /admin/users` → all users
* `GET /admin/tasks` → all tasks
* `DELETE /admin/tasks/:id` → delete any task
* `PUT /admin/make-admin/:id` → promote user


## Testing

You can test all APIs using Postman.

For protected routes, send token like:

```
Authorization: Bearer <access_token>
```


## Security Notes

* Passwords are never stored as plain text
* Tokens expire automatically
* Only authenticated users can access protected routes
* Role-based access is enforced


## Possible Improvements

* Email verification (OTP)
* Password reset system
* API documentation (Swagger)
* Rate limiting
* Deployment with Docker


## Author

MD. NASIM KHAN MILON


## Note

This project is created for learning purposes and backend practice.
