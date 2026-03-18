import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
      },
      orderBy: {
        completedDate: 'desc',
      },
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
