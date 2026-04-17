'use client';

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

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

function clampSettings(input: Partial<Settings>): Settings {
  const arabicFont = (input.arabicFont === 'Scheherazade New' || input.arabicFont === 'Amiri')
    ? input.arabicFont
    : DEFAULT_SETTINGS.arabicFont;

  const arabicFontSizeRaw = typeof input.arabicFontSize === 'number' ? input.arabicFontSize : DEFAULT_SETTINGS.arabicFontSize;
  const translationFontSizeRaw = typeof input.translationFontSize === 'number' ? input.translationFontSize : DEFAULT_SETTINGS.translationFontSize;

  return {
    arabicFont,
    arabicFontSize: Math.min(48, Math.max(18, arabicFontSizeRaw)),
    translationFontSize: Math.min(24, Math.max(12, translationFontSizeRaw)),
  };
}

function readFromStorage(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return clampSettings({ ...DEFAULT_SETTINGS, ...parsed });
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeToStorage(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const STORE_EVENT = 'quran-settings:changed';

function settingsEqual(a: Settings, b: Settings) {
  return (
    a.arabicFont === b.arabicFont &&
    a.arabicFontSize === b.arabicFontSize &&
    a.translationFontSize === b.translationFontSize
  );
}

let hasHydrated = false;
let cachedSnapshot: Settings = DEFAULT_SETTINGS;

function getSnapshot(): Settings {
  // During hydration we must return the same values the server rendered,
  // otherwise React will report hydration mismatches.
  if (!hasHydrated) return DEFAULT_SETTINGS;

  const next = readFromStorage();
  if (settingsEqual(cachedSnapshot, next)) return cachedSnapshot;
  cachedSnapshot = next;
  return cachedSnapshot;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cachedSnapshot = readFromStorage();
    onStoreChange();
  };
  const onCustom = () => onStoreChange();

  window.addEventListener('storage', onStorage);
  window.addEventListener(STORE_EVENT, onCustom as EventListener);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(STORE_EVENT, onCustom as EventListener);
  };
}

function emitStoreChange() {
  window.dispatchEvent(new Event(STORE_EVENT));
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Important for hydration: during SSR + hydration, React will use the server snapshot
  // (DEFAULT_SETTINGS) so the HTML matches. After hydration it re-reads localStorage.
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_SETTINGS);

  // Persist + apply whenever settings change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    applySettingsToDOM(settings);
  }, [settings]);

  // Flip the hydration gate after mount, then emit one update so the store re-reads localStorage.
  useEffect(() => {
    hasHydrated = true;
    cachedSnapshot = readFromStorage();
    emitStoreChange();
  }, []);

  const setArabicFont = useCallback((font: ArabicFont) => {
    const next = clampSettings({ ...readFromStorage(), arabicFont: font });
    writeToStorage(next);
    applySettingsToDOM(next);
    emitStoreChange();
  }, []);

  const setArabicFontSize = useCallback((size: number) => {
    const next = clampSettings({ ...readFromStorage(), arabicFontSize: size });
    writeToStorage(next);
    applySettingsToDOM(next);
    emitStoreChange();
  }, []);

  const setTranslationFontSize = useCallback((size: number) => {
    const next = clampSettings({ ...readFromStorage(), translationFontSize: size });
    writeToStorage(next);
    applySettingsToDOM(next);
    emitStoreChange();
  }, []);

  const resetSettings = useCallback(() => {
    writeToStorage(DEFAULT_SETTINGS);
    applySettingsToDOM(DEFAULT_SETTINGS);
    emitStoreChange();
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
