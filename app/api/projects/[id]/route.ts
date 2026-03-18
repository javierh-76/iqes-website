import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const serializedProject = {
      ...project,
      completedDate: project.completedDate?.toISOString() ?? null,
    };

    return NextResponse.json({ project: serializedProject }, { status: 200 });
  } catch (error: any) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
