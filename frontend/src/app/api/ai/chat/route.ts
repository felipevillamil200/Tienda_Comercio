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
