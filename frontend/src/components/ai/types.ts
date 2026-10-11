import { Product } from '@/types';
import { AiAction } from '@/lib/ai/types';

export type { AiAction };

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  products?: Product[];
  actions?: AiAction[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface AiUserContext {
  name?: string;
  email?: string;
  city?: string;
  department?: string;
  address?: string;
  phone?: string;
  wishlist?: Array<{ id: string }>;
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
    description: string;
  }>;
}
