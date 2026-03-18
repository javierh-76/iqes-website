import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Send/resend quote email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Send email
    await sendQuoteEmail(quote);

    // Update status
    await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: quote.status === 'draft' ? 'sent' : quote.status,
        sentAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Quote sent successfully' });
  } catch (error) {
    console.error('Error sending quote:', error);
    return NextResponse.json(
      { error: 'Failed to send quote' },
      { status: 500 }
    );
  }
}

async function sendQuoteEmail(quote: any) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://iqes-lowvoltage.abacusai.app';
  const quoteUrl = `${baseUrl}/quotes/${quote.token}`;
  
  const lineItems = JSON.parse(quote.lineItems);
  const itemsHtml = lineItems.map((item: any) => 
    `<tr><td style="padding:8px;border:1px solid #ddd;">${item.description}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.quantity}</td><td style="padding:8px;border:1px solid #ddd;text-align:right;">$${item.unitPrice.toFixed(2)}</td><td style="padding:8px;border:1px solid #ddd;text-align:right;">$${item.total.toFixed(2)}</td></tr>`
  ).join('');

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#003366;padding:20px;text-align:center;">
        <h1 style="color:#FF6600;margin:0;">IQES Low Voltage Solutions</h1>
        <p style="color:#fff;margin:5px 0 0;">Professional Quote</p>
      </div>
      
      <div style="padding:20px;background:#f9f9f9;">
        <p>Dear <strong>${quote.clientName}</strong>,</p>
        <p>Thank you for your interest in our services. Please find your quote details below:</p>
        
        <div style="background:#fff;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Quote Number:</strong> ${quote.quoteNumber}</p>
          <p><strong>Valid Until:</strong> ${new Date(quote.expiresAt).toLocaleDateString('en-US')}</p>
          <p><strong>Services:</strong> ${quote.services.join(', ')}</p>
        </div>
        
        <h3 style="color:#003366;">Project Details</h3>
        <p>${quote.description}</p>
        
        <h3 style="color:#003366;">Price Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;background:#fff;">
          <thead>
            <tr style="background:#003366;color:#fff;">
              <th style="padding:10px;text-align:left;">Description</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Unit Price</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr><td colspan="3" style="padding:8px;text-align:right;"><strong>Subtotal:</strong></td><td style="padding:8px;text-align:right;">$${quote.subtotal.toFixed(2)}</td></tr>
            ${quote.taxAmount > 0 ? `<tr><td colspan="3" style="padding:8px;text-align:right;">Tax (${quote.taxRate}%):</td><td style="padding:8px;text-align:right;">$${quote.taxAmount.toFixed(2)}</td></tr>` : ''}
            <tr style="background:#003366;color:#fff;"><td colspan="3" style="padding:10px;text-align:right;"><strong>Total:</strong></td><td style="padding:10px;text-align:right;"><strong>$${quote.totalAmount.toFixed(2)}</strong></td></tr>
            <tr style="background:#FF6600;color:#fff;"><td colspan="3" style="padding:10px;text-align:right;"><strong>Deposit Required (${quote.depositPercent}%):</strong></td><td style="padding:10px;text-align:right;"><strong>$${quote.depositAmount.toFixed(2)}</strong></td></tr>
          </tfoot>
        </table>
        
        <div style="text-align:center;margin:30px 0;">
          <a href="${quoteUrl}" style="display:inline-block;background:#FF6600;color:#fff;padding:15px 40px;text-decoration:none;border-radius:8px;font-size:18px;font-weight:bold;">View & Approve Quote</a>
        </div>
        
        <p style="color:#666;font-size:14px;">This quote is valid for ${quote.validDays} days. A ${quote.depositPercent}% deposit is required to begin work.</p>
      </div>
      
      <div style="background:#003366;padding:15px;text-align:center;">
        <p style="color:#fff;margin:0;font-size:14px;">Questions? Call us at <a href="tel:+13866039541" style="color:#FF6600;">386-603-9541</a></p>
        <p style="color:#888;margin:5px 0 0;font-size:12px;">&copy; ${new Date().getFullYear()} IQES Low Voltage Solutions</p>
      </div>
    </div>
  `;

  const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deployment_token: process.env.ABACUSAI_API_KEY,
      app_id: process.env.WEB_APP_ID,
      notification_id: process.env.NOTIF_ID_QUOTE_SENT_TO_CLIENT,
      recipient_email: quote.clientEmail,
      subject: `Your Quote from IQES Low Voltage Solutions - ${quote.quoteNumber}`,
      body: htmlContent,
      is_html: true,
      sender_email: 'noreply@iqeslowvoltage.com',
      sender_alias: 'IQES Low Voltage Solutions',
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}
