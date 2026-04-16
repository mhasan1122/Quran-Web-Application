'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  onSettingsToggle: () => void;
}

export default function Navbar({ onSettingsToggle }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b"
      style={{ backgroundColor: 'rgba(13,17,23,0.9)', borderColor: 'var(--color-border)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Go to home">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(16,185,129,0.12))',
                border: '1px solid rgba(212,175,55,0.22)',
              }}
            >
              <Image
                src="/logo.png"
                alt="Quran Reader"
                width={40}
                height={40}
                priority
                className="rounded-xl"
              />
            </div>
          </Link>

          {/* Nav Links + Controls */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              id="nav-home"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: pathname === '/' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                backgroundColor: pathname === '/' ? 'rgba(212,175,55,0.08)' : 'transparent',
              }}
            >
              Surahs
            </Link>

            <Link
              href="/search"
              id="nav-search"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: pathname === '/search' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                backgroundColor: pathname === '/search' ? 'rgba(212,175,55,0.08)' : 'transparent',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>

            {/* Settings Toggle */}
            <button
              id="settings-toggle"
              onClick={onSettingsToggle}
              className="relative p-2 rounded-xl transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(212,175,55,0.08)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
              aria-label="Open settings panel"
              aria-haspopup="dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
