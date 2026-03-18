import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, subjectEs, message, messageEs, serviceArea } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact form submission
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        phone,
        subject,
        subjectEs,
        message,
        messageEs,
        serviceArea,
        status: 'new',
      },
    });

    // Send email notification to admin
    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = 'IQES Low Voltage Solutions';
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366; border-bottom: 2px solid #00A651; padding-bottom: 10px;">
            📧 Nuevo Mensaje de Contacto / New Contact Message
          </h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 Nombre / Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>📱 Teléfono / Phone:</strong> ${phone || 'No proporcionado'}</p>
            <p style="margin: 10px 0;"><strong>📍 Área de Servicio / Service Area:</strong> ${serviceArea || 'No especificada'}</p>
            <p style="margin: 10px 0;"><strong>📋 Asunto / Subject:</strong> ${subject}</p>
            <p style="margin: 10px 0;"><strong>💬 Mensaje / Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #003366;">
              ${message}
            </div>
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
          notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
          subject: `[IQES Contact] New message from ${name}`,
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
        message: 'Contact form submitted successfully',
        id: contactForm.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const contacts = await prisma.contactForm.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
