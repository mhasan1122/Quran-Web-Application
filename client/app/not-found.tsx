import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page Not Found — Quran Reader' };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div
        className="text-8xl mb-6"
        style={{ fontFamily: "'Amiri', serif", color: 'var(--color-gold-light)' }}
      >
        ٤٠٤
      </div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
        Page Not Found
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        The page you are looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, var(--color-gold), var(--color-emerald))',
          color: '#0d1117',
        }}
      >
        Back to Quran
      </Link>
    </div>
  );
}
