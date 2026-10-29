import { Product } from '@/types';

export interface AiAction {
  type: 
    | 'go_to_catalog' 
    | 'open_product' 
    | 'close_product' 
    | 'add_to_cart' 
    | 'remove_from_cart' 
    | 'clear_cart' 
    | 'open_cart' 
    | 'close_cart' 
    | 'apply_coupon' 
    | 'remove_coupon' 
    | 'open_checkout' 
    | 'close_checkout' 
    | 'open_tracking' 
    | 'close_tracking' 
    | 'open_account' 
    | 'close_account' 
    | 'filter_category' 
    | 'open_categories' 
    | 'scroll_to_section' 
    | 'view_stock'
    | 'add_to_wishlist'
    | 'remove_from_wishlist'
    | 'open_wishlist';
  label?: string;
  productId?: string;
  product?: Product;
  size?: string;
  color?: string;
  quantity?: number;
  couponCode?: string;
  category?: string;
  sectionId?: string;
  autoExecute?: boolean;
}

export interface UniversalToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface UserContextPayload {
  name?: string;
  email?: string;
  city?: string;
  department?: string;
  address?: string;
  phone?: string;
  wishlist?: Array<{ id: string; name?: string; price?: number }>;
  cart?: Array<{
    name: string;
    size: string;
    quantity: number;
    color: string;
    price: number;
  }>;
  orders?: Array<{
    orderNumber: string;
    reference: string;
    total: number;
    deliveryStatus?: string;
    trackingNumber?: string;
    items?: any[];
  }>;
  pqrs?: Array<{
    radicado: string;
    type: string;
    status: string;
    description?: string;
  }>;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

export interface AiAgentResult {
  reply: string;
  actions: AiAction[];
  recommendedProducts?: Product[];
  provider: 'openrouter' | 'gemini' | 'openai' | 'anthropic' | 'fallback';
  model: string;
}
