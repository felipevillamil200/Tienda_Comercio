import { STORE_TOOLS } from '../tools';
import { buildSystemPrompt } from '../prompt';
import { UserContextPayload, ChatHistoryMessage, AiAgentResult, AiAction } from '../types';

export function isOpenRouterAvailable(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 5);
}

// Modelos gratuitos comprobados y optimizados para e-commerce
const FALLBACK_FREE_MODELS = [
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free'
];

export async function runOpenRouterAgent(
  message: string,
  userContext?: UserContextPayload,
  history?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY no está configurada');
  }

  const primaryModel = (process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
  const modelsToTry = [primaryModel, ...FALLBACK_FREE_MODELS.filter(m => m !== primaryModel)];

  const systemPrompt = buildSystemPrompt(userContext, history);

  const openAITools = STORE_TOOLS.map(t => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));

  const messages: any[] = [
    { role: 'system', content: systemPrompt }
  ];

  if (history && history.length > 0) {
    history.slice(-8).forEach(h => {
      messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text
      });
    });
  }

  messages.push({ role: 'user', content: message });

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://tienda-comercio.onrender.com',
          'X-Title': 'NOCTIS URBANO'
        },
        body: JSON.stringify({
          model,
          messages,
          tools: openAITools,
          tool_choice: 'auto'
        }),
        signal: AbortSignal.timeout(12000)
      });

      // Si el modelo no admite tools o devuelve 400, reintentar el mismo modelo como completado puro de texto
      if (response.status === 400) {
        const errText = await response.text();
        console.warn(`[OpenRouter] Reintentando ${model} en modo texto tras rechazo de tools:`, errText.slice(0, 120));
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://tienda-comercio.onrender.com',
            'X-Title': 'NOCTIS URBANO'
          },
          body: JSON.stringify({
            model,
            messages
          }),
          signal: AbortSignal.timeout(12000)
        });
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[OpenRouter] Falló modelo ${model} (${response.status}): ${errText.slice(0, 150)}`);
        lastError = new Error(`OpenRouter (${model}) status ${response.status}: ${errText}`);
        continue; // Intentar con el siguiente modelo de fallback
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const actions: AiAction[] = [];
      const textReply = choice?.message?.content || '';

      if (choice?.message?.tool_calls) {
        for (const tc of choice.message.tool_calls) {
          if (tc.type === 'function') {
            const fnName = tc.function.name;
            let args: any = {};
            try {
              args = JSON.parse(tc.function.arguments || '{}');
            } catch {}

            switch (fnName) {
              case 'addToCart':
                actions.push({
                  type: 'add_to_cart',
                  productId: args.productId,
                  size: args.size || 'M',
                  color: args.color || 'Negro',
                  quantity: args.quantity || 1,
                  autoExecute: true
                });
                break;
              case 'removeFromCart':
                actions.push({
                  type: 'remove_from_cart',
                  productId: args.productId,
                  size: args.size,
                  color: args.color,
                  autoExecute: true
                });
                break;
              case 'clearCart':
                actions.push({ type: 'clear_cart', autoExecute: true });
                break;
              case 'openCart':
                actions.push({ type: 'open_cart', autoExecute: true });
                break;
              case 'closeCart':
                actions.push({ type: 'close_cart', autoExecute: true });
                break;
              case 'openCheckout':
                actions.push({ type: 'open_checkout', autoExecute: true });
                break;
              case 'openTracking':
                actions.push({ type: 'open_tracking', autoExecute: true });
                break;
              case 'applyCoupon':
                actions.push({ type: 'apply_coupon', couponCode: args.couponCode || 'NOCTIS10', autoExecute: true });
                break;
              case 'filterCategory':
                actions.push({ type: 'filter_category', category: args.category, autoExecute: true });
                break;
              case 'openAccount':
                actions.push({ type: 'open_account', autoExecute: true });
                break;
              case 'scrollToSection':
                actions.push({ type: 'scroll_to_section', sectionId: args.sectionId, autoExecute: true });
                break;
              case 'addToWishlist':
                actions.push({
                  type: 'add_to_wishlist',
                  productId: args.productId,
                  autoExecute: true
                });
                break;
              case 'removeFromWishlist':
                actions.push({
                  type: 'remove_from_wishlist',
                  productId: args.productId,
                  autoExecute: true
                });
                break;
              case 'openWishlist':
                actions.push({ type: 'open_wishlist', autoExecute: true });
                break;
            }
          }
        }
      }

      return {
        reply: textReply.trim(),
        actions,
        provider: 'openrouter',
        model
      };
    } catch (err: any) {
      console.warn(`[OpenRouter] Error de conexión con modelo ${model}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('No se pudo conectar con ningún modelo de OpenRouter');
}
