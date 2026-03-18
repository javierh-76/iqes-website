import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// VAPI Webhook - V15
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log('VAPI Webhook:', message?.type || 'unknown');

    // Handle tool-calls
    if (message?.type === 'tool-calls') {
      const toolCall = message?.toolCallList?.[0] || message?.toolCalls?.[0];
      if (!toolCall) {
        return NextResponse.json({ results: [] });
      }

      const functionName = toolCall.function?.name;
      const parameters = typeof toolCall.function?.arguments === 'string' 
        ? JSON.parse(toolCall.function.arguments) 
        : toolCall.function?.arguments || {};

      console.log('Tool call:', functionName, JSON.stringify(parameters));

      // Capture lead and send welcome email
      if (functionName === 'captureLeadInfo') {
        const { name, email, phone, city, serviceInterest, language, projectDetails } = parameters;
        const isSpanish = language === 'spanish' || language === 'es' || language === 'español' || language === 'SPANISH';

        console.log('Capturing lead:', { name, email, phone, city, serviceInterest });

        try {
          // Send welcome email to customer
          if (email) {
            const emailResult = await sendWelcomeEmail(email, name, serviceInterest, isSpanish);
            console.log('Welcome email result:', JSON.stringify(emailResult));
          }

          // Send lead notification to admin
          const adminResult = await sendLeadNotification(name, email, phone, city, serviceInterest, projectDetails || '', isSpanish);
          console.log('Admin email result:', JSON.stringify(adminResult));

        } catch (emailError) {
          console.error('Email error:', emailError);
        }

        return NextResponse.json({
          results: [{
            toolCallId: toolCall.id,
            result: 'Lead captured successfully.'
          }]
        });
      }

      // Get prices from database
      if (functionName === 'getPrices') {
        const { category } = parameters;
        
        const whereClause: { isActive: boolean; category?: { contains: string; mode: 'insensitive' } } = { isActive: true };
        if (category) {
          whereClause.category = { contains: category, mode: 'insensitive' };
        }

        const prices = await prisma.priceItem.findMany({
          where: whereClause,
          orderBy: { sortOrder: 'asc' },
          take: 10,
        });

        const priceList = prices.map((p: { name: string; priceMin: number; priceMax: number; unitLabel?: string | null }) => {
          const priceRange = p.priceMin === p.priceMax 
            ? `$${p.priceMin}` 
            : `$${p.priceMin} - $${p.priceMax}`;
          return `${p.name}: ${priceRange} ${p.unitLabel || ''}`;
        }).join('; ');

        return NextResponse.json({
          results: [{
            toolCallId: toolCall.id,
            result: priceList || 'Contact us for a customized quote.'
          }]
        });
      }

      // Validate email format
      if (functionName === 'validate_email') {
        const { email } = parameters;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email || '');
        
        console.log('Email validation:', email, isValid ? 'VALID' : 'INVALID');
        
        return NextResponse.json({
          results: [{
            toolCallId: toolCall.id,
            result: JSON.stringify({ 
              valid: isValid,
              email: email || '',
              message: isValid ? 'Email format is valid' : 'Invalid email format'
            })
          }]
        });
      }

      // Handle handoff
      if (functionName === 'transferToTechnical') {
        return NextResponse.json({
          results: [{
            toolCallId: toolCall.id,
            result: JSON.stringify({ success: true })
          }]
        });
      }

      return NextResponse.json({
        results: [{ toolCallId: toolCall.id, result: 'OK' }]
      });
    }

    // Handle function-call (legacy)
    if (message?.type === 'function-call') {
      const { functionCall } = message;
      const functionName = functionCall?.name;
      const parameters = functionCall?.parameters || {};

      if (functionName === 'getPrices') {
        const { category } = parameters;
        
        const whereClause: { isActive: boolean; category?: { contains: string; mode: 'insensitive' } } = { isActive: true };
        if (category) {
          whereClause.category = { contains: category, mode: 'insensitive' };
        }

        const prices = await prisma.priceItem.findMany({
          where: whereClause,
          orderBy: { sortOrder: 'asc' },
          take: 10,
        });

        const priceList = prices.map((p: { name: string; priceMin: number; priceMax: number; unitLabel?: string | null }) => {
          const range = p.priceMin === p.priceMax ? `$${p.priceMin}` : `$${p.priceMin}-${p.priceMax}`;
          return `${p.name}: ${range} ${p.unitLabel || ''}`;
        }).join('; ');

        return NextResponse.json({ result: priceList || 'Pricing available upon request.' });
      }

      return NextResponse.json({ result: 'OK' });
    }

    // Handle end-of-call-report - Send call summary to admin
    if (message?.type === 'end-of-call-report') {
      const call = message?.call || {};
      const callId = call?.id || 'unknown';
      const duration = call?.duration || 0;
      const endedReason = call?.endedReason || 'unknown';
      const transcript = message?.transcript || '';
      const summary = message?.summary || '';
      const customerNumber = call?.customer?.number || 'unknown';
      
      console.log('Call ended:', callId, 'Duration:', duration, 'Reason:', endedReason);
      
      // Send call log to admin
      try {
        await sendCallLog(callId, duration, endedReason, customerNumber, transcript, summary);
      } catch (logError) {
        console.error('Call log error:', logError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error';
    console.error('VAPI webhook error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Send welcome email to customer
async function sendWelcomeEmail(email: string, name: string, serviceInterest: string, isSpanish: boolean) {
  const apiKey = process.env.ABACUSAI_API_KEY;
  const appId = process.env.WEB_APP_ID;
  const notificationId = process.env.NOTIF_ID_CHAT_CONVERSATION_FOLLOWUP;

  if (!apiKey || !appId || !notificationId) {
    console.log('Missing env vars for email:', { apiKey: !!apiKey, appId: !!appId, notificationId: !!notificationId });
    return { success: false, reason: 'missing_config' };
  }

  const subject = isSpanish
    ? `¡Gracias por llamar a IQES, ${name || 'estimado cliente'}!`
    : `Thank you for calling IQES, ${name || 'valued customer'}!`;

  const body = isSpanish
    ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#003366;padding:20px;text-align:center">
          <h1 style="color:white;margin:0">IQES Low Voltage Solutions</h1>
        </div>
        <div style="padding:30px;background:#f8f9fa">
          <h2 style="color:#003366">¡Hola ${name || ''}!</h2>
          <p>Gracias por llamar a IQES. Hemos recibido su consulta sobre <strong>${serviceInterest || 'nuestros servicios'}</strong>.</p>
          <p>Nuestro Departamento de Ingeniería está revisando su proyecto y preparando una cotización personalizada.</p>
          <p>Recibirá su cotización dentro de las próximas <strong>24-48 horas</strong>. Si hay dudas técnicas, le contactaremos para aclarar antes de enviar la propuesta.</p>
          <div style="background:#e8f4fd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #003366">
            <p style="margin:0;color:#003366"><strong>💡 ¿Tiene documentación del proyecto?</strong></p>
            <p style="margin:10px 0 0 0;color:#333">Puede <strong>responder a este correo</strong> adjuntando planos, imágenes, videos, dibujos o la dirección exacta del proyecto para agilizar su cotización y hacerla más precisa.</p>
          </div>
          <div style="background:#FF6B00;padding:15px;border-radius:8px">
            <p style="color:white;margin:0;text-align:center">
              <strong>📞 386-603-9541 | 💬 WhatsApp: 786-436-7307</strong>
            </p>
          </div>
        </div>
        <div style="background:#003366;padding:10px;text-align:center">
          <p style="color:white;margin:0;font-size:12px">www.iqeslowvoltage.com</p>
        </div>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#003366;padding:20px;text-align:center">
          <h1 style="color:white;margin:0">IQES Low Voltage Solutions</h1>
        </div>
        <div style="padding:30px;background:#f8f9fa">
          <h2 style="color:#003366">Hello ${name || ''}!</h2>
          <p>Thank you for calling IQES. We received your inquiry about <strong>${serviceInterest || 'our services'}</strong>.</p>
          <p>Our Engineering Department is reviewing your project and preparing a customized quote.</p>
          <p>You'll receive your quote within <strong>24-48 hours</strong>. If we have technical questions, we'll reach out to clarify before sending your proposal.</p>
          <div style="background:#e8f4fd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #003366">
            <p style="margin:0;color:#003366"><strong>💡 Have project documentation?</strong></p>
            <p style="margin:10px 0 0 0;color:#333">You can <strong>reply to this email</strong> with blueprints, images, videos, drawings, or the exact project address to speed up your quote and make it more accurate.</p>
          </div>
          <div style="background:#FF6B00;padding:15px;border-radius:8px">
            <p style="color:white;margin:0;text-align:center">
              <strong>📞 386-603-9541 | 💬 WhatsApp: 786-436-7307</strong>
            </p>
          </div>
        </div>
        <div style="background:#003366;padding:10px;text-align:center">
          <p style="color:white;margin:0;font-size:12px">www.iqeslowvoltage.com</p>
        </div>
      </div>`;

  try {
    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: apiKey,
        app_id: appId,
        notification_id: notificationId,
        recipient_email: email,
        subject,
        body,
        is_html: true,
        sender_email: 'noreply@iqeslowvoltage.com',
        sender_alias: 'IQES Low Voltage Solutions',
      }),
    });

    const result = await response.text();
    console.log('Welcome email API response:', response.status, result);
    return { success: response.ok, status: response.status, result };
  } catch (err) {
    console.error('Welcome email fetch error:', err);
    return { success: false, error: String(err) };
  }
}

// Send lead notification to admin
async function sendLeadNotification(
  name: string, email: string, phone: string, city: string,
  serviceInterest: string, projectDetails: string, isSpanish: boolean
) {
  const apiKey = process.env.ABACUSAI_API_KEY;
  const appId = process.env.WEB_APP_ID;
  const notificationId = process.env.NOTIF_ID_CHAT_LEAD_NOTIFICATION;

  if (!apiKey || !appId || !notificationId) {
    return { success: false, reason: 'missing_config' };
  }

  const body = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#FF6B00;padding:20px;text-align:center">
      <h1 style="color:white;margin:0">📞 Nuevo Lead - Llamada Telefónica</h1>
    </div>
    <div style="padding:30px;background:#f8f9fa">
      <h3 style="color:#003366;margin-top:0">Datos del Cliente</h3>
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#e9ecef"><td style="padding:12px;border:1px solid #ddd;width:30%"><strong>Nombre:</strong></td><td style="padding:12px;border:1px solid #ddd">${name || 'N/A'}</td></tr>
        <tr><td style="padding:12px;border:1px solid #ddd"><strong>Email:</strong></td><td style="padding:12px;border:1px solid #ddd"><a href="mailto:${email || ''}">${email || 'N/A'}</a></td></tr>
        <tr style="background:#e9ecef"><td style="padding:12px;border:1px solid #ddd"><strong>Teléfono:</strong></td><td style="padding:12px;border:1px solid #ddd"><a href="tel:${phone || ''}">${phone || 'N/A'}</a></td></tr>
        <tr><td style="padding:12px;border:1px solid #ddd"><strong>Ciudad:</strong></td><td style="padding:12px;border:1px solid #ddd">${city || 'N/A'}</td></tr>
        <tr style="background:#e9ecef"><td style="padding:12px;border:1px solid #ddd"><strong>Servicio:</strong></td><td style="padding:12px;border:1px solid #ddd"><strong style="color:#FF6B00">${serviceInterest || 'N/A'}</strong></td></tr>
        <tr><td style="padding:12px;border:1px solid #ddd"><strong>Idioma:</strong></td><td style="padding:12px;border:1px solid #ddd">${isSpanish ? '🇪🇸 Español' : '🇺🇸 English'}</td></tr>
      </table>
      ${projectDetails ? `<div style="margin-top:20px;padding:15px;background:white;border-radius:8px;border-left:4px solid #003366">
        <h3 style="color:#003366;margin-top:0">📋 Detalles Técnicos del Proyecto</h3>
        <p style="white-space:pre-wrap">${projectDetails}</p>
      </div>` : ''}
      <div style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px;border-left:4px solid #ffc107">
        <p style="margin:0;color:#856404"><strong>⏰ Próximos pasos:</strong></p>
        <ul style="margin:10px 0 0 0;padding-left:20px;color:#856404">
          <li>Revisar detalles técnicos</li>
          <li>Contactar si hay dudas</li>
          <li>Enviar cotización en 24-48h</li>
        </ul>
      </div>
      <div style="margin-top:15px;padding:15px;background:#d4edda;border-radius:8px">
        <p style="margin:0;color:#155724;text-align:center"><strong>✉️ Email de confirmación enviado al cliente</strong></p>
      </div>
    </div>
  </div>`;

  try {
    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: apiKey,
        app_id: appId,
        notification_id: notificationId,
        recipient_email: 'info@iqeslowvoltage.com',
        subject: `🔔 Llamada: ${name || 'Cliente'} - ${serviceInterest || 'Consulta'} - ${city || 'Florida'}`,
        body,
        is_html: true,
        sender_email: 'noreply@iqeslowvoltage.com',
        sender_alias: 'IQES Voice Assistant',
      }),
    });

    const result = await response.text();
    console.log('Admin email API response:', response.status, result);
    return { success: response.ok, status: response.status, result };
  } catch (err) {
    console.error('Admin email fetch error:', err);
    return { success: false, error: String(err) };
  }
}

