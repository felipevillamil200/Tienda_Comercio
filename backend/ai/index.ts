import { UserContextPayload, ChatHistoryMessage, AiAgentResult, AiAction } from './types';
import { runOpenRouterAgent, isOpenRouterAvailable } from './providers/openrouterProvider';
import { runGeminiAgent, isGeminiAvailable } from './providers/geminiProvider';
import { runOpenAIAgent, isOpenAIAvailable } from './providers/openaiProvider';
import { getAllProducts, getProductById } from '@/lib/productsStore';

export * from './types';
export * from './tools';
export * from './prompt';
export { isOpenRouterAvailable } from './providers/openrouterProvider';

export async function runUniversalAiAgent(
  message: string,
  userContext?: UserContextPayload,
  history?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  const providerPreference = (process.env.AI_PROVIDER || 'openrouter').toLowerCase();
  const allProds = getAllProducts();

  let agentResult: AiAgentResult | null = null;
  let lastError: string | null = null;

  // 1. Intento con OpenRouter (Prioridad principal por estabilidad y modelos gratuitos :free)
  if ((providerPreference === 'openrouter' || !agentResult) && isOpenRouterAvailable()) {
    try {
      agentResult = await runOpenRouterAgent(message, userContext, history);
    } catch (err: any) {
      console.warn('[UniversalAiAgent] OpenRouter error:', err?.message || err);
      lastError = err?.message;
    }
  }

  // 2. Intento con OpenAI (si está configurado)
  if (!agentResult && (providerPreference === 'openai' || isOpenAIAvailable())) {
    try {
      agentResult = await runOpenAIAgent(message, userContext, history);
    } catch (err: any) {
      console.warn('[UniversalAiAgent] OpenAI error:', err?.message || err);
      lastError = err?.message;
    }
  }

  // 3. Intento con Gemini (fallback o si es el proveedor seleccionado)
  if (!agentResult && isGeminiAvailable()) {
    try {
      agentResult = await runGeminiAgent(message, userContext, history);
    } catch (err: any) {
      console.warn('[UniversalAiAgent] Gemini error:', err?.message || err);
      lastError = err?.message;
    }
  }

  // 4. Si no hay proveedor configurado o falló la conexión con el LLM
  if (!agentResult || !agentResult.reply) {
    const errorDetail = lastError ? ` (Detalle: ${lastError})` : '';
    agentResult = {
      reply: `⚠️ Para interactuar con el Copiloto de IA de NOCTIS URBANO, asegúrate de configurar tu **OPENROUTER_API_KEY** en las variables de entorno.${errorDetail}`,
      actions: [
        {
          type: 'go_to_catalog',
          label: '⚡ Ver Catálogo de Prendas'
        }
      ],
      recommendedProducts: [],
      provider: 'fallback',
      model: 'unconfigured'
    };
  }

  // Enriquecer las acciones generadas por la IA con los datos completos del producto
  const enrichedActions = (agentResult.actions || []).map(act => {
    if (act.productId && !act.product) {
      const prod = getProductById(act.productId) || 
        allProds.find(p => p.id.toLowerCase().includes(act.productId!.toLowerCase()) || p.name.toLowerCase().includes(act.productId!.toLowerCase()));
      if (prod) {
        return { ...act, product: prod };
      }
    }
    return act;
  });

  return {
    ...agentResult,
    actions: enrichedActions,
    recommendedProducts: agentResult.recommendedProducts || []
  };
}
