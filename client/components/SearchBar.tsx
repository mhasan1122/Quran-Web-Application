'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Search the Quran by translation...',
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      } else if (value.trim().length >= 2) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }, 300);
  }, [onSearch, router]);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    if (onSearch) onSearch('');
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: 'var(--color-text-dim)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        ref={inputRef}
        id="search-input"
        type="search"
        role="searchbox"
        defaultValue={initialValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm outline-none transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-bg-2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-gold)';
          e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
        aria-label="Search the Quran"
      />

      {/* Clear button */}
      <button
        onClick={handleClear}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Clear search"
        tabIndex={0}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
