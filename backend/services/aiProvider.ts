/**
 * AI PROVIDER - CEREBRO Y MOTOR DE DECISIONES DE NOCTIS URBANO
 * 
 * Capa agnóstica de Inteligencia Artificial para e-commerce empresarial.
 * Desacoplado de proveedores específicos (Google Gemini, OpenAI GPT-4o, Anthropic, DeepSeek).
 * Soporta Tool Calling nativo, matrices cognitivas de decisión, RAG semántico y control MCP.
 */

import { runUniversalAiAgent, AiAgentResult, UserContextPayload, ChatHistoryMessage, AiAction } from '../ai';
import { translateWithGemini, isGeminiConfigured } from './gemini';

export * from '../ai';

/**
 * Verifica si algún proveedor de IA empresarial está configurado y activo
 */
export function isAiConfigured(): boolean {
  return isGeminiConfigured() || Boolean(process.env.OPENAI_API_KEY);
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
  return translateWithGemini(params);
}
