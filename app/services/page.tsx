'use client';

import { useLanguage } from '@/contexts/language-context';
import { Cable, Camera, Network, KeyRound, Radio, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const content = {
    en: {
      title: 'Our Services',
      subtitle: 'Comprehensive low voltage and telecommunications solutions',
      services: [
        {
          icon: Radio,
          href: '/services/fiber-optic',
          title: 'Fiber Optic',
          description: 'Complete fiber optic solutions for FTTH, FTTB, and FTTP deployments. Professional fusion splicing, OTDR testing, and certification.',
          benefits: ['High Speed', 'Greater Bandwidth', 'Long Distance Without Loss', 'Electromagnetic Immunity'],
          applications: ['Data Centers', 'Corporate Networks', 'FTTH Networks', 'Telecommunications Infrastructure'],
        },
        {
          icon: Camera,
          href: '/services/cctv',
          title: 'CCTV & Video Surveillance',
          description: 'Professional IP video surveillance: 4K/8MP cameras, PTZ domes, thermal imaging, and AI analytics with LPR.',
          benefits: ['24/7 Monitoring', 'AI Analytics', 'Remote Access', 'Cloud Storage'],
          applications: ['Retail', 'Hospitality', 'Warehouses', 'Multi-site Deployments'],
        },
        {
          icon: Cable,
          href: '/services/structured-cabling',
          title: 'Structured Cabling',
          description: 'Enterprise-grade network infrastructure with Cat6, Cat6a, and Cat7 cabling for voice and data.',
          benefits: ['Organized Infrastructure', 'Easy Maintenance', 'Scalable Design', 'Industry Standards'],
          applications: ['Data Centers', 'Educational Facilities', 'Large Facilities', 'Cat6/Cat6A/Cat7 Implementations'],
        },
        {
          icon: KeyRound,
          href: '/services/access-control',
          title: 'Access Control',
          description: 'Comprehensive security: card readers, biometric systems, keypads, intercoms, and CCTV integration.',
          benefits: ['Enhanced Security', 'Audit Trail', 'Mobile Credentials', 'Cloud Management'],
          applications: ['Corporate Offices', 'Healthcare Facilities', 'Government Buildings', 'Multi-tenant Properties'],
        },
        {
          icon: Network,
          href: '/services/networking',
          title: 'Networking Solutions',
          description: 'End-to-end network infrastructure: switches, routers, wireless APs, firewalls, and enterprise WiFi.',
          benefits: ['High Performance', 'Secure Connectivity', 'Scalable Architecture', 'Remote Management'],
          applications: ['Enterprise Networks', 'Campus WiFi', 'VPN Solutions', 'Network Segmentation'],
        },
      ],
    },
    es: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones integrales en cableado estructurado y telecomunicaciones',
      services: [
        {
          icon: Radio,
          href: '/services/fiber-optic',
          title: 'Fibra Óptica',
          description: 'Soluciones completas de fibra óptica para FTTH, FTTB y FTTP. Empalme por fusión profesional, pruebas OTDR y certificación.',
          benefits: ['Alta Velocidad', 'Mayor Ancho de Banda', 'Mayor Distancia sin Pérdida', 'Inmunidad a Interferencias'],
          applications: ['Centros de Datos', 'Redes Corporativas', 'Redes FTTH', 'Infraestructura de Telecomunicaciones'],
        },
        {
          icon: Camera,
          href: '/services/cctv',
          title: 'CCTV y Videovigilancia',
          description: 'Videovigilancia IP profesional: cámaras 4K/8MP, domos PTZ, imagen térmica y analíticos IA con LPR.',
          benefits: ['Monitoreo 24/7', 'Analíticos IA', 'Acceso Remoto', 'Almacenamiento Nube'],
          applications: ['Retail', 'Hotelería', 'Almacenes', 'Despliegues Multi-sitio'],
        },
        {
          icon: Cable,
          href: '/services/structured-cabling',
          title: 'Cableado Estructurado',
          description: 'Infraestructura de red empresarial con cableado Cat6, Cat6a y Cat7 para voz y datos.',
          benefits: ['Infraestructura Organizada', 'Mantenimiento Fácil', 'Diseño Escalable', 'Estándares de la Industria'],
          applications: ['Centros de Datos', 'Instalaciones Educativas', 'Grandes Superficies', 'Implementaciones Cat6/Cat6A/Cat7'],
        },
        {
          icon: KeyRound,
          href: '/services/access-control',
          title: 'Control de Acceso',
          description: 'Seguridad completa: lectores de tarjetas, biométricos, teclados, intercomunicadores e integración CCTV.',
          benefits: ['Seguridad Mejorada', 'Registro de Auditoría', 'Credenciales Móviles', 'Gestión en Nube'],
          applications: ['Oficinas Corporativas', 'Instalaciones de Salud', 'Edificios Gubernamentales', 'Propiedades Multi-inquilino'],
        },
        {
          icon: Network,
          href: '/services/networking',
          title: 'Soluciones de Redes',
          description: 'Infraestructura de red completa: switches, routers, APs inalámbricos, firewalls y WiFi empresarial.',
          benefits: ['Alto Rendimiento', 'Conectividad Segura', 'Arquitectura Escalable', 'Gestión Remota'],
          applications: ['Redes Empresariales', 'WiFi de Campus', 'Soluciones VPN', 'Segmentación de Red'],
        },
      ],
    },
  };

  const t = content[language as 'en' | 'es'] || content.en;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: COLORS.primary }}>
            {t.title}
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: COLORS.text.secondary }}>
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {t.services.map((service, index) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${COLORS.orange}15` }}
                >
                  <service.icon className="w-7 h-7" style={{ color: COLORS.orange }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.primary }}>
                    {service.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: COLORS.accent }}>
                    {isEs ? 'Beneficios' : 'Benefits'}
                  </h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.text.secondary }}>
                        <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.accent }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: COLORS.orange }}>
                    {isEs ? 'Aplicaciones' : 'Applications'}
                  </h4>
                  <ul className="space-y-1">
                    {service.applications.map((app, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.text.secondary }}>
                        <Zap className="w-3 h-3 flex-shrink-0" style={{ color: COLORS.orange }} />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Link 
                  href={service.href}
                  className="flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: COLORS.primary }}
                >
                  {isEs ? 'Ver más' : 'Learn more'} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/quote"
                  className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: COLORS.orange, color: COLORS.white }}
                >
                  {isEs ? 'Solicitar Cotización' : 'Request Quote'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
