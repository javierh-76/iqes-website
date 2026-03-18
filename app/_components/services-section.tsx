'use client';

import { useLanguage } from '@/contexts/language-context';
import { ServiceCard } from '@/components/service-card';
import { Cable, Camera, Network, Shield, Wifi } from 'lucide-react';
import { COLORS } from '@/lib/constants';

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Cable,
      href: '/services/fiber-optic',
      title: t?.services?.fiberOptic?.name ?? 'Fiber Optic Installation',
      description:
        t?.services?.fiberOptic?.description ??
        'High-speed fiber optic installation and splicing services for maximum data transfer efficiency.',
    },
    {
      icon: Camera,
      href: '/services/cctv',
      title: t?.services?.cctv?.name ?? 'CCTV Systems',
      description:
        t?.services?.cctv?.description ??
        'Advanced surveillance and security camera systems with remote monitoring capabilities.',
    },
    {
      icon: Network,
      href: '/services/structured-cabling',
      title: t?.services?.cabling?.name ?? 'Structured Cabling',
      description:
        t?.services?.cabling?.description ??
        'Professional structured cabling for reliable network infrastructure.',
    },
    {
      icon: Shield,
      href: '/services/access-control',
      title: t?.services?.accessControl?.name ?? 'Access Control',
      description:
        t?.services?.accessControl?.description ??
        'Secure access control systems to protect your facilities and assets.',
    },
    {
      icon: Wifi,
      href: '/services/networking',
      title: t?.services?.networking?.name ?? 'Networking Solutions',
      description:
        t?.services?.networking?.description ??
        'Complete networking solutions for seamless connectivity and communication.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ color: COLORS.primary }}>
            {t?.home?.servicesTitle ?? 'Our Services'}
          </h2>
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            {t?.home?.servicesSubtitle ?? 'Comprehensive low voltage electrical solutions'}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.href}
              title={service.title}
              description={service.description}
              icon={service.icon}
              href={service.href}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
