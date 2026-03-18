'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { CreditCard, Building2, Smartphone, Shield, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { COLORS, COMPANY } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Payment method logos
const paymentMethods = [
  {
    id: 'stripe',
    nameEn: 'Credit/Debit Cards',
    nameEs: 'Tarjetas de Crédito/Débito',
    logo: '/payments/stripe-logo.png',
    descriptionEn: 'Visa, Mastercard, American Express, Discover',
    descriptionEs: 'Visa, Mastercard, American Express, Discover',
    icon: CreditCard,
    color: '#635BFF',
  },
  {
    id: 'paypal',
    nameEn: 'PayPal',
    nameEs: 'PayPal',
    logo: '/payments/paypal-logo.png',
    descriptionEn: 'Pay securely with your PayPal account',
    descriptionEs: 'Pague de forma segura con su cuenta PayPal',
    icon: CreditCard,
    color: '#003087',
  },
  {
    id: 'zelle',
    nameEn: 'Zelle',
    nameEs: 'Zelle',
    logo: '/payments/zelle-logo.png',
    descriptionEn: 'Fast bank-to-bank transfers',
    descriptionEs: 'Transferencias rápidas de banco a banco',
    icon: Smartphone,
    color: '#6D1ED4',
  },
  {
    id: 'bank',
    nameEn: 'Bank Transfer (ACH/Wire)',
    nameEs: 'Transferencia Bancaria (ACH/Wire)',
    logo: '/payments/chase-logo.png',
    descriptionEn: 'Direct bank transfer via Chase',
    descriptionEs: 'Transferencia directa vía Chase',
    icon: Building2,
    color: '#117ACA',
  },
  {
    id: 'affirm',
    nameEn: 'Affirm - Pay Over Time',
    nameEs: 'Affirm - Pague a Plazos',
    logo: '/payments/affirm-logo.png',
    descriptionEn: 'Split your payment into 4 interest-free installments',
    descriptionEs: 'Divida su pago en 4 cuotas sin interés',
    icon: Clock,
    color: '#0FA0EA',
  },
];

// Card brand logos
const cardBrands = [
  { name: 'Visa', logo: '/payments/visa-logo.png' },
  { name: 'Mastercard', logo: '/payments/mastercard-logo.png' },
  { name: 'American Express', logo: '/payments/amex-logo.png' },
];

