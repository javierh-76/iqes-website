'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { COLORS } from '@/lib/constants';

interface TestimonialCardProps {
  clientName: string;
  companyName?: string;
  text: string;
  rating: number;
  index?: number;
}

export function TestimonialCard({
  clientName,
  companyName,
  text,
  rating,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="h-full rounded-lg p-6 shadow-md bg-white relative">
        <Quote
          className="absolute top-4 right-4 h-8 w-8 opacity-10"
          style={{ color: COLORS.accent }}
        />
        
        {/* Rating */}
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              fill={i < rating ? COLORS.accent : 'none'}
              stroke={i < rating ? COLORS.accent : COLORS.text.light}
            />
          ))}
        </div>

        {/* Testimonial text */}
        <p className="mb-4 text-sm leading-relaxed italic" style={{ color: COLORS.text.secondary }}>
          "{text}"
        </p>

        {/* Client info */}
        <div className="border-t pt-4" style={{ borderColor: `${COLORS.text.light}30` }}>
          <p className="font-semibold" style={{ color: COLORS.text.primary }}>
            {clientName}
          </p>
          {companyName && (
            <p className="text-xs" style={{ color: COLORS.text.light }}>
              {companyName}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
