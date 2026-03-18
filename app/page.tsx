import { HeroSection } from './_components/hero-section';
import { ServicesSection } from './_components/services-section';
import { ServiceAreasSection } from './_components/service-areas-section';
import { ProjectsSection } from './_components/projects-section';
import { TestimonialsSection } from './_components/testimonials-section';
import { TrustSection } from './_components/trust-section';
import { CTASection } from './_components/cta-section';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ServicesSection />
      <ServiceAreasSection />
      <TrustSection />
      <ProjectsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
