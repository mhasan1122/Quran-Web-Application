import Link from 'next/link';
import { SurahMeta } from '@/lib/api';

interface SurahCardProps {
  surah: SurahMeta;
}

export default function SurahCard({ surah }: SurahCardProps) {
  const isEven = surah.number % 2 === 0;
  const isMeccan = surah.revelationType === 'Meccan';

  return (
    <Link
      href={`/surah/${surah.number}`}
      id={`surah-card-${surah.number}`}
      className="card-hover block rounded-2xl p-4 border relative overflow-hidden group"
      style={{
        backgroundColor: 'var(--color-bg-2)',
        borderColor: 'var(--color-border)',
      }}
      aria-label={`Surah ${surah.number}: ${surah.transliteration} (${surah.englishName})`}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.04), rgba(16,185,129,0.04))',
        }}
      />

      <div className="relative flex items-start gap-3">
        {/* Number Badge */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: isEven
              ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))'
              : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
            border: `1px solid ${isEven ? 'rgba(212,175,55,0.2)' : 'rgba(16,185,129,0.2)'}`,
            color: isEven ? 'var(--color-gold)' : 'var(--color-emerald)',
          }}
        >
          {surah.number}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3
                className="text-sm font-semibold leading-tight"
                style={{ color: 'var(--color-text)' }}
              >
                {surah.transliteration}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {surah.englishName}
              </p>
            </div>
            {/* Arabic Name */}
            <span
              className="text-xl flex-shrink-0"
              style={{
                fontFamily: "'Amiri', serif",
                color: 'var(--color-gold-light)',
                lineHeight: 1.5,
              }}
            >
              {surah.arabicName}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${isMeccan ? 'badge-meccan' : 'badge-medinan'}`}
            >
              {surah.revelationType}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
              {surah.totalAyahs} ayahs
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
