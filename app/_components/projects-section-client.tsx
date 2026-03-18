'use client';

import { useLanguage } from '@/contexts/language-context';
import { ProjectCard } from '@/components/project-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/lib/constants';

export function ProjectsSectionClient({ projects }: { projects: any[] }) {
  const { t, language } = useLanguage();

  return (
    <section
      className="py-20"
      style={{ backgroundColor: `${COLORS.primary}05` }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="mb-4" style={{ color: COLORS.primary }}>
            {t?.home?.projectsTitle ?? 'Recent Projects'}
          </h2>
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            {t?.home?.projectsSubtitle ?? 'Quality work delivered on time'}
          </p>
        </div>

        {/* Projects grid */}
        {projects?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project?.id}
                  id={project?.id ?? ''}
                  title={(language === 'es' && project?.titleEs) || project?.title || ''}
                  description={
                    (language === 'es' && project?.descriptionEs) || project?.description || ''
                  }
                  serviceType={project?.serviceType ?? ''}
                  location={project?.location ?? ''}
                  image={project?.images?.[0] ?? undefined}
                  completedDate={project?.completedDate ? new Date(project.completedDate) : undefined}
                  index={index}
                />
              ))}
            </div>

            {/* View all button */}
            <div className="text-center">
              <Link href="/projects">
                <Button
                  size="lg"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                  }}
                >
                  {t?.common?.viewAll ?? 'View All'} Projects
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: COLORS.text.secondary }}>
              No featured projects available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
