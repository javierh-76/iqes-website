'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { COLORS } from '@/lib/constants';
import { MapPin, Calendar, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { language } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data.project);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProject();
    }
  }, [id]);

  // ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage !== null) {
        setSelectedImage(null);
      }
      if (selectedImage !== null && project?.images?.length > 1) {
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev + 1) % project.images.length);
        }
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, project?.images?.length]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: COLORS.accent }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 style={{ color: COLORS.primary }}>Project Not Found</h1>
          <Link href="/projects">
            <Button className="mt-4" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = (language === 'es' && project.titleEs) || project.title;
  const description = (language === 'es' && project.descriptionEs) || project.description;
  const images = project.images || [];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-8">
            {/* Main Image */}
            <div 
              className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer mb-4"
              onClick={() => setSelectedImage(activeImageIndex)}
            >
              <Image
                src={images[activeImageIndex]}
                alt={`${title} - Image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-[#00A651]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <span
                className="inline-block rounded-full px-4 py-2 text-sm font-medium mb-4"
                style={{ backgroundColor: `${COLORS.accent}15`, color: COLORS.accent }}
              >
                {project.serviceType}
              </span>
              <h1 className="mb-4" style={{ color: COLORS.primary }}>
                {title}
              </h1>
              <div className="flex items-center space-x-6 text-sm" style={{ color: COLORS.text.secondary }}>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                {project.completedDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.completedDate).toLocaleDateString('en-US')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.primary }}>
                {language === 'es' ? 'Descripción del Proyecto' : 'Project Description'}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: COLORS.text.secondary }}>
                {description}
              </p>
            </div>

            {project.clientTestimonial && (
              <div className="border-t pt-8" style={{ borderColor: `${COLORS.text.light}30` }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.primary }}>
                  {language === 'es' ? 'Testimonio del Cliente' : 'Client Testimonial'}
                </h2>
                <blockquote className="italic text-lg mb-4" style={{ color: COLORS.text.secondary }}>
                  "{(language === 'es' && project.clientTestimonialEs) || project.clientTestimonial}"
                </blockquote>
                {project.clientName && (
                  <p className="font-semibold" style={{ color: COLORS.primary }}>
                    — {project.clientName}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/projects">
            <Button style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
              {language === 'es' ? 'Volver a Proyectos' : 'Back to All Projects'}
            </Button>
          </Link>
          <Link href="/quote" className="ml-4">
            <Button style={{ backgroundColor: COLORS.cta, color: COLORS.white }}>
              {language === 'es' ? 'Solicitar Cotización' : 'Request a Quote'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); setSelectedImage(activeImageIndex); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeImageIndex]}
              alt={`${title} - Full size`}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); setSelectedImage(activeImageIndex); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
