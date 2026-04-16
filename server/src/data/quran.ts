import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type RevelationType = 'Meccan' | 'Medinan';

export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
}

export interface Surah {
  number: number;
  arabicName: string;
  englishName: string;
  transliteration: string;
  totalAyahs: number;
  revelationType: RevelationType;
  ayahs: Ayah[];
}

type QuranJsonVerse = { id: number; text: string; translation: string };
type QuranJsonSurah = {
  id: number;
  name: string;
  transliteration: string;
  translation?: string;
  type: string;
  total_verses: number;
  verses: QuranJsonVerse[];
};

const DEFAULT_QURAN_DATA_URL =
  'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_PATH = path.join(__dirname, 'quran_en.cache.json');

let cache: Surah[] | null = null;
let cachePromise: Promise<Surah[]> | null = null;

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Quran data (${res.status})`);
  return (await res.json()) as QuranJsonSurah[];
}

async function readCacheFile(): Promise<QuranJsonSurah[] | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(raw) as QuranJsonSurah[];
  } catch {
    return null;
  }
}

async function writeCacheFile(data: QuranJsonSurah[]) {
  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(data), 'utf8');
  } catch {
    // Best-effort cache only (ignore write failures)
  }
}

function normalizeRevelationType(t: string): RevelationType {
  const v = (t ?? '').toLowerCase();
  if (v.includes('medin')) return 'Medinan';
  return 'Meccan';
}

function toSurahs(data: QuranJsonSurah[]): Surah[] {
  return data
    .map((s) => ({
      number: s.id,
      arabicName: s.name,
      englishName: s.translation ?? s.transliteration,
      transliteration: s.transliteration,
      totalAyahs: s.total_verses,
      revelationType: normalizeRevelationType(s.type),
      ayahs: s.verses.map((v) => ({
        number: v.id,
        arabic: v.text,
        translation: v.translation,
      })),
    }))
    .sort((a, b) => a.number - b.number);
}

export async function loadQuran(): Promise<Surah[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const url = process.env.QURAN_DATA_URL ?? DEFAULT_QURAN_DATA_URL;

    // Prefer fresh online fetch, fallback to local cache file if offline.
    let raw = await fetchJson(url).catch(async () => {
      const cached = await readCacheFile();
      if (!cached) throw new Error('Unable to load Quran data (offline and no cache)');
      return cached;
    });

    // Save best-effort cache for next boot.
    void writeCacheFile(raw);

    cache = toSurahs(raw);
    return cache;
  })();

  return cachePromise;
}

export async function getSurahMetaList() {
  const surahs = await loadQuran();
  return surahs.map(({ ayahs, ...meta }) => meta);
}

export async function getSurahByNumber(num: number) {
  const surahs = await loadQuran();
  return surahs.find((s) => s.number === num) ?? null;
}

