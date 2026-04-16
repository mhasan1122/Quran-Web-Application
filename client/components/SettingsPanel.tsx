'use client';

import { useEffect, useRef } from 'react';
import { useSettings, ArabicFont } from '@/context/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, setArabicFont, setArabicFontSize, setTranslationFontSize, resetSettings } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusable = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Focus first element when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFocusable.current?.focus(), 50);
    }
  }, [isOpen]);

  // Lock body scroll when panel open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const arabicFonts: { value: ArabicFont; label: string; sample: string }[] = [
    { value: 'Amiri', label: 'Amiri', sample: 'بِسْمِ اللَّهِ' },
    { value: 'Scheherazade New', label: 'Scheherazade New', sample: 'بِسْمِ اللَّهِ' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Reading settings"
        className={`fixed top-0 right-0 h-full w-80 z-50 flex flex-col settings-panel ${isOpen ? 'open' : ''}`}
        style={{
          backgroundColor: 'var(--color-bg-2)',
          borderLeft: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl" style={{ color: 'var(--color-gold)' }}>⚙</span>
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              Reading Settings
            </h2>
          </div>
          <button
            ref={firstFocusable}
            onClick={onClose}
            id="settings-close"
            className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Close settings panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* ── Arabic Font ── */}
          <section aria-labelledby="font-family-label">
            <h3
              id="font-family-label"
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-text-dim)' }}
            >
              Arabic Font
            </h3>
            <div className="space-y-2">
              {arabicFonts.map(({ value, label, sample }) => (
                <button
                  key={value}
                  id={`font-option-${value.replace(/\s/g, '-').toLowerCase()}`}
                  onClick={() => setArabicFont(value)}
                  className="w-full p-3 rounded-xl text-left transition-all duration-200 border"
                  style={{
                    backgroundColor: settings.arabicFont === value ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                    borderColor: settings.arabicFont === value ? 'var(--color-gold)' : 'var(--color-border)',
                    color: settings.arabicFont === value ? 'var(--color-gold)' : 'var(--color-text-muted)',
                  }}
                  aria-pressed={settings.arabicFont === value}
                >
                  <div className="text-sm font-medium mb-1">{label}</div>
                  <div
                    style={{
                      fontFamily: `'${value}', serif`,
                      fontSize: '20px',
                      direction: 'rtl',
                      color: settings.arabicFont === value ? 'var(--color-gold-light)' : 'var(--color-text-muted)',
                    }}
                  >
                    {sample}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Arabic Font Size ── */}
          <section aria-labelledby="arabic-size-label">
            <div className="flex items-center justify-between mb-4">
              <h3
                id="arabic-size-label"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-dim)' }}
              >
                Arabic Size
              </h3>
              <span
                className="text-sm font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--color-bg-3)', color: 'var(--color-gold)' }}
              >
                {settings.arabicFontSize}px
              </span>
            </div>
            <input
              id="arabic-font-size-slider"
              type="range"
              min={18}
              max={48}
              step={2}
              value={settings.arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--color-gold)' }}
              aria-label="Arabic font size"
              aria-valuemin={18}
              aria-valuemax={48}
              aria-valuenow={settings.arabicFontSize}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
              <span>18px</span><span>48px</span>
            </div>
            {/* Live preview */}
            <div
              className="mt-4 p-3 rounded-lg text-center"
              style={{ backgroundColor: 'var(--color-bg-3)', border: '1px solid var(--color-border)' }}
            >
              <span className="arabic-text">بِسْمِ ٱللَّهِ</span>
            </div>
          </section>

          {/* ── Translation Font Size ── */}
          <section aria-labelledby="trans-size-label">
            <div className="flex items-center justify-between mb-4">
              <h3
                id="trans-size-label"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-dim)' }}
              >
                Translation Size
              </h3>
              <span
                className="text-sm font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--color-bg-3)', color: 'var(--color-emerald)' }}
              >
                {settings.translationFontSize}px
              </span>
            </div>
            <input
              id="translation-font-size-slider"
              type="range"
              min={12}
              max={24}
              step={1}
              value={settings.translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--color-emerald)' }}
              aria-label="Translation font size"
              aria-valuemin={12}
              aria-valuemax={24}
              aria-valuenow={settings.translationFontSize}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
              <span>12px</span><span>24px</span>
            </div>
            {/* Live preview */}
            <div
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-bg-3)', border: '1px solid var(--color-border)' }}
            >
              <p className="translation-text">
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            id="settings-reset"
            onClick={resetSettings}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
}
