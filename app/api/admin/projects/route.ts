import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all projects (admin view - includes unpublished)
export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const serializedProjects = projects.map((p: any) => ({
      ...p,
      completedDate: p.completedDate?.toISOString() ?? null,
    }));

    return NextResponse.json({ projects: serializedProjects }, { status: 200 });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const project = await prisma.project.create({
      data: {
        title: data.title,
        titleEs: data.titleEs || null,
        description: data.description,
        descriptionEs: data.descriptionEs || null,
        serviceType: data.serviceType,
        location: data.location,
        featured: data.featured || false,
        images: data.images || [],
        beforeImage: data.beforeImage || null,
        afterImage: data.afterImage || null,
        completedDate: data.completedDate ? new Date(data.completedDate) : null,
        clientTestimonial: data.clientTestimonial || null,
        clientTestimonialEs: data.clientTestimonialEs || null,
        clientName: data.clientName || null,
        published: data.published ?? true,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
