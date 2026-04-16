# 📖 Quran Reader

A full-stack Quran web application with Arabic text, English translation (Sahih International), search, and a customizable reading experience.

## ✨ Features

- 📚 **114 Surahs** with full Arabic text and Sahih International translation
- 🔍 **Instant search** across all ayahs with highlighted results
- 🎨 **Dark Islamic aesthetic** with gold/emerald accents
- ⚙️ **Customizable settings**: Arabic font selection, font sizes
- 💾 **Persistent settings** via localStorage
- 📱 **Fully responsive** — mobile, tablet, desktop

## 🏗️ Architecture

```
MongoDB Atlas ← Hono/Node.js API (port 3001) ← Next.js App (port 3000)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (or Bun)
- **MongoDB Atlas** connection string (or local MongoDB)

### 1. Backend Setup

```bash
cd server
npm install

# Create .env file (already included)
# Edit MONGODB_URI if needed

npm run start:ts     # Development (with ts-node)
# OR
npm run build && npm start  # Production
```

The API will start at `http://localhost:3001` and automatically seed MongoDB on first run.

**API Endpoints:**
- `GET /api/surahs` — list all 114 surahs
- `GET /api/surahs/:id` — full surah with ayahs (1–114)
- `GET /api/search?q=mercy` — search by translation text
- `GET /health` — health check

### 2. Frontend Setup

```bash
cd client
npm install

# Make sure .env.local has:
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev     # Development server at http://localhost:3000
npm run build   # Production build
npm start       # Production server
```

## 📁 Project Structure

```
quran-app/
├── server/                   # Hono + Node.js backend
│   ├── src/
│   │   ├── data/seed.ts      # Fetches & seeds Quran data from CDN
│   │   ├── models/Surah.ts   # Mongoose schema
│   │   ├── routes/
│   │   │   ├── surahs.ts     # GET /api/surahs, GET /api/surahs/:id
│   │   │   └── search.ts     # GET /api/search?q=...
│   │   └── index.ts          # Server entry point
│   ├── .env                  # MongoDB URI + PORT
│   └── package.json
│
└── client/                   # Next.js 14 App Router frontend
    ├── app/
    │   ├── layout.tsx         # Root layout + anti-FOUC script
    │   ├── page.tsx           # Home: surah grid (SSG)
    │   ├── surah/[id]/page.tsx # Ayat page (SSG, 114 routes)
    │   └── search/page.tsx    # Search page (CSR)
    ├── components/
    │   ├── AppShell.tsx       # Client layout with settings state
    │   ├── Navbar.tsx         # Navigation bar
    │   ├── SettingsPanel.tsx  # Slide-in settings sidebar
    │   ├── SurahCard.tsx      # Surah list card
    │   ├── AyahCard.tsx       # Individual verse card
    │   └── SearchBar.tsx      # Debounced search input
    ├── context/
    │   └── SettingsContext.tsx # Settings state + localStorage
    ├── lib/
    │   └── api.ts             # Typed API client functions
    └── .env.local             # NEXT_PUBLIC_API_URL
```

## ⚙️ Settings

The settings panel (gear icon in navbar) allows:

| Setting | Range | Default |
|---------|-------|---------|
| Arabic Font | Amiri / Scheherazade New | Amiri |
| Arabic Font Size | 18px – 48px | 28px |
| Translation Font Size | 12px – 24px | 16px |

Settings are saved in `localStorage` under the key `quran-settings` and applied before first render to avoid flash.

## 🌐 Environment Variables

### Backend (`server/.env`)
```env
MONGODB_URI=mongodb+srv://...
PORT=3001
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Data Source

Quran data is fetched from [quran-json](https://github.com/risan/quran-json) via jsDelivr CDN on first server startup and seeded into MongoDB. Subsequent startups use the database directly.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Hono v4 + Node.js v22 |
| Database | MongoDB Atlas + Mongoose |
| Frontend | Next.js 14 App Router |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Arabic Fonts | Amiri, Scheherazade New (Google Fonts) |
