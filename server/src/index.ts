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
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await seedDatabase();

    // Start server
    serve({ fetch: app.fetch, port: PORT });
    console.log(`🚀 Quran API running at http://localhost:${PORT}`);
    console.log(`   → GET /api/surahs`);
    console.log(`   → GET /api/surahs/:id`);
    console.log(`   → GET /api/search?q=...`);
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

main();
