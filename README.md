# Project Title

A brief description of what this project does and who it's for

# 🚀 Task Manager Pro - Full-Stack Application

This is a full-stack task management application built to demonstrate clean architecture, secure authentication, and modern development practices using React and Fastify.

## 🛠️ Technology Stack
* **Backend:** Node.js, Fastify, TypeScript, Kysely (Query Builder), PostgreSQL, JWT Authentication, Bcrypt.
* **Frontend:** React, Vite, TypeScript, React Router, TanStack Query.
* **Infrastructure:** Docker & Docker Compose (PostgreSQL).

## ⚙️ Prerequisites
Before running the project, make sure you have installed:
* Node.js (v18 or higher)
* Docker Desktop (running)

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone <https://github.com/mvalladaresmembreno/task-manager-assesstment>

cd task-manager-assesstment
```

### 2. Start the Database
From the root of the project, start the PostgreSQL container:
```bash
docker compose up -d
```
*(To reset the database later, you can use: `docker compose down -v` followed by `docker compose up -d`)*

### 3. Set Up and Start the Backend
```bash
cd apps/api
```

```bash
npm install
```

Create a `.env` file inside `apps/api/.env` with the following variables:
```bash
PORT=3000
JWT_SECRET=supersecretkey
DATABASE_URL=postgres://postgres:postgres@localhost:5433/task_manager
CORS_ORIGIN=http://localhost:5173
```

Run the migrations to create the tables and start the server:
```bash
npm run migrate
```
```bash
npm run dev
```

*Backend runs at: `http://localhost:3000`*

### 4. Set Up and Start the Frontend
In a new terminal window:
```bash
cd apps/web
```
```bash
npm install
```

Create a `.env` file inside `apps/web/.env`:
```bash
VITE_API_URL=http://localhost:3000
```
Start the frontend:
```bash
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

## 🌟 How to Use the App
1. Open `http://localhost:5173` in your browser.
2. Register a new user and Login.
3. Manage your workflow: Create tasks, toggle task status (pending/completed), and delete tasks.

## 📝 Key Features & Notes
* **Clean Architecture:** Efficient API design and secure authentication flow.
* **Modern Data Handling:** The frontend uses React Query for efficient state management and caching.
* **Database Management:** Schema is managed using Kysely migrations. Pagination is implemented using native SQL `LIMIT`/`OFFSET`.
* **Security:** JWT is stored in `localStorage` and injected automatically in API calls. The `Content-Type` header is dynamically managed (only sent when requests have a body, which is important for `DELETE` requests).

## 📖 API Documentation

All task routes require a JWT token. The frontend automatically attaches the token to all requests.
**Header format:** `Authorization: Bearer <your_token>`

### 🔐 Authentication (`/api/auth`)

* **POST** `/api/auth/signup` - Register a new user
* **POST** `/api/auth/login` - Log in and receive a JWT
* **GET** `/api/auth/me` - Get current logged-in user

### 📋 Tasks (`/api/tasks`)

* **GET** `/api/tasks` - List tasks
* **POST** `/api/tasks` - Create a new task
* **PATCH** `/api/tasks/:id` - Update a task's details
* **PATCH** `/api/tasks/:id/status` - Update a task's status
* **DELETE** `/api/tasks/:id` - Delete a task by ID

## 🗄️ Database Schema

### Users
* `id` (UUID)
* `name`
* `email`
* `password_hash`
* `role`
* `created_at`
* `updated_at`

### Tasks
* `id` (UUID)
* `title`
* `description`
* `status` (pending/completed)
* `user_id` (Foreign Key)
* `created_at`
* `updated_at`

## 🔮 Future Improvements
* Role-based access (Admin/User).
* UI improvements (Tailwind / shadcn).
* Task editing UI.
* Unit and integration tests.
* Full Dockerization (frontend + backend).
