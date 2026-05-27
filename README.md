# TaskFlow Productivity Suite 🚀
Plan Better. Stay Focused. Get More Done.

TaskFlow is a premium, high-fidelity full-stack task management and productivity dashboard. It helps individuals and teams organize work, optimize timelines, concentrate on subtasks using Pomodoro rings, and track velocity through metrics.

---

## 🎨 UI/UX Design & Aesthetic Features
- **Matte Glassmorphism**: Cards and panels styled with high-performance `backdrop-filter: blur` styling.
- **Deep Slate Palette**: Dark-mode-first interfaces featuring Cyber Neon Cyan (`#00f0ff`), Indigo violet (`#6366f1`), and Emerald (`#10b981`) highlights.
- **Smooth Animations**: Animated hover indicators, slide-in sidebar dialogs, and transition velocity curves.
- **Responsive Navigation Layouts**: Seamless toggle capabilities between large desktop frames and mobile drawer systems.

---

## 🛠️ Technology Stack
- **Frontend Core**: React (Vite SPA)
- **Visual Charting**: Recharts (fully responsive SVG nodes)
- **Developer Icons**: Lucide React
- **Backend API**: Node.js & Express
- **Real-time Sync**: Standard WebSockets (`ws`)
- **Database Engine**: SQLite3 (zero setup, portable relational SQL database)
- **Security System**: JSON Web Tokens (JWT) & bcryptjs hashing

---

## 💾 Relational Database Schema
TaskFlow runs on an automated SQLite relational database engine, storing all information inside `/backend/taskflow.db`.

1. **users**: `id`, `name`, `email`, `password_hash`, `avatar`, `created_at`
2. **tasks**: `id`, `user_id`, `team_id`, `title`, `description`, `status` ('todo', 'in_progress', 'done'), `priority` ('low', 'medium', 'high'), `due_date`, `created_at`, `updated_at`
3. **teams**: `id`, `name`, `owner_id`, `members` (JSON string arrays of user IDs)
4. **comments**: `id`, `task_id`, `user_id`, `content`, `created_at`
5. **notifications**: `id`, `user_id`, `message`, `type` ('system', 'task_assignment', 'deadline', 'comment'), `read` (0 or 1), `created_at`
6. **pomodoro_sessions**: `id`, `user_id`, `task_id`, `duration`, `completed_at`

---

## 🔌 API & Communication Endpoints

### 1. REST Endpoints (`http://localhost:5000/api`)

| Category | Method | Route | Description | Secure |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Register new profile account. | No |
| | `POST` | `/auth/login` | Login and issue credentials. | No |
| | `POST` | `/auth/oauth` | Simulated Google OAuth credentials. | No |
| | `GET` | `/auth/me` | Fetch active user credentials. | **Yes** |
| **Tasks** | `GET` | `/tasks` | Fetch personal & team task checklists. | **Yes** |
| | `POST` | `/tasks` | Add a new task card. | **Yes** |
| | `PUT` | `/tasks/:id` | Update parameters (status, priorities...). | **Yes** |
| | `DELETE` | `/tasks/:id` | Permanently wipe a task and comments. | **Yes** |
| **Teams** | `GET` | `/teams` | Get channels the user is in. | **Yes** |
| | `POST` | `/teams` | Register a new team channel. | **Yes** |
| | `POST` | `/teams/:id/join` | Join team via unique numeric identifier. | **Yes** |
| | `POST` | `/teams/:id/leave` | Leave a team workspace. | **Yes** |
| **Comments** | `GET` | `/comments/task/:taskId` | Fetch discussion comments for a task. | **Yes** |
| | `POST` | `/comments` | Leave a new feedback comment. | **Yes** |
| **Alerts** | `GET` | `/notifications` | Get latest 50 alert messages. | **Yes** |
| | `PUT` | `/notifications/:id/read` | Mark a notification as read. | **Yes** |
| | `PUT` | `/notifications/read-all` | Mark all alerts as read. | **Yes** |
| **Focus** | `POST` | `/pomodoro/session` | Record a completed focus session. | **Yes** |
| | `GET` | `/pomodoro/stats` | Retrieve focus minutes and streak sums. | **Yes** |

### 2. WebSocket Notifications (`ws://localhost:5000?token=JWT_STRING`)
Authenticates connection requests via JWT tokens passed in the query string parameters. Broadcasts the following events:
- `NOTIFICATION_RECEIVED`: Live notification trigger (unread bell counts update).
- `TASK_CREATED`: Team task creation updates.
- `TASK_UPDATED`: Column status modifications or task parameter changes.
- `TASK_DELETED`: Task cards deleted.
- `COMMENT_ADDED`: Real-time feedback comments inside team panels.

---

## 🚀 Setup & Execution Guide

### Prerequisite Dependencies
- **Node.js**: Version `v16` or newer installed.

### Step 1: Start Backend Server
```bash
cd backend
npm install
node server.js
```
*Port Allocation: Runs on `http://localhost:5000`. Instantly verifies/creates `taskflow.db` database tables and seeds demo profiles (Sarah, Alex, Elena).*

### Step 2: Start Frontend Dev Client
```bash
cd frontend
npm install
npm run dev
```
*Port Allocation: Runs on `http://localhost:5173`. Open in your browser to plan, focus, and collaborate!*

---

## 🔑 Environmental Credentials (`.env`)
If you require custom ports or private keys, add a `.env` file to the `/backend` directory:
```env
PORT=5000
JWT_SECRET=taskflow-super-secure-secret-key
```

---

## 👤 Seeding Demo Credentials
During initialization, the database automatically logs three default developer accounts for fast, real-time testing:
- **Sarah Jenkins** (Landing mock creator) - `sarah@taskflow.com` (password: `password123`)
- **Alex Rivera** (JWT programmer) - `alex@taskflow.com` (password: `password123`)
- **Elena Rostova** (Marketeer) - `elena@taskflow.com` (password: `password123`)

*Simply toggle the "Sign In with Google" OAuth button inside login screens to immediately log in as one of these seeded team members!*
