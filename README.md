# 🚀 Task Manager Pro - Full-Stack Application

This is a full-stack task management application built to demonstrate clean architecture, secure authentication, and modern development practices using React and Fastify.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Fastify
- TypeScript
- Kysely (Query Builder)
- PostgreSQL
- JWT Authentication
- Bcrypt

### Frontend
- React
- Vite
- TypeScript
- React Router
- TanStack Query

### Infrastructure
- Docker & Docker Compose (PostgreSQL)

---

## ⚙️ Prerequisites

Before running the project, make sure you have installed:

- Node.js (v18 or higher)
- Docker Desktop (running)

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager-assesstment
```

---

### 2. Start the Database (PostgreSQL)

From the root of the project:

```bash
docker compose up -d
```

---

### 3. Setup and Run the Backend

```bash
cd apps/api
npm install
```

#### Create `.env`

Inside `apps/api/.env`:

```env
PORT=3000
JWT_SECRET=supersecretkey
DATABASE_URL=postgres://postgres:postgres@localhost:5433/task_manager
CORS_ORIGIN=http://localhost:5173
```

#### Run migrations

```bash
npm run migrate
```

#### Start backend

```bash
npm run dev
```

Backend runs at:  
👉 http://localhost:3000

---

### 4. Setup and Run the Frontend

In another terminal:

```bash
cd apps/web
npm install
```

#### Create `.env`

Inside `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3000
```

#### Start frontend

```bash
npm run dev
```

Frontend runs at:  
👉 http://localhost:5173

---

## 🧑‍💻 How to Use the App

1. Open: http://localhost:5173  
2. Register a new user  
3. Login  
4. Create tasks  
5. Toggle task status (pending/completed)  
6. Delete tasks  

---

## 🔐 Authentication

All task routes require a JWT token.

**Header format:**

```http
Authorization: Bearer <your_token>
```

The frontend automatically attaches the token to all requests.

---

## 📡 API Overview

### Auth

| Method | Endpoint              | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/signup     | Register user      |
| POST   | /api/auth/login      | Login              |
| GET    | /api/auth/me         | Get current user   |

### Tasks

| Method | Endpoint              | Description        |
|--------|----------------------|--------------------|
| GET    | /api/tasks           | List tasks         |
| POST   | /api/tasks           | Create task        |
| PATCH  | /api/tasks/:id       | Update task        |
| PATCH  | /api/tasks/:id/status| Update status      |
| DELETE | /api/tasks/:id       | Delete task        |

---

## 🗄️ Database Schema

### Users
- id (UUID)
- name
- email
- password_hash
- role
- created_at
- updated_at

### Tasks
- id (UUID)
- title
- description
- status (pending/completed)
- user_id (FK)
- created_at
- updated_at

---

## 🐳 Docker Commands

### Start database

```bash
docker compose up -d
```

### Reset database

```bash
docker compose down -v
docker compose up -d
```

---

## 📝 Notes

- Database schema is managed using Kysely migrations  
- JWT is stored in localStorage and injected automatically in API calls  
- Content-Type header is only sent when request has a body (important for DELETE requests)  
- Pagination is implemented using SQL LIMIT/OFFSET  

---

## 🚧 Future Improvements

- Role-based access (Admin/User)  
- UI improvements (Tailwind / shadcn)  
- Task editing UI  
- Unit and integration tests  
- Full Dockerization (frontend + backend)  

---

## 📌 Summary

This project demonstrates:

- Clean full-stack architecture  
- Secure authentication flow  
- Efficient API design  
- Modern React data handling with React Query  
- Database migrations with Kysely  
