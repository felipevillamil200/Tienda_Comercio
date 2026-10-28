/**
 * GEMINI AI ADAPTER (COMPATIBILITY SHIM)
 * 
 * NOTA: Este archivo ha sido reemplazado oficialmente por `@/lib/aiProvider` y la arquitectura modular `@/lib/ai/`.
 * Se conserva este archivo como fachada de retrocompatibilidad para evitar roturas de importación.
 */

import { runUniversalAiAgent, UserContextPayload, ChatHistoryMessage, AiAgentResult } from '../ai';
import { isGeminiAvailable, getGeminiClient } from '../ai/providers/geminiProvider';

export function isGeminiConfigured(): boolean {
  return isGeminiAvailable();
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

/**
 * Traduce texto utilizando Gemini con preservación del tono de marca
 */
export async function translateWithGemini(params: {
  text: string;
  targetLang: 'ES' | 'EN';
  context?: string;
}): Promise<string> {
  const { text, targetLang, context = 'Streetwear fashion ecommerce for Bogota cold weather' } = params;

  const aiClient = getGeminiClient();
  if (!aiClient) {
    return text;
  }

  try {
    const prompt = `You are the official translator for NOCTIS URBANO, a premium high-end streetwear fashion brand based in Bogota, Colombia (cold Andean weather, 2,600m altitude).
Translate the following text to ${targetLang === 'EN' ? 'English (US)' : 'Spanish (Latin America)'}.
Context: ${context}
Keep brand names like NOCTIS URBANO, and preserve tone (dark, minimal, premium, structured).
Return ONLY the translated text without commentary or quotes.

Text to translate:
"""${text}"""`;

    const modelName = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error('[Gemini Translation Error]:', error);
    return text;
  }
}

/**
 * Chat interactivo con IA (redirigido al orquestador universal con Tool Calling y matriz de decisiones)
 */
export async function chatWithGemini(
  userMessage: string,
  userContext?: UserContextPayload,
  conversationHistory?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  return runUniversalAiAgent(userMessage, userContext, conversationHistory);
}
