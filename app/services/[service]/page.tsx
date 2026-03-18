'use client';

import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { COLORS } from '@/lib/constants';
import { Radio, Camera, Cable, KeyRound, Network, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ServiceDetailPage() {
  const params = useParams();
  const service = params?.service as string;
  const { language } = useLanguage();
  const isEs = language === 'es';

  const serviceData: Record<string, any> = {
    'fiber-optic': {
      icon: Radio,
      title: isEs ? 'Fibra Óptica' : 'Fiber Optic',
      description: isEs 
        ? 'Soluciones completas de fibra óptica para FTTH, FTTB y FTTP. Empalme por fusión profesional, pruebas OTDR y certificación.'
        : 'Complete fiber optic solutions for FTTH, FTTB, and FTTP deployments. Professional fusion splicing, OTDR testing, and certification.',
      benefits: isEs 
        ? ['Alta Velocidad', 'Mayor Ancho de Banda', 'Mayor Distancia sin Pérdida', 'Inmunidad a Interferencias Electromagnéticas']
        : ['High Speed', 'Greater Bandwidth', 'Long Distance Without Loss', 'Electromagnetic Immunity'],
      applications: isEs
        ? ['Centros de Datos', 'Redes Corporativas', 'Redes FTTH', 'Infraestructura de Telecomunicaciones']
        : ['Data Centers', 'Corporate Networks', 'FTTH Networks', 'Telecommunications Infrastructure'],
    },
    'cctv': {
      icon: Camera,
      title: isEs ? 'CCTV y Videovigilancia' : 'CCTV & Video Surveillance',
      description: isEs
        ? 'Videovigilancia IP profesional: cámaras 4K/8MP, domos PTZ, imagen térmica y analíticos IA con LPR.'
        : 'Professional IP video surveillance: 4K/8MP cameras, PTZ domes, thermal imaging, and AI analytics with LPR.',
      benefits: isEs
        ? ['Monitoreo 24/7', 'Analíticos IA', 'Acceso Remoto', 'Almacenamiento en Nube']
        : ['24/7 Monitoring', 'AI Analytics', 'Remote Access', 'Cloud Storage'],
      applications: isEs
        ? ['Retail', 'Hotelería', 'Almacenes', 'Despliegues Multi-sitio']
        : ['Retail', 'Hospitality', 'Warehouses', 'Multi-site Deployments'],
    },
    'structured-cabling': {
      icon: Cable,
      title: isEs ? 'Cableado Estructurado' : 'Structured Cabling',
      description: isEs
        ? 'Infraestructura de red empresarial con cableado Cat6, Cat6a y Cat7 para voz y datos.'
        : 'Enterprise-grade network infrastructure with Cat6, Cat6a, and Cat7 cabling for voice and data.',
      benefits: isEs
        ? ['Infraestructura Organizada', 'Mantenimiento Fácil', 'Diseño Escalable', 'Estándares de la Industria']
        : ['Organized Infrastructure', 'Easy Maintenance', 'Scalable Design', 'Industry Standards'],
      applications: isEs
        ? ['Centros de Datos', 'Instalaciones Educativas', 'Grandes Superficies', 'Implementaciones Cat6/Cat6A/Cat7']
        : ['Data Centers', 'Educational Facilities', 'Large Facilities', 'Cat6/Cat6A/Cat7 Implementations'],
    },
    'access-control': {
      icon: KeyRound,
      title: isEs ? 'Control de Acceso' : 'Access Control',
      description: isEs
        ? 'Seguridad completa: lectores de tarjetas, biométricos, teclados, intercomunicadores e integración CCTV.'
        : 'Comprehensive security: card readers, biometric systems, keypads, intercoms, and CCTV integration.',
      benefits: isEs
        ? ['Seguridad Mejorada', 'Registro de Auditoría', 'Credenciales Móviles', 'Gestión en Nube']
        : ['Enhanced Security', 'Audit Trail', 'Mobile Credentials', 'Cloud Management'],
      applications: isEs
        ? ['Oficinas Corporativas', 'Instalaciones de Salud', 'Edificios Gubernamentales', 'Propiedades Multi-inquilino']
        : ['Corporate Offices', 'Healthcare Facilities', 'Government Buildings', 'Multi-tenant Properties'],
    },
    'networking': {
      icon: Network,
      title: isEs ? 'Soluciones de Redes' : 'Networking Solutions',
      description: isEs
        ? 'Infraestructura de red completa: switches, routers, APs inalámbricos, firewalls y WiFi empresarial.'
        : 'End-to-end network infrastructure: switches, routers, wireless APs, firewalls, and enterprise WiFi.',
      benefits: isEs
        ? ['Alto Rendimiento', 'Conectividad Segura', 'Arquitectura Escalable', 'Gestión Remota']
        : ['High Performance', 'Secure Connectivity', 'Scalable Architecture', 'Remote Management'],
      applications: isEs
        ? ['Redes Empresariales', 'WiFi de Campus', 'Soluciones VPN', 'Segmentación de Red']
        : ['Enterprise Networks', 'Campus WiFi', 'VPN Solutions', 'Network Segmentation'],
    },
  };

  const data = serviceData[service];
  if (!data) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 style={{ color: COLORS.primary }}>Service Not Found</h1>
          <Link href="/services">
            <Button className="mt-4" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${COLORS.accent}15` }}>
              <Icon className="h-12 w-12" style={{ color: COLORS.accent }} />
            </div>
            <h1 style={{ color: COLORS.primary }}>{data.title}</h1>
          </div>
          <p className="text-xl" style={{ color: COLORS.text.secondary }}>
            {data.description}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>
            {isEs ? 'Beneficios' : 'Benefits'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.benefits.map((benefit: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: COLORS.accent }} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.primary }}>
            {isEs ? 'Aplicaciones' : 'Applications'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.applications.map((app: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: COLORS.accent }} />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/quote">
            <Button size="lg" style={{ backgroundColor: COLORS.orange, color: COLORS.white }}>
              {isEs ? 'Solicitar Cotización' : 'Request a Quote'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
