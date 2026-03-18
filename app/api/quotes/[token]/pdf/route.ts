import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatDate(date: Date | string | null): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'deposit_paid' | 'completed' | 'expired' | 'declined';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'DRAFT',
  sent: 'PENDING APPROVAL',
  viewed: 'PENDING APPROVAL',
  approved: 'APPROVED',
  deposit_paid: 'DEPOSIT PAID',
  completed: 'COMPLETED',
  expired: 'EXPIRED',
  declined: 'DECLINED',
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: '#6B7280',
  sent: '#F59E0B',
  viewed: '#F59E0B',
  approved: '#10B981',
  deposit_paid: '#10B981',
  completed: '#10B981',
  expired: '#EF4444',
  declined: '#EF4444',
};

function generateQuoteHTML(quote: any): string {
  const lineItems = typeof quote.lineItems === 'string' ? JSON.parse(quote.lineItems) : quote.lineItems || [];
  const status = (quote.status as QuoteStatus) || 'draft';
  const statusLabel = STATUS_LABELS[status] || status.toUpperCase();
  const statusColor = STATUS_COLORS[status] || '#6B7280';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
    .page { padding: 40px 50px; max-width: 800px; margin: 0 auto; }
    
    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #003366; padding-bottom: 20px; }
    .logo-section { }
    .logo { width: 200px; height: auto; }
    .company-name { font-size: 24px; font-weight: bold; color: #003366; margin-bottom: 5px; }
    .company-tagline { font-size: 10px; color: #FF6600; font-style: italic; }
    .company-info { font-size: 9px; color: #666; margin-top: 8px; }
    
    .quote-info { text-align: right; }
    .quote-title { font-size: 28px; font-weight: bold; color: #003366; margin-bottom: 10px; }
    .quote-number { font-size: 16px; font-weight: bold; color: #FF6600; margin-bottom: 5px; }
    .quote-date { font-size: 10px; color: #666; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 15px; font-size: 10px; font-weight: bold; color: white; margin-top: 10px; }
    
    /* Client Info */
    .client-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
    .section-title { font-size: 12px; font-weight: bold; color: #003366; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .client-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .client-item label { font-size: 9px; color: #666; text-transform: uppercase; }
    .client-item p { font-size: 11px; font-weight: 500; margin-top: 2px; }
    
    /* Services */
    .services-section { margin-bottom: 25px; }
    .services-list { background: #fff3e6; padding: 15px; border-radius: 8px; border-left: 4px solid #FF6600; }
    .service-tag { display: inline-block; background: #FF6600; color: white; padding: 3px 10px; border-radius: 12px; font-size: 9px; margin: 3px 3px 3px 0; }
    
    /* Description */
    .description-section { margin-bottom: 25px; }
    .description-box { background: #f0f4f8; padding: 15px; border-radius: 8px; font-size: 11px; line-height: 1.6; }
    
    /* Line Items Table */
    .items-section { margin-bottom: 25px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #003366; color: white; padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
    th:last-child, td:last-child { text-align: right; }
    td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 11px; }
    tr:nth-child(even) { background: #f9fafb; }
    .item-desc { font-size: 9px; color: #666; margin-top: 3px; }
    
    /* Totals */
    .totals-section { display: flex; justify-content: flex-end; margin-bottom: 30px; }
    .totals-box { width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .total-row.subtotal { }
    .total-row.tax { font-size: 10px; color: #666; }
    .total-row.grand-total { background: #003366; color: white; padding: 12px 15px; margin-top: 5px; border-radius: 5px; font-weight: bold; }
    .total-row.deposit { background: #FF6600; color: white; padding: 12px 15px; margin-top: 5px; border-radius: 5px; font-weight: bold; }
    
    /* Payment Info */
    .payment-section { background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
    .payment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .payment-method { }
    .payment-method h4 { font-size: 11px; font-weight: bold; color: #003366; margin-bottom: 8px; }
    .payment-method p { font-size: 10px; color: #333; margin-bottom: 3px; }
    .payment-method .highlight { font-weight: bold; color: #FF6600; }
    
    /* Terms */
    .terms-section { margin-bottom: 30px; }
    .terms-box { font-size: 9px; color: #666; line-height: 1.6; }
    .terms-box ul { padding-left: 15px; }
    .terms-box li { margin-bottom: 5px; }
    
    /* Signature */
    .signature-section { margin-top: 40px; padding-top: 20px; border-top: 2px solid #003366; }
    .signature-title { font-size: 14px; font-weight: bold; color: #003366; margin-bottom: 20px; text-align: center; }
    .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .signature-box { }
    .signature-line { border-bottom: 1px solid #333; height: 50px; margin-bottom: 5px; }
    .signature-label { font-size: 9px; color: #666; }
    .authorization-text { font-size: 10px; color: #333; margin-bottom: 20px; text-align: center; line-height: 1.6; }
    
    /* Footer */
    .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; }
    .footer p { font-size: 9px; color: #666; margin-bottom: 3px; }
    .footer .legal { font-size: 8px; color: #999; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <div class="company-name">IQES</div>
        <div class="company-tagline">Low Voltage Solutions</div>
        <div class="company-info">
          Innovation & Quality Engineering Services<br>
          📧 info@iqeslowvoltage.com<br>
          📞 (386) 603-9541<br>
          📍 Florida, USA
        </div>
      </div>
      <div class="quote-info">
        <div class="quote-title">QUOTE</div>
        <div class="quote-number">${quote.quoteNumber}</div>
        <div class="quote-date">
          <strong>Date:</strong> ${formatDate(quote.createdAt)}<br>
          <strong>Valid Until:</strong> ${formatDate(quote.expiresAt)}
        </div>
        <div class="status-badge" style="background: ${statusColor}">${statusLabel}</div>
      </div>
    </div>
    
    <!-- Client Information -->
    <div class="client-section">
      <div class="section-title">Client Information / Información del Cliente</div>
      <div class="client-grid">
        <div class="client-item">
          <label>Name / Nombre</label>
          <p>${quote.clientName}</p>
        </div>
        <div class="client-item">
          <label>Company / Empresa</label>
          <p>${quote.companyName || 'N/A'}</p>
        </div>
        <div class="client-item">
          <label>Email</label>
          <p>${quote.clientEmail}</p>
        </div>
        <div class="client-item">
          <label>Phone / Teléfono</label>
          <p>${quote.clientPhone || 'N/A'}</p>
        </div>
      </div>
    </div>
    
    <!-- Services -->
    <div class="services-section">
      <div class="section-title">Services / Servicios</div>
      <div class="services-list">
        ${(quote.services || []).map((s: string) => `<span class="service-tag">${s}</span>`).join('')}
      </div>
    </div>
    
    <!-- Project Description -->
    ${quote.description ? `
    <div class="description-section">
      <div class="section-title">Project Description / Descripción del Proyecto</div>
      <div class="description-box">
        ${quote.description}
        ${quote.descriptionEs ? `<br><br><em>${quote.descriptionEs}</em>` : ''}
      </div>
    </div>
    ` : ''}
    
    <!-- Line Items -->
    ${lineItems.length > 0 ? `
    <div class="items-section">
      <div class="section-title">Quote Details / Detalle de Cotización</div>
      <table>
        <thead>
          <tr>
            <th style="width: 50%">Description / Descripción</th>
            <th style="width: 15%">Qty / Cant</th>
            <th style="width: 17%">Unit Price</th>
            <th style="width: 18%">Total</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems.map((item: any) => `
            <tr>
              <td>
                <strong>${item.description}</strong>
                ${item.details ? `<div class="item-desc">${item.details}</div>` : ''}
              </td>
              <td>${item.quantity || 1}</td>
              <td>${formatCurrency(item.unitPrice || item.amount || 0)}</td>
              <td>${formatCurrency((item.quantity || 1) * (item.unitPrice || item.amount || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="total-row subtotal">
          <span>Subtotal:</span>
          <span>${formatCurrency(quote.subtotal)}</span>
        </div>
        <div class="total-row tax">
          <span>Tax / Impuesto (${(quote.taxRate * 100).toFixed(1)}%):</span>
          <span>${formatCurrency(quote.taxAmount)}</span>
        </div>
        <div class="total-row grand-total">
          <span>TOTAL:</span>
          <span>${formatCurrency(quote.totalAmount)}</span>
        </div>
        <div class="total-row deposit">
          <span>Deposit Required (${(quote.depositPercent * 100).toFixed(0)}%):</span>
          <span>${formatCurrency(quote.depositAmount)}</span>
        </div>
      </div>
    </div>
    
    <!-- Payment Information -->
    <div class="payment-section">
      <div class="section-title">Payment Methods / Métodos de Pago</div>
      <div class="payment-grid">
        <div class="payment-method">
          <h4>🏦 Bank Transfer / Transferencia Bancaria</h4>
          <p><strong>Bank:</strong> Chase Bank</p>
          <p><strong>Account:</strong> ****0033</p>
          <p><strong>Routing:</strong> 267084131</p>
          <p><strong>Account Name:</strong> IQES LLC</p>
        </div>
        <div class="payment-method">
          <h4>📱 Zelle</h4>
          <p><strong>Email:</strong> <span class="highlight">iqesllc@gmail.com</span></p>
          <p style="margin-top: 10px;"><strong>💳 Credit/Debit Card</strong></p>
          <p>Visa, Mastercard, AMEX accepted</p>
          <p><em>(3% processing fee applies)</em></p>
        </div>
      </div>
    </div>
    
    <!-- Terms & Conditions -->
    <div class="terms-section">
      <div class="section-title">Terms & Conditions / Términos y Condiciones</div>
      <div class="terms-box">
        <ul>
          <li><strong>Deposit:</strong> ${(quote.depositPercent * 100).toFixed(0)}% deposit (${formatCurrency(quote.depositAmount)}) is required to begin work.</li>
          <li><strong>Balance:</strong> Remaining balance due upon project completion.</li>
          <li><strong>Validity:</strong> This quote is valid for ${quote.validDays} days from the date of issue.</li>
          <li><strong>Changes:</strong> Any changes to the scope of work may result in price adjustments.</li>
          <li><strong>Warranty:</strong> All work is guaranteed with industry-standard warranties.</li>
          <li><strong>Permits:</strong> Customer is responsible for obtaining necessary permits unless otherwise specified.</li>
        </ul>
        ${quote.termsConditions ? `<p style="margin-top: 10px;">${quote.termsConditions}</p>` : ''}
      </div>
    </div>
    
    <!-- Authorization Signature -->
    <div class="signature-section">
      <div class="signature-title">📝 AUTHORIZATION / AUTORIZACIÓN</div>
      <div class="authorization-text">
        By signing below, I authorize IQES LLC to proceed with the work as described in this quote.<br>
        I agree to the terms and conditions stated above and authorize payment of the deposit.<br><br>
        <em>Al firmar abajo, autorizo a IQES LLC a proceder con el trabajo descrito en esta cotización.<br>
        Acepto los términos y condiciones indicados y autorizo el pago del depósito.</em>
      </div>
      <div class="signature-grid">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Client Signature / Firma del Cliente</div>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Date / Fecha</div>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <div class="signature-grid">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Print Name / Nombre Completo</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Title / Cargo (if applicable)</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>IQES Low Voltage Solutions</strong> - Innovation & Quality Engineering Services</p>
      <p>📧 info@iqeslowvoltage.com | 📞 (386) 603-9541 | 🌐 www.iqeslowvoltage.com</p>
      <p class="legal">
        This document serves as an official quote and payment authorization. Quote #${quote.quoteNumber}<br>
        © ${new Date().getFullYear()} IQES LLC. All rights reserved. Licensed & Insured in Florida.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    const quote = await prisma.quote.findUnique({
      where: { token },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const htmlContent = generateQuoteHTML(quote);

    // Step 1: Create PDF request
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: htmlContent,
        pdf_options: {
          format: 'Letter',
          margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
          print_background: true,
        },
        base_url: process.env.NEXTAUTH_URL || '',
      }),
    });

    if (!createResponse.ok) {
      console.error('PDF create request failed:', await createResponse.text());
      return NextResponse.json({ error: 'Failed to create PDF request' }, { status: 500 });
    }

    const { request_id } = await createResponse.json();
    if (!request_id) {
      return NextResponse.json({ error: 'No request ID returned' }, { status: 500 });
    }

    // Step 2: Poll for status
    const maxAttempts = 60; // 1 minute max
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, deployment_token: process.env.ABACUSAI_API_KEY }),
      });

      const statusResult = await statusResponse.json();
      const status = statusResult?.status || 'FAILED';
      const result = statusResult?.result || null;

      if (status === 'SUCCESS') {
        if (result && result.result) {
          const pdfBuffer = Buffer.from(result.result, 'base64');
          const filename = `IQES_Quote_${quote.quoteNumber.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
          
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          });
        } else {
          return NextResponse.json({ error: 'PDF generation completed but no result data' }, { status: 500 });
        }
      } else if (status === 'FAILED') {
        const errorMsg = result?.error || 'PDF generation failed';
        console.error('PDF generation failed:', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ error: 'PDF generation timed out' }, { status: 500 });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate PDF' }, { status: 500 });
  }
}
