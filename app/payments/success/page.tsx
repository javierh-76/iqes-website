'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Phone } from 'lucide-react';
import { COLORS, COMPANY } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PaymentSuccessContent() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<{
    status: string;
    customerEmail: string;
    amountTotal: number;
    metadata: { quoteId?: string; customerName?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe/checkout?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setPaymentDetails(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const content = {
    en: {
      title: 'Payment Successful!',
      subtitle: 'Thank you for your payment. Your transaction has been completed.',
      confirmationSent: 'A confirmation email has been sent to:',
      amountPaid: 'Amount Paid',
      projectRef: 'Project Reference',
      nextSteps: 'Next Steps',
      nextStepsItems: [
        'You will receive a detailed receipt via email',
        'Our team will contact you within 24 hours',
        'Project work will begin as scheduled',
      ],
      questions: 'Questions?',
      callUs: 'Call us at',
      backHome: 'Back to Home',
    },
    es: {
      title: '¡Pago Exitoso!',
      subtitle: 'Gracias por su pago. Su transacción ha sido completada.',
      confirmationSent: 'Se ha enviado un correo de confirmación a:',
      amountPaid: 'Monto Pagado',
      projectRef: 'Referencia del Proyecto',
      nextSteps: 'Próximos Pasos',
      nextStepsItems: [
        'Recibirá un recibo detallado por correo electrónico',
        'Nuestro equipo lo contactará dentro de 24 horas',
        'El trabajo del proyecto comenzará según lo programado',
      ],
      questions: '¿Preguntas?',
      callUs: 'Llámenos al',
      backHome: 'Volver al Inicio',
    },
  };

  const t = isEs ? content.es : content.en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.orange }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8"
        >
          <CheckCircle className="w-16 h-16 text-green-600" />
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

        {paymentDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left"
          >
            {paymentDetails.customerEmail && (
              <div className="mb-4">
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {t.confirmationSent}
                </p>
                <p className="font-semibold" style={{ color: COLORS.primary }}>
                  {paymentDetails.customerEmail}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div>
                <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {t.amountPaid}
                </p>
                <p className="text-2xl font-bold" style={{ color: COLORS.orange }}>
                  ${paymentDetails.amountTotal?.toFixed(2)}
                </p>
              </div>
              {paymentDetails.metadata?.quoteId && (
                <div>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {t.projectRef}
                  </p>
                  <p className="font-semibold" style={{ color: COLORS.primary }}>
                    #{paymentDetails.metadata.quoteId}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                {t.nextSteps}
              </p>
              <ul className="space-y-2">
                {t.nextStepsItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: COLORS.text.secondary }}>
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 rounded-xl p-6 mb-8"
        >
          <p className="font-semibold mb-2" style={{ color: COLORS.primary }}>
            {t.questions}
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

        <Link href="/">
          <Button
            size="lg"
            style={{ backgroundColor: COLORS.primary, color: 'white' }}
            className="hover:opacity-90"
          >
            <Home className="w-5 h-5 mr-2" />
            {t.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#F97316' }}></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
