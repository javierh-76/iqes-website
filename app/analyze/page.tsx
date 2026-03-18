'use client';

import { useLanguage } from '@/contexts/language-context';
import DocumentAnalyzer from '@/components/document-analyzer';
import { motion } from 'framer-motion';
import { FileSearch, Zap, Clock, Shield } from 'lucide-react';

export default function AnalyzePage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      heroTitle: 'Instant Project Analysis',
      heroSubtitle: 'Upload your blueprints, plans, or project images and get AI-powered insights in seconds',
      features: [
        {
          icon: FileSearch,
          title: 'Smart Analysis',
          description: 'Our AI analyzes your documents to identify project requirements and specifications.',
        },
        {
          icon: Zap,
          title: 'Instant Results',
          description: 'Get detailed insights and recommendations within seconds, not days.',
        },
        {
          icon: Clock,
          title: 'Save Time',
          description: 'Skip the back-and-forth. We understand your project before the first call.',
        },
        {
          icon: Shield,
          title: 'Secure & Private',
          description: 'Your documents are processed securely and never shared with third parties.',
        },
      ],
      supportedTitle: 'What You Can Upload',
      supported: [
        'Floor plans and blueprints',
        'Site photos and images',
        'Project specifications (PDF)',
        'Network diagrams',
        'Existing system documentation',
      ],
    },
    es: {
      heroTitle: 'Análisis Instantáneo de Proyectos',
      heroSubtitle: 'Sube tus planos, blueprints o imágenes del proyecto y obtén insights con IA en segundos',
      features: [
        {
          icon: FileSearch,
          title: 'Análisis Inteligente',
          description: 'Nuestra IA analiza tus documentos para identificar requisitos y especificaciones.',
        },
        {
          icon: Zap,
          title: 'Resultados Instantáneos',
          description: 'Obtén insights detallados y recomendaciones en segundos, no días.',
        },
        {
          icon: Clock,
          title: 'Ahorra Tiempo',
          description: 'Evita idas y vueltas. Entendemos tu proyecto antes de la primera llamada.',
        },
        {
          icon: Shield,
          title: 'Seguro y Privado',
          description: 'Tus documentos se procesan de forma segura y nunca se comparten con terceros.',
        },
      ],
      supportedTitle: 'Qué Puedes Subir',
      supported: [
        'Planos de piso y blueprints',
        'Fotos e imágenes del sitio',
        'Especificaciones del proyecto (PDF)',
        'Diagramas de red',
        'Documentación de sistemas existentes',
      ],
    },
  };

  const t = translations[language as 'en' | 'es'] || translations['en'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section
        className="py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #003366 0%, #004080 100%)' }}
      >
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            {t.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 -mt-8">
        <div className="container mx-auto">
          <DocumentAnalyzer />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {t.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#003366]/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-[#003366]" />
                </div>
                <h3 className="font-bold text-[#003366] mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Files */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-[#003366] text-center mb-8">{t.supportedTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.supported.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200"
              >
                <div className="w-2 h-2 rounded-full bg-[#00A651]" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
