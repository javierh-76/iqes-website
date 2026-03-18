'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/lib/constants';

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent}40 100%)`,
      }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Contact us today for a free consultation and quote
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/quote">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                style={{
                  backgroundColor: COLORS.cta,
                  color: COLORS.white,
                }}
              >
                {t?.nav?.getQuote ?? 'Get Quote'}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                style={{
                  borderColor: COLORS.white,
                  color: COLORS.white,
                }}
              >
                {t?.nav?.contact ?? 'Contact Us'}
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="text-lg">386-603-9541</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <a
              href="mailto:info@iqeslowvoltage.com"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="text-lg">info@iqeslowvoltage.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
