# VedaAI

VedaAI is an AI-powered assignment generation platform with a Next.js frontend and a Node.js/TypeScript backend. It uses MongoDB for persistence, Redis for queues and realtime pub/sub, Gemini for question-paper generation, and Playwright for PDF output.

## Monorepo Structure

- `frontend/` - Next.js 16 app (App Router + TypeScript)
- `backend/` - Express + TypeScript API, auth, assignment generation pipeline, workers
- `redis/` - Redis connectivity notes and helper script

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Socket.IO client
- Backend: Express 5, TypeScript, Mongoose, BullMQ, Socket.IO, JWT, Zod
- Infra/Services: MongoDB, Redis (local or managed), Gemini API, Playwright (PDF rendering)

## How It Works

1. Frontend requests assignment generation from backend.
2. Backend stores a `queued` assignment and enqueues a BullMQ job.
3. Generation worker builds a prompt and calls Gemini.
4. Normalized output is saved, then a PDF job is enqueued.
5. PDF worker renders and saves a PDF using Playwright.
6. Realtime events are published through Redis pub/sub and delivered via Socket.IO.

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or hosted)
- Redis (local or hosted)
- Gemini API key (required for generation)

## Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/vedaai
JWT_SECRET=replace-with-a-strong-secret-at-least-16-chars
JWT_EXPIRES_IN=7d
REDIS_URL=redis://127.0.0.1:6379
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
PDF_OUTPUT_DIR=uploads/pdfs
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## Local Development

Open separate terminals from repo root.

1. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Start backend API + workers:

```bash
cd backend
npm run dev:all
```

3. Start frontend:

```bash
cd frontend
npm run dev
```

4. Open app:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:4000/health`

## Useful Scripts

### Backend (`backend/package.json`)

- `npm run dev` - run API in watch mode
- `npm run dev:worker` - run workers in watch mode
- `npm run dev:all` - run API + workers together
- `npm run build` - compile TypeScript
- `npm run check` - type-check without emit
- `npm run start:all` - run compiled API + workers

### Frontend (`frontend/package.json`)

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## API Overview

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/assignments/generate` (auth)
- `GET /api/v1/assignments` (auth)
- `GET /api/v1/assignments/:id` (auth)
- `GET /api/v1/assignments/:id/pdf` (auth)
- `GET /api/v1/assignments/:id/pdf/download` (auth)
- `DELETE /api/v1/assignments/:id` (auth)

## Redis Notes

Redis is treated as a separately managed service. For managed Redis (Upstash/Redis Cloud), use a `rediss://` URL in `REDIS_URL`.

Connectivity check:

```bash
node redis/scripts/check-connection.mjs
```

## Common Issues

- `GEMINI_API_KEY is not configured`:
  - Set `GEMINI_API_KEY` in `backend/.env` and restart backend workers.
- Redis connection failures:
  - Verify `REDIS_URL` format and access; use `rediss://` for TLS providers.
- PDF generation failures:
  - Ensure backend dependencies installed correctly (Playwright included) and worker is running.
- CORS errors in browser:
  - Ensure `FRONTEND_ORIGIN` includes your frontend URL.

## Production Notes

- Use strong secrets for `JWT_SECRET` and keep all secrets out of git.
- Run API and worker as separate processes in production.
- Use managed MongoDB/Redis and set environment variables through your hosting platform.
- Persist `PDF_OUTPUT_DIR` on durable storage if PDFs must survive restarts.
