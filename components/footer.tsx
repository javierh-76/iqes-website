'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { COLORS, COMPANY } from '@/lib/constants';

export function Footer() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const quickLinks = [
    { name: isEs ? 'Inicio' : 'Home', href: '/' },
    { name: isEs ? 'Servicios' : 'Services', href: '/services' },
    { name: isEs ? 'Áreas de Servicio' : 'Service Areas', href: '/service-areas' },
    { name: isEs ? 'Proyectos' : 'Projects', href: '/projects' },
    { name: isEs ? 'Contacto' : 'Contact', href: '/contact' },
  ];

  // Product brands for SEO - keywords for low voltage industry
  const productBrands = [
    { 
      name: 'CommScope', 
      category: 'Fiber & Cabling', 
      logo: 'https://cdn.abacus.ai/images/ec528f17-995e-4d94-9ae0-4dbf24372234.png',
      descriptionEn: 'Fiber optic infrastructure, data center cabling, enterprise connectivity solutions',
      descriptionEs: 'Infraestructura de fibra óptica, cableado de centros de datos, soluciones de conectividad empresarial'
    },
    { 
      name: 'Panduit', 
      category: 'Structured Cabling', 
      logo: 'https://cdn.abacus.ai/images/97610b4e-6e6a-46f7-a127-a769c79c9ace.png',
      descriptionEn: 'Structured cabling systems, cable management, patch panels, server rack solutions',
      descriptionEs: 'Sistemas de cableado estructurado, gestión de cables, patch panels, soluciones de rack'
    },
    { 
      name: 'Corning', 
      category: 'Fiber Optic', 
      logo: 'https://cdn.abacus.ai/images/422c6eae-5709-4e2c-9ecf-1c5ae7daf8c1.png',
      descriptionEn: 'Single-mode & multi-mode fiber, optical cables, fiber termination & splicing',
      descriptionEs: 'Fibra monomodo y multimodo, cables ópticos, terminación y empalme de fibra'
    },
    { 
      name: 'Fluke', 
      category: 'Testing Equipment', 
      logo: 'https://cdn.abacus.ai/images/331e526a-0c9d-477e-bcf1-b7eb924a651e.png',
      descriptionEn: 'Network certification, cable testing, fiber optic verification & diagnostics',
      descriptionEs: 'Certificación de redes, pruebas de cableado, verificación y diagnóstico de fibra óptica'
    },
    { 
      name: 'Axis', 
      category: 'CCTV Cameras', 
      logo: 'https://cdn.abacus.ai/images/cfa99170-3514-4470-b040-b3e3f002690d.png',
      descriptionEn: 'IP surveillance cameras, video analytics, enterprise security monitoring',
      descriptionEs: 'Cámaras IP de vigilancia, análisis de video, monitoreo de seguridad empresarial'
    },
    { 
      name: 'Hikvision', 
      category: 'Security Systems', 
      logo: 'https://cdn.abacus.ai/images/46dfb78e-48f0-46e0-92ee-0e2069a5ccb1.png',
      descriptionEn: 'CCTV systems, NVR/DVR recorders, AI-powered video surveillance',
      descriptionEs: 'Sistemas CCTV, grabadores NVR/DVR, vigilancia de video con inteligencia artificial'
    },
    { 
      name: 'Avigilon', 
      category: 'CCTV Solutions', 
      logo: 'https://cdn.abacus.ai/images/ead54ba6-4844-4eb4-a2d4-9a2046b59a16.png',
      descriptionEn: 'Advanced video analytics, high-definition surveillance, access control integration',
      descriptionEs: 'Análisis de video avanzado, vigilancia en alta definición, integración de control de acceso'
    },
    { 
      name: 'Cisco', 
      category: 'Networking', 
      logo: 'https://cdn.abacus.ai/images/25815622-3030-4c23-86f2-17a4e5778fb8.png',
      descriptionEn: 'Enterprise networking, switches, routers, unified communications systems',
      descriptionEs: 'Redes empresariales, switches, routers, sistemas de comunicaciones unificadas'
    },
    { 
      name: 'Ubiquiti', 
      category: 'WiFi & Network', 
      logo: 'https://cdn.abacus.ai/images/959b64b5-5ceb-445b-a5b4-f48f7f802c34.png',
      descriptionEn: 'WiFi access points, network switches, wireless bridge solutions',
      descriptionEs: 'Puntos de acceso WiFi, switches de red, soluciones de puente inalámbrico'
    },
    { 
      name: 'HID', 
      category: 'Access Control', 
      logo: 'https://cdn.abacus.ai/images/3dc67223-dcc0-4a6d-9d19-18e3db73c439.png',
      descriptionEn: 'Access control systems, card readers, biometric authentication, secure entry',
      descriptionEs: 'Sistemas de control de acceso, lectores de tarjetas, autenticación biométrica'
    },
    { 
      name: 'Aruba', 
      category: 'Network Infrastructure', 
      logo: 'https://cdn.abacus.ai/images/fb6789bf-d7c1-4ffd-9293-06169c8d1033.png',
      descriptionEn: 'Enterprise WiFi, network management, secure wireless infrastructure',
      descriptionEs: 'WiFi empresarial, gestión de redes, infraestructura inalámbrica segura'
    },
    { 
      name: 'Fortinet', 
      category: 'Network Security', 
      logo: 'https://cdn.abacus.ai/images/ac3cf660-df49-4dfc-938c-e3c8506daf3a.png',
      descriptionEn: 'Firewall protection, network security, cybersecurity & threat prevention',
      descriptionEs: 'Protección firewall, seguridad de red, ciberseguridad y prevención de amenazas'
    },
  ];

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        borderColor: `${COLORS.primary}dd`,
      }}
    >
      {/* CTA Section with Orange Button */}
      <div className="py-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <p className="text-lg font-medium text-white">
              {isEs ? '¿Listo para cotizar su proyecto?' : 'Ready to quote your project?'}
            </p>
            <Link 
              href="/quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: COLORS.orange, color: COLORS.white }}
            >
              {isEs ? 'Solicitar Cotización' : 'Get a Quote'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info with larger logo */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="relative h-16 w-48 sm:h-20 sm:w-56 lg:h-24 lg:w-72">
                <Image
                  src="/logo-header.jpg"
                  alt={COMPANY.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-sm text-white/70 -mt-1">{COMPANY.tagline}</p>
            </div>
            <p className="text-sm text-white/80 mb-4">
              {isEs 
                ? '+13 años de experiencia en soluciones de cableado estructurado'
                : '+13 years of experience in low voltage solutions'
              }
            </p>
            <div className="space-y-2">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center space-x-2 text-sm hover:text-white/80">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.orange }} />
                <span className="font-semibold">{COMPANY.phone}</span>
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center space-x-2 text-sm hover:text-white/80">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.orange }} />
                <span>{COMPANY.email}</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{isEs ? 'Servicio en toda Florida' : 'Serving all of Florida'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isEs ? 'Enlaces Rápidos' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands We Work With - SEO Keywords */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              {isEs ? 'Marcas y Productos' : 'Brands & Products'}
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {isEs 
                ? 'Trabajamos con las mejores marcas de la industria'
                : 'We work with top industry brands'
              }
            </p>
            {/* Brand Grid with Logos and Descriptions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {productBrands.map((brand, idx) => (
                <div 
                  key={idx} 
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors flex flex-col items-center"
                  title={`${brand.name} - ${isEs ? brand.descriptionEs : brand.descriptionEn}`}
                >
                  <div className="relative h-8 w-full mb-1 bg-white rounded px-2 py-1">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-[9px] text-white/70 text-center leading-tight line-clamp-2 mt-1">
                    {isEs ? brand.descriptionEs : brand.descriptionEn}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/60">
              {isEs 
                ? 'Certificados en instalación y mantenimiento de equipos profesionales.'
                : 'Certified in professional equipment installation and maintenance.'
              }
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-center text-sm text-white/60">
            &copy; 2025 {COMPANY.legalName}. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
