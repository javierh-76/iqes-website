import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      completedDate: project.completedDate?.toISOString() ?? null,
    });
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const project = await prisma.project.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Remove project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
