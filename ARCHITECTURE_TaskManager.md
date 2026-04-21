# 🏗️ System Architecture Document
## Full Stack Task Manager — TaskFlow

---

> **Document Version:** 1.0  
> **Type:** Technical Architecture Guide  
> **Last Updated:** April 2026  
> **Author:** Senior Software Architect  
> **Audience:** Developers implementing or reviewing the system
> **Tech Stack:** React + TypeScript | Supabase (Postgres + Auth)

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Folder Structure](#2-folder-structure)
3. [API Layer Design](#3-api-layer-design)
4. [Authentication Flow (JWT)](#4-authentication-flow-jwt)
5. [State Management Strategy](#5-state-management-strategy)
6. [Error Handling Strategy](#6-error-handling-strategy)
7. [Security Best Practices](#7-security-best-practices)
8. [Scalability Plan](#8-scalability-plan)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Development Setup Guide](#10-development-setup-guide)

---

## 1. High-Level Architecture

### The Big Picture (30,000 Feet View)

```
                        TASKFLOW — SYSTEM ARCHITECTURE

  ┌─────────────────────────────────────────────────────────────────┐
  │                        CLIENT SIDE                              │
  │                                                                 │
  │   ┌──────────────────────────────────────────────────────┐     │
  │   │              React + TypeScript + Tailwind            │     │
  │   │                                                        │     │
  │   │   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │     │
  │   │   │  Pages   │  │Components│  │  State (Context) │  │     │
  │   │   │ /login   │  │TaskCard  │  │  AuthContext     │  │     │
  │   │   │ /signup  │  │TaskForm  │  │  TaskContext     │  │     │
  │   │   │/dashboard│  │Filter    │  │                  │  │     │
  │   │   └──────────┘  └──────────┘  └──────────────────┘  │     │
  │   │                                                        │     │
  │   │              API Service Layer (Axios)                 │     │
  │   └──────────────────────────┬───────────────────────────┘     │
  └──────────────────────────────│─────────────────────────────────┘
                                 │
                    HTTPS (JSON over REST API)
                    Authorization: Bearer <JWT>
                                 │
  ┌──────────────────────────────│─────────────────────────────────┐
  │                        SERVER SIDE                              │
  │                                                                 │
  │   ┌──────────────────────────▼───────────────────────────┐     │
  │   │              Node.js + Express + TypeScript           │     │
  │   │                                                        │     │
  │   │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │     │
  │   │  │  Routes  │→ │Middleware│→ │    Controllers      │ │     │
  │   │  │/auth     │  │  auth    │  │  authController    │ │     │
  │   │  │/tasks    │  │  error   │  │  taskController    │ │     │
  │   │  │          │  │  rate    │  │                    │ │     │
  │   │  └──────────┘  └──────────┘  └────────┬───────────┘ │     │
  │   │                                         │             │     │
  │   │              Service Layer              │             │     │
  │   │        ┌────────────────────────────────┘             │     │
  │   │        ▼                                              │     │
  │   │  ┌──────────┐  ┌──────────┐                          │     │
  │   │  │  Models  │  │ Services │                          │     │
  │   │  │  User    │  │authSvc   │                          │     │
  │   │  │  Task    │  │taskSvc   │                          │     │
  │   │  └────┬─────┘  └──────────┘                          │     │
  │   └────────│───────────────────────────────────────────── ┘    │
  └────────────│────────────────────────────────────────────────────┘
               │
          Mongoose ODM
               │
  ┌────────────▼───────────────────────────────────────────────────┐
  │                         DATABASE                                │
  │                                                                 │
  │              MongoDB Atlas (Cloud) / Local MongoDB              │
  │                                                                 │
  │        ┌──────────────┐      ┌──────────────────┐             │
  │        │  users       │      │     tasks         │             │
  │        │  collection  │◄─────│  collection       │             │
  │        │              │  ref │  user: ObjectId   │             │
  │        └──────────────┘      └──────────────────┘             │
  └─────────────────────────────────────────────────────────────────┘
```

---

### Component Interaction Flow

```
Browser (User)
     │
     │ 1. User clicks "Add Task"
     ▼
React Component (TaskForm.tsx)
     │
     │ 2. Form submit → calls API service
     ▼
api/taskApi.ts (Axios instance)
     │
     │ 3. POST /api/tasks
     │    + Authorization: Bearer eyJ...
     ▼
Express Router (taskRoutes.ts)
     │
     │ 4. Route matches → goes to middleware first
     ▼
authMiddleware.ts
     │
     │ 5. Verify JWT token
     │    ✅ Valid → attach user to req.user
     │    ❌ Invalid → return 401
     ▼
taskController.ts → createTask()
     │
     │ 6. Validate inputs
     │    Call service layer
     ▼
taskService.ts → create()
     │
     │ 7. Call Mongoose model
     ▼
Task.model.ts (Mongoose)
     │
     │ 8. Save to MongoDB
     ▼
MongoDB Atlas
     │
     │ 9. Data saved → return document
     ▼
Response flows back up the chain
     │
     │ 10. 201 Created + task data
     ▼
React updates state (Context)
     │
     │ 11. UI re-renders with new task
     ▼
User sees new task in dashboard ✅
```

---

## 2. Folder Structure

### 2.1 Complete Project Structure

```
taskflow/
├── 📁 client/                    # Frontend (React + TypeScript)
│   ├── 📁 public/
│   │   └── index.html
│   ├── 📁 src/
│   │   ├── 📁 api/               # API call functions
│   │   │   ├── authApi.ts        # Login, signup, me
│   │   │   ├── taskApi.ts        # CRUD task calls
│   │   │   └── axiosInstance.ts  # Base Axios config
│   │   │
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── 📁 tasks/
│   │   │   │   ├── TaskCard.tsx      # Ek task ka UI block
│   │   │   │   ├── TaskForm.tsx      # Add/Edit task modal
│   │   │   │   ├── TaskList.tsx      # Task cards ki list
│   │   │   │   └── TaskFilter.tsx    # All/Pending/Completed filter
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── StatsCard.tsx     # Summary count cards
│   │   │   │   └── DashboardHeader.tsx
│   │   │   └── 📁 shared/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Toast.tsx
│   │   │       ├── Spinner.tsx
│   │   │       └── ProtectedRoute.tsx  # Auth guard component
│   │   │
│   │   ├── 📁 context/           # React Context (Global State)
│   │   │   ├── AuthContext.tsx   # User + token state
│   │   │   └── TaskContext.tsx   # Tasks state + actions
│   │   │
│   │   ├── 📁 hooks/             # Custom React Hooks
│   │   │   ├── useAuth.ts        # Login/logout logic
│   │   │   ├── useTasks.ts       # Task CRUD logic
│   │   │   └── useForm.ts        # Form state management
│   │   │
│   │   ├── 📁 pages/             # Full page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   │
│   │   ├── 📁 types/             # TypeScript interfaces
│   │   │   ├── auth.types.ts
│   │   │   └── task.types.ts
│   │   │
│   │   ├── 📁 utils/             # Helper functions
│   │   │   ├── formatDate.ts
│   │   │   ├── validators.ts
│   │   │   └── storage.ts        # localStorage wrapper
│   │   │
│   │   ├── App.tsx               # Root component + Routes
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Tailwind base styles
│   │
│   ├── .env                      # VITE_API_URL etc
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── 📁 server/                    # Backend (Node.js + Express + TypeScript)
    ├── 📁 src/
    │   ├── 📁 config/
    │   │   ├── db.ts             # MongoDB connection
    │   │   └── env.ts            # Environment variables validation
    │   │
    │   ├── 📁 controllers/       # Request handlers
    │   │   ├── auth.controller.ts
    │   │   └── task.controller.ts
    │   │
    │   ├── 📁 middleware/        # Express middlewares
    │   │   ├── auth.middleware.ts     # JWT verification
    │   │   ├── error.middleware.ts    # Global error handler
    │   │   ├── validate.middleware.ts # Input validation
    │   │   └── rateLimit.middleware.ts
    │   │
    │   ├── 📁 models/            # Mongoose schemas
    │   │   ├── User.model.ts
    │   │   └── Task.model.ts
    │   │
    │   ├── 📁 routes/            # Express route definitions
    │   │   ├── auth.routes.ts
    │   │   └── task.routes.ts
    │   │
    │   ├── 📁 services/          # Business logic layer
    │   │   ├── auth.service.ts
    │   │   └── task.service.ts
    │   │
    │   ├── 📁 types/             # TypeScript types
    │   │   ├── auth.types.ts
    │   │   ├── task.types.ts
    │   │   └── express.d.ts      # Extend Express Request type
    │   │
    │   ├── 📁 utils/
    │   │   ├── jwt.utils.ts      # Token generate/verify
    │   │   ├── hash.utils.ts     # Password hashing
    │   │   └── apiResponse.ts    # Standard response format
    │   │
    │   ├── 📁 validators/        # express-validator rules
    │   │   ├── auth.validators.ts
    │   │   └── task.validators.ts
    │   │
    │   └── app.ts                # Express app setup
    │
    ├── server.ts                 # Entry point (starts server)
    ├── .env                      # Environment variables
    ├── .env.example              # Template for .env
    ├── package.json
    └── tsconfig.json
```

---

### Why This Structure?

```
Principle          → Implementation
─────────────────────────────────────────────────
Separation of      → Routes → Controllers → Services → Models
Concerns             (har layer ka alag kaam)

Single             → Ek file = ek responsibility
Responsibility       (TaskCard sirf task dikhata hai)

DRY (Don't         → Shared components, utility functions
Repeat Yourself)     reusable banao

Scalability        → Naya feature = naya folder, existing
                     code touch mat karo
```

---

## 3. API Layer Design

### 3.1 Request Lifecycle (Ek Request Kaise Travel Karti Hai)

```
HTTP Request
    │
    ▼
Express App (app.ts)
    │
    ├── helmet()           → Security headers
    ├── cors()             → Cross-origin allow karo
    ├── express.json()     → JSON body parse karo
    ├── rateLimit()        → Request limit check karo
    │
    ▼
Router (/api/tasks)
    │
    ▼
Auth Middleware             → JWT verify karo
    │
    ▼
Validation Middleware       → Input validate karo
    │
    ▼
Controller                  → Business logic call karo
    │
    ▼
Service Layer               → DB operations
    │
    ▼
Mongoose Model              → MongoDB query
    │
    ▼
Response ← data ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

### 3.2 Standard API Response Format

**Saare responses ek consistent format mein honge:**

```typescript
// Success Response
{
  success: true,
  message: "Task created successfully",
  data: { ...actual data... }
}

// Error Response
{
  success: false,
  message: "Human readable error",
  errors: [                          // Optional: validation errors
    { field: "email", message: "Invalid email format" }
  ]
}

// List Response
{
  success: true,
  count: 10,
  data: [ ...array of items... ]
}
```

---

### 3.3 Axios Configuration (Frontend)

```typescript
// src/api/axiosInstance.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,  // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor — har request mein auto token attach karo
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor — 401 aane par auto logout karo
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 4. Authentication Flow (JWT)

### 4.1 Signup Flow — Step by Step

```
FRONTEND                              BACKEND
   │                                     │
   │  1. User fills signup form          │
   │                                     │
   │──POST /api/auth/register──────────►│
   │     { name, email, password }       │
   │                                     │
   │                            2. Validate input (express-validator)
   │                            3. Check: email already exists?
   │                            4. Hash password: bcrypt(password, 12)
   │                            5. Save user to MongoDB
   │                            6. Generate JWT:
   │                               jwt.sign({ userId }, SECRET, { expiresIn: '7d' })
   │                                     │
   │◄──201 { token, user } ────────────│
   │                                     │
   │  7. Store token in localStorage     │
   │  8. Update AuthContext              │
   │  9. Redirect to /dashboard          │
```

---

### 4.2 Login Flow

```
FRONTEND                              BACKEND
   │                                     │
   │──POST /api/auth/login─────────────►│
   │     { email, password }             │
   │                                     │
   │                            2. Find user by email
   │                            3. bcrypt.compare(password, hashedPassword)
   │                            4. ❌ Wrong → 401 Unauthorized
   │                            5. ✅ Correct → Generate JWT
   │                                     │
   │◄──200 { token, user }─────────────│
   │                                     │
   │  6. localStorage.setItem('token')   │
   │  7. All future requests mein        │
   │     Authorization header add hoga   │
```

---

### 4.3 Protected Route Access Flow

```
FRONTEND                              BACKEND
   │                                     │
   │──GET /api/tasks──────────────────►│
   │   Headers:                          │
   │   Authorization: Bearer eyJ...      │
   │                                     │
   │                            authMiddleware runs:
   │                            │
   │                            ├── Token present? No → 401
   │                            ├── Token valid? No → 401 "Invalid token"
   │                            ├── Token expired? → 401 "Token expired"
   │                            └── Valid! → req.user = decoded payload
   │                                     │
   │                            Controller runs with req.user.id
   │                            Query: Task.find({ user: req.user.id })
   │                                     │
   │◄──200 { tasks: [...] }────────────│
```

---

### 4.4 JWT Token Structure

```
JWT = Header.Payload.Signature

Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (publicly readable — koi secret nahi daalo):
{
  "userId": "64abc123...",
  "iat": 1713427200,        // issued at (timestamp)
  "exp": 1714032000         // expires at (7 days later)
}

Signature:
HMACSHA256(
  base64(header) + "." + base64(payload),
  JWT_SECRET
)
```

---

### 4.5 authMiddleware.ts Implementation

```typescript
// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // 1. Header se token nikalo
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // 3. User ID request mein attach karo
    (req as any).user = { id: decoded.userId };
    
    next(); // 4. Controller ko call karo
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
```

---

### 4.6 Frontend Auth Context

```typescript
// src/context/AuthContext.tsx

// State structure:
{
  user: User | null,       // Current logged in user
  token: string | null,    // JWT token
  isAuthenticated: boolean,
  isLoading: boolean,      // Auth check ke time true
}

// Actions:
login(email, password) → API call → token store → user set
signup(name, email, password) → API call → token store
logout() → token clear → user null → redirect /login
checkAuth() → token se /auth/me call → user info refresh
```

---

### 4.7 ProtectedRoute Component

```typescript
// src/components/shared/ProtectedRoute.tsx

// Kaam kaise karta hai:
// 1. Auth check karo
// 2. isLoading → Spinner dikhao
// 3. isAuthenticated → Children render karo (dashboard, etc.)
// 4. Not authenticated → Redirect to /login

// Route configuration in App.tsx:
//   /dashboard → ProtectedRoute → DashboardPage
//   /login     → LoginPage (public)
//   /signup    → SignupPage (public)
```

---

## 5. State Management Strategy

### 5.1 State Architecture Decision

> **Choice: React Context API + useReducer**  
> **Why not Redux?** MVP ke liye Redux overkill hai. Context + useReducer sufficient hai.  
> **When to upgrade?** Jab features 20+ ho jaayein ya team 3+ developers ho.

---

### 5.2 State Map

```
Global State (Context)
├── AuthContext
│   ├── user: { id, name, email }
│   ├── token: string
│   ├── isAuthenticated: boolean
│   └── isLoading: boolean
│
└── TaskContext
    ├── tasks: Task[]            → All tasks (raw from API)
    ├── filteredTasks: Task[]    → After filter applied
    ├── activeFilter: string     → 'all' | 'pending' | 'completed'
    ├── isLoading: boolean
    └── error: string | null

Local State (useState — component ke andar)
├── LoginForm → email, password, formError
├── TaskForm → title, description, dueDate, isSubmitting
└── TaskCard → isEditing, showDeleteConfirm
```

---

### 5.3 Data Flow Diagram

```
User Action (e.g., Click "Complete Task")
           │
           ▼
    TaskCard Component
           │
           │ Calls: toggleTask(taskId)
           ▼
     useTasks Hook
           │
           │ PATCH /api/tasks/:id/complete
           ▼
        API Layer
           │
           │ Response: { task: { ...completed: true } }
           ▼
     TaskContext dispatch
           │
           │ action: UPDATE_TASK
           ▼
     Reducer updates tasks array
           │
           │ Context value changes
           ▼
  All subscribed components re-render
           │
           ▼
  TaskCard shows ✅ completed style
```

---

### 5.4 Reducer Pattern

```typescript
// taskReducer.ts

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t._id !== action.payload),
      };
    
    // ...other cases
  }
}
```

---

## 6. Error Handling Strategy

### 6.1 Layered Error Handling

```
Error Sources → Handling Layer → User Experience
────────────────────────────────────────────────
Network Error  → Axios interceptor → "Connection error" toast
4xx API Error  → Component handler → Form error message
5xx API Error  → Global handler    → "Something went wrong" toast
Validation Err → Controller layer  → Field-level error
Auth Error     → Axios interceptor → Redirect to login
Unknown Error  → Error Boundary    → Fallback UI page
```

---

### 6.2 Backend Error Handling

```typescript
// src/middleware/error.middleware.ts

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message                    // User-friendly error
    : 'Internal server error';       // Hide technical details

  // Log full error to server (user ko mat dikhao)
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
    // Development mein stack bhi bhejo, production mein nahi
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

### 6.3 Frontend Error Handling

```typescript
// API call mein error handle karna:

const createTask = async (taskData: CreateTaskInput) => {
  try {
    setIsLoading(true);
    const response = await taskApi.create(taskData);
    dispatch({ type: 'ADD_TASK', payload: response.data.task });
    showToast('Task created!', 'success');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to create task';
      showToast(message, 'error');
    } else {
      showToast('Unexpected error. Please try again.', 'error');
    }
  } finally {
    setIsLoading(false);
  }
};
```

---

### 6.4 Error Boundary (React)

```typescript
// src/components/shared/ErrorBoundary.tsx
// Koi bhi unhandled React error → Ye fallback UI dikhao
// User ko refresh karne ka option do
```

---

## 7. Security Best Practices

### 7.1 Backend Security Checklist

```
✅ Passwords
   └── bcrypt with 12 salt rounds
   └── Never store plain text
   └── Never return password in API response (select: false)

✅ JWT Security
   └── Secret key minimum 32 characters
   └── Expiry: 7 days (refresh token future mein)
   └── Validate on every protected request
   └── Never put sensitive info in payload

✅ Input Validation
   └── express-validator on all endpoints
   └── Trim all strings
   └── Sanitize to prevent XSS
   └── Type checking with TypeScript

✅ HTTP Security (Helmet.js)
   └── X-Content-Type-Options: nosniff
   └── X-Frame-Options: DENY
   └── Content-Security-Policy
   └── Strict-Transport-Security (HTTPS)

✅ CORS
   └── Whitelist only frontend domain
   └── No wildcard (*) in production

✅ Rate Limiting
   └── express-rate-limit
   └── Auth routes: 5-10 req/15min
   └── API routes: 100 req/15min

✅ MongoDB Security
   └── Never expose connection string
   └── Use MongoDB Atlas IP whitelist
   └── Avoid $where, eval() in queries
   └── Parameterized queries (Mongoose does this)
```

---

### 7.2 Frontend Security Checklist

```
✅ Token Storage
   └── MVP: localStorage (acceptable)
   └── Ideal: HttpOnly Cookie (XSS se protected)

✅ API Communication
   └── Always HTTPS in production
   └── Never log token to console

✅ Route Protection
   └── ProtectedRoute component
   └── Redirect unauthenticated users

✅ Form Security
   └── Client-side validation (UX ke liye)
   └── Never trust client-only validation
   └── Server validation always present

✅ Sensitive Data
   └── Never store password in state
   └── Clear token on logout
```

---

### 7.3 Environment Variables

```bash
# server/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# client/.env
VITE_API_URL=http://localhost:5000/api
```

**⚠️ Rules for .env:**
- `.env` file kabhi bhi Git mein commit mat karo
- `.env.example` file banao (empty values ke saath)
- Production mein platform environment variables use karo
- `.gitignore` mein `.env` add karo

---

## 8. Scalability Plan

### 8.1 Current Architecture (MVP — 0 to 1000 Users)

```
Single Server Setup:
  Frontend → Vercel (CDN se serve hoga)
  Backend  → Render (Single Node.js instance)
  Database → MongoDB Atlas M0 (Free tier)
```

---

### 8.2 Phase 2 Scaling (1K to 50K Users)

```
Improvements:
  Backend  → Horizontal scaling (multiple instances)
             Load balancer add karo
  Database → MongoDB Atlas M10 (Dedicated cluster)
             Read replicas for queries
  Caching  → Redis add karo (session, frequent queries)
  Auth     → Refresh token + Access token pattern

Architecture:
  [Vercel CDN]
       │
  [Load Balancer]
       │
  ┌────┴────┐
  │Server 1 │  ├── MongoDB Atlas (Primary)
  │Server 2 │  │       └── Read Replica
  │Server 3 │  └── Redis Cache
  └─────────┘
```

---

### 8.3 Phase 3 Scaling (50K to 1M Users)

```
Microservices mein split karo:
  Auth Service      → Dedicated auth microservice
  Task Service      → Task management microservice
  Notification Svc  → Email/push notifications
  Analytics Svc     → Usage tracking

Message Queue:
  → RabbitMQ / AWS SQS for async operations

Database:
  → MongoDB Atlas M30+ (Production grade)
  → Sharding for horizontal DB scaling

CDN:
  → CloudFront for static assets
  → Edge functions for dynamic content
```

---

### 8.4 Database Indexing Strategy

```javascript
// Current Indexes (MVP)
users: { email: 1 }                    // Unique, fast lookup
tasks: { user: 1 }                     // Fast user task fetch
tasks: { user: 1, completed: 1 }       // Filtering queries

// Future Indexes (as queries grow)
tasks: { user: 1, dueDate: 1 }         // Due date sorting
tasks: { user: 1, createdAt: -1 }      // Recent tasks first
tasks: { title: 'text', desc: 'text' } // Full-text search
```

---

## 9. Deployment Architecture

### 9.1 Deployment Stack

```
Production Deployment:

  FRONTEND → Vercel
  ├── Auto deploy from GitHub main branch
  ├── Global CDN (fast worldwide)
  ├── Free SSL certificate
  └── Environment: VITE_API_URL=https://api.taskflow.app/api

  BACKEND → Render
  ├── Web Service (Node.js)
  ├── Auto deploy from GitHub main branch
  ├── Free SSL
  └── Environment variables set karo in dashboard

  DATABASE → MongoDB Atlas
  ├── Free M0 cluster (MVP)
  ├── Cloud hosted, managed backups
  └── Connection: MONGODB_URI in Render env vars
```

---

### 9.2 CI/CD Pipeline (Future)

```
GitHub Push to main
       │
       ▼
GitHub Actions runs:
  ├── npm run lint        (Code quality check)
  ├── npm run test        (Unit tests)
  ├── npm run build       (Build check)
  └── ✅ All pass → Deploy
       │
       ├──► Vercel (Frontend auto-deploy)
       └──► Render (Backend auto-deploy)
```

---

### 9.3 Deployment Checklist

```
Before deploying:
□ .env variables set on hosting platforms
□ CORS updated to production frontend URL
□ MongoDB Atlas IP whitelist updated
□ NODE_ENV=production set
□ JWT_SECRET strong key set
□ Rate limiting enabled
□ Error logging setup (optional: Sentry)

After deploying:
□ Test signup/login flow
□ Test task CRUD operations
□ Test on mobile browser
□ Check API response times
□ Verify HTTPS working
```

---

## 10. Development Setup Guide

### 10.1 Prerequisites

```bash
# Required installations:
node --version    # v18+ required
npm --version     # v8+ required
mongod --version  # MongoDB (optional, Atlas use kar sakte ho)
```

---

### 10.2 Backend Setup

```bash
# 1. Server folder mein jao
cd taskflow/server

# 2. Dependencies install karo
npm install

# 3. .env file banao
cp .env.example .env
# Phir .env mein apni values bharo

# 4. Development server start karo
npm run dev
# → Server: http://localhost:5000

# 5. Production build
npm run build
npm start
```

---

### 10.3 Frontend Setup

```bash
# 1. Client folder mein jao
cd taskflow/client

# 2. Dependencies install karo
npm install

# 3. .env file banao
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api

# 4. Development server start karo
npm run dev
# → App: http://localhost:5173

# 5. Production build
npm run build
```

---

### 10.4 API Testing (Postman Collection Structure)

```
TaskFlow API (Postman Collection)
├── 📁 Auth
│   ├── POST Register
│   ├── POST Login
│   └── GET Me
└── 📁 Tasks
    ├── GET All Tasks
    ├── POST Create Task
    ├── PUT Update Task
    ├── DELETE Task
    └── PATCH Toggle Complete

Environment Variables:
  BASE_URL: http://localhost:5000/api
  TOKEN: {{auto-set after login}}
```

---

## Architecture Decision Records (ADR)

### ADR-001: Why MongoDB over PostgreSQL?

```
Decision: MongoDB
Reason:
  - Flexible schema (future features mein columns add karne easy)
  - Task data naturally document-like hai
  - MongoDB Atlas free tier production-ready hai
  - Future mein nested data store karna easy hoga (subtasks, etc.)

Trade-off:
  - Complex relationships SQL se zyada easy hain relational DB mein
  - Lekin TaskFlow ke current scope mein yeh problem nahi aayegi
```

---

### ADR-002: Why Context API over Redux?

```
Decision: React Context API + useReducer
Reason:
  - Redux too much boilerplate for 2 entities (User + Task)
  - Context sufficient hai for current scale
  - Team size small hai (solo/2-3 devs)
  - Learning curve kam hai

Upgrade trigger:
  - 10+ global states ho jaayein
  - Performance issues aayein (too many re-renders)
  - Team 5+ developers ho jaaye
  → Phir Zustand ya Redux Toolkit use karo
```

---

### ADR-003: Why JWT over Sessions?

```
Decision: JWT (Stateless)
Reason:
  - Stateless → server pe session store nahi karna
  - Horizontally scalable (multiple servers token verify kar sakte hain)
  - Mobile app future mein easily integrate hoga

Trade-off:
  - Logout par token invalidate karna mushkil hai (server state nahi)
  - Solution: Short expiry (15min access + 7day refresh) → v2 feature
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUICK REFERENCE                              │
├─────────────────────────────────────────────────────────────────┤
│  Dev Server     │  FE: :5173  │  BE: :5000  │  DB: :27017      │
│  JWT Expiry     │  7 days (MVP), 15min + refresh (v2)           │
│  Password Hash  │  bcrypt, 12 rounds                            │
│  Rate Limit     │  100 req/15min (API), 10 req/15min (auth)     │
│  File Size Limit│  10MB (for future file uploads)               │
│  DB Timeout     │  30 seconds (connection), 10s (query)         │
│  API Timeout    │  10 seconds (Axios)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

*Document prepared for portfolio and interview use.*  
*Version 1.0 — TaskFlow Full Stack Architecture Guide*

---
