import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceType,
      projectDetails,
      projectDetailsEs,
      firstName,
      lastName,
      email,
      phone,
      companyName,
      serviceArea,
      budgetRange,
      preferredContact,
      attachments,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !serviceType || !projectDetails || !serviceArea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        serviceType: Array.isArray(serviceType) ? serviceType : [serviceType],
        projectDetails,
        projectDetailsEs,
        firstName,
        lastName,
        email,
        phone,
        companyName,
        serviceArea,
        budgetRange,
        preferredContact: preferredContact || 'email',
        attachments: attachments || [],
        status: 'new',
      },
    });

    // Send email notification to admin
    try {
      const appName = 'IQES Low Voltage Solutions';
      const servicesFormatted = Array.isArray(serviceType) ? serviceType.join(', ') : serviceType;
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366; border-bottom: 2px solid #00A651; padding-bottom: 10px;">
            📋 Nueva Solicitud de Cotización / New Quote Request
          </h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #003366; margin-top: 0;">📞 Información del Cliente / Client Info</h3>
            <p style="margin: 10px 0;"><strong>👤 Nombre / Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 10px 0;"><strong>🏢 Empresa / Company:</strong> ${companyName || 'No especificada'}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>📱 Teléfono / Phone:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong>💬 Contacto preferido / Preferred Contact:</strong> ${preferredContact || 'Email'}</p>
            
            <h3 style="color: #003366; margin-top: 20px;">🔧 Detalles del Proyecto / Project Details</h3>
            <p style="margin: 10px 0;"><strong>📍 Área de Servicio / Service Area:</strong> ${serviceArea}</p>
            <p style="margin: 10px 0;"><strong>🛠️ Servicios / Services:</strong> ${servicesFormatted}</p>
            <p style="margin: 10px 0;"><strong>💰 Presupuesto / Budget:</strong> ${budgetRange || 'No especificado'}</p>
            <p style="margin: 10px 0;"><strong>📝 Descripción / Description:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #003366;">
              ${projectDetails}
            </div>
            ${attachments && attachments.length > 0 ? `
              <p style="margin: 10px 0; margin-top: 15px;"><strong>📎 Archivos adjuntos / Attachments:</strong> ${attachments.length} archivo(s)</p>
            ` : ''}
          </div>
          <p style="color: #666; font-size: 12px;">
            Enviado / Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
          </p>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_QUOTE_REQUEST,
          subject: `[IQES Quote] New request from ${firstName} ${lastName} - ${servicesFormatted}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'info@iqeslowvoltage.com',
          sender_alias: appName,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Quote request submitted successfully',
        id: quoteRequest.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const quotes = await prisma.quoteRequest.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error: any) {
    console.error('Get quotes error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
