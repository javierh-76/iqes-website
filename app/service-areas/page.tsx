'use client';

import { useLanguage } from '@/contexts/language-context';
import { MapPin, ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS, COMPANY } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { cities, services } from '@/lib/seo-data';

// Florida cities with coverage info
const coverageAreas = [
  { city: 'Jacksonville', slug: 'jacksonville', region: 'Northeast Florida', nearbyAreas: ['St. Augustine', 'Orange Park', 'Ponte Vedra', 'Fernandina Beach'] },
  { city: 'Orlando', slug: 'orlando', region: 'Central Florida', nearbyAreas: ['Kissimmee', 'Sanford', 'Winter Park', 'Lake Mary'] },
  { city: 'Tampa', slug: 'tampa', region: 'Tampa Bay Area', nearbyAreas: ['St. Petersburg', 'Clearwater', 'Brandon', 'Lakeland'] },
  { city: 'Tallahassee', slug: 'tallahassee', region: 'North Florida / Panhandle', nearbyAreas: ['Panama City', 'Gainesville', 'Pensacola', 'Crawfordville'] },
  { city: 'Fort Myers', slug: 'fort-myers', region: 'Southwest Florida', nearbyAreas: ['Naples', 'Cape Coral', 'Bonita Springs', 'Lehigh Acres'] },
  { city: 'Miami', slug: 'miami', region: 'South Florida', nearbyAreas: ['Fort Lauderdale', 'Hialeah', 'Miami Beach', 'Homestead'] },
  { city: 'West Palm Beach', slug: 'west-palm-beach', region: 'Palm Beach County', nearbyAreas: ['Boca Raton', 'Delray Beach', 'Jupiter', 'Palm Beach Gardens'] },
];

export default function ServiceAreasPage() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const content = {
    en: {
      title: 'Delivering Infrastructure Solutions Across Florida',
      subtitle: 'We provide comprehensive structured cabling and telecommunications services throughout the entire state of Florida',
      nearbyAreas: 'Nearby areas',
      viewServices: 'View services',
      servicesByCity: 'Services by City',
      fullCoverage: 'Statewide Coverage',
      fullCoverageDesc: 'Our strategic locations allow us to provide same-day or next-day service across the entire state of Florida. From the Panhandle to the Keys, we have you covered.',
      callUs: 'Call for service',
    },
    es: {
      title: 'Entregando Soluciones de Infraestructura en toda Florida',
      subtitle: 'Brindamos servicios integrales de cableado estructurado y telecomunicaciones en todo el estado de Florida',
      nearbyAreas: 'Áreas cercanas',
      viewServices: 'Ver servicios',
      servicesByCity: 'Servicios por Ciudad',
      fullCoverage: 'Cobertura Estatal',
      fullCoverageDesc: 'Nuestras ubicaciones estratégicas nos permiten proporcionar servicio el mismo día o al día siguiente en todo el estado de Florida. Desde el Panhandle hasta los Keys, lo tenemos cubierto.',
      callUs: 'Llamar para servicio',
    },
  };

  const t = content[language as 'en' | 'es'] || content.en;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: COLORS.primary }}>
            {t.title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: COLORS.text.secondary }}>
            {t.subtitle}
          </p>
        </div>

        {/* Florida Coverage Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl overflow-hidden shadow-xl border border-gray-200"
        >
          <div 
            className="p-4 text-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h2 className="text-2xl font-bold text-white">
              {isEs ? 'Mapa de Cobertura en Florida' : 'Florida Coverage Map'}
            </h2>
          </div>
          <div className="relative aspect-[16/7] bg-white max-w-4xl mx-auto">
            <Image
              src="/florida-service-map.png"
              alt="IQES Low Voltage Solutions - Florida Service Coverage Map - Jacksonville, Orlando, Tampa, Tallahassee, Miami, West Palm Beach"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          <div 
            className="p-4 flex flex-wrap justify-center gap-3"
            style={{ backgroundColor: `${COLORS.primary}08` }}
          >
            {coverageAreas.map((area) => (
              <Link
                key={area.city}
                href={`/locations/${area.slug}`}
                className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105 shadow-sm"
                style={{ 
                  backgroundColor: COLORS.orange,
                  color: 'white'
                }}
              >
                {area.city}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Detailed Coverage Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {coverageAreas.map((area, index) => (
            <motion.div
              key={area.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${COLORS.orange}15` }}
                >
                  <MapPin className="w-6 h-6" style={{ color: COLORS.orange }} />
                </div>
                <div className="flex-1">
                  <Link href={`/locations/${area.slug}`}>
                    <h3 
                      className="font-bold text-xl hover:underline cursor-pointer"
                      style={{ color: COLORS.orange }}
                    >
                      {area.city}
                    </h3>
                  </Link>
                  <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                    {area.region}
                  </p>
                  
                  <p className="text-xs font-medium mb-1" style={{ color: COLORS.text.primary }}>
                    {t.nearbyAreas}:
                  </p>
                  <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                    {area.nearbyAreas.join(' • ')}
                  </p>
                  
                  <Link 
                    href={`/locations/${area.slug}`}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium transition-colors"
                    style={{ color: COLORS.accent }}
                  >
                    {t.viewServices} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services by City Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 p-8 rounded-2xl bg-gray-50"
        >
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: COLORS.primary }}>
            {t.servicesByCity}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <div key={city.slug} className="bg-white p-4 rounded-lg shadow-sm">
                <Link href={`/locations/${city.slug}`}>
                  <h3 className="font-bold mb-3 hover:underline" style={{ color: COLORS.orange }}>
                    {city.name}, FL
                  </h3>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <Link
                      key={`${city.slug}-${service.slug}`}
                      href={`/locations/${city.slug}/${service.slug}`}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ backgroundColor: `${COLORS.orange}15`, color: COLORS.text.primary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.orange;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${COLORS.orange}15`;
                        e.currentTarget.style.color = COLORS.text.primary;
                      }}
                    >
                      {isEs ? service.shortNameEs : service.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full Coverage CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl"
          style={{ backgroundColor: COLORS.primary }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            {t.fullCoverage}
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            {t.fullCoverageDesc}
          </p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.orange }}
          >
            <Phone className="w-5 h-5" />
            {t.callUs}: {COMPANY.phone}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
