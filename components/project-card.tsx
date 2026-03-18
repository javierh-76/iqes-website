'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { COLORS } from '@/lib/constants';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  location: string;
  image?: string;
  completedDate?: Date;
  index?: number;
}

export function ProjectCard({
  id,
  title,
  description,
  serviceType,
  location,
  image,
  completedDate,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={`/projects/${id}`}>
        <div className="group h-full overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-video bg-gray-200 overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center"
                style={{ backgroundColor: `${COLORS.accent}15` }}
              >
                <span className="text-sm" style={{ color: COLORS.text.light }}>
                  No image
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="mb-2">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${COLORS.accent}15`, color: COLORS.accent }}
              >
                {serviceType}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-bold line-clamp-2" style={{ color: COLORS.text.primary }}>
              {title}
            </h3>
            <p className="mb-4 text-sm line-clamp-3" style={{ color: COLORS.text.secondary }}>
              {description}
            </p>
            <div className="flex items-center justify-between text-xs" style={{ color: COLORS.text.light }}>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
              {completedDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(completedDate).toLocaleDateString('en-US')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
