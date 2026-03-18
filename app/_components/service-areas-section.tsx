'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS, SERVICE_AREAS } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export function ServiceAreasSection() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Project images for carousel with SEO watermarks
  const projectImages = [
    { src: '/projects/datacenter-1.jpg', labelEn: 'Cat6 | Cat6A Cabling', labelEs: 'Cableado Cat6 | Cat6A' },
    { src: '/projects/fiber-install-1.jpg', labelEn: 'Fiber Optic', labelEs: 'Fibra Óptica' },
    { src: '/projects/cctv-miami-1.jpg', labelEn: 'CCTV | IP Cameras', labelEs: 'CCTV | Cámaras IP' },
    { src: '/projects/network-rack-1.jpg', labelEn: 'Networking', labelEs: 'Redes' },
    { src: '/projects/server-room-1.jpg', labelEn: 'Data Center', labelEs: 'Centro de Datos' },
    { src: '/projects/cabling-wpb-1.jpg', labelEn: 'Structured Cabling', labelEs: 'Cableado Estructurado' },
    { src: '/projects/fiber-test-equipment.jpg', labelEn: 'Fiber Testing', labelEs: 'Pruebas de Fibra' },
    { src: '/projects/access-control-1.jpg', labelEn: 'Access Control', labelEs: 'Control de Acceso' },
    { src: '/projects/warehouse-install.jpg', labelEn: 'WiFi Solutions', labelEs: 'Soluciones WiFi' },
    { src: '/projects/cable-management-1.jpg', labelEn: 'Cable Management', labelEs: 'Gestión de Cables' },
  ];
  
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselRef.current) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const newPosition = scrollPosition + 200;
        
        if (newPosition >= maxScroll) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setScrollPosition(0);
        } else {
          carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
          setScrollPosition(newPosition);
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [scrollPosition]);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = Math.max(0, scrollPosition - 300);
      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 300);
      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: `${COLORS.accent}08` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header - Without subtitle */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.primary }}>
            {isEs ? 'Entregando Soluciones de Infraestructura en toda Florida' : 'Delivering Infrastructure Solutions Across Florida'}
          </h2>
        </div>

        {/* Service areas grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {SERVICE_AREAS.map((area, index) => (
            <motion.div
              key={area.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <MapPin
                className="h-6 w-6 mx-auto mb-2"
                style={{ color: COLORS.accent }}
              />
              <p className="font-semibold text-sm" style={{ color: COLORS.text.primary }}>
                {area.city}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compact Horizontal Carousel - Multiple images visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Carousel Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold" style={{ color: COLORS.primary }}>
              {isEs ? 'Nuestros Proyectos' : 'Our Projects'}
            </h3>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Arrow Left */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" style={{ color: COLORS.primary }} />
            </button>
            
            {/* Scrollable Image Strip */}
            <div 
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {projectImages.map((image, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  style={{ width: '180px', height: '120px' }}
                >
                  <Image
                    src={image.src}
                    alt={image.labelEn}
                    fill
                    className="object-cover"
                  />
                  {/* Small label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-medium text-center truncate">
                      {isEs ? image.labelEs : image.labelEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrow Right */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" style={{ color: COLORS.primary }} />
            </button>
          </div>
          
          {/* View Full Coverage Map Link */}
          <div className="text-center mt-6">
            <Link href="/service-areas">
              <Button
                style={{
                  backgroundColor: COLORS.orange,
                  color: COLORS.white,
                }}
                className="hover:opacity-90"
              >
                {isEs ? 'Ver Mapa de Cobertura Completo' : 'View Full Coverage Map'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
