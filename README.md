```markdown
# Quran Reader

A simple, modern Quran web application built for a smooth and focused reading experience. It displays Arabic text alongside the Sahih International English translation, with fast search and customizable reading preferences.

---

## Live Demo

- Website: https://quran-web-application-56j9.vercel.app/
- Backend API: https://quran-web-application-1.onrender.com

---

## Features

- Browse all 114 surahs  
- Read Arabic with English translation (Sahih International)  
- Fast verse search using English keywords  
- Adjustable reading settings (font family and size)  
- Preferences saved in browser (localStorage)  
- Fully responsive design (mobile and desktop)  

---

## Architecture

```

MongoDB <-> Hono (Node.js) API <-> Next.js Client

````

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node 20+)
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd server
npm install

cp .env.example .env

npm run dev
````

Backend runs at:
[http://localhost:3001](http://localhost:3001)

---

### Frontend Setup

```bash
cd client
npm install

# Add this in client/.env
NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

Frontend runs at:
[http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/quran

# Optional: allowed origins for CORS
CORS_ORIGINS=

# Optional: dataset source
QURAN_DATA_URL=https://raw.githubusercontent.com/risan/quran-json/v3.1.2/dist/quran_en.json
```

---

### Frontend (`client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Endpoints

* `GET /health` – check server status
* `GET /api/surahs` – get all surahs
* `GET /api/surahs/:id` – get a specific surah (1–114)
* `GET /api/search?q=keyword` – search verses

---

## Data Source

On first startup, the server automatically seeds Quran data from the
[https://github.com/risan/quran-json](https://github.com/risan/quran-json) dataset.

After that, all data is served from MongoDB for faster performance.

---

## Tech Stack

**Backend**

* Hono
* Node.js
* TypeScript
* Mongoose

**Database**

* MongoDB

**Frontend**

* Next.js
* React
* TypeScript
* Tailwind CSS