// Send call log to admin (for calls where captureLeadInfo was not called)
async function sendCallLog(
  callId: string, duration: number, endedReason: string,
  customerNumber: string, transcript: string, summary: string
) {
  const apiKey = process.env.ABACUSAI_API_KEY;
  const appId = process.env.WEB_APP_ID;
  const notificationId = process.env.NOTIF_ID_CHAT_LEAD_NOTIFICATION;

  if (!apiKey || !appId || !notificationId) {
    console.log('Missing env vars for call log');
    return;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Format transcript for email
  const transcriptHtml = transcript 
    ? transcript.split('\n').map((line: string) => `<p style="margin:5px 0">${line}</p>`).join('')
    : '<p>No transcript available</p>';

  const body = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#003366;padding:20px;text-align:center">
      <h1 style="color:white;margin:0">📞 Registro de Llamada</h1>
    </div>
    <div style="padding:30px;background:#f8f9fa">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr style="background:#e9ecef"><td style="padding:12px;border:1px solid #ddd"><strong>ID Llamada:</strong></td><td style="padding:12px;border:1px solid #ddd">${callId}</td></tr>
        <tr><td style="padding:12px;border:1px solid #ddd"><strong>Número Cliente:</strong></td><td style="padding:12px;border:1px solid #ddd">${customerNumber}</td></tr>
        <tr style="background:#e9ecef"><td style="padding:12px;border:1px solid #ddd"><strong>Duración:</strong></td><td style="padding:12px;border:1px solid #ddd">${durationStr}</td></tr>
        <tr><td style="padding:12px;border:1px solid #ddd"><strong>Motivo Fin:</strong></td><td style="padding:12px;border:1px solid #ddd">${endedReason}</td></tr>
      </table>
      ${summary ? `<div style="margin-bottom:20px;padding:15px;background:white;border-radius:8px;border-left:4px solid #FF6B00"><h3 style="color:#003366;margin-top:0">Resumen</h3><p>${summary}</p></div>` : ''}
      <div style="padding:15px;background:white;border-radius:8px;border-left:4px solid #003366">
        <h3 style="color:#003366;margin-top:0">Transcripción</h3>
        <div style="font-size:14px;color:#333">${transcriptHtml}</div>
      </div>
      <div style="margin-top:20px;padding:15px;background:#fff3cd;border-radius:8px">
        <p style="margin:0;color:#856404"><strong>⚠️ Nota:</strong> Si no se capturaron datos del cliente, usar el número para contactar: ${customerNumber}</p>
      </div>
    </div>
  </div>`;

  try {
    const response = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: apiKey,
        app_id: appId,
        notification_id: notificationId,
        recipient_email: 'info@iqeslowvoltage.com',
        subject: `📞 Registro Llamada: ${customerNumber} - ${durationStr}`,
        body,
        is_html: true,
        sender_email: 'noreply@iqeslowvoltage.com',
        sender_alias: 'IQES Voice Log',
      }),
    });

    const result = await response.text();
    console.log('Call log email sent:', response.status, result);
  } catch (err) {
    console.error('Call log email error:', err);
  }
}
