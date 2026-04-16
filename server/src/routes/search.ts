import { Hono } from 'hono';
import { loadQuran } from '../data/quran.js';

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
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const surahs = await loadQuran();

    const results: Array<{
      surahNumber: number;
      surahName: string;
      surahArabicName: string;
      surahTransliteration: string;
      ayahNumber: number;
      arabic: string;
      translation: string;
    }> = [];

    for (const surah of surahs) {
      for (const ayah of surah.ayahs) {
        if (regex.test(ayah.translation)) {
          results.push({
            surahNumber: surah.number,
            surahName: surah.englishName,
            surahArabicName: surah.arabicName,
            surahTransliteration: surah.transliteration,
            ayahNumber: ayah.number,
            arabic: ayah.arabic,
            translation: ayah.translation,
          });
        }
      }
    }

    // Sort by surah number then ayah number
    results.sort((a, b) =>
      a.surahNumber !== b.surahNumber
        ? a.surahNumber - b.surahNumber
        : a.ayahNumber - b.ayahNumber
    );

    // Limit to 100 results
    const limited = results.slice(0, 100);

    return c.json({
      success: true,
      query,
      total: results.length,
      data: limited,
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Search failed' }, 500);
  }
});

export default searchRouter;
