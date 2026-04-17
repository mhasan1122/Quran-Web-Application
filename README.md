# Quran Reader

A full-stack Quran web app with Arabic text and Sahih International English translation, plus fast search and reading preferences.

### Live

- **Website**: `https://quran-web-application-56j9.vercel.app/`
- **Backend API**: `https://quran-web-application-1.onrender.com`

## Features

- Browse all 114 surahs
- Read Arabic with English translation (Sahih International)
- Search ayahs by translation text
- Reading settings (font family and font sizes)
- Settings persist in the browser (localStorage)
- Responsive layout for mobile and desktop

## Architecture

```
MongoDB <-> Hono (Node.js) API <-> Next.js client
```

## Getting started (local)

### Prerequisites

- Node.js 18+ (recommended: Node 20+)
- MongoDB (local) or a MongoDB Atlas connection string

### Backend

```bash
cd server
npm install

# Create your env file
cp .env.example .env

npm run dev
```

API runs on `http://localhost:3001`.

### Frontend

```bash
cd client
npm install

# Create/update client/.env with your API base URL
# Example for local dev:
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

Client runs on `http://localhost:3000`.

## Environment variables

### Backend (`server/.env`)

```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/quran

# Optional: comma-separated allowed origins for CORS
# CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
CORS_ORIGINS=

# Optional: override the dataset URL used for seeding
QURAN_DATA_URL=https://raw.githubusercontent.com/risan/quran-json/v3.1.2/dist/quran_en.json
```

### Frontend (`client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## API endpoints

- `GET /health`
- `GET /api/surahs`
- `GET /api/surahs/:id` (1–114)
- `GET /api/search?q=mercy`

## Data source

On first startup, the server seeds MongoDB using the dataset from [`risan/quran-json`](https://github.com/risan/quran-json). After that, it reads from the database.

## Tech stack

- Backend: Hono, Node.js, TypeScript, Mongoose
- Database: MongoDB
- Frontend: Next.js, React, TypeScript, Tailwind CSS
