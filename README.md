# VedaAI Assessment Creator

Teacher dashboard for creating assignments and generating structured question papers.

## Stack

- **Frontend:** Next.js, TypeScript, Zustand, Socket.IO
- **Backend:** Express, TypeScript, MongoDB
- **AI:** OpenAI (optional; local generator used when no API key)

## Setup

1. Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Copy env files and fill in values (do not commit `.env`):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env`:

- `MONGODB_URI` — MongoDB connection string
- `OPENAI_API_KEY` — optional
- `SCHOOL_NAME`, `SUBJECT`, `CLASS_NAME` — defaults on generated papers

`frontend/.env.local`:

- `NEXT_PUBLIC_API_URL` — e.g. `http://localhost:4000`
- `NEXT_PUBLIC_WS_URL` — same as API URL for local dev
- `NEXT_PUBLIC_SCHOOL_NAME`, `NEXT_PUBLIC_SCHOOL_LOCATION`, `NEXT_PUBLIC_USER_NAME` — UI labels

3. Start MongoDB (local or Atlas).

4. Run:

```bash
npm run dev
```

- App: http://localhost:3000  
- API: http://localhost:4000  

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/assignments` | List assignments |
| POST | `/api/assignments` | Create assignment |
| GET | `/api/assignments/:id` | Get assignment + paper |
| GET | `/api/assignments/:id/status` | Generation status |
| POST | `/api/assignments/:id/regenerate` | Regenerate paper |
| DELETE | `/api/assignments/:id` | Delete |
| GET | `/api/assignments/:id/pdf` | Download PDF |

WebSocket: subscribe with `subscribe:assignment`; listen for `generation:progress`.

## Project layout

```
backend/src   — API, generation, PDF, WebSocket
frontend/src  — Next.js app
```
