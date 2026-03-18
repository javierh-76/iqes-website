'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { COLORS, COMPANY } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const content = {
    en: {
      title: 'Payment Cancelled',
      subtitle: 'Your payment was not completed. No charges have been made to your account.',
      reasons: 'Possible reasons:',
      reasonsList: [
        'You cancelled the payment',
        'There was an issue with your payment method',
        'The session timed out',
      ],
      tryAgain: 'Try Again',
      contactUs: 'Contact Us',
      needHelp: 'Need help?',
      callUs: 'Call us at',
    },
    es: {
      title: 'Pago Cancelado',
      subtitle: 'Su pago no fue completado. No se han realizado cargos a su cuenta.',
      reasons: 'Posibles razones:',
      reasonsList: [
        'Usted canceló el pago',
        'Hubo un problema con su método de pago',
        'La sesión expiró',
      ],
      tryAgain: 'Intentar de Nuevo',
      contactUs: 'Contáctenos',
      needHelp: '¿Necesita ayuda?',
      callUs: 'Llámenos al',
    },
  };

  const t = isEs ? content.es : content.en;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-8"
        >
          <XCircle className="w-16 h-16 text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl mb-8"
          style={{ color: COLORS.text.secondary }}
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left"
        >
          <p className="font-semibold mb-3" style={{ color: COLORS.primary }}>
            {t.reasons}
          </p>
          <ul className="space-y-2">
            {t.reasonsList.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm"
                style={{ color: COLORS.text.secondary }}
              >
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                {reason}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Link href="/payments">
            <Button
              size="lg"
              style={{ backgroundColor: COLORS.orange, color: 'white' }}
              className="hover:opacity-90"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.tryAgain}
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.contactUs}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 rounded-xl p-6"
        >
          <p className="font-semibold mb-2" style={{ color: COLORS.primary }}>
            {t.needHelp}
          </p>
          <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
            {t.callUs}
          </p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 text-xl font-bold"
            style={{ color: COLORS.orange }}
          >
            <Phone className="w-5 h-5" />
            {COMPANY.phone}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
