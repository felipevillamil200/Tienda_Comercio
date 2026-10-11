import { STORE_TOOLS } from '../tools';
import { buildSystemPrompt } from '../prompt';
import { UserContextPayload, ChatHistoryMessage, AiAgentResult, AiAction } from '../types';

export function isOpenAIAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5);
}

export async function runOpenAIAgent(
  message: string,
  userContext?: UserContextPayload,
  history?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

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

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      tools: openAITools,
      tool_choice: 'auto'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
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
    provider: 'openai',
    model
  };
}
