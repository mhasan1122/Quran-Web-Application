import { getSurah, getSurahs } from '@/lib/api';
import AyahCard from '@/components/AyahCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const surah = await getSurah(id);
    return {
      title: `${surah.transliteration} — Surah ${surah.number}`,
      description: `Read Surah ${surah.transliteration} (${surah.englishName}) — ${surah.totalAyahs} ayahs, ${surah.revelationType}. Arabic text with Sahih International translation.`,
    };
  } catch {
    return { title: `Surah ${id}` };
  }
}

export async function generateStaticParams() {
  const surahs = await getSurahs();
  return surahs.map(s => ({ id: String(s.number) }));
}

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export default async function SurahPage({ params }: Props) {
  const { id } = await params;
  const surahId = parseInt(id, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  let surah;
  try {
    surah = await getSurah(surahId);
  } catch {
    notFound();
  }

  const showBismillah = surahId !== 9;
  const isMeccan = surah.revelationType === 'Meccan';

  return (
    <div className="min-h-screen">
      {/* Surah Header */}
      <section
        className="relative overflow-hidden py-12 px-4"
        style={{
          background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(212,175,55,0.06), transparent)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            id="back-to-surahs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Surahs
          </Link>

          {/* Surah number */}
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold mb-5 mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,185,129,0.2))',
              border: '1px solid rgba(212,175,55,0.3)',
              color: 'var(--color-gold)',
            }}
          >
            {surah.number}
          </div>

          {/* Arabic name */}
          <h1
            className="text-5xl sm:text-6xl mb-3 leading-tight"
            style={{ fontFamily: "'Amiri', serif", color: 'var(--color-gold-light)' }}
            dir="rtl"
            lang="ar"
          >
            {surah.arabicName}
          </h1>

          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {surah.transliteration}
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            {surah.englishName}
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${isMeccan ? 'badge-meccan' : 'badge-medinan'}`}>
              {surah.revelationType}
            </span>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{
                backgroundColor: 'rgba(139,148,158,0.1)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              {surah.totalAyahs} Ayahs
            </span>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {surahId > 1 && (
              <Link
                href={`/surah/${surahId - 1}`}
                id="prev-surah"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </Link>
            )}
            {surahId < 114 && (
              <Link
                href={`/surah/${surahId + 1}`}
                id="next-surah"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-bg-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Ayahs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Bismillah Banner */}
        {showBismillah && (
          <div
            className="rounded-2xl p-6 mb-8 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(16,185,129,0.05))',
              borderColor: 'rgba(212,175,55,0.2)',
            }}
          >
            <p
              className="text-3xl sm:text-4xl leading-loose"
              style={{ fontFamily: "'Amiri', serif", color: 'var(--color-gold-light)' }}
              dir="rtl"
              lang="ar"
              aria-label="Bismillah ir-rahman ir-rahim"
            >
              {BISMILLAH}
            </p>
            <p className="text-xs mt-3" style={{ color: 'var(--color-text-dim)' }}>
              In the name of Allah, the Entirely Merciful, the Especially Merciful
            </p>
          </div>
        )}

        {/* Ayah list */}
        <div className="space-y-4">
          {surah.ayahs.map(ayah => (
            <AyahCard key={ayah.number} ayah={ayah} surahNumber={surah.number} />
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {surahId > 1 ? (
            <Link
              href={`/surah/${surahId - 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-bg-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Surah
            </Link>
          ) : <div />}

          <Link
            href="/"
            className="text-sm"
            style={{ color: 'var(--color-text-dim)' }}
          >
            ↑ All Surahs
          </Link>

          {surahId < 114 ? (
            <Link
              href={`/surah/${surahId + 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-bg-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              Next Surah
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </section>
    </div>
  );
}
