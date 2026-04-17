import { Hono } from 'hono';
import Surah from '../models/Surah.js';

const searchRouter = new Hono();

// GET /api/search?q=:query — search ayahs by translation text
searchRouter.get('/', async (c) => {
  const query = c.req.query('q')?.trim();

  if (!query || query.length < 2) {
    return c.json({ success: false, error: 'Query must be at least 2 characters.' }, 400);
  }

  if (query.length > 200) {
    return c.json({ success: false, error: 'Query too long.' }, 400);
  }

  try {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safe, 'i');

    const [out] = await Surah.aggregate<{
      data: Array<{
        surahNumber: number;
        surahName: string;
        surahArabicName: string;
        surahTransliteration: string;
        ayahNumber: number;
        arabic: string;
        translation: string;
      }>;
      meta: Array<{ total: number }>;
    }>([
      { $unwind: '$ayahs' },
      { $match: { 'ayahs.translation': { $regex: regex } } },
      {
        $project: {
          _id: 0,
          surahNumber: '$number',
          surahName: '$englishName',
          surahArabicName: '$arabicName',
          surahTransliteration: '$transliteration',
          ayahNumber: '$ayahs.number',
          arabic: '$ayahs.arabic',
          translation: '$ayahs.translation',
        },
      },
      { $sort: { surahNumber: 1, ayahNumber: 1 } },
      {
        $facet: {
          data: [{ $limit: 100 }],
          meta: [{ $count: 'total' }],
        },
      },
    ]);

    const total = out?.meta?.[0]?.total ?? 0;
    const data = out?.data ?? [];

    return c.json({
      success: true,
      query,
      total,
      data,
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Search failed' }, 500);
  }
});

export default searchRouter;
