import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Public API to get active prices (for chatbot)
export async function GET() {
  try {
    const prices = await prisma.priceItem.findMany({
      where: {
        isActive: true,
        showInChat: true,
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
      select: {
        category: true,
        name: true,
        nameEs: true,
        unitLabel: true,
        unitLabelEs: true,
        priceMin: true,
        priceMax: true,
        priceAvg: true,
      },
    });
    return NextResponse.json(prices);
  } catch (error: any) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch prices' }, { status: 500 });
  }
}
