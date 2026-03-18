'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { MessageSquare, X, Globe, Phone, Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

type WidgetView = 'closed' | 'options' | 'chat';
type ChatMessage = {
  role: string;
  content: string;
  attachment?: {
    type: 'image' | 'document';
    name: string;
    url?: string;
  };
};

// Customer data collected during chat
interface CustomerData {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
}

export default function VapiVoiceWidget() {
  const { language, setLanguage } = useLanguage();
  const [view, setView] = useState<WidgetView>('closed');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'es'>(language as 'en' | 'es');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const hasAskedInactivityRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({ name: '', email: '', phone: '', city: '', service: '' });
  const followUpSentRef = useRef<boolean>(false);

  const translations = {
    en: {
      contactUs: 'Contact Us',
      chooseOption: 'How can we help you?',
      textChat: 'Start Chat',
      callUs: 'Call Us',
      selectLanguage: 'Select Language',
      chatPlaceholder: 'Type your message...',
      send: 'Send',
      welcome: "Hi! I'm Alex from IQES Low Voltage Solutions. May I have your name please?",
      english: 'English',
      spanish: 'Spanish',
      orCallUs: 'Or call us directly:',
      attachFile: 'Attach file',
      attachImage: 'Attach image',
      fileAttached: 'File attached',
      removeFile: 'Remove',
      inactivityMessage: "Are you still there? Is there anything else I can help you with?",
      servicesReminder: "Remember our services:\n• Fiber Optic Installation\n• CCTV Security Systems\n• Access Control\n• Structured Cabling\n• WiFi & Networking\n\nServing all of Florida!",
      uploadSupport: "You can share images or documents if you'd like. Just click the attachment button.",
      goodbyeMessage: "Thank you for contacting IQES Low Voltage Solutions!",
      servicesListReminder: "Our services:\n• Fiber Optic Installation & Repair\n• CCTV & Security Systems\n• Access Control Solutions\n• Structured Cabling (Cat5e, Cat6, Cat6a)\n• WiFi & Networking\n\nContact us:\nPhone: 386-603-9541\nEmail: info@iqeslowvoltage.com\nWhatsApp: 786-436-7307\n\nServing all 67 counties in Florida.\nYou'll receive your formal quote soon!",
    },
    es: {
      contactUs: 'Contáctenos',
      chooseOption: '¿Cómo podemos ayudarle?',
      textChat: 'Iniciar Chat',
      callUs: 'Llamar',
      selectLanguage: 'Seleccione Idioma',
      chatPlaceholder: 'Escriba su mensaje...',
      send: 'Enviar',
      welcome: '¡Hola! Soy Alex de IQES Low Voltage Solutions. ¿Me puede dar su nombre por favor?',
      english: 'Inglés',
      spanish: 'Español',
      orCallUs: 'O llámenos directamente:',
      attachFile: 'Adjuntar archivo',
      attachImage: 'Adjuntar imagen',
      fileAttached: 'Archivo adjunto',
      removeFile: 'Quitar',
      inactivityMessage: "¿Sigue ahí? ¿Hay algo más en lo que pueda ayudarle?",
      servicesReminder: "Recuerde nuestros servicios:\n• Instalación de Fibra Óptica\n• Sistemas CCTV y Seguridad\n• Control de Acceso\n• Cableado Estructurado\n• WiFi y Redes\n\n¡Servicio en toda Florida!",
      uploadSupport: "Puede compartir imágenes o documentos si lo desea. Solo haga clic en el botón de adjuntar.",
      goodbyeMessage: "¡Gracias por contactar a IQES Low Voltage Solutions!",
      servicesListReminder: "Nuestros servicios:\n• Instalación y Reparación de Fibra Óptica\n• Sistemas CCTV y Seguridad\n• Soluciones de Control de Acceso\n• Cableado Estructurado (Cat5e, Cat6, Cat6a)\n• WiFi y Redes\n\nContáctenos:\nTeléfono: 386-603-9541\nEmail: info@iqeslowvoltage.com\nWhatsApp: 786-436-7307\n\nServicio en los 67 condados de Florida.\n¡Pronto recibirá su cotización formal!",
    },
  };

  const t = translations[selectedLang] || translations.en;

  useEffect(() => {
    setSelectedLang(language as 'en' | 'es');
  }, [language]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoading]);

  // Extract customer data from messages
  const extractCustomerData = useCallback((messages: ChatMessage[]): Partial<CustomerData> => {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    const extracted: Partial<CustomerData> = {};

    // Extract email
    const emailMatch = userMessages.match(/[\w.-]+@[\w.-]+\.\w+/i);
    if (emailMatch) extracted.email = emailMatch[0];

    // Extract phone (various formats)
    const phoneMatch = userMessages.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
    if (phoneMatch) extracted.phone = phoneMatch[0];

    // Extract name (usually in first few messages)
    const firstUserMessages = messages.filter(m => m.role === 'user').slice(0, 3).map(m => m.content);
    for (const msg of firstUserMessages) {
      // Check for common name patterns
      const namePatterns = [
        /(?:my name is|me llamo|soy|i am|i'm)\s+([A-Za-zÀ-ÿ\s]+)/i,
        /^([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)$/i, // Just a name response
      ];
      for (const pattern of namePatterns) {
        const match = msg.match(pattern);
        if (match && match[1] && match[1].length > 1 && match[1].length < 50) {
          extracted.name = match[1].trim();
          break;
        }
      }
      if (extracted.name) break;
    }

    // Extract city (Florida cities)
    const cities = ['jacksonville', 'orlando', 'tampa', 'tallahassee', 'fort myers', 'miami', 'west palm beach', 'gainesville', 'sarasota', 'naples', 'pensacola', 'st. petersburg', 'clearwater', 'boca raton', 'fort lauderdale'];
    const lowerMessages = userMessages.toLowerCase();
    for (const city of cities) {
      if (lowerMessages.includes(city)) {
        extracted.city = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }

    // Extract service interest
    const services = [
      { keywords: ['fiber', 'fibra', 'optic', 'óptica'], name: 'Fiber Optic' },
      { keywords: ['cctv', 'camera', 'cámara', 'security', 'seguridad', 'surveillance', 'vigilancia'], name: 'CCTV/Security' },
      { keywords: ['access', 'acceso', 'control', 'lock', 'cerradura', 'biometric', 'biométrico'], name: 'Access Control' },
      { keywords: ['cable', 'cabling', 'cableado', 'cat5', 'cat6', 'network', 'red', 'ethernet'], name: 'Structured Cabling' },
      { keywords: ['wifi', 'wireless', 'inalámbrico', 'networking', 'redes'], name: 'Networking/WiFi' },
    ];
    for (const service of services) {
      if (service.keywords.some(k => lowerMessages.includes(k))) {
        extracted.service = service.name;
        break;
      }
    }

    return extracted;
  }, []);

  // Send follow-up email
  const sendFollowUpEmail = useCallback(async () => {
    if (followUpSentRef.current) return;
    
    const data = extractCustomerData(chatMessages);
    
    // Only send if we have at least an email
    if (!data.email) {
      console.log('No email found in conversation, skipping follow-up');
      return;
    }
    
    followUpSentRef.current = true;

    // Get conversation summary (last few exchanges)
    const recentMessages = chatMessages.slice(-6);
    const summary = recentMessages
      .map(m => `${m.role === 'user' ? 'Customer' : 'Alex'}: ${m.content}`)
      .join('\n');

    console.log('Sending follow-up email to:', data.email);

    try {
      const response = await fetch('/api/chat/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.name || 'Valued Customer',
          customerEmail: data.email,
          customerPhone: data.phone,
          city: data.city,
          serviceInterest: data.service || customerData.service,
          conversationSummary: summary,
          language: selectedLang,
        }),
      });
      const result = await response.json();
      console.log('Follow-up email result:', result);
    } catch (err) {
      console.error('Failed to send follow-up email:', err);
    }
  }, [chatMessages, customerData.service, selectedLang, extractCustomerData]);

  // Check for goodbye/end conversation patterns
  const checkForGoodbye = useCallback((message: string): boolean => {
    const goodbyePatterns = [
      /(?:gracias|thank|bye|adios|adiós|hasta luego|see you|goodbye|chao|ciao|nos vemos|later|that's all|eso es todo|perfect|perfecto|great|excelente|ok thanks|ok gracias)/i
    ];
    return goodbyePatterns.some(p => p.test(message));
  }, []);

  // Track if goodbye message was already sent
  const goodbyeSentRef = useRef<boolean>(false);

  // Monitor messages for email extraction and goodbye
  useEffect(() => {
    if (chatMessages.length > 3 && !goodbyeSentRef.current) {
      const lastUserMessage = [...chatMessages].reverse().find(m => m.role === 'user');
      if (lastUserMessage && checkForGoodbye(lastUserMessage.content)) {
        goodbyeSentRef.current = true;
        const currentT = translations[selectedLang] || translations.en;
        // Send goodbye message with services reminder
        setChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: currentT.goodbyeMessage },
          { role: 'assistant', content: currentT.servicesListReminder }
        ]);
        // Delay to allow final response then send follow-up email
        setTimeout(() => sendFollowUpEmail(), 3000);
      }
    }
  }, [chatMessages, checkForGoodbye, sendFollowUpEmail, selectedLang]);

  // Send follow-up when chat is closed (if email was collected)
  const handleCloseChat = useCallback(() => {
    if (chatMessages.length > 2) {
      // Show goodbye message with services if not already shown
      if (!goodbyeSentRef.current) {
        goodbyeSentRef.current = true;
        const currentT = translations[selectedLang] || translations.en;
        setChatMessages(prev => [
          ...prev,
          { role: 'assistant', content: currentT.goodbyeMessage },
          { role: 'assistant', content: currentT.servicesListReminder }
        ]);
      }
      sendFollowUpEmail();
    }
    // Delay close slightly to show the message
    setTimeout(() => setView('closed'), 500);
  }, [chatMessages.length, sendFollowUpEmail, selectedLang]);

  // Auto-close timer after 10 minutes of inactivity
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    hasAskedInactivityRef.current = false;
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Clear auto-close timer
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    
    // Set timer for 90 seconds (1.5 minutes) - ask if still there
    inactivityTimerRef.current = setTimeout(() => {
      if (view === 'chat' && !hasAskedInactivityRef.current && chatMessages.length > 1) {
        hasAskedInactivityRef.current = true;
        const currentT = translations[selectedLang] || translations.en;
        setChatMessages(prev => [
          ...prev, 
          { role: 'assistant', content: currentT.inactivityMessage }
        ]);
        
        // After asking, set 10-minute auto-close timer (no more messages)
        autoCloseTimerRef.current = setTimeout(() => {
          if (view === 'chat') {
            // Show goodbye message with services before closing
            if (!goodbyeSentRef.current) {
              goodbyeSentRef.current = true;
              const closeT = translations[selectedLang] || translations.en;
              setChatMessages(prev => [
                ...prev,
                { role: 'assistant', content: closeT.goodbyeMessage },
                { role: 'assistant', content: closeT.servicesListReminder }
              ]);
            }
            // Send follow-up email before closing
            sendFollowUpEmail();
            // Delay to show the message
            setTimeout(() => setView('closed'), 2000);
          }
        }, 600000); // 10 minutes = 600,000 ms
      }
    }, 90000); // 90 seconds
  }, [view, selectedLang, chatMessages.length, sendFollowUpEmail]);

  // Start inactivity timer when chat opens
  useEffect(() => {
    if (view === 'chat') {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [view, resetInactivityTimer]);

  const selectLanguage = (lang: 'en' | 'es') => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowFileOptions(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startChat = () => {
    setChatMessages([{ role: 'assistant', content: t.welcome }]);
    setView('chat');
    hasAskedInactivityRef.current = false;
    followUpSentRef.current = false;
    goodbyeSentRef.current = false;
    setCustomerData({ name: '', email: '', phone: '', city: '', service: '' });
  };

  const sendMessage = async () => {
    if ((!chatInput.trim() && !selectedFile) || isLoading) return;
    
    // Reset inactivity timer on user activity
    resetInactivityTimer();
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Create message with optional attachment
    const newUserMessage: ChatMessage = { 
      role: 'user', 
      content: userMessage || (selectedFile ? `[${selectedLang === 'es' ? 'Archivo adjunto' : 'File attached'}: ${selectedFile.name}]` : ''),
    };
    
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      newUserMessage.attachment = {
        type: isImage ? 'image' : 'document',
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
      };
    }
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // Prepare message for API
    let messageForApi = userMessage;
    if (selectedFile) {
      messageForApi = userMessage 
        ? `${userMessage} [${selectedLang === 'es' ? 'Cliente adjuntó archivo' : 'Customer attached file'}: ${selectedFile.name}]`
        : `[${selectedLang === 'es' ? 'Cliente adjuntó archivo' : 'Customer attached file'}: ${selectedFile.name}]`;
    }
    
    // Clear selected file
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageForApi,
          language: selectedLang,
          history: chatMessages.slice(-10),
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        
        // If language changed, update it
        if (data.detectedLanguage && data.detectedLanguage !== selectedLang) {
          setSelectedLang(data.detectedLanguage);
          setLanguage(data.detectedLanguage);
        }
      } else {
        const fallback = selectedLang === 'es'
          ? `Lo siento, hubo un problema. Llámenos al ${COMPANY.phone}.`
          : `Sorry, there was an issue. Please call us at ${COMPANY.phone}.`;
        setChatMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      }
    } catch {
      const fallback = selectedLang === 'es'
        ? `Lo siento, hubo un problema de conexión. Llámenos al ${COMPANY.phone}.`
        : `Sorry, connection issue. Please call us at ${COMPANY.phone}.`;
      setChatMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button - Closed State */}
      {view === 'closed' && (
        <button
          onClick={() => setView('options')}
          className="group flex items-center gap-3 bg-[#003366] hover:bg-[#002244] text-white px-5 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label={t.contactUs}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="font-semibold">{t.contactUs}</span>
        </button>
      )}

      {/* Options View - Language + Chat/Call options */}
      {view === 'options' && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-[320px] border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-[#003366] text-lg">IQES</h3>
              <p className="text-gray-500 text-sm">{t.chooseOption}</p>
            </div>
            <button onClick={() => setView('closed')} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> {t.selectLanguage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => selectLanguage('en')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedLang === 'en' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🇺🇸 {t.english}
              </button>
              <button
                onClick={() => selectLanguage('es')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedLang === 'es' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🇪🇸 {t.spanish}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Chat Button */}
            <button
              onClick={startChat}
              className="flex items-center justify-center gap-2 bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              {t.textChat}
            </button>

            {/* Divider with phone */}
            <div className="text-center">
              <p className="text-sm text-gray-500 my-2">{t.orCallUs}</p>
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <Phone className="w-5 h-5" />
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Chat View */}
      {view === 'chat' && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[480px] flex flex-col border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#003366] text-white px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold">IQES Chat</h3>
              <p className="text-xs text-white/70">Low Voltage Solutions</p>
            </div>
            <button onClick={handleCloseChat} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#003366] text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {/* Show attachment if present */}
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.type === 'image' && msg.attachment.url ? (
                        <img 
                          src={msg.attachment.url} 
                          alt={msg.attachment.name}
                          className="max-w-full rounded-lg max-h-32 object-cover"
                        />
                      ) : (
                        <div className="flex items-center gap-2 bg-white/20 rounded px-2 py-1 text-xs">
                          <Paperclip className="w-3 h-3" />
                          {msg.attachment.name}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Phone number banner */}
          <a
            href={`tel:${COMPANY.phone}`}
            className="mx-4 mb-2 flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Phone className="w-4 h-4" />
            {t.callUs}: {COMPANY.phone}
          </a>

          {/* Selected file preview */}
          {selectedFile && (
            <div className="mx-3 mb-2 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-[#003366]" />
                ) : (
                  <Paperclip className="w-4 h-4 text-[#003366]" />
                )}
                <span className="truncate max-w-[180px]">{selectedFile.name}</span>
              </div>
              <button
                onClick={removeFile}
                className="text-red-500 text-xs hover:text-red-700"
              >
                {t.removeFile}
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2 items-center">
              {/* Attachment button */}
              <div className="relative">
                <button
                  onClick={() => setShowFileOptions(!showFileOptions)}
                  className="p-2 text-gray-500 hover:text-[#003366] transition-colors"
                  title={t.attachFile}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                {/* File options dropdown */}
                {showFileOptions && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                      <ImageIcon className="w-4 h-4" />
                      {t.attachImage}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, 'image')}
                        ref={fileInputRef}
                      />
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                      <Paperclip className="w-4 h-4" />
                      {t.attachFile}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, 'document')}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <input
                type="text"
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  resetInactivityTimer();
                }}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t.chatPlaceholder}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#003366]"
              />
              <button
                onClick={sendMessage}
                disabled={(!chatInput.trim() && !selectedFile) || isLoading}
                className="bg-[#003366] hover:bg-[#002244] disabled:bg-gray-300 text-white p-2 rounded-xl transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close file options */}
      {showFileOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowFileOptions(false)}
        />
      )}
    </div>
  );
}
