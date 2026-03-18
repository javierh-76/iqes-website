import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const analysisType = formData.get('type') as string || 'general';
    const language = formData.get('language') as string || 'en';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileType = file.type;
    const fileName = file.name;
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');

    let messages: any[] = [];
    const systemPrompt = language === 'es' 
      ? `Eres un experto analizador de documentos técnicos para IQES Low Voltage Solutions, una empresa de instalaciones eléctricas de baja tensión en Florida.
         
         Servicios que ofrece IQES:
         - Fibra Óptica (instalación, fusión, certificación)
         - CCTV y Sistemas de Vigilancia
         - Control de Acceso
         - Cableado Estructurado (Cat5e, Cat6, Cat6a)
         - Servicios de IT y Networking
         
         Analiza el documento/imagen proporcionado y:
         1. Identifica el tipo de proyecto o necesidad
         2. Extrae información técnica relevante (medidas, especificaciones, materiales)
         3. Sugiere servicios de IQES que podrían aplicar
         4. Proporciona una estimación preliminar si es posible
         5. Lista cualquier pregunta adicional que necesitamos aclarar con el cliente
         
         Responde de manera profesional pero amigable, en español.`
      : `You are an expert document analyzer for IQES Low Voltage Solutions, an electrical low voltage installation company in Florida.
         
         Services IQES offers:
         - Fiber Optic (installation, splicing, certification)
         - CCTV and Surveillance Systems
         - Access Control
         - Structured Cabling (Cat5e, Cat6, Cat6a)
         - IT Services and Networking
         
         Analyze the provided document/image and:
         1. Identify the type of project or need
         2. Extract relevant technical information (measurements, specifications, materials)
         3. Suggest IQES services that could apply
         4. Provide a preliminary estimate if possible
         5. List any additional questions we need to clarify with the customer
         
         Respond professionally but friendly, in English.`;

    // Handle different file types
    if (fileType.startsWith('image/')) {
      // Image analysis
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Please analyze this ${analysisType} image/plan and provide insights for a low voltage project.` },
            { type: 'image_url', image_url: { url: `data:${fileType};base64,${base64String}` } }
          ]
        }
      ];
    } else if (fileType === 'application/pdf') {
      // PDF analysis
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'file', file: { filename: fileName, file_data: `data:application/pdf;base64,${base64String}` } },
            { type: 'text', text: `Please analyze this ${analysisType} PDF document and provide insights for a low voltage project.` }
          ]
        }
      ];
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload an image or PDF.' }, { status: 400 });
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: messages,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', errorText);
      return NextResponse.json({ error: 'Failed to analyze document' }, { status: 500 });
    }

    const result = await response.json();
    const analysis = result.choices?.[0]?.message?.content || 'Unable to analyze the document.';

    return NextResponse.json({
      success: true,
      analysis,
      fileName,
      fileType,
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