export default function PaymentsPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const content = {
    en: {
      title: 'Payment Methods',
      subtitle: 'Secure and flexible payment options for your projects',
      acceptedMethods: 'Accepted Payment Methods',
      zelleInfo: 'Zelle Payment Information',
      zelleEmail: 'Send payment to:',
      bankInfo: 'Bank Transfer Information',
      bankName: 'Bank:',
      accountNumber: 'Account Number:',
      routingNumber: 'Routing Number:',
      accountName: 'Account Name:',
      depositInfo: 'Deposit & Payment Terms',
      depositDesc: 'A 50% deposit is required to begin work on your project. The remaining balance is due upon completion.',
      securePayments: 'Secure Payments',
      secureDesc: 'All transactions are encrypted and processed through secure payment gateways.',
      policies: 'Payment Policies & Terms',
      policyItems: [
        'All prices are quoted in US Dollars (USD)',
        '50% deposit required to initiate project work',
        'Remaining 50% due upon project completion and client approval',
        'For projects over $10,000, payment plans are available',
        'Credit card payments may include a 3% processing fee',
        'Bank transfers and Zelle payments have no additional fees',
        'Affirm financing subject to credit approval',
        'Refunds are processed within 5-7 business days',
        'Cancellation fees may apply for work already completed',
      ],
      policyItemsEs: [
        'Todos los precios están cotizados en Dólares Estadounidenses (USD)',
        'Se requiere un depósito del 50% para iniciar el trabajo del proyecto',
        'El 50% restante se debe al completar el proyecto y la aprobación del cliente',
        'Para proyectos mayores a $10,000, hay planes de pago disponibles',
        'Los pagos con tarjeta de crédito pueden incluir un cargo del 3% por procesamiento',
        'Las transferencias bancarias y pagos Zelle no tienen cargos adicionales',
        'Financiamiento Affirm sujeto a aprobación de crédito',
        'Los reembolsos se procesan en 5-7 días hábiles',
        'Pueden aplicar cargos por cancelación por trabajo ya completado',
      ],
      legalNotice: 'Legal Notice',
      legalText: 'By making a payment, you agree to our terms and conditions. IQES LLC reserves the right to modify pricing and payment terms. All work is guaranteed and covered under our service agreement. For disputes, please contact us directly before initiating chargebacks.',
      legalTextEs: 'Al realizar un pago, usted acepta nuestros términos y condiciones. IQES LLC se reserva el derecho de modificar precios y términos de pago. Todo el trabajo está garantizado y cubierto bajo nuestro acuerdo de servicio. Para disputas, por favor contáctenos directamente antes de iniciar contracargos.',
      protectionTitle: 'Customer Protection',
      protectionItems: [
        'SSL encrypted transactions',
        'PCI DSS compliant payment processing',
        'No storage of credit card information',
        'Detailed invoices for all transactions',
        'Written estimates before work begins',
      ],
      protectionItemsEs: [
        'Transacciones encriptadas con SSL',
        'Procesamiento de pagos compatible con PCI DSS',
        'No almacenamos información de tarjetas de crédito',
        'Facturas detalladas para todas las transacciones',
        'Cotizaciones escritas antes de comenzar el trabajo',
      ],
      requestQuote: 'Request a Quote',
      contactUs: 'Contact Us',
    },
    es: {
      title: 'Métodos de Pago',
      subtitle: 'Opciones de pago seguras y flexibles para sus proyectos',
      acceptedMethods: 'Métodos de Pago Aceptados',
      zelleInfo: 'Información de Pago Zelle',
      zelleEmail: 'Enviar pago a:',
      bankInfo: 'Información de Transferencia Bancaria',
      bankName: 'Banco:',
      accountNumber: 'Número de Cuenta:',
      routingNumber: 'Número de Ruta:',
      accountName: 'Nombre de la Cuenta:',
      depositInfo: 'Términos de Depósito y Pago',
      depositDesc: 'Se requiere un depósito del 50% para comenzar el trabajo en su proyecto. El saldo restante se paga al completar.',
      securePayments: 'Pagos Seguros',
      secureDesc: 'Todas las transacciones están encriptadas y procesadas a través de pasarelas de pago seguras.',
      policies: 'Políticas y Términos de Pago',
      policyItems: [],
      policyItemsEs: [],
      legalNotice: 'Aviso Legal',
      legalText: '',
      legalTextEs: '',
      protectionTitle: 'Protección al Cliente',
      protectionItems: [],
      protectionItemsEs: [],
      requestQuote: 'Solicitar Cotización',
      contactUs: 'Contáctenos',
    },
  };

  const t = content.en;
  const policyItems = isEs ? t.policyItemsEs : t.policyItems;
  const protectionItems = isEs ? t.protectionItemsEs : t.protectionItems;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            {isEs ? t.title : content.en.title}
          </motion.h1>
          <p className="text-xl" style={{ color: COLORS.text.secondary }}>
            {isEs ? content.es.subtitle : content.en.subtitle}
          </p>
        </div>

        {/* Payment Methods Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: COLORS.primary }}>
            {isEs ? content.es.acceptedMethods : content.en.acceptedMethods}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${method.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: method.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: COLORS.text.primary }}>
                        {isEs ? method.nameEs : method.nameEn}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {isEs ? method.descriptionEs : method.descriptionEn}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Payment Details Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Zelle Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-8 h-8" style={{ color: '#6D1ED4' }} />
              <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {isEs ? content.es.zelleInfo : content.en.zelleInfo}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
                <span className="text-sm font-medium" style={{ color: COLORS.text.secondary }}>
                  {isEs ? content.es.zelleEmail : content.en.zelleEmail}
                </span>
                <span className="font-bold" style={{ color: '#6D1ED4' }}>iqesllc@gmail.com</span>
              </div>
              <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                {isEs 
                  ? 'Use este correo electrónico en su aplicación bancaria para enviar pagos Zelle.'
                  : 'Use this email in your banking app to send Zelle payments.'
                }
              </p>
            </div>
          </motion.div>

          {/* Bank Transfer Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8" style={{ color: '#117ACA' }} />
              <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {isEs ? content.es.bankInfo : content.en.bankInfo}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {isEs ? content.es.bankName : content.en.bankName}
                </span>
                <span className="font-semibold">Chase Bank</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {isEs ? content.es.accountName : content.en.accountName}
                </span>
                <span className="font-semibold">IQES LLC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {isEs ? content.es.accountNumber : content.en.accountNumber}
                </span>
                <span className="font-semibold">****0033</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-blue-100">
                <span className="text-sm" style={{ color: COLORS.text.secondary }}>
                  {isEs ? content.es.routingNumber : content.en.routingNumber}
                </span>
                <span className="font-semibold">267084131</span>
              </div>
              <p className="text-xs mt-2" style={{ color: COLORS.text.secondary }}>
                {isEs 
                  ? 'Contáctenos para obtener los datos completos de la cuenta para transferencias.'
                  : 'Contact us for complete account details for wire transfers.'
                }
              </p>
            </div>
          </motion.div>
        </div>

        {/* Deposit & Security Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 rounded-xl shadow-lg p-6 border border-orange-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8" style={{ color: COLORS.orange }} />
              <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {isEs ? content.es.depositInfo : content.en.depositInfo}
              </h3>
            </div>
            <p style={{ color: COLORS.text.secondary }}>
              {isEs ? content.es.depositDesc : content.en.depositDesc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {isEs ? content.es.securePayments : content.en.securePayments}
              </h3>
            </div>
            <p style={{ color: COLORS.text.secondary }}>
              {isEs ? content.es.secureDesc : content.en.secureDesc}
            </p>
          </motion.div>
        </div>

        {/* Policies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: COLORS.primary }}>
            <FileText className="w-7 h-7" style={{ color: COLORS.orange }} />
            {isEs ? content.es.policies : content.en.policies}
          </h2>
          <ul className="space-y-3">
            {policyItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLORS.orange }} />
                <span style={{ color: COLORS.text.secondary }}>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Customer Protection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl shadow-lg p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-7 h-7" />
            {isEs ? content.es.protectionTitle : content.en.protectionTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protectionItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-400" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Legal Notice */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 bg-gray-50 rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: COLORS.orange }} />
            <div>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>
                {isEs ? content.es.legalNotice : content.en.legalNotice}
              </h3>
              <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                {isEs ? t.legalTextEs : t.legalText}
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/quote">
            <Button
              size="lg"
              style={{ backgroundColor: COLORS.orange, color: 'white' }}
              className="hover:opacity-90 px-8"
            >
              {isEs ? content.es.requestQuote : content.en.requestQuote}
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="px-8"
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
            >
              {isEs ? content.es.contactUs : content.en.contactUs}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
