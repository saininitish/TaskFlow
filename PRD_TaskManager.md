# 📋 Product Requirements Document (PRD)
## Full Stack Task Manager Web Application

---

> **Document Version:** 1.0  
> **Status:** Ready for Development  
> **Last Updated:** April 2026  
> **Author:** Senior Product Manager  
> **Tech Stack:** React + TypeScript | Supabase (Postgres + Auth)

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users](#2-target-users)
3. [Core Features](#3-core-features)
4. [User Flow](#4-user-flow)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [API Requirements](#7-api-requirements)
8. [Database Schema](#8-database-schema)
9. [Future Enhancements](#9-future-enhancements)
10. [Edge Cases & Error Scenarios](#10-edge-cases--error-scenarios)

---

## 1. Product Overview

### Kya Hai Ye App? (What is this?)

**TaskFlow** ek simple aur powerful web application hai jo users ko apne daily tasks manage karne mein help karta hai. Ye ek **Full Stack** project hai — matlab frontend bhi hai, backend bhi hai, aur database bhi connected hai.

> Think of it as a **personal to-do list** — lekin professional level ka, with login system, secure APIs, aur clean UI.

### Problem Statement

Aaj kal developers, students, aur freelancers ke paas bahut kaam hota hai. Notes apps mein kho jaate hain tasks, deadlines miss ho jaati hain, aur progress track nahi hoti. **TaskFlow** is problem ko solve karta hai by providing:

- Ek **secure personal space** jahan sirf aapke tasks hon
- **Fast aur intuitive UI** jahan task add karna sirf 2 seconds ka kaam ho
- **Real-time filtering** — completed vs pending tasks clearly dikhein

### Product Vision

> "Every developer, student, and freelancer deserves a tool that gets out of their way and lets them focus on what matters."

---

## 2. Target Users

### 👨‍🎓 Students (Primary User)

| Attribute | Detail |
|-----------|--------|
| Age | 18–25 years |
| Need | Assignment tracking, exam prep lists, project milestones |
| Pain Point | Scattered notes, forgotten deadlines |
| Tech Level | Moderate — comfortable with apps |

**Use Case Example:** Rahul ek 3rd-year CS student hai. Uske paas 5 subjects ke assignments hain. Wo TaskFlow use karta hai to track kaunsa assignment submit ho gaya aur kaunsa pending hai.

---

### 👨‍💻 Developers (Power User)

| Attribute | Detail |
|-----------|--------|
| Age | 22–35 years |
| Need | Bug tracking, feature lists, sprint planning (personal level) |
| Pain Point | Mental overload, context switching |
| Tech Level | High — wants clean API, fast UI |

**Use Case Example:** Priya ek freelance developer hai. Wo TaskFlow use karti hai to har client ke liye alag tasks maintain karne ke liye (future: tags/labels feature).

---

### 🧑‍💼 Freelancers (Business User)

| Attribute | Detail |
|-----------|--------|
| Age | 25–40 years |
| Need | Client deliverables, invoice reminders, meeting notes |
| Pain Point | No single organized view of all work |
| Tech Level | Moderate — needs simple UI |

**Use Case Example:** Aakash ek graphic designer hai jo 3 clients ke saath kaam karta hai. Wo TaskFlow se track karta hai kaunsa design deliver ho gaya aur kaunsa revision pending hai.

---

## 3. Core Features

### Feature 1: 🔐 User Authentication (Signup / Login)

**Description:** Har user ka apna secure account hoga. Koi bhi dusre ka data access nahi kar sakta.

**Acceptance Criteria:**
- User apna naam, email, aur password se signup kar sake
- Login karne par JWT token milna chahiye
- Token 7 din tak valid rahe
- Wrong credentials par clear error message aaye
- Password minimum 8 characters ka ho

**Priority:** 🔴 Critical (P0)

---

### Feature 2: ✅ Task Management (Add / Edit / Delete)

**Description:** Users apni tasks create, update, aur delete kar sakte hain.

**Acceptance Criteria:**
- Task add karne ke liye: Title (required), Description (optional), Due Date (optional)
- Task edit karne par changes save ho jaayein
- Delete karne par confirmation modal aaye
- Ek user ki tasks doosre ko nahi dikhni chahiye
- Task title 200 characters se zyada nahi ho sakta

**Priority:** 🔴 Critical (P0)

---

### Feature 3: ☑️ Mark as Completed

**Description:** User kisi bhi task ko complete ya incomplete mark kar sake.

**Acceptance Criteria:**
- Single click se task complete/incomplete toggle ho
- Completed task ka visual style alag dikhe (strikethrough + faded color)
- Status change instantly UI mein reflect ho
- Completion timestamp store ho

**Priority:** 🔴 Critical (P0)

---

### Feature 4: 🔍 Task Filtering

**Description:** User apni tasks ko filter karke dekh sake — All, Pending, ya Completed.

**Acceptance Criteria:**
- 3 filter options: All Tasks | Pending | Completed
- Filter apply hone par sirf relevant tasks dikhein
- Active filter visually highlighted ho
- Count badge har filter mein dikhe (e.g., "Pending (5)")

**Priority:** 🟠 High (P1)

---

### Feature 5: 📊 Dashboard UI

**Description:** Ek clean homepage jahan user apna sab kuch ek jagah dekh sake.

**Acceptance Criteria:**
- Summary cards: Total Tasks, Completed, Pending
- Task list clearly organized
- Add Task button prominently visible
- Responsive design (mobile + desktop)
- Logout option clearly accessible

**Priority:** 🟠 High (P1)

---

## 4. User Flow

### 4.1 New User Journey (First Time)

```
START
  │
  ▼
[Landing Page / Login Page]
  │
  ├──► [Click "Sign Up"]
  │         │
  │         ▼
  │    [Fill Name, Email, Password]
  │         │
  │         ▼
  │    [Submit Form]
  │         │
  │    ┌────┴────┐
  │    │Validation│
  │    └────┬────┘
  │         │
  │    ┌────┴────────────────┐
  │    │ Error?              │
  │    │ YES → Show error    │
  │    │ NO  → Account bana  │
  │    └────────────────────-┘
  │         │
  │         ▼
  │    [JWT Token Generate]
  │         │
  │         ▼
  │    [Redirect to Dashboard]
  │
  ▼
[Dashboard — Empty State]
  │
  ▼
[Click "+ Add Task"]
  │
  ▼
[Task Form Modal Opens]
  │
  ▼
[Fill Title, Description, Due Date]
  │
  ▼
[Save Task]
  │
  ▼
[Task Appears in Dashboard List]
  │
  ▼
END
```

---

### 4.2 Returning User Journey

```
START
  │
  ▼
[Login Page]
  │
  ▼
[Enter Email + Password]
  │
  ▼
[API Call → /api/auth/login]
  │
  ├── Invalid → Error Message
  │
  └── Valid → JWT Token Stored in localStorage
                    │
                    ▼
              [Dashboard Loads]
                    │
                    ▼
              [Fetch User Tasks from API]
                    │
                    ▼
              [Tasks Display karo]
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  [Edit Task]  [Complete   [Delete Task]
                 Task]
        │           │           │
        └───────────┴───────────┘
                    │
                    ▼
              [Real-time UI Update]
                    │
                    ▼
              [Logout → Token Clear]
                    │
                    ▼
                  END
```

---

### 4.3 Task Filtering Flow

```
Dashboard
    │
    ▼
[Filter Bar: All | Pending | Completed]
    │
    ├── Click "All"       → Show all tasks
    ├── Click "Pending"   → Show tasks where completed = false
    └── Click "Completed" → Show tasks where completed = true
                                │
                                ▼
                         [Count Badge Update]
                                │
                                ▼
                         [Filtered List Render]
```

---

## 5. Functional Requirements

### 5.1 Authentication Module

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| AUTH-01 | User signup with name, email, password | P0 |
| AUTH-02 | Email uniqueness validation | P0 |
| AUTH-03 | Password hashing with bcrypt (min 10 rounds) | P0 |
| AUTH-04 | JWT token generation on login | P0 |
| AUTH-05 | Token expiry: 7 days | P1 |
| AUTH-06 | Protected routes require valid JWT | P0 |
| AUTH-07 | Logout clears token from client storage | P1 |
| AUTH-08 | Invalid token returns 401 Unauthorized | P0 |

---

### 5.2 Task Management Module

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| TASK-01 | Create task with title (required) | P0 |
| TASK-02 | Create task with description (optional) | P1 |
| TASK-03 | Create task with due date (optional) | P1 |
| TASK-04 | Edit any field of an existing task | P0 |
| TASK-05 | Delete task with confirmation | P0 |
| TASK-06 | Mark task as completed/incomplete (toggle) | P0 |
| TASK-07 | Tasks belong to the authenticated user only | P0 |
| TASK-08 | Timestamps: createdAt, updatedAt auto-populate | P1 |
| TASK-09 | Task title max length: 200 characters | P1 |
| TASK-10 | Task description max length: 1000 characters | P2 |

---

### 5.3 Dashboard & UI Module

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| UI-01 | Show total, completed, pending task count | P1 |
| UI-02 | Filter tasks: All / Pending / Completed | P0 |
| UI-03 | Empty state when no tasks available | P1 |
| UI-04 | Loading skeleton while fetching data | P2 |
| UI-05 | Responsive layout (mobile + desktop) | P1 |
| UI-06 | Toast notifications for success/error actions | P2 |
| UI-07 | Confirmation dialog before task deletion | P1 |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|--------|--------|
| API response time | < 300ms for 95% of requests |
| Frontend initial load | < 2 seconds on 4G connection |
| Dashboard render time | < 500ms after data fetch |
| Concurrent users (MVP) | 100 simultaneous users |
| Database query time | < 100ms per query |

### 6.2 Security

| Requirement | Implementation |
|-------------|----------------|
| Password storage | bcrypt with 12 salt rounds |
| Authentication | JWT (RS256 or HS256) |
| Input sanitization | express-validator on all inputs |
| CORS policy | Whitelist frontend domain only |
| Rate limiting | 100 requests/15 min per IP |
| Helmet.js | HTTP security headers |
| HTTPS only | Enforce TLS in production |
| Token storage | localStorage (MVP) → HttpOnly Cookie (v2) |

### 6.3 Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% (MVP target) |
| Error handling | Graceful degradation with user-friendly messages |
| Data validation | Both client-side AND server-side |
| Database backup | Automatic (Supabase Managed) |

### 6.4 Usability

- App **sirf English mein** hoga (MVP)
- **Keyboard navigable** — Tab, Enter, Escape support
- **WCAG 2.1 Level A** accessibility compliance
- **Zero onboarding** — User bina tutorial ke use kar sake

### 6.5 Maintainability

- Code documentation: JSDoc comments on all functions
- ESLint + Prettier enforced
- Modular folder structure
- Environment-based configuration (.env)

---

## 7. API Requirements

### Base URL

```
Production:  https://api.taskflow.app/api
Development: http://localhost:5000/api
```

### 7.1 Authentication Endpoints

#### POST /auth/register

**Purpose:** Naya user account banana

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{ "success": false, "message": "Email already registered" }

// 500 - Server Error
{ "success": false, "message": "Internal server error" }
```

---

#### POST /auth/login

**Purpose:** Existing user login

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com"
  }
}
```

**Error Responses:**
```json
// 401 - Invalid Credentials
{ "success": false, "message": "Invalid email or password" }
```

---

#### GET /auth/me

**Purpose:** Current user ki info fetch karna  
**Auth Required:** ✅ Yes (Bearer Token)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "64abc123...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### 7.2 Task Endpoints

**All task endpoints require:** `Authorization: Bearer <JWT_TOKEN>`

---

#### GET /tasks

**Purpose:** Current user ki saari tasks fetch karna

**Query Parameters:**
```
?status=pending     → Only pending tasks
?status=completed   → Only completed tasks
(no param)          → All tasks
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "tasks": [
    {
      "_id": "64task001",
      "title": "Complete React assignment",
      "description": "Build a counter app with hooks",
      "completed": false,
      "dueDate": "2026-04-25T00:00:00Z",
      "createdAt": "2026-04-18T09:00:00Z",
      "updatedAt": "2026-04-18T09:00:00Z"
    }
  ]
}
```

---

#### POST /tasks

**Purpose:** Naya task create karna

**Request Body:**
```json
{
  "title": "Complete React assignment",
  "description": "Build a counter app with hooks",
  "dueDate": "2026-04-25"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "64task001",
    "title": "Complete React assignment",
    "description": "Build a counter app with hooks",
    "completed": false,
    "dueDate": "2026-04-25T00:00:00Z",
    "user": "64abc123...",
    "createdAt": "2026-04-18T09:00:00Z"
  }
}
```

---

#### PUT /tasks/:id

**Purpose:** Existing task update karna

**Request Body (partial update allowed):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2026-05-01",
  "completed": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { "...updated task object..." }
}
```

**Error Responses:**
```json
// 404 - Task not found
{ "success": false, "message": "Task not found" }

// 403 - Not authorized
{ "success": false, "message": "Not authorized to update this task" }
```

---

#### DELETE /tasks/:id

**Purpose:** Task delete karna

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

#### PATCH /tasks/:id/complete

**Purpose:** Task completion status toggle karna

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "task": {
    "_id": "64task001",
    "completed": true,
    "completedAt": "2026-04-18T14:30:00Z"
  }
}
```

---

### 7.3 API Summary Table

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | ❌ | New user signup |
| POST | /auth/login | ❌ | User login |
| GET | /auth/me | ✅ | Get current user |
| GET | /tasks | ✅ | Get all user tasks |
| POST | /tasks | ✅ | Create new task |
| PUT | /tasks/:id | ✅ | Update task |
| DELETE | /tasks/:id | ✅ | Delete task |
| PATCH | /tasks/:id/complete | ✅ | Toggle completion |

---

## 8. Database Schema

### 8.1 User Schema (PostgreSQL/Supabase)

```javascript
// Table: profiles
{
  id: UUID,                   // References auth.users.id
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,             // Email duplicate nahi ho sakta
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false             // Supabase handles this via Auth
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

// Indexes:
// - email: unique index (fast lookup + duplicate prevention)
```

**Sample Document:**
```json
{
  "_id": "64abc123def456",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "$2b$12$hashed_password_here",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

---

### 8.2 Task Schema (MongoDB)

```javascript
// Collection: tasks
{
  _id: ObjectId,              // Auto-generated
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000,
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null             // Sirf tab set hoga jab task complete ho
  },
  dueDate: {
    type: Date,
    default: null
  },
  user: {
    type: ObjectId,
    ref: "User",              // User schema se link (foreign key)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}

// Indexes:
// - user: index (user ID se fast task fetch ke liye)
// - completed: index (filtering ke liye)
// - user + completed: compound index (most common query)
```

**Sample Document:**
```json
{
  "_id": "64task001abc",
  "title": "Complete React assignment",
  "description": "Build a counter app with hooks and context",
  "completed": false,
  "completedAt": null,
  "dueDate": "2026-04-25T00:00:00Z",
  "user": "64abc123def456",
  "createdAt": "2026-04-18T09:00:00Z",
  "updatedAt": "2026-04-18T09:00:00Z"
}
```

---

### 8.3 Entity Relationship Diagram

```
┌─────────────────────────────────┐
│            USER                 │
├─────────────────────────────────┤
│ _id          ObjectId (PK)      │
│ name         String             │
│ email        String (Unique)    │
│ password     String (Hashed)    │
│ createdAt    Date               │
│ updatedAt    Date               │
└─────────────────┬───────────────┘
                  │
                  │ 1 USER → MANY TASKS
                  │
                  ▼
┌─────────────────────────────────┐
│             TASK                │
├─────────────────────────────────┤
│ _id          ObjectId (PK)      │
│ title        String (Required)  │
│ description  String (Optional)  │
│ completed    Boolean            │
│ completedAt  Date (Nullable)    │
│ dueDate      Date (Optional)    │
│ user         ObjectId (FK→User) │
│ createdAt    Date               │
│ updatedAt    Date               │
└─────────────────────────────────┘
```

---

## 9. Future Enhancements

Ye features MVP mein nahi hain lekin roadmap mein hain:

### Phase 2 — Enhanced UX (Q3 2026)

| Feature | Description | Effort |
|---------|-------------|--------|
| 🏷️ Task Labels/Tags | Tasks ko categories mein organize karo | Medium |
| 📅 Calendar View | Tasks ko calendar pe dekho | High |
| 🔔 Due Date Reminders | Email/browser notifications | Medium |
| 🔍 Search Tasks | Task title/description search karo | Low |
| 📱 PWA Support | Mobile pe install karo | Medium |

---

### Phase 3 — Collaboration (Q4 2026)

| Feature | Description | Effort |
|---------|-------------|--------|
| 👥 Shared Workspaces | Team ke saath tasks share karo | High |
| 💬 Task Comments | Task pe comments aur discussions | Medium |
| 📊 Analytics Dashboard | Productivity graphs aur insights | High |
| 🎯 Priority Levels | High/Medium/Low priority set karo | Low |

---

### Phase 4 — Integrations (2027)

| Feature | Description |
|---------|-------------|
| 🔗 Google Calendar Sync | Tasks automatically calendar mein jaayein |
| 📧 Gmail Integration | Email se task banao |
| 🤖 AI Task Suggestions | AI batayega ki kya karna chahiye pehle |
| 📤 CSV Export | Tasks ko export karo |

---

## 10. Edge Cases & Error Scenarios

### 10.1 Authentication Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User same email se dobara register kare | "Email already registered" error |
| Wrong password 5 baar daale | Account temporarily lock (future) |
| JWT token expire ho jaaye | 401 error → Redirect to login |
| Token manually delete kar diya | Logout state, login required |
| JWT token tamper ho jaaya ho | 401 Invalid token error |
| Network disconnect during login | Timeout error with retry option |

---

### 10.2 Task Management Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User kisi aur ki task ID se request kare | 403 Forbidden error |
| Delete ki hui task ko update karne ki koshish | 404 Not Found |
| Empty title ke saath task create karna | Validation error: "Title is required" |
| 201+ character title daalna | Validation error with max length info |
| Same task dobara complete mark karna | Toggle karo — idempotent behaviour |
| Network fail ho task save ke dauraan | Error toast + retry button dikhao |
| 1000 tasks ek user ke paas | Pagination add karo (future enhancement) |

---

### 10.3 UI/UX Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Filter lagaya → All tasks delete hue | Empty state message dikhao |
| Slow network par dashboard load | Loading skeleton dikhao |
| User directly `/dashboard` URL pe jaaye bina login ke | Redirect to `/login` |
| Browser back button after logout | Login page dikhao, not dashboard |
| Multiple tabs mein same account | Session sync (future: WebSockets) |

---

### 10.4 API Rate Limiting

```
Rate Limit Rules:
├── /auth/register → 5 requests / 15 minutes (per IP)
├── /auth/login    → 10 requests / 15 minutes (per IP)
├── /tasks/*       → 100 requests / 15 minutes (per user)
└── Global         → 200 requests / 15 minutes (per IP)
```

---

## Appendix

### A. Glossary

| Term | Meaning |
|------|---------|
| JWT | JSON Web Token — authentication ke liye secure token |
| CRUD | Create, Read, Update, Delete — basic database operations |
| API | Application Programming Interface — frontend-backend ka bridge |
| MVP | Minimum Viable Product — pehla working version |
| P0/P1/P2 | Priority 0 (critical) / Priority 1 (high) / Priority 2 (nice-to-have) |
| bcrypt | Password hashing algorithm |
| Middleware | Request aur response ke beech mein kaam karne wala code |

---

### B. Tech Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                    TECH STACK                           │
├─────────────────────────────────────────────────────────┤
│  Frontend    │  React 18 + TypeScript + Tailwind CSS    │
│  Backend     │  Node.js + Express + TypeScript          │
│  Database    │  MongoDB + Mongoose ODM                  │
│  Auth        │  JWT (jsonwebtoken) + bcryptjs           │
│  Deployment  │  Vercel (FE) + Render (BE) + Atlas (DB)  │
│  Tools       │  ESLint + Prettier + Postman + Git       │
└─────────────────────────────────────────────────────────┘
```

---

*Document prepared for portfolio and interview use.*  
*Version 1.0 — TaskFlow Full Stack Task Manager*

---
