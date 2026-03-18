import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { query, action, priceData } = await request.json();

    // Action to save price to database
    if (action === 'save' && priceData) {
      const saved = await prisma.priceItem.create({
        data: {
          category: priceData.category || 'other',
          name: priceData.name,
          nameEs: priceData.nameEs || priceData.name,
          unit: priceData.unit || 'per_unit',
          unitLabel: priceData.unitLabel || 'per unit',
          unitLabelEs: priceData.unitLabelEs || 'por unidad',
          priceMin: priceData.priceMin,
          priceMax: priceData.priceMax,
          priceAvg: Math.round((priceData.priceMin + priceData.priceMax) / 2),
          isActive: true,
          showInChat: true,
          showInQuote: true,
        },
      });
      return NextResponse.json({ success: true, saved });
    }

    if (!query) {
      return NextResponse.json({ error: 'No query provided' }, { status: 400 });
    }

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an expert in low voltage electrical equipment and services pricing in the USA market.
Your task is to provide reference market prices for BOTH:
1. EQUIPMENT/DEVICES (cameras, NVRs, access panels, cables, switches, access points, etc.)
2. INSTALLATION/LABOR costs

When asked about prices, provide:
1. Equipment/device cost range (min - max) in USD
2. Installation/labor cost range if applicable
3. Popular brands and models with typical prices
4. What factors affect the price

Categories you cover:
- CCTV: IP cameras, PTZ cameras, dome/bullet cameras, NVRs, DVRs
- Fiber Optic: ODF panels, patch cords, splice closures, media converters
- Access Control: electronic locks, card readers, biometric devices, control panels
- Structured Cabling: Cat6/Cat6a cables (per box/ft), patch panels, keystone jacks, wall plates
- Networking: switches, routers, access points, PoE injectors, firewalls
- Accessories: racks, cable management, conduits, mounting hardware

IMPORTANT: At the end of your response, provide a JSON block with suggested price data in this exact format:
\`\`\`json
{
  "suggestions": [
    {
      "name": "Item name in English",
      "nameEs": "Nombre del item en Español",
      "category": "cctv|fiber|access|cabling|wifi",
      "priceMin": 100,
      "priceMax": 200,
      "unit": "per_unit|per_foot|per_camera|per_door|per_point",
      "unitLabel": "per unit",
      "unitLabelEs": "por unidad",
      "type": "equipment|labor|both"
    }
  ]
}
\`\`\`

Provide 1-3 suggestions based on the search query.`;

    const response = await fetch('https://routellm.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Search market prices for: ${query}\n\nInclude both equipment costs and installation/labor costs if applicable. Provide price ranges in USD.` }
        ],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No results found.';

    // Extract JSON suggestions from the response
    let suggestions: any[] = [];
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        suggestions = parsed.suggestions || [];
      } catch (e) {
        console.error('Failed to parse suggestions:', e);
      }
    }

    // Clean the result (remove JSON block for display)
    const cleanResult = result.replace(/```json[\s\S]*?```/g, '').trim();

    return NextResponse.json({ success: true, result: cleanResult, suggestions });
  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
