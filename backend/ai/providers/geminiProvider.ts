import { GoogleGenAI } from '@google/genai';
import { STORE_TOOLS } from '../tools';
import { buildSystemPrompt } from '../prompt';
import { UserContextPayload, ChatHistoryMessage, AiAgentResult, AiAction } from '../types';

function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  return key && key.trim().length > 5 ? key.trim() : null;
}

let cachedClient: GoogleGenAI | null = null;
let lastKeyUsed: string | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const key = getGeminiApiKey();
  if (!key) return null;
  if (!cachedClient || lastKeyUsed !== key) {
    try {
      cachedClient = new GoogleGenAI({ apiKey: key });
      lastKeyUsed = key;
    } catch (err) {
      console.error('[GeminiProvider] Error inicializando cliente GoogleGenAI:', err);
      return null;
    }
  }
  return cachedClient;
}

export function isGeminiAvailable(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function runGeminiAgent(
  message: string,
  userContext?: UserContextPayload,
  history?: ChatHistoryMessage[]
): Promise<AiAgentResult> {
  const aiClient = getGeminiClient();
  if (!aiClient) {
    throw new Error('Gemini AI Client is not configured');
  }

  const systemPrompt = buildSystemPrompt(userContext, history);

  // Convert Universal Tools to Gemini functionDeclarations format
  const geminiFunctions = STORE_TOOLS.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'OBJECT' as any,
      properties: Object.entries(tool.parameters.properties).reduce((acc, [key, prop]) => {
        acc[key] = {
          type: prop.type.toUpperCase() as any,
          description: prop.description,
          ...(prop.enum ? { enum: prop.enum } : {})
        };
        return acc;
      }, {} as any),
      required: tool.parameters.required || []
    }
  }));

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nMENSAJE ACTUAL DEL CLIENTE: "${message}"`,
      config: {
        tools: [{ functionDeclarations: geminiFunctions }]
      }
    });

    const candidate = response.candidates?.[0];
    const actions: AiAction[] = [];
    let textReply = '';

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          textReply += part.text;
        }
        if (part.functionCall) {
          const fc = part.functionCall;
          const args = (fc.args || {}) as Record<string, any>;

          switch (fc.name) {
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
            default:
              break;
          }
        }
      }
    }

    if (!textReply && response.text) {
      textReply = response.text;
    }

    return {
      reply: textReply.trim(),
      actions,
      provider: 'gemini',
      model: 'gemini-2.5-flash'
    };
  } catch (error) {
    console.error('[GeminiProvider] Execution error:', error);
    throw error;
  }
}
