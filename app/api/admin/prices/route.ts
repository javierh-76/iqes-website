import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all prices
export async function GET() {
  try {
    const prices = await prisma.priceItem.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });
    return NextResponse.json(prices);
  } catch (error: any) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch prices' }, { status: 500 });
  }
}

// POST create new price item
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const price = await prisma.priceItem.create({
      data: {
        category: data.category,
        name: data.name,
        nameEs: data.nameEs || null,
        description: data.description || null,
        descriptionEs: data.descriptionEs || null,
        unit: data.unit,
        unitLabel: data.unitLabel,
        unitLabelEs: data.unitLabelEs || null,
        priceMin: parseFloat(data.priceMin),
        priceMax: parseFloat(data.priceMax),
        priceAvg: data.priceAvg ? parseFloat(data.priceAvg) : null,
        notes: data.notes || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
        showInChat: data.showInChat ?? true,
        showInQuote: data.showInQuote ?? true,
      },
    });
    
    return NextResponse.json(price);
  } catch (error: any) {
    console.error('Error creating price:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create price' }, { status: 500 });
  }
}
