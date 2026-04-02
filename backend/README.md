# FYP PORTAL – FYP Management System – Backend

Node.js + Express + MongoDB backend with JWT auth, role-based access, projects, milestones, chat (Socket.io), file uploads, and AI integration stubs.

## Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET`, etc.
2. `npm install`
3. Ensure MongoDB is running.
4. `npm run dev` or `npm start`

## Environment Variables

- `PORT` – Server port (default 5000)
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for signing JWTs
- `JWT_EXPIRE` – Token expiry (e.g. 7d)
- `CORS_ORIGIN` – Frontend origin (e.g. http://localhost:5173)
- `AI_SERVICE_URL` – Optional FastAPI AI service URL

## Sample API Requests

### Auth

**Login** (no auth header):

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fyp.com","password":"yourpassword"}'
```

Response: `{ "success": true, "token": "...", "user": { "id", "name", "email", "role" } }`

**Register** (Admin only; requires Bearer token):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"New User","email":"user@fyp.com","password":"secret123","role":"Student"}'
```

### Users (Admin only)

```bash
# List users
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Student One","email":"student@fyp.com","password":"pass123","role":"Student"}'
```

### Projects

```bash
# My group (Student)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/projects/my-group

# Submit proposal (Student)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Project","description":"Description","groupId":null}'

# Proposals to review (Mentor/Admin)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/projects/to-review

# Approve proposal
curl -X PATCH http://localhost:5000/api/projects/PROJECT_ID/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Assign supervisor (Admin)
curl -X PATCH http://localhost:5000/api/projects/PROJECT_ID/supervisor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"supervisorId":"MENTOR_USER_ID"}'
```

### Milestones

```bash
# List milestones
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/milestones

# Create milestone (Admin)
curl -X POST http://localhost:5000/api/milestones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Proposal","description":"","deadline":"2024-06-01","weightage":10}'

# Submit milestone (Student)
curl -X POST http://localhost:5000/api/milestones/MILESTONE_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"projectId":"PROJECT_ID","fileUrl":"https://..."}'

# Evaluate submission (Mentor/Admin)
curl -X PATCH http://localhost:5000/api/milestones/submissions/SUBMISSION_ID/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"grade":85,"feedback":"Good work."}'
```

### Chat

```bash
# List conversations
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/chat/conversations

# Get messages
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/chat/conversations/CONV_ID/messages

# Send message
curl -X POST http://localhost:5000/api/chat/conversations/CONV_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"body":"Hello"}'
```

### AI

```bash
# Evaluate idea (stub or proxy to FastAPI)
curl -X POST http://localhost:5000/api/ai/evaluate-idea \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Project Title","description":"Description"}'
```

### Announcements (Admin)

```bash
# List
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/announcements

# Create
curl -X POST http://localhost:5000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Welcome","body":"Welcome message","target":"all"}'
```

## Socket.io

Connect with `auth: { token: "YOUR_JWT" }`. Events: `message:send` (payload: `{ toUserId, body, conversationId }`), `message:receive` (server → client).
