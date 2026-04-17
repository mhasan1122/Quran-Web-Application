import { getSurahs } from '@/lib/api';
import SurahCard from '@/components/SurahCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quran Reader — All 114 Surahs',
  description: 'Browse all 114 surahs of the Holy Quran with Arabic names, transliteration, and ayah counts.',
};

// Revalidate every 24h (ISR), static-first
export const revalidate = 86400;

export default async function HomePage() {
  let surahs;
  try {
    surahs = await getSurahs();
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
          Could not connect to API
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Make sure the backend is running at{' '}
          <code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-3)' }}>
            http://localhost:3001
          </code>
        </p>
      </div>
    );
  }

  const meccanCount = surahs.filter(s => s.revelationType === 'Meccan').length;
  const medinanCount = surahs.filter(s => s.revelationType === 'Medinan').length;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-14 px-4">
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(212,175,55,0.08), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Arabic Basmala */}
          <div
            className="text-4xl sm:text-5xl mb-4 leading-loose"
            style={{ fontFamily: 'var(--arabic-font)', color: 'var(--color-gold-light)' }}
            dir="rtl"
            lang="ar"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            The Holy Quran
          </h1>
          <p className="text-sm sm:text-base mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Arabic text with Sahih International English translation
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Surahs', value: '114', color: 'var(--color-gold)' },
              { label: 'Meccan', value: meccanCount, color: 'var(--color-emerald)' },
              { label: 'Medinan', value: medinanCount, color: 'var(--color-gold)' },
              { label: 'Ayahs', value: '6,236', color: 'var(--color-emerald)' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex flex-col items-center px-5 py-3 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--color-bg-2)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span className="text-2xl font-bold" style={{ color }}>
                  {value}
                </span>
                <span className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surah Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            All Surahs
          </h2>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(212,175,55,0.08)',
              color: 'var(--color-gold)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            {surahs.length} surahs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {surahs.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      </section>
    </div>
  );
}
