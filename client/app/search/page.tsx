'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import AyahCard from '@/components/AyahCard';
import { searchAyahs, SearchResult } from '@/lib/api';
import Link from 'next/link';

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
    >
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-8 w-full rounded" />
      <div className="skeleton h-px w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="skeleton h-4 w-3/5 rounded" />
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await searchAyahs(trimmed);
      setResults(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search on initial mount if query param exists
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    const trimmed = q.trim();
    if (trimmed.length >= 2) {
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      runSearch(trimmed);
    } else {
      router.replace('/search', { scroll: false });
      setResults([]);
      setSearched(false);
    }
  }, [runSearch, router]);

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Search the Quran
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Search by English translation (Sahih International)
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          initialValue={initialQuery}
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4" aria-label="Loading search results" aria-live="polite">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          className="rounded-2xl p-6 text-center border"
          style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'rgba(239,68,68,0.3)' }}
          role="alert"
        >
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-sm font-medium mb-1" style={{ color: '#f87171' }}>Search Error</p>
          <p
            className="text-sm whitespace-pre-line"
            style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}
          >
            {error}
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && !error && searched && results.length === 0 && (
        <div
          className="rounded-2xl p-10 text-center border"
          style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
          role="status"
          aria-live="polite"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No results found
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Try different keywords — search is by English translation
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Search results for{' '}
              <span style={{ color: 'var(--color-gold)' }}>&ldquo;{query}&rdquo;</span>
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(16,185,129,0.08)',
                color: 'var(--color-emerald)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
              role="status"
              aria-live="polite"
            >
              {total > 100 ? `${results.length}+ of ${total}` : `${results.length} result${results.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="space-y-4">
            {results.map(result => (
              <div key={`${result.surahNumber}-${result.ayahNumber}`}>
                {/* Surah header for each result */}
                <Link
                  href={`/surah/${result.surahNumber}#ayah-${result.surahNumber}-${result.ayahNumber}`}
                  className="inline-flex items-center gap-2 mb-2 text-xs transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-text-dim)' }}
                  id={`result-link-${result.surahNumber}-${result.ayahNumber}`}
                >
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(212,175,55,0.1)',
                      color: 'var(--color-gold)',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}
                  >
                    {result.surahNumber}. {result.surahTransliteration}
                  </span>
                  <span>{result.surahArabicName}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
                <AyahCard
                  ayah={{ number: result.ayahNumber, arabic: result.arabic, translation: result.translation }}
                  surahNumber={result.surahNumber}
                  highlightQuery={query}
                />
              </div>
            ))}
          </div>

          {total > 100 && (
            <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-dim)' }}>
              Showing first 100 of {total} results. Refine your search for more specific results.
            </p>
          )}
        </>
      )}

      {/* Empty state (before first search) */}
      {!loading && !error && !searched && (
        <div
          className="rounded-2xl p-10 text-center border"
          style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
        >
          <div className="text-5xl mb-6" style={{ fontFamily: "'Amiri', serif", color: 'var(--color-gold-light)' }}>
            ٱلْقُرْآن
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Type at least 2 characters to search
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['mercy', 'patience', 'prayer', 'paradise', 'righteous'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                id={`suggestion-${suggestion}`}
                className="px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  color: 'var(--color-gold)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
