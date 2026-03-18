'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { COLORS, COMPANY } from '@/lib/constants';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, FileText, CreditCard, Building2, 
  Phone, Mail, AlertCircle, Loader2, Calendar, DollarSign,
  ArrowRight, Shield, Download
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LineItem {
  description: string;
  descriptionEs?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  token: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  services: string[];
  description: string;
  descriptionEs?: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  depositPercent: number;
  depositAmount: number;
  totalAmount: number;
  status: string;
  expiresAt?: string;
  approvedAt?: string;
  depositPaidAt?: string;
  clientNotes?: string;
  validDays: number;
}

export default function QuotePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isEs = language === 'es';
  const token = params.token as string;
  const cancelled = searchParams.get('cancelled');
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [token]);

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${token}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Quote not found');
      } else {
        setQuote(data.quote);
      }
    } catch (err) {
      setError('Failed to load quote');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await fetch(`/api/quotes/${token}/approve`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setQuote(prev => prev ? { ...prev, status: 'approved', approvedAt: new Date().toISOString() } : null);
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (err) {
      alert('Failed to approve quote');
    } finally {
      setApproving(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/quotes/${token}/pay`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create payment');
        setPaying(false);
      }
    } catch (err) {
      alert('Failed to initiate payment');
      setPaying(false);
    }
  };

  const isExpired = quote?.expiresAt && new Date() > new Date(quote.expiresAt);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: COLORS.primary }} />
          <p className="mt-4 text-gray-600">{isEs ? 'Cargando cotización...' : 'Loading quote...'}</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isEs ? 'Cotización No Encontrada' : 'Quote Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isEs 
              ? 'Esta cotización no existe o el enlace ha expirado.'
              : 'This quote does not exist or the link has expired.'}
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: COLORS.primary }}
          >
            {isEs ? 'Contáctenos' : 'Contact Us'}
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string; bg: string; icon: any; label: string; labelEs: string }> = {
    draft: { color: 'text-gray-600', bg: 'bg-gray-100', icon: FileText, label: 'Draft', labelEs: 'Borrador' },
    sent: { color: 'text-blue-600', bg: 'bg-blue-100', icon: Mail, label: 'Sent', labelEs: 'Enviada' },
    viewed: { color: 'text-purple-600', bg: 'bg-purple-100', icon: FileText, label: 'Viewed', labelEs: 'Vista' },
    approved: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, label: 'Approved', labelEs: 'Aprobada' },
    deposit_paid: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: DollarSign, label: 'Deposit Paid', labelEs: 'Depósito Pagado' },
    completed: { color: 'text-teal-600', bg: 'bg-teal-100', icon: CheckCircle, label: 'Completed', labelEs: 'Completada' },
    expired: { color: 'text-red-600', bg: 'bg-red-100', icon: Clock, label: 'Expired', labelEs: 'Expirada' },
    declined: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, label: 'Declined', labelEs: 'Rechazada' }
  };

  const status = statusConfig[quote.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto">
        {/* Cancelled Notice */}
        {cancelled && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              {isEs ? 'El pago fue cancelado. Puede intentarlo de nuevo cuando esté listo.' : 'Payment was cancelled. You can try again when ready.'}
            </p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
        >
          <div className="p-6" style={{ backgroundColor: COLORS.primary }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-32 bg-white rounded p-2">
                  <Image
                    src="/iqes-logo.png"
                    alt="IQES Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-bold">{isEs ? 'Cotización Profesional' : 'Professional Quote'}</h1>
                  <p className="text-white/80 text-sm">{quote.quoteNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-semibold">{isEs ? status.labelEs : status.label}</span>
                </div>
                <a
                  href={`/api/quotes/${token}/pdf`}
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
                  title={isEs ? 'Descargar PDF' : 'Download PDF'}
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">PDF</span>
                </a>
              </div>
            </div>
          </div>

          {/* Expired Banner */}
          {isExpired && quote.status !== 'deposit_paid' && quote.status !== 'completed' && (
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                {isEs 
                  ? 'Esta cotización ha expirado. Por favor contáctenos para una nueva cotización.'
                  : 'This quote has expired. Please contact us for a new quote.'}
              </p>
            </div>
          )}

          {/* Client Info */}
          <div className="p-6 border-b">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{isEs ? 'Preparado Para' : 'Prepared For'}</h3>
                <p className="font-medium text-gray-900">{quote.clientName}</p>
                {quote.companyName && <p className="text-gray-600">{quote.companyName}</p>}
                <p className="text-gray-600">{quote.clientEmail}</p>
                {quote.clientPhone && <p className="text-gray-600">{quote.clientPhone}</p>}
              </div>
              <div className="text-right">
                <div className="inline-block text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{isEs ? 'Válida hasta:' : 'Valid until:'}</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {quote.expiresAt ? new Date(quote.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">{isEs ? 'Servicios' : 'Services'}</h3>
            <div className="flex flex-wrap gap-2">
              {quote.services.map((service, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: COLORS.orange }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">{isEs ? 'Descripción del Proyecto' : 'Project Description'}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {isEs && quote.descriptionEs ? quote.descriptionEs : quote.description}
            </p>
          </div>

          {/* Line Items */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">{isEs ? 'Desglose de Precios' : 'Price Breakdown'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white" style={{ backgroundColor: COLORS.primary }}>
                    <th className="p-3 text-left">{isEs ? 'Descripción' : 'Description'}</th>
                    <th className="p-3 text-center">{isEs ? 'Cant.' : 'Qty'}</th>
                    <th className="p-3 text-right">{isEs ? 'Precio Unit.' : 'Unit Price'}</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lineItems.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{isEs && item.descriptionEs ? item.descriptionEs : item.description}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-b">
                    <td colSpan={3} className="p-3 text-right font-medium">Subtotal:</td>
                    <td className="p-3 text-right">${quote.subtotal.toFixed(2)}</td>
                  </tr>
                  {quote.taxAmount > 0 && (
                    <tr className="border-b">
                      <td colSpan={3} className="p-3 text-right">{isEs ? 'Impuesto' : 'Tax'} ({quote.taxRate}%):</td>
                      <td className="p-3 text-right">${quote.taxAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="text-white font-bold" style={{ backgroundColor: COLORS.primary }}>
                    <td colSpan={3} className="p-3 text-right">Total:</td>
                    <td className="p-3 text-right">${quote.totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="text-white font-bold" style={{ backgroundColor: COLORS.orange }}>
                    <td colSpan={3} className="p-3 text-right">
                      {isEs ? `Depósito Requerido (${quote.depositPercent}%):` : `Deposit Required (${quote.depositPercent}%):`}
                    </td>
                    <td className="p-3 text-right">${quote.depositAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Client Notes */}
          {quote.clientNotes && (
            <div className="p-6 border-b bg-blue-50">
              <h3 className="font-semibold text-gray-900 mb-2">{isEs ? 'Notas Adicionales' : 'Additional Notes'}</h3>
              <p className="text-gray-700">{quote.clientNotes}</p>
            </div>
          )}

          {/* Actions */}
          {!isExpired && !['deposit_paid', 'completed', 'declined'].includes(quote.status) && (
            <div className="p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {quote.status === 'approved' ? (
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: COLORS.orange }}
                  >
                    {paying ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        {isEs ? `Pagar Depósito $${quote.depositAmount.toFixed(2)}` : `Pay Deposit $${quote.depositAmount.toFixed(2)}`}
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={approving}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
                      style={{ backgroundColor: '#28a745' }}
                    >
                      {approving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          {isEs ? 'Aprobar Cotización' : 'Approve Quote'}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
                      style={{ backgroundColor: COLORS.orange }}
                    >
                      {paying ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6" />
                          {isEs ? 'Aprobar y Pagar' : 'Approve & Pay'}
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
              
              {/* Alternative Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-3">
                  {isEs ? 'También aceptamos otros métodos de pago:' : 'We also accept other payment methods:'}
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Image src="/payments/zelle-logo.png" alt="Zelle" width={40} height={20} className="object-contain" />
                    <span>iqesllc@gmail.com</span>
                  </div>
                  <Link href="/payments" className="text-sm text-blue-600 hover:underline">
                    {isEs ? 'Ver todos los métodos de pago' : 'View all payment methods'}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Paid Status */}
          {quote.status === 'deposit_paid' && (
            <div className="p-6 bg-emerald-50 border-t-4 border-emerald-500">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">
                  {isEs ? '¡Depósito Recibido!' : 'Deposit Received!'}
                </h3>
                <p className="text-emerald-600 mb-4">
                  {isEs 
                    ? 'Gracias por su pago. Nuestro equipo se comunicará pronto para programar su proyecto.'
                    : 'Thank you for your payment. Our team will contact you shortly to schedule your project.'}
                </p>
                <p className="text-gray-600">
                  {isEs ? 'Balance restante:' : 'Remaining balance:'} <strong>${(quote.totalAmount - quote.depositAmount).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} />
              <p className="font-semibold text-gray-900">{isEs ? 'Pago Seguro' : 'Secure Payment'}</p>
              <p className="text-sm text-gray-600">{isEs ? 'Encriptación SSL' : 'SSL Encrypted'}</p>
            </div>
            <div>
              <Building2 className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} />
              <p className="font-semibold text-gray-900">{isEs ? 'Licenciado y Asegurado' : 'Licensed & Insured'}</p>
              <p className="text-sm text-gray-600">Florida</p>
            </div>
            <div>
              <Clock className="w-10 h-10 mx-auto mb-2" style={{ color: COLORS.primary }} />
              <p className="font-semibold text-gray-900">{isEs ? '+13 Años' : '+13 Years'}</p>
              <p className="text-sm text-gray-600">{isEs ? 'De experiencia' : 'Experience'}</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <h3 className="font-semibold text-gray-900 mb-4">{isEs ? '¿Preguntas?' : 'Questions?'}</h3>
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
              info@iqeslowvoltage.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
