import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: {
    default: 'Quran Reader — Read the Holy Quran Online',
    template: '%s | Quran Reader',
  },
  description:
    'Read, explore, and search the Holy Quran with Arabic text and English translation (Sahih International). Beautiful dark mode reader with customizable fonts.',
  keywords: ['Quran', 'Islam', 'Quran reader', 'Islamic app', 'Arabic', 'Sahih International'],
  authors: [{ name: 'Quran Reader' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Arabic Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Prevent settings FOUC — inline script to set CSS vars before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var s = JSON.parse(localStorage.getItem('quran-settings') || '{}');
                  var r = document.documentElement;
                  if (s.arabicFont)          r.style.setProperty('--arabic-font', "'" + s.arabicFont + "', serif");
                  if (s.arabicFontSize)      r.style.setProperty('--arabic-font-size', s.arabicFontSize + 'px');
                  if (s.translationFontSize) r.style.setProperty('--translation-font-size', s.translationFontSize + 'px');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <SettingsProvider>
          <AppShell>{children}</AppShell>
        </SettingsProvider>
      </body>
    </html>
  );
}
