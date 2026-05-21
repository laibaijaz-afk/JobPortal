# JobPortal - Full-Stack Recruitment Management System

A production-ready Job Portal built with React, Node.js, Express, and MongoDB.

---

## Project Structure

```
JobPortal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── FilterPanel.jsx
    │   │   ├── JobCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Spinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── EmployerDashboard.jsx
    │   │   ├── PostJob.jsx
    │   │   ├── ManageJobs.jsx
    │   │   ├── EditJob.jsx
    │   │   ├── Applicants.jsx
    │   │   └── CandidateDashboard.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Setup Instructions

### 1. Clone / Navigate to the Project

```bash
cd JobPortal
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Copy the env file and configure it:
```bash
copy .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at: **http://localhost:5173**
The backend runs at: **http://localhost:5000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/me` | Update profile | Yes |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Get all jobs (with filters) | No |
| POST | `/api/jobs` | Create job | Employer |
| GET | `/api/jobs/:id` | Get job by ID | No |
| PUT | `/api/jobs/:id` | Update job | Employer (owner) |
| DELETE | `/api/jobs/:id` | Delete job | Employer (owner) |
| GET | `/api/jobs/employer/myjobs` | Get employer's jobs | Employer |
| GET | `/api/jobs/employer/stats` | Get dashboard stats | Employer |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications` | Apply to job | Candidate |
| GET | `/api/applications/user` | Get candidate's applications | Candidate |
| GET | `/api/applications/job/:jobId` | Get job applicants | Employer |
| PUT | `/api/applications/:id/status` | Update status | Employer |
| DELETE | `/api/applications/:id` | Withdraw application | Candidate |

### Query Parameters for GET /api/jobs
- `keyword` — search in title, description, company
- `location` — filter by location
- `experience` — filter by level (entry/mid/senior/lead/any)
- `jobType` — filter by type (full-time/part-time/contract/freelance/internship)
- `skills` — comma-separated skills filter
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)

---

## Features

### Authentication & RBAC
- JWT-based auth with 7-day token expiry
- bcrypt password hashing (12 salt rounds)
- Role-based access: Employer / Candidate
- Protected routes on both frontend and backend

### Employer Features
- Dashboard with stats (total jobs, active jobs, applications, shortlisted)
- Post, edit, delete job listings
- Toggle job active/inactive status
- View all applicants per job
- Update applicant status (Applied → Shortlisted → Hired / Rejected)

### Candidate Features
- Browse and search all active jobs
- Advanced filtering (keyword, location, experience, job type, skills)
- Apply with optional resume URL and cover letter
- Track application status in real-time
- Withdraw pending applications

### UI/UX
- Responsive design (mobile-first)
- Toast notifications for all actions
- Loading states and spinners
- Empty states with helpful CTAs
- Pagination for job listings

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| HTTP Client | Axios with JWT interceptors |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |
