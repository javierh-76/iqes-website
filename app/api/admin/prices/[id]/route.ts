import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET single price
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const price = await prisma.priceItem.findUnique({
      where: { id: params.id },
    });
    
    if (!price) {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }
    
    return NextResponse.json(price);
  } catch (error: any) {
    console.error('Error fetching price:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch price' }, { status: 500 });
  }
}

// PUT update price
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const price = await prisma.priceItem.update({
      where: { id: params.id },
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
    console.error('Error updating price:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update price' }, { status: 500 });
  }
}

// DELETE price
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.priceItem.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting price:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete price' }, { status: 500 });
  }
}
