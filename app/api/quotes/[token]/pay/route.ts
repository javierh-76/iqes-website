import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover'
});

// POST - Create Stripe checkout session for deposit payment
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
      return NextResponse.json(
        { error: 'Quote has expired' },
        { status: 400 }
      );
    }

    // Check if already paid
    if (quote.status === 'deposit_paid' || quote.status === 'completed') {
      return NextResponse.json(
        { error: 'Deposit already paid' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://iqes-lowvoltage.abacusai.app';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Deposit for ${quote.quoteNumber}`,
              description: `${quote.depositPercent}% deposit for: ${quote.services.join(', ')}`
            },
            unit_amount: Math.round(quote.depositAmount * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${baseUrl}/quotes/${quote.token}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/quotes/${quote.token}?cancelled=true`,
      customer_email: quote.clientEmail,
      metadata: {
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        token: quote.token
      }
    });

    // Update quote with session ID
    await prisma.quote.update({
      where: { token: params.token },
      data: {
        stripeSessionId: session.id,
        paymentMethod: 'stripe'
      }
    });

    return NextResponse.json({ 
      success: true, 
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
