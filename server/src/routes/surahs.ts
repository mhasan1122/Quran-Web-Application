import { Hono } from 'hono';
import { getSurahByNumber, getSurahMetaList } from '../data/quran.js';

const surahsRouter = new Hono();

// GET /api/surahs — list all 114 surahs (metadata only, no ayahs)
surahsRouter.get('/', async (c) => {
  try {
    const surahs = await getSurahMetaList();
    return c.json({ success: true, data: surahs });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Failed to fetch surahs' }, 500);
  }
});

// GET /api/surahs/:id — full surah with ayahs
surahsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id) || id < 1 || id > 114) {
    return c.json({ success: false, error: 'Invalid surah number. Must be 1–114.' }, 400);
  }

  try {
    const surah = await getSurahByNumber(id);
    if (!surah) {
      return c.json({ success: false, error: 'Surah not found' }, 404);
    }
    return c.json({ success: true, data: surah });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Failed to fetch surah' }, 500);
  }
});

export default surahsRouter;
