import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FollowUpData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  city?: string;
  serviceInterest?: string;
  conversationSummary?: string;
  language: 'en' | 'es';
}

export async function POST(request: NextRequest) {
  try {
    const data: FollowUpData = await request.json();
    const { customerName, customerEmail, customerPhone, city, serviceInterest, conversationSummary, language } = data;

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const isSpanish = language === 'es';

    // Email to customer
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #003366; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">IQES Low Voltage Solutions</h1>
      <p style="color: #FF6B00; margin: 10px 0 0 0; font-size: 14px;">
        ${isSpanish ? 'Soluciones Profesionales en Cableado Estructurado y Telecomunicaciones' : 'Professional Structured Cabling & Telecommunications Solutions'}
      </p>
    </div>

    <!-- Welcome Message -->
    <div style="padding: 30px;">
      <h2 style="color: #003366; margin: 0 0 20px 0;">
        ${isSpanish ? `¡Bienvenido(a), ${customerName}!` : `Welcome, ${customerName}!`}
      </h2>
      <p style="color: #333333; font-size: 16px; line-height: 1.6;">
        ${isSpanish 
          ? 'Gracias por contactarnos a través de nuestro chat. Nos complace poder asistirle con sus necesidades de infraestructura de bajo voltaje.' 
          : 'Thank you for contacting us through our chat. We are pleased to assist you with your low voltage infrastructure needs.'}
      </p>
      
      ${serviceInterest ? `
      <div style="background-color: #f8f9fa; border-left: 4px solid #FF6B00; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #003366; font-weight: bold;">
          ${isSpanish ? 'Su consulta:' : 'Your inquiry:'}
        </p>
        <p style="margin: 10px 0 0 0; color: #333333;">
          ${serviceInterest}
        </p>
      </div>
      ` : ''}

      <p style="color: #333333; font-size: 16px; line-height: 1.6;">
        ${isSpanish 
          ? '✅ Su solicitud está siendo procesada y un especialista se comunicará con usted pronto.' 
          : '✅ Your request is being processed and a specialist will contact you soon.'}
      </p>
    </div>

    <!-- Services Section -->
    <div style="background-color: #f8f9fa; padding: 30px;">
      <h3 style="color: #003366; margin: 0 0 20px 0; text-align: center;">
        ${isSpanish ? '🛠️ Nuestros Servicios' : '🛠️ Our Services'}
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; vertical-align: top; width: 50%;">
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; height: 100%;">
              <h4 style="color: #FF6B00; margin: 0 0 10px 0;">🔌 ${isSpanish ? 'Fibra Óptica' : 'Fiber Optic'}</h4>
              <p style="color: #666666; font-size: 13px; margin: 0;">
                ${isSpanish ? 'Instalación, fusión, certificación y reparación' : 'Installation, splicing, certification & repair'}
              </p>
            </div>
          </td>
          <td style="padding: 10px; vertical-align: top; width: 50%;">
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; height: 100%;">
              <h4 style="color: #FF6B00; margin: 0 0 10px 0;">📹 CCTV</h4>
              <p style="color: #666666; font-size: 13px; margin: 0;">
                ${isSpanish ? 'Cámaras de seguridad, DVR/NVR, monitoreo remoto' : 'Security cameras, DVR/NVR, remote monitoring'}
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; vertical-align: top;">
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; height: 100%;">
              <h4 style="color: #FF6B00; margin: 0 0 10px 0;">🔐 ${isSpanish ? 'Control de Acceso' : 'Access Control'}</h4>
              <p style="color: #666666; font-size: 13px; margin: 0;">
                ${isSpanish ? 'Cerraduras electrónicas, lectores biométricos' : 'Electronic locks, biometric readers'}
              </p>
            </div>
          </td>
          <td style="padding: 10px; vertical-align: top;">
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; height: 100%;">
              <h4 style="color: #FF6B00; margin: 0 0 10px 0;">🌐 ${isSpanish ? 'Cableado y Redes' : 'Cabling & Networks'}</h4>
              <p style="color: #666666; font-size: 13px; margin: 0;">
                ${isSpanish ? 'Cat5e, Cat6, Cat6a, WiFi empresarial' : 'Cat5e, Cat6, Cat6a, Enterprise WiFi'}
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Payment Methods -->
    <div style="padding: 30px;">
      <h3 style="color: #003366; margin: 0 0 20px 0; text-align: center;">
        ${isSpanish ? '💳 Métodos de Pago Aceptados' : '💳 Accepted Payment Methods'}
      </h3>
      <div style="text-align: center;">
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">💳 Visa/Mastercard</span>
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">💳 American Express</span>
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">🅿️ PayPal</span>
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">⚡ Zelle</span>
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">🏦 ${isSpanish ? 'Transferencia Bancaria' : 'Bank Transfer'}</span>
        <span style="display: inline-block; background-color: #f8f9fa; padding: 10px 20px; margin: 5px; border-radius: 20px; font-size: 14px; color: #333333;">📅 Affirm (${isSpanish ? 'Financiamiento' : 'Financing'})</span>
      </div>
    </div>

    <!-- Contact Section -->
    <div style="background-color: #003366; padding: 30px; text-align: center;">
      <h3 style="color: #ffffff; margin: 0 0 20px 0;">
        ${isSpanish ? '📞 Contáctenos' : '📞 Contact Us'}
      </h3>
      <p style="margin: 10px 0;">
        <a href="tel:386-603-9541" style="color: #FF6B00; text-decoration: none; font-size: 18px; font-weight: bold;">📞 386-603-9541</a>
      </p>
      <p style="margin: 10px 0;">
        <a href="mailto:info@iqeslowvoltage.com" style="color: #ffffff; text-decoration: none; font-size: 16px;">✉️ info@iqeslowvoltage.com</a>
      </p>
      <p style="margin: 10px 0;">
        <a href="https://wa.me/17864367307" style="color: #25D366; text-decoration: none; font-size: 16px;">💬 WhatsApp: 786-436-7307</a>
      </p>
      <p style="color: #ffffff; margin: 20px 0 0 0; font-size: 14px;">
        ${isSpanish ? '🌎 Servicio en todo el estado de Florida' : '🌎 Serving all of Florida'}
      </p>
    </div>

    <!-- CTA Button -->
    <div style="padding: 30px; text-align: center;">
      <a href="${process.env.NEXTAUTH_URL || 'https://iqes-lowvoltage.abacusai.app'}/quote" 
         style="display: inline-block; background-color: #FF6B00; color: #ffffff; padding: 15px 40px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
        ${isSpanish ? '📝 Solicitar Cotización' : '📝 Request a Quote'}
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
      <p style="color: #666666; font-size: 12px; margin: 0;">
        © 2024 IQES Low Voltage Solutions LLC. ${isSpanish ? 'Todos los derechos reservados.' : 'All rights reserved.'}
      </p>
      <p style="color: #999999; font-size: 11px; margin: 10px 0 0 0;">
        Jacksonville | Orlando | Tampa | Tallahassee | Fort Myers | Miami | West Palm Beach
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to customer
    try {
      console.log('Sending customer follow-up email to:', customerEmail);
      const customerResponse = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CHAT_CONVERSATION_FOLLOWUP,
          recipient_email: customerEmail,
          subject: isSpanish 
            ? `¡Bienvenido a IQES Low Voltage Solutions, ${customerName}!`
            : `Welcome to IQES Low Voltage Solutions, ${customerName}!`,
          body: customerEmailHtml,
          is_html: true,
          sender_email: 'noreply@iqeslowvoltage.com',
          sender_alias: 'IQES Low Voltage Solutions',
        }),
      });
      const customerResult = await customerResponse.text();
      console.log('Customer email response:', customerResponse.status, customerResult);
    } catch (err) {
      console.error('Error sending customer email:', err);
    }

    // Email to admin (info@iqeslowvoltage.com)
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background-color: #003366; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 New Chat Lead</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #003366; margin: 0 0 20px 0;">Customer Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
        </tr>
        ${customerPhone ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${customerPhone}">${customerPhone}</a></td>
        </tr>
        ` : ''}
        ${city ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">City:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${city}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Language:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${isSpanish ? 'Spanish' : 'English'}</td>
        </tr>
      </table>

      ${serviceInterest ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #003366; margin: 0 0 10px 0;">Service Interest:</h3>
        <p style="margin: 0; color: #333333;">${serviceInterest}</p>
      </div>
      ` : ''}

      ${conversationSummary ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 8px;">
        <h3 style="color: #856404; margin: 0 0 10px 0;">Conversation Summary:</h3>
        <p style="margin: 0; color: #333333; white-space: pre-wrap;">${conversationSummary}</p>
      </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #666666; font-size: 14px;">
          📅 Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to admin
    try {
      console.log('Sending admin notification email to: info@iqeslowvoltage.com');
      const adminResponse = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CHAT_LEAD_NOTIFICATION,
          recipient_email: 'info@iqeslowvoltage.com',
          subject: `🔔 New Chat Lead: ${customerName} - ${serviceInterest || 'General Inquiry'}`,
          body: adminEmailHtml,
          is_html: true,
          sender_email: 'noreply@iqeslowvoltage.com',
          sender_alias: 'IQES Low Voltage Solutions',
        }),
      });
      const adminResult = await adminResponse.text();
      console.log('Admin email response:', adminResponse.status, adminResult);
    } catch (err) {
      console.error('Error sending admin email:', err);
    }

    console.log('Follow-up emails process completed for:', customerEmail);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Follow-up email error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send follow-up' }, { status: 500 });
  }
}
