'use client';

import { TestimonialCard } from '@/components/testimonial-card';
import { COLORS } from '@/lib/constants';
import { useLanguage } from '@/contexts/language-context';

export function TestimonialsSectionClient({ testimonials }: { testimonials: any[] }) {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ color: COLORS.primary }}>
            {t?.home?.testimonialsTitle ?? 'What Our Clients Say'}
          </h2>
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            {t?.home?.testimonialsSubtitle ?? 'Trusted by businesses across Florida'}
          </p>
        </div>

        {/* Testimonials grid */}
        {testimonials?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial?.id}
                clientName={testimonial?.clientName ?? 'Anonymous'}
                companyName={testimonial?.companyName ?? undefined}
                text={
                  (language === 'es' && testimonial?.textEs) || testimonial?.text || ''
                }
                rating={testimonial?.rating ?? 5}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: COLORS.text.secondary }}>
              No testimonials available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
