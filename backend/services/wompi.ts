import crypto from 'crypto';
import { Order, OrderStatus } from '@/types';

export const WOMPI_CONFIG = {
  publicKey: process.env.WOMPI_PUBLIC_KEY || '',
  integritySecret: process.env.WOMPI_INTEGRITY_SECRET || '',
  eventsSecret: process.env.WOMPI_EVENTS_SECRET || '',
  currency: 'COP',
  checkoutUrl: 'https://checkout.wompi.co/p/',
  redirectUrl: process.env.WOMPI_REDIRECT_URL || 'http://localhost:4173/?pago=wompi'
};

export function generateWompiSignature(reference: string, amountInCents: number, currency: string = 'COP'): string {
  const secret = WOMPI_CONFIG.integritySecret;
  const rawString = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash('sha256').update(rawString).digest('hex');
}

export function generateOrderReference(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = Date.now().toString(36).toUpperCase();
  return `NOCTIS-${dateStr}-${random}`;
}

export function generateAccessToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

// In-Memory Order Repository
declare global {
  var __noctisOrdersStore: Order[] | undefined;
  var __noirOrdersStore: Order[] | undefined;
}

if (!global.__noctisOrdersStore) {
  global.__noctisOrdersStore = global.__noirOrdersStore || [];
}

export function getAllOrders(): Order[] {
  return global.__noctisOrdersStore || [];
}

export function findOrderByReference(reference: string): Order | undefined {
  return (global.__noctisOrdersStore || []).find(o => o.reference === reference);
}

export function findOrderByNumberAndToken(orderNumber: string, token: string): Order | undefined {
  const clean = orderNumber.replace(/^#/, '').trim().toUpperCase();
  const withoutPrefix = clean.replace(/^ORD-/, '');
  const withPrefix = `ORD-${withoutPrefix}`;

  return (global.__noctisOrdersStore || []).find(
    o => {
      const oNum = (o.orderNumber || '').toUpperCase();
      const oRef = (o.reference || '').toUpperCase();
      const oId = (o.id || '').toUpperCase();

      const matchesNumber = 
        oNum === clean ||
        oNum === withPrefix ||
        oNum === withoutPrefix ||
        oNum.replace(/^ORD-/, '') === withoutPrefix ||
        oRef === clean ||
        oRef.includes(clean) ||
        oId === clean;

      const matchesToken = !token || o.accessToken === token.trim();
      return matchesNumber && matchesToken;
    }
  );
}

export function saveOrder(order: Order): Order {
  const store = global.__noctisOrdersStore || [];
  const idx = store.findIndex(o => o.id === order.id || o.reference === order.reference);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...order, updatedAt: new Date().toISOString() };
    return store[idx];
  } else {
    store.unshift(order);
    return order;
  }
}

export function updateOrderStatus(reference: string, status: OrderStatus, transactionId?: string, paymentMethod?: string): Order | undefined {
  const order = findOrderByReference(reference);
  if (order) {
    order.status = status;
    if (transactionId) order.transactionId = transactionId;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    order.updatedAt = new Date().toISOString();
    return saveOrder(order);
  }
  return undefined;
}

export function deleteOrder(referenceOrId: string): boolean {
  const store = global.__noctisOrdersStore || [];
  const idx = store.findIndex(o => o.id === referenceOrId || o.reference === referenceOrId);
  if (idx >= 0) {
    store.splice(idx, 1);
    return true;
  }
  return false;
}
