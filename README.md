# Application Maintenance Tracker

A full-stack enterprise web application for managing and tracking application maintenance requests (tokens) across teams of Users, Developers, Testers, and Admins.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | CSS Variables + MUI |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT (HTTP-only cookie) |

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Application Maintenance Tracker"
```

### 2. Set up the database
```bash
psql -U postgres -c "CREATE DATABASE amt_db;"
psql -U postgres -d amt_db -f backend/db_setup.sql
psql -U postgres -d amt_db -f backend/db_seed.sql  # optional demo data
```

### 3. Configure environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials and JWT secret
```

### 4. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/application-maintenance-tracker
npm install
```

### 5. Run the application
```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm start

# Terminal 2 — Frontend (port 5173)
cd frontend/application-maintenance-tracker
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Roles

| Role | Capabilities |
|---|---|
| **User** | Create tokens, view own tokens |
| **Admin** | Assign tokens to Developer + Tester, view all records |
| **Developer** | View assigned work, update progress, add comments |
| **Tester** | Review developed tokens, approve or reject |

---

## 📁 Project Structure

```
Application Maintenance Tracker/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # SQL queries
│   ├── routes/         # Express routes
│   ├── server.js       # Entry point
│   └── .env            # Environment variables (not in git)
└── frontend/
    └── application-maintenance-tracker/
        ├── src/
        │   ├── pages/          # Login, CreateToken, NotFound
        │   ├── css/            # Component-level CSS
        │   ├── context/        # AuthContext
        │   ├── api/            # Axios instance
        │   └── *.jsx           # Dashboard & Navbar components
        └── index.html
```

---

## 🔒 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amt_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CORS_ORIGIN=http://localhost:5173
```
