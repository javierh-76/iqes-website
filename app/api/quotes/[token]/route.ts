import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get quote by public token (for client view)
export async function GET(
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

    // Mark as viewed if first time
    if (!quote.viewedAt) {
      await prisma.quote.update({
        where: { token: params.token },
        data: { 
          viewedAt: new Date(),
          status: quote.status === 'sent' ? 'viewed' : quote.status
        }
      });
    }

    // Parse line items
    const quoteData = {
      ...quote,
      lineItems: JSON.parse(quote.lineItems)
    };

    // Don't expose internal notes to client
    delete (quoteData as any).internalNotes;

    return NextResponse.json({ quote: quoteData });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
