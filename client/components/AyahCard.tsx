import { Ayah } from '@/lib/api';

interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  highlightQuery?: string;
}

function highlightText(text: string, query: string): string {
  if (!query || query.length < 2) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

export default function AyahCard({ ayah, surahNumber, highlightQuery }: AyahCardProps) {
  const ayahKey = `${surahNumber}:${ayah.number}`;
  const highlightedTranslation = highlightQuery
    ? highlightText(ayah.translation, highlightQuery)
    : ayah.translation;

  return (
    <div
      id={`ayah-${surahNumber}-${ayah.number}`}
      className="rounded-2xl p-5 sm:p-7 border transition-colors duration-200"
      style={{
        backgroundColor: 'var(--color-bg-2)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Ayah Number */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-gold)' }}
          />
          <span className="text-xs font-semibold" style={{ color: 'var(--color-gold)' }}>
            {ayahKey}
          </span>
        </div>

        {/* Decorative rosette-like marker */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,185,129,0.2))',
            border: '1px solid rgba(212,175,55,0.3)',
            color: 'var(--color-gold)',
          }}
          aria-hidden="true"
        >
          ◈
        </div>
      </div>

      {/* Arabic Text */}
      <p
        className="arabic-text mb-5 leading-loose"
        dir="rtl"
        lang="ar"
        aria-label={`Arabic text of ayah ${ayahKey}`}
      >
        {ayah.arabic}
      </p>

      {/* Divider */}
      <div
        className="mb-5 h-px"
        style={{ background: 'linear-gradient(90deg, var(--color-border), transparent)' }}
      />

      {/* Translation */}
      <p
        className="translation-text"
        style={{ color: 'var(--color-text-muted)' }}
        dangerouslySetInnerHTML={{ __html: highlightedTranslation }}
        aria-label={`Translation of ayah ${ayahKey}`}
      />
    </div>
  );
}
