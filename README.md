# react-nest-todo

Todo CRUD app: **Next.js** frontend + **NestJS** API with **TypeORM** and **SQLite**.

## Structure

```
react-nest-todo/
├── backend/     NestJS API (port 8000)
└── frontend/    Next.js UI (port 3000)
```

## Run

**Terminal 1 — API**

```bash
cd backend
npm run start:dev
```

API: http://localhost:8000/api/todos

**Terminal 2 — UI**

```bash
cd frontend
npm run dev
```

App: http://localhost:3000

## API

| Method | URL | Action |
|--------|-----|--------|
| GET | `/api/todos` | List todos |
| POST | `/api/todos` | Create `{ "title": "..." }` |
| PATCH | `/api/todos/:id` | Update `{ "status": "completed" }` |
| DELETE | `/api/todos/:id` | Delete |

SQLite file: `backend/data.sqlite` (created on first run).
