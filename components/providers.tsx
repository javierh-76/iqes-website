'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/language-context';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
