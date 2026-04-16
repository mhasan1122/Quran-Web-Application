const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface SurahMeta {
  number: number;
  arabicName: string;
  englishName: string;
  transliteration: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
}

export interface SurahFull extends SurahMeta {
  ayahs: Ayah[];
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  surahTransliteration: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface SearchResponse {
  success: boolean;
  query: string;
  total: number;
  data: SearchResult[];
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 86400 }, // 24h cache for SSG
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getSurahs(): Promise<SurahMeta[]> {
  const response = await apiFetch<ApiResponse<SurahMeta[]>>('/api/surahs');
  return response.data;
}

export async function getSurah(id: number | string): Promise<SurahFull> {
  const response = await apiFetch<ApiResponse<SurahFull>>(`/api/surahs/${id}`);
  return response.data;
}

export async function searchAyahs(query: string): Promise<SearchResponse> {
  const response = await apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`);
  return response;
}
