/**
 * AI PROVIDER - CEREBRO Y MOTOR DE DECISIONES DE NOCTIS URBANO
 * 
 * Capa agnóstica de Inteligencia Artificial para e-commerce empresarial.
 * Desacoplado de proveedores específicos (Google Gemini, OpenAI GPT-4o, Anthropic, DeepSeek).
 * Soporta Tool Calling nativo, matrices cognitivas de decisión, RAG semántico y control MCP.
 */

import { runUniversalAiAgent, isOpenRouterAvailable, AiAgentResult, UserContextPayload, ChatHistoryMessage, AiAction } from '../ai';
import { translateWithGemini, isGeminiConfigured } from './gemini';

export * from '../ai';

/**
 * Traduce texto utilizando OpenRouter con preservación del tono de marca
 */
export async function translateWithOpenRouter(params: {
  text: string;
  targetLang: 'ES' | 'EN';
  context?: string;
}): Promise<string> {
  const { text, targetLang, context = 'Streetwear fashion ecommerce for Bogota cold weather' } = params;
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return text;

  try {
    const prompt = `You are the official translator for NOCTIS URBANO, a premium high-end streetwear fashion brand based in Bogota, Colombia.
Translate the following text to ${targetLang === 'EN' ? 'English (US)' : 'Spanish (Latin America)'}.
Context: ${context}
Keep brand names like NOCTIS URBANO, and preserve tone (dark, minimal, premium, structured).
Return ONLY the translated text without commentary or quotes.

Text to translate:
"""${text}"""`;

    const model = (process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://tienda-comercio.onrender.com',
        'X-Title': 'NOCTIS URBANO'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250
      })
    });

    if (!response.ok) return text;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch (err) {
    console.warn('[OpenRouter Translation Warning]:', err);
    return text;
  }
}

/**
 * Verifica si algún proveedor de IA empresarial está configurado y activo
 */
export function isAiConfigured(): boolean {
  return isOpenRouterAvailable() || isGeminiConfigured() || Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Punto de entrada principal para el chat interactivo del copiloto empresarial
 */
export async function chatWithAiProvider(
  userMessage: string,
  userContext?: UserContextPayload,
  conversationHistory?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  return runUniversalAiAgent(userMessage, userContext, conversationHistory);
}

/**
 * Servicio de traducción contextual multi-idioma (ES <-> EN)
 */
export async function translateWithAi(params: {
  text: string;
  targetLang: 'ES' | 'EN';
  context?: string;
}): Promise<string> {
  if (isOpenRouterAvailable()) {
    return translateWithOpenRouter(params);
  }
  return translateWithGemini(params);
}

