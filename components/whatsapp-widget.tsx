'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { MessageCircle, X, Send, Globe } from 'lucide-react';

export default function WhatsAppWidget() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'es'>(language as 'en' | 'es');

  // WhatsApp Business number (use international format without +)
  const WHATSAPP_NUMBER = '17864367307'; // Main WhatsApp business line

  useEffect(() => {
    setSelectedLang(language as 'en' | 'es');
  }, [language]);

  const selectLanguage = (lang: 'en' | 'es') => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const t = {
    en: {
      title: 'WhatsApp Us',
      subtitle: 'Quick response via WhatsApp',
      selectLanguage: 'Language',
      english: 'English',
      spanish: 'Español',
      name: 'Your Name',
      service: 'Service Needed',
      selectService: 'Select a service...',
      message: 'Additional details (optional)',
      send: 'Start Chat',
      services: [
        { value: 'fiber', label: 'Fiber Optic Installation' },
        { value: 'cctv', label: 'CCTV / Security Cameras' },
        { value: 'cabling', label: 'Structured Cabling' },
        { value: 'access', label: 'Access Control' },
        { value: 'network', label: 'Networking' },
        { value: 'quote', label: 'General Quote' },
        { value: 'other', label: 'Other' },
      ],
      greeting: 'Hello IQES! My name is',
      interested: 'I\'m interested in',
      details: 'Details',
    },
    es: {
      title: 'WhatsApp',
      subtitle: 'Respuesta rápida por WhatsApp',
      selectLanguage: 'Idioma',
      english: 'English',
      spanish: 'Español',
      name: 'Su Nombre',
      service: 'Servicio Necesitado',
      selectService: 'Seleccione un servicio...',
      message: 'Detalles adicionales (opcional)',
      send: 'Iniciar Chat',
      services: [
        { value: 'fiber', label: 'Instalación de Fibra Óptica' },
        { value: 'cctv', label: 'CCTV / Cámaras de Seguridad' },
        { value: 'cabling', label: 'Cableado Estructurado' },
        { value: 'access', label: 'Control de Acceso' },
        { value: 'network', label: 'Redes' },
        { value: 'quote', label: 'Cotización General' },
        { value: 'other', label: 'Otro' },
      ],
      greeting: '¡Hola IQES! Mi nombre es',
      interested: 'Estoy interesado en',
      details: 'Detalles',
    },
  };

  const text = t[selectedLang] || t.en;
  const phoneNumber = WHATSAPP_NUMBER;

  const handleSendWhatsApp = () => {
    const serviceName = text.services.find(s => s.value === selectedService)?.label || selectedService;
    
    let message = `${text.greeting} ${name || 'a potential client'}.\n\n`;
    if (selectedService) {
      message += `${text.interested}: ${serviceName}\n\n`;
    }
    if (customMessage) {
      message += `${text.details}: ${customMessage}`;
    }

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating WhatsApp Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" fill="white" />
          <span className="font-semibold hidden sm:inline">WhatsApp</span>
        </button>
      )}

      {/* WhatsApp Form Modal */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[320px] border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <MessageCircle className="w-5 h-5" fill="white" />
              <div>
                <h3 className="font-bold text-sm">{text.title}</h3>
                <p className="text-xs opacity-90">{text.subtitle}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Language Selector */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {text.selectLanguage}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => selectLanguage('en')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedLang === 'en' 
                      ? 'bg-[#25D366] text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🇺🇸 {text.english}
                </button>
                <button
                  onClick={() => selectLanguage('es')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedLang === 'es' 
                      ? 'bg-[#25D366] text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🇪🇸 {text.spanish}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {text.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                placeholder={selectedLang === 'es' ? 'Juan Pérez' : 'John Doe'}
              />
            </div>

            {/* Service */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {text.service}
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent bg-white"
              >
                <option value="">{text.selectService}</option>
                {text.services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {text.message}
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none"
                placeholder={selectedLang === 'es' ? 'Ubicación, urgencia, etc...' : 'Location, urgency, etc...'}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendWhatsApp}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all"
            >
              <Send className="w-5 h-5" />
              {text.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
