import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any
});

// POST - Confirm payment after Stripe redirect
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.findUnique({
      where: { token: params.token }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update quote status
      await prisma.quote.update({
        where: { token: params.token },
        data: {
          status: 'deposit_paid',
          depositPaidAt: new Date(),
          stripePaymentId: session.payment_intent as string
        }
      });

      // Send confirmation email to client
      await sendPaymentConfirmationEmail(quote);

      return NextResponse.json({ 
        success: true, 
        message: 'Payment confirmed'
      });
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}

async function sendPaymentConfirmationEmail(quote: any) {
  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#003366;padding:20px;text-align:center;">
        <h1 style="color:#FF6600;margin:0;">IQES Low Voltage Solutions</h1>
        <p style="color:#fff;margin:5px 0 0;">Payment Confirmation</p>
      </div>
      
      <div style="padding:20px;background:#f9f9f9;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="background:#28a745;color:#fff;display:inline-block;padding:15px 30px;border-radius:50px;font-size:18px;">
            ✓ Payment Received
          </div>
        </div>
        
        <p>Dear <strong>${quote.clientName}</strong>,</p>
        <p>Thank you! We have received your deposit payment for quote <strong>${quote.quoteNumber}</strong>.</p>
        
        <div style="background:#fff;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Amount Paid:</strong> $${quote.depositAmount.toFixed(2)}</p>
          <p><strong>Remaining Balance:</strong> $${(quote.totalAmount - quote.depositAmount).toFixed(2)}</p>
          <p><strong>Services:</strong> ${quote.services.join(', ')}</p>
        </div>
        
        <p>Our team will contact you shortly to schedule your project. If you have any questions, please don't hesitate to reach out.</p>
        
        <p style="color:#666;font-size:14px;margin-top:20px;">The remaining balance of $${(quote.totalAmount - quote.depositAmount).toFixed(2)} will be due upon project completion.</p>
      </div>
      
      <div style="background:#003366;padding:15px;text-align:center;">
        <p style="color:#fff;margin:0;font-size:14px;">Questions? Call us at <a href="tel:+13866039541" style="color:#FF6600;">386-603-9541</a></p>
        <p style="color:#888;margin:5px 0 0;font-size:12px;">&copy; ${new Date().getFullYear()} IQES Low Voltage Solutions</p>
      </div>
    </div>
  `;

  try {
    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_QUOTE_SENT_TO_CLIENT,
        recipient_email: quote.clientEmail,
        subject: `Payment Received - ${quote.quoteNumber} | IQES Low Voltage Solutions`,
        body: htmlContent,
        is_html: true,
        sender_email: 'noreply@iqeslowvoltage.com',
        sender_alias: 'IQES Low Voltage Solutions',
      })
    });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
}
