import { TestimonialsSectionClient } from './testimonials-section-client';
import { prisma } from '@/lib/db';

export async function TestimonialsSection() {
  // Fetch featured testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: {
      published: true,
      featured: true,
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return <TestimonialsSectionClient testimonials={testimonials} />;
}
