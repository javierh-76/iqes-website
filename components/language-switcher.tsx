'use client';

import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-white hover:bg-white/10"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium uppercase">{language}</span>
    </Button>
  );
}
