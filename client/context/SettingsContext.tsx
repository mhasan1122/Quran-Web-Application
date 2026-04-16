'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ArabicFont = 'Amiri' | 'Scheherazade New';

export interface Settings {
  arabicFont: ArabicFont;
  arabicFontSize: number;    // 18–48px
  translationFontSize: number; // 12–24px
}

const DEFAULT_SETTINGS: Settings = {
  arabicFont: 'Amiri',
  arabicFontSize: 28,
  translationFontSize: 16,
};

const STORAGE_KEY = 'quran-settings';

interface SettingsContextValue {
  settings: Settings;
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applySettingsToDOM(settings: Settings) {
  const root = document.documentElement;
  root.style.setProperty('--arabic-font', `'${settings.arabicFont}', serif`);
  root.style.setProperty('--arabic-font-size', `${settings.arabicFontSize}px`);
  root.style.setProperty('--translation-font-size', `${settings.translationFontSize}px`);
}

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on first mount (client only)
  useEffect(() => {
    const persisted = loadSettings();
    setSettings(persisted);
    applySettingsToDOM(persisted);
    setMounted(true);
  }, []);

  // Persist + apply whenever settings change (after initial mount)
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettingsToDOM(settings);
  }, [settings, mounted]);

  const setArabicFont = useCallback((font: ArabicFont) => {
    setSettings(prev => ({ ...prev, arabicFont: font }));
  }, []);

  const setArabicFontSize = useCallback((size: number) => {
    setSettings(prev => ({ ...prev, arabicFontSize: Math.min(48, Math.max(18, size)) }));
  }, []);

  const setTranslationFontSize = useCallback((size: number) => {
    setSettings(prev => ({ ...prev, translationFontSize: Math.min(24, Math.max(12, size)) }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setArabicFont, setArabicFontSize, setTranslationFontSize, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
