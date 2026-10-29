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
      source: result.provider === 'openrouter'
        ? `OpenRouter AI (${result.model}) [Tool Calling Nativo]`
        : result.provider === 'gemini' 
        ? 'Google Gemini (Legacy Fallback)' 
        : result.provider === 'openai' 
        ? 'OpenAI / Universal Agent (Tool Calling Nativo)' 
        : 'NOCTIS Semantic Core (Fallback)'
    });
  } catch (error: any) {
    console.error('[/api/ai/chat Error]:', error);
    return NextResponse.json({ 
      error: 'Error procesando respuesta de IA',
      detail: error?.message || String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey && openrouterKey.trim().length > 5) {
      return NextResponse.json({
        ok: true,
        activeProvider: 'openrouter',
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',
        status: 'OPENROUTER_OPERATIONAL',
        freeModelsSupported: [
          'openrouter/free',
          'google/gemma-4-31b-it:free',
          'nvidia/nemotron-3.5-lightning:free',
          'meta-llama/llama-3.3-70b-instruct:free',
          'deepseek/deepseek-r1:free'
        ]
      });
    }

    const { getGeminiClient } = await import('@/lib/ai/providers/geminiProvider');
    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Ni OPENROUTER_API_KEY ni GEMINI_API_KEY están configuradas',
        recommendation: 'Configura OPENROUTER_API_KEY=sk-or-v1-... en tus variables de entorno.'
      });
    }
    const response = await client.models.list();
    const models: string[] = [];
    for await (const m of response) {
      if (m.name) models.push(m.name);
    }
    return NextResponse.json({ ok: true, activeProvider: 'gemini', count: models.length, models });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) });
  }
}
