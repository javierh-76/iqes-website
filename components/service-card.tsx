'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  index?: number;
}

export function ServiceCard({ title, description, icon: Icon, href, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={href}>
        <div
          className="group h-full rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 bg-white border-2 border-transparent hover:border-opacity-100"
          style={{
            borderColor: 'transparent',
            '--hover-border-color': COLORS.accent,
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div
            className="mb-4 inline-flex rounded-lg p-3 transition-colors duration-300"
            style={{ backgroundColor: `${COLORS.accent}15` }}
          >
            <Icon
              className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              style={{ color: COLORS.accent }}
            />
          </div>
          <h3 className="mb-2 text-xl font-bold" style={{ color: COLORS.text.primary }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
            {description}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium" style={{ color: COLORS.primary }}>
            <span className="group-hover:underline">Learn more</span>
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
