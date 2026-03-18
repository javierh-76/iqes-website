'use client';

import { useLanguage } from '@/contexts/language-context';
import { COLORS } from '@/lib/constants';

export default function BlogPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="mb-4" style={{ color: COLORS.primary }}>
            Blog
          </h1>
          <p className="text-xl" style={{ color: COLORS.text.secondary }}>
            Industry insights and updates
          </p>
        </div>

        <div className="text-center py-20">
          <p className="text-xl" style={{ color: COLORS.text.secondary }}>
            Blog posts coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
