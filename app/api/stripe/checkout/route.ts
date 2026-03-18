import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, quoteId, customerEmail, customerName, description, language } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'https://iqes-lowvoltage.abacusai.app';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: language === 'es' 
                ? `Depósito - Proyecto IQES #${quoteId || 'N/A'}`
                : `Deposit - IQES Project #${quoteId || 'N/A'}`,
              description: description || (language === 'es'
                ? 'Depósito del 50% para iniciar el proyecto'
                : '50% deposit to begin project work'),
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        quoteId: quoteId || '',
        customerName: customerName || '',
        type: 'project_deposit',
      },
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payments/cancel`,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      metadata: session.metadata,
    });
  } catch (error: unknown) {
    console.error('Stripe session retrieval error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
