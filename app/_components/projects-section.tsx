import { ProjectsSectionClient } from './projects-section-client';
import { prisma } from '@/lib/db';

export async function ProjectsSection() {
  // Fetch featured projects
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      featured: true,
    },
    take: 3,
    orderBy: {
      completedDate: 'desc',
    },
  });
  
  const serializedProjects = projects.map((p: any) => ({
    ...p,
    completedDate: p.completedDate?.toISOString() ?? null,
  }));
  
  return <ProjectsSectionClient projects={serializedProjects} />;
}
