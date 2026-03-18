'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { COLORS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, Mail, Home, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function QuoteSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isEs = language === 'es';
  const token = params.token as string;
  const sessionId = searchParams.get('session_id');
  
  const [confirming, setConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  useEffect(() => {
    if (sessionId && token) {
      confirmPayment();
    } else {
      setConfirming(false);
      setConfirmed(true);
    }
  }, [sessionId, token]);

  const confirmPayment = async () => {
    try {
      const res = await fetch(`/api/quotes/${token}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      
      if (res.ok) {
        setConfirmed(true);
        // Fetch quote number
        const quoteRes = await fetch(`/api/quotes/${token}`);
        const quoteData = await quoteRes.json();
        if (quoteData.quote) {
          setQuoteNumber(quoteData.quote.quoteNumber);
        }
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: COLORS.primary }} />
          <p className="mt-4 text-gray-600">{isEs ? 'Confirmando pago...' : 'Confirming payment...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="p-8 text-center" style={{ backgroundColor: '#28a745' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-24 h-24 mx-auto text-white mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEs ? '¡Pago Exitoso!' : 'Payment Successful!'}
            </h1>
            <p className="text-white/90 text-lg">
              {isEs ? 'Gracias por su confianza' : 'Thank you for your trust'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg mb-4">
                {isEs 
                  ? 'Hemos recibido su depósito exitosamente. Nuestro equipo se comunicará con usted pronto para coordinar los siguientes pasos de su proyecto.'
                  : 'We have received your deposit successfully. Our team will contact you shortly to coordinate the next steps of your project.'}
              </p>
              
              {quoteNumber && (
                <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 mb-4">
                  <p className="text-sm text-gray-600">{isEs ? 'Número de Cotización' : 'Quote Number'}</p>
                  <p className="text-xl font-bold" style={{ color: COLORS.primary }}>{quoteNumber}</p>
                </div>
              )}

              <p className="text-gray-600 text-sm">
                {isEs 
                  ? 'Se ha enviado un correo de confirmación a su dirección de email.'
                  : 'A confirmation email has been sent to your email address.'}
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">{isEs ? '¿Qué sigue?' : "What's next?"}</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">1</span>
                  <span>{isEs ? 'Nuestro equipo revisará su proyecto y se comunicará en 24-48 horas.' : 'Our team will review your project and reach out within 24-48 hours.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">2</span>
                  <span>{isEs ? 'Programaremos una fecha conveniente para iniciar el trabajo.' : "We'll schedule a convenient date to start the work."}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">3</span>
                  <span>{isEs ? 'El balance restante será debido al completar el proyecto.' : 'The remaining balance will be due upon project completion.'}</span>
                </li>
              </ol>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <p className="text-center text-gray-600 mb-4">
                {isEs ? '¿Tiene preguntas? Estamos aquí para ayudar.' : 'Have questions? We\'re here to help.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="tel:+13866039541" 
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Phone className="w-5 h-5" />
                  386-603-9541
                </a>
                <a 
                  href="mailto:info@iqeslowvoltage.com" 
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                >
                  <Mail className="w-5 h-5" />
                  {isEs ? 'Enviar Email' : 'Send Email'}
                </a>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                {isEs ? 'Volver al Inicio' : 'Back to Home'}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 text-center" style={{ backgroundColor: COLORS.primary }}>
            <div className="relative h-8 w-24 mx-auto mb-2">
              <Image
                src="/iqes-logo.png"
                alt="IQES"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/80 text-sm">IQES Low Voltage Solutions</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
