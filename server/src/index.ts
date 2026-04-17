import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import mongoose from 'mongoose';
import surahsRouter from './routes/surahs.js';
import searchRouter from './routes/search.js';
import { seedDatabase } from './data/seed.js';

const app = new Hono();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Allow same-origin / server-to-server / curl (no Origin header)
      if (!origin) return '*';

      const allowList = new Set(
        (process.env.CORS_ORIGINS ??
          'http://localhost:3000,http://127.0.0.1:3000,https://quran-web-application-56j9.vercel.app'
        )
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );

      if (allowList.has(origin)) return origin;

      // Optional: allow Vercel preview deployments for this project
      // (e.g. https://quran-web-application-xxxx.vercel.app)
      if (/^https:\/\/quran-web-application-[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;

      return null;
    },
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.route('/api/surahs', surahsRouter);
app.route('/api/search', searchRouter);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 fallback
app.notFound((c) => c.json({ success: false, error: 'Route not found' }, 404));

// ─── Startup ─────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);

async function main() {
  try {
    const mongoUri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('Missing env var MONGO_URI (or MONGODB_URI)');
    }

    console.log('🗄️  Connecting to MongoDB...');
    mongoose.connection.on('error', (e) => {
      console.error('❌ MongoDB connection error:', e);
    });
    mongoose.connection.on('disconnected', () => {
      console.error('⚠️  MongoDB disconnected');
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB');

    await seedDatabase();

    // Start server
    serve({ fetch: app.fetch, port: PORT });
    console.log(`🚀 Quran API running at http://localhost:${PORT}`);
    console.log(`   → GET /api/surahs`);
    console.log(`   → GET /api/surahs/:id`);
    console.log(`   → GET /api/search?q=...`);
  } catch (err) {
    console.error(
      '❌ Startup failed:',
      err instanceof Error ? `${err.name}: ${err.message}` : err
    );
    if (err instanceof Error && err.stack) console.error(err.stack);
    process.exit(1);
  }
}

main();
