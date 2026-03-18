import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Approve quote
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { token: params.token }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (quote.expiresAt && new Date() > new Date(quote.expiresAt)) {
      await prisma.quote.update({
        where: { token: params.token },
        data: { status: 'expired' }
      });
      return NextResponse.json(
        { error: 'Quote has expired' },
        { status: 400 }
      );
    }

    // Check if already approved
    if (['approved', 'deposit_paid', 'completed'].includes(quote.status)) {
      return NextResponse.json(
        { error: 'Quote already approved', status: quote.status },
        { status: 400 }
      );
    }

    // Update status
    const updatedQuote = await prisma.quote.update({
      where: { token: params.token },
      data: {
        status: 'approved',
        approvedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Quote approved successfully',
      quote: updatedQuote
    });
  } catch (error) {
    console.error('Error approving quote:', error);
    return NextResponse.json(
      { error: 'Failed to approve quote' },
      { status: 500 }
    );
  }
}
