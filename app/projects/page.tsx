'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { ProjectCard } from '@/components/project-card';
import { COLORS } from '@/lib/constants';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Carousel images with service watermarks for SEO
const carouselImages = [
  { src: '/projects/datacenter-1.jpg', service: 'Cat6 | Cat6A', serviceEs: 'Cat6 | Cat6A' },
  { src: '/projects/fiber-test-equipment.jpg', service: 'Fiber Optic', serviceEs: 'Fibra Óptica' },
  { src: '/projects/cctv-miami-1.jpg', service: 'CCTV | NVR', serviceEs: 'CCTV | NVR' },
  { src: '/projects/networking-1.jpg', service: 'Networking', serviceEs: 'Redes' },
  { src: '/projects/cabling-wpb-1.jpg', service: 'Data Center', serviceEs: 'Centro de Datos' },
  { src: '/projects/warehouse-install.jpg', service: 'Structured Cabling', serviceEs: 'Cableado Estructurado' },
  { src: '/projects/dsc-cabling-1.jpg', service: 'Fiber Termination', serviceEs: 'Terminación Fibra' },
  { src: '/projects/cctv-extra-1.jpg', service: 'Access Control', serviceEs: 'Control de Acceso' },
];

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const isEs = language === 'es';
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel with Watermarks */}
      <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={carouselImages[currentSlide].src}
              alt={`IQES Project - ${carouselImages[currentSlide].service}`}
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Watermark */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="max-w-7xl mx-auto flex items-end justify-between">
                <div>
                  <span 
                    className="inline-block px-3 py-1.5 rounded-lg text-white text-base md:text-xl font-bold mb-1"
                    style={{ backgroundColor: COLORS.orange }}
                  >
                    {isEs ? carouselImages[currentSlide].serviceEs : carouselImages[currentSlide].service}
                  </span>
                  <p className="text-white/90 text-xs md:text-sm mt-1">
                    IQES Low Voltage Solutions • Florida
                  </p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-white font-semibold text-base">
                    {isEs ? 'Proyecto Profesional' : 'Professional Project'}
                  </p>
                  <p className="text-white/70 text-xs">+13 {isEs ? 'años de experiencia' : 'years of experience'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
          style={{ color: COLORS.primary }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all z-10"
          style={{ color: COLORS.primary }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: COLORS.primary }}>
              {isEs ? 'Portafolio de Proyectos' : 'Project Portfolio'}
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.text.secondary }}>
              {isEs ? 'Vea nuestro trabajo completado en toda Florida' : 'See our completed work across Florida'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin" style={{ color: COLORS.accent }} />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={(isEs && project.titleEs) || project.title}
                  description={(isEs && project.descriptionEs) || project.description}
                  serviceType={project.serviceType}
                  location={project.location}
                  image={project.images?.[0]}
                  completedDate={project.completedDate ? new Date(project.completedDate) : undefined}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl" style={{ color: COLORS.text.secondary }}>
                {isEs ? 'No hay proyectos disponibles todavía.' : 'No projects available yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
