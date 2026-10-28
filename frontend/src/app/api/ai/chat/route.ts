import { NextRequest, NextResponse } from 'next/server';
import { runUniversalAiAgent } from '@/lib/aiProvider';

export async function POST(req: NextRequest) {
  try {
    const { message, userContext, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const result = await runUniversalAiAgent(message, userContext, history);

    return NextResponse.json({
      reply: result.reply,
      recommendedProducts: result.recommendedProducts || [],
      actions: result.actions || [],
      engine: result.model,
      source: result.provider === 'gemini' 
        ? 'Google Gemini 2.5 Flash (Tool Calling Nativo)' 
        : result.provider === 'openai' 
        ? 'OpenAI / Universal Agent (Tool Calling Nativo)' 
        : 'NOCTIS Semantic Core (Fallback)'
    });
  } catch (error: any) {
    console.error('[/api/ai/chat Error]:', error);
    return NextResponse.json({ error: 'Error procesando respuesta de IA' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getGeminiClient } = await import('@/lib/ai/providers/geminiProvider');
    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY no configurada' });
    }
    const response = await client.models.list();
    const models: string[] = [];
    for await (const m of response) {
      if (m.name) models.push(m.name);
    }
    return NextResponse.json({ ok: true, count: models.length, models });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) });
  }
}
