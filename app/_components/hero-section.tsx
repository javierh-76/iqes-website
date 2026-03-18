'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio, Camera, Cable, KeyRound, Network } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { COLORS } from '@/lib/constants';

const services = [
  { icon: Radio, name: 'Fiber Optic', nameEs: 'Fibra Óptica' },
  { icon: Camera, name: 'CCTV', nameEs: 'CCTV' },
  { icon: Cable, name: 'Cabling', nameEs: 'Cableado' },
  { icon: KeyRound, name: 'Access Control', nameEs: 'Control Acceso' },
  { icon: Network, name: 'Networking', nameEs: 'Redes' },
];

export function HeroSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'IQES Low Voltage Solutions',
      subtitle: '+13 years of experience providing comprehensive low voltage and telecommunications solutions. We specialize in the design, implementation, and maintenance of technology infrastructure under international quality standards, ensuring operational continuity, security, and efficiency for organizations across all sectors.',
      servingFlorida: 'Delivering Infrastructure Solutions Across Florida',
    },
    es: {
      title: 'IQES Low Voltage Solutions',
      subtitle: '+13 años de experiencia ofreciendo soluciones integrales en cableado estructurado y telecomunicaciones. Nos especializamos en el diseño, implementación y mantenimiento de infraestructuras tecnológicas bajo estándares internacionales de calidad, garantizando continuidad operativa, seguridad y eficiencia para organizaciones de diversos sectores.',
      servingFlorida: 'Entregando Soluciones de Infraestructura en toda Florida',
    },
  };

  const t = content[language as 'en' | 'es'] || content.en;

  return (
    <section
      className="relative min-h-[550px] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primary}dd 50%, ${COLORS.accent}40 100%)`,
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${COLORS.white} 35px, ${COLORS.white} 36px)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Company name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
          >
            {t.title}
          </motion.h1>

          {/* Company description - 13 years */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 text-base sm:text-lg lg:text-xl text-white/90 max-w-5xl mx-auto leading-relaxed"
          >
            {t.subtitle}
          </motion.p>

          {/* Serving Florida */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10 text-lg text-white/70"
          >
            {t.servingFlorida}
          </motion.p>

          {/* Services icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12"
          >
            {services.map((service, index) => (
              <Link
                key={service.name}
                href="/services"
                className="group flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${COLORS.white}20` }}
                >
                  <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <span className="text-white/90 text-sm sm:text-base font-medium group-hover:text-white transition-colors">
                  {language === 'es' ? service.nameEs : service.name}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16"
          style={{ fill: COLORS.white }}
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>
    </section>
  );
}
