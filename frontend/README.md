# FYP PORTAL – FYP Management System (Frontend)

React + Vite + Tailwind CSS frontend with role-based dashboards (Student, Mentor, Admin).

## Run

From the **frontend** folder:

- `npm install`
- `npm run dev` — starts the dev server and should open **http://localhost:5173** in your browser.

If the browser doesn’t open, go to **http://localhost:5173** manually. If the port is in use, Vite will use the next one (e.g. 5174); check the terminal for the exact URL.

## Build

- `npm run build` — production build to `dist/`

## Backend

- Without `VITE_API_URL`: app uses **dummy data** (no backend required).
- With `VITE_API_URL=http://localhost:5000/api`: app calls the Node.js backend. Start the backend first (see `../backend/README.md`).

## Demo login (dummy mode)

- **Student**: `student@fyp.com` / `password`
- **Mentor**: `mentor@fyp.com` / `password`
- **Admin**: `admin@fyp.com` / `password`

## Structure

- `src/api/` — API client and service placeholders (auth, users, projects, milestones, chat, files, ai, announcements)
- `src/components/layout/` — DashboardLayout, Header, Sidebar
- `src/contexts/` — AuthContext
- `src/pages/` — auth (Login), student, mentor, admin pages
- `src/routes/AppRoutes.jsx` — protected routes and role-based redirect
- `src/utils/constants.js` — ROLES, dummy data, sidebar config
