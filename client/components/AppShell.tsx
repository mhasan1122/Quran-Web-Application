'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SettingsPanel from '@/components/SettingsPanel';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Navbar onSettingsToggle={() => setSettingsOpen(prev => !prev)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <main>{children}</main>
    </>
  );
}
