# Quran Reader (Client)

This folder contains the Next.js frontend for Quran Reader.

### Uses

- Next.js + React
- A backend API configured via `NEXT_PUBLIC_API_URL` in `client/.env`

## Run locally

1) Install dependencies:

```bash
npm install
```

2) Create `client/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3) Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm start
```

## Related

For full setup (server + database), see the root `README.md`.
