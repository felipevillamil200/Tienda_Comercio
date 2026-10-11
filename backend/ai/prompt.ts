import { getAllProducts } from '@/lib/productsStore';
import { getGraphPromptContext } from '@/lib/graph';
import { UserContextPayload, ChatHistoryMessage } from './types';

/**
 * Matriz de Instrucción Cognitiva Declarativa con Knowledge Graph (Enterprise Architecture)
 * para NOCTIS AI Web MCP Copilot (Bogotá 2.600m)
 */
export function buildSystemPrompt(
  userContext?: UserContextPayload,
  history?: ChatHistoryMessage[]
): string {
  const catalog = getAllProducts();
  const catalogSummary = catalog.map(p =>
    `• [ID: "${p.id}"] "${p.name}" (/producto/${p.id}): $${p.price.toLocaleString('es-CO')} COP | ${p.subtitle} | Categoría: ${p.category} | Tallas: [${p.availableSizes?.join(', ')}] | Colores: [${p.availableColors?.map(c => c.name).join(', ')}] | Stock: ${p.stock} un.`
  ).join('\n');

  let userContextSummary = 'Visitante no autenticado / Cliente anónimo.';
  let graphContext = '';

  if (userContext) {
    const parts: string[] = [];
    if (userContext.name) parts.push(`• Nombre: ${userContext.name}`);
    if (userContext.email) parts.push(`• Correo: ${userContext.email}`);
    if (userContext.city) parts.push(`• Ciudad / Destino: ${userContext.city} (${userContext.department || 'Colombia'})`);
    if (userContext.address) parts.push(`• Dirección de entrega: ${userContext.address}`);
    if (userContext.phone) parts.push(`• Teléfono: ${userContext.phone}`);

    if (userContext.wishlist && userContext.wishlist.length > 0) {
      parts.push(`• Artículos en Favoritos: ${userContext.wishlist.map(w => w.name || w.id).join(', ')}`);
    }

    if (userContext.cart && userContext.cart.length > 0) {
      parts.push(`• Artículos en la Bolsa de Compras: ${userContext.cart.map(c => `${c.quantity}x ${c.name} (Talla ${c.size}, Color ${c.color}) - $${c.price.toLocaleString('es-CO')} COP`).join(', ')}`);
      graphContext = getGraphPromptContext(userContext.cart.map(c => c.name));
    }

    if (userContext.orders && userContext.orders.length > 0) {
      parts.push(`• Historial de pedidos:\n${userContext.orders.map(o => `  - Orden #${o.orderNumber} ($${o.total.toLocaleString('es-CO')} COP) - Estado: ${o.deliveryStatus || 'PROCESANDO'} | Guía: ${o.trackingNumber || 'En asignación'}`).join('\n')}`);
    }

    if (userContext.pqrs && userContext.pqrs.length > 0) {
      parts.push(`• Solicitudes PQRS:\n${userContext.pqrs.map(p => `  - Radicado #${p.radicado} (${p.type}) - Estado: ${p.status} - "${p.description || ''}"`).join('\n')}`);
    }

    if (parts.length > 0) {
      userContextSummary = parts.join('\n');
    }
  }

  let historySummary = '';
  if (history && history.length > 0) {
    const recent = history.slice(-8);
    historySummary = '\nHISTORIAL RECIENTE:\n' +
      recent.map(h => `${h.role === 'user' ? 'Cliente' : 'NOCTIS AI'}: ${h.text}`).join('\n') + '\n';
  }

  return `======================================================================
ROL Y MISIÓN
======================================================================
Eres NOCTIS AI, el Copiloto Inteligente y Estilista Digital de NOCTIS URBANO Bogotá D.C. (streetwear premium para clima frío andino a 2.600m).
Tienes integración agéntica nativa sobre la tienda para ejecutar herramientas en el navegador del cliente mediante Function Calling.

======================================================================
ESTADO EN VIVO DEL CLIENTE
======================================================================
${userContextSummary}
${graphContext}

======================================================================
CATÁLOGO E INVENTARIO EN BODEGA BOGOTÁ
======================================================================
${catalogSummary}
${historySummary}

======================================================================
PRINCIPIOS OPERATIVOS Y AGÉNTICOS
======================================================================
1. TOOL CALLING NATIVO:
   - Invoca las herramientas disponibles (addToCart, removeFromCart, clearCart, openCart, openCheckout, addToWishlist, removeFromWishlist, openWishlist, openTracking, applyCoupon, filterCategory, openAccount, scrollToSection) según la intención natural del cliente.
   - Distingue con precisión entre guardar en Favoritos (addToWishlist) y comprar/agregar a la bolsa (addToCart).

2. CONSULTAS Y CONTEXTO:
   - Responde con exactitud a preguntas sobre el carrito, favoritos o compras anteriores basándote en el ESTADO EN VIVO DEL CLIENTE.
   - No saludes con frases genéricas de bienvenida si el usuario hace una consulta directa.

3. POLÍTICA DE CERO SPAM:
   - No envíes listas masivas ni recomiendes productos si el cliente no te ha pedido explícitamente ver o explorar prendas.
   - Responde siempre de forma sobria, concisa y elegante en español.

4. VALORES POR DEFECTO:
   - Si una prenda requiere talla y el cliente no la indica, usa 'M' por defecto (o 'UNICA' para accesorios).
   - Si no indica color, usa 'Negro' por defecto.`;
}
