const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

class ApiError extends Error {
  name = 'ApiError' as const;
  constructor(
    message: string,
    public readonly details?: {
      url?: string;
      status?: number;
    }
  ) {
    super(message);
  }
}

function humanizeNetworkError(err: unknown, url: string): ApiError {
  const msg =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'Network error';

  // Browser fetch commonly throws TypeError("Failed to fetch") when server is down / CORS / DNS.
  if (msg.toLowerCase().includes('failed to fetch')) {
    return new ApiError('Server Unreachable.', { url });
  }

  return new ApiError('Server Unreachable.', { url });
}

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
  const url = `${API_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: 86400 }, // 24h cache for SSG
    });
  } catch (err) {
    throw humanizeNetworkError(err, url);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: 'Request failed' }));
    const message =
      (typeof errBody === 'object' && errBody && 'error' in errBody && typeof errBody.error === 'string'
        ? errBody.error
        : undefined) ?? `API request failed (${res.status})`;

    throw new ApiError(`${message}\nTried: ${url}`, { url, status: res.status });
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
