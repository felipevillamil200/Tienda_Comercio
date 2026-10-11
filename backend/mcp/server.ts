import {
  JsonRpcRequest,
  JsonRpcResponse,
  JSON_RPC_ERRORS,
  McpTool,
  McpToolCallResult,
  McpResource,
  McpResourceContent,
  McpPrompt,
  McpServerInfo,
  McpServerCapabilities
} from './types';
import { getAllProducts, getProductById } from '@/lib/productsStore';
import { DEFAULT_CATEGORY_GROUPS } from '@/lib/categoriesStore';

export const MCP_SERVER_INFO: McpServerInfo = {
  name: 'noctis-urbano-mcp',
  version: '2.0.0'
};

export const MCP_PROTOCOL_VERSION = '2024-11-05';

export const MCP_CAPABILITIES: McpServerCapabilities = {
  tools: {
    listChanged: false
  },
  resources: {
    subscribe: false,
    listChanged: false
  },
  prompts: {
    listChanged: false
  }
};

/**
 * Catálogo formal de Herramientas MCP para ChatGPT y Agentes Autónomos
 */
export const MCP_TOOLS: McpTool[] = [
  {
    name: 'noctis_search_products',
    description: 'Busca prendas y accesorios del catálogo de NOCTIS URBANO por texto, categoría o rango de precio.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Texto de búsqueda (nombre, palabra clave, corte o material, ej: "hoodie", "puffer", "sombrilla").'
        },
        category: {
          type: 'string',
          description: 'Categoría específica',
          enum: ['HOODIES', 'PANTS', 'TEES', 'JACKETS', 'ACCESSORIES', 'ALL']
        },
        maxPrice: {
          type: 'number',
          description: 'Precio máximo en Pesos Colombianos (COP).'
        },
        inStockOnly: {
          type: 'boolean',
          description: 'Si es true, solo retorna artículos con stock mayor a 0 en bodega Bogotá.'
        }
      }
    }
  },
  {
    name: 'noctis_get_product_detail',
    description: 'Obtiene la ficha técnica completa de un producto por su ID o slug (gramaje GSM, materiales, tallas, stock y cuidados).',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID del producto (ej: "prod-andes-hoodie", "prod-cold-puffer", "prod-shadow-palm-tee").'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'noctis_check_stock',
    description: 'Consulta en tiempo real la disponibilidad y stock en bodega Bogotá para un producto y talla específica.',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID del producto a consultar.'
        },
        size: {
          type: 'string',
          description: 'Talla (S, M, L, XL, UNICA).'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'noctis_calculate_order',
    description: 'Calcula el subtotal, descuentos por cupón, costo de envío e IVA para una lista de productos en Colombia.',
    inputSchema: {
      type: 'object',
      properties: {
        items: {
          type: 'string',
          description: 'JSON array serializado con { productId, quantity, size, color }.'
        },
        couponCode: {
          type: 'string',
          description: 'Código de cupón promocional opcional (ej: "NOCTIS10").'
        },
        destinationCity: {
          type: 'string',
          description: 'Ciudad de entrega en Colombia (ej: "Bogotá", "Medellín", "Cali").'
        }
      },
      required: ['items']
    }
  },
  {
    name: 'noctis_validate_coupon',
    description: 'Verifica la validez, porcentaje de descuento y condiciones de un cupón de descuento.',
    inputSchema: {
      type: 'object',
      properties: {
        couponCode: {
          type: 'string',
          description: 'Código del cupón a validar (ej: "NOCTIS10", "WELCOME5").'
        }
      },
      required: ['couponCode']
    }
  },
  {
    name: 'noctis_get_brand_ethos',
    description: 'Retorna el manifiesto de diseño y especificaciones climáticas de NOCTIS URBANO (Bogotá 2.600m, lluvia andina y gramajes pesados).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'noctis_get_graph_recommendations',
    description: 'Consulta el Grafo Relacional de Entidades (Knowledge Graph) para obtener recomendaciones de capas (layering), outfits y prendas complementarias para una prenda específica.',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'ID del producto a consultar en el grafo (ej: "prod-andes-hoodie", "prod-noctis-puffer").'
        }
      },
      required: ['productId']
    }
  }
];

/**
 * Recursos MCP para proveer contexto en tiempo real a LLMs
 */
export const MCP_RESOURCES: McpResource[] = [
  {
    uri: 'noctis://catalog/products',
    name: 'Catálogo Oficial de Productos NOCTIS URBANO',
    description: 'Lista completa y actualizada de prendas, precios en COP, gramajes y existencias en bodega Bogotá.',
    mimeType: 'application/json'
  },
  {
    uri: 'noctis://catalog/categories',
    name: 'Estructura de Categorías y Drops',
    description: 'Jerarquía de colecciones, categorías y prendas insignia.',
    mimeType: 'application/json'
  },
  {
    uri: 'noctis://policies/shipping',
    name: 'Políticas de Envío, Envíos Gratis y Tiempos de Entrega',
    description: 'Tiempos de entrega en Bogotá (mismo día/24h) y nacional (2-3 días), tarifas y cobertura.',
    mimeType: 'text/markdown'
  },
  {
    uri: 'noctis://brand/manifesto',
    name: 'Manifiesto de Marca e Identidad Térmica',
    description: 'Concepto de diseño urbano para clima frío andino a 2.600 msnm.',
    mimeType: 'text/markdown'
  }
];

/**
 * Plantillas de Prompts MCP para ChatGPT
 */
export const MCP_PROMPTS: McpPrompt[] = [
  {
    name: 'bogota_streetwear_stylist',
    description: 'Configura a ChatGPT como Asesor de Estilo y Outfit Personalizado para el clima de Bogotá.',
    arguments: [
      {
        name: 'genderPreference',
        description: 'Preferencia de silueta o estilo (oversized, boxy fit, unisex).',
        required: false
      },
      {
        name: 'budgetCOP',
        description: 'Presupuesto aproximado en COP.',
        required: false
      }
    ]
  },
  {
    name: 'noctis_shopping_assistant',
    description: 'Asistente de compras y resolución de dudas técnicas sobre gramajes de tela y tallaje.',
    arguments: [
      {
        name: 'customerCity',
        description: 'Ciudad de destino del cliente para calcular tiempos de envío.',
        required: false
      }
    ]
  }
];

/**
 * Manejador principal de Tool Calling para MCP
 */
async function handleToolCall(name: string, args: Record<string, any> = {}): Promise<McpToolCallResult> {
  const allProducts = getAllProducts();

  switch (name) {
    case 'noctis_search_products': {
      let filtered = [...allProducts];
      if (args.category && args.category !== 'ALL') {
        filtered = filtered.filter(p => p.category?.toUpperCase() === args.category.toUpperCase());
      }
      if (args.query) {
        const q = String(args.query).toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.badge?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      if (typeof args.maxPrice === 'number') {
        filtered = filtered.filter(p => p.price <= args.maxPrice);
      }
      if (args.inStockOnly) {
        filtered = filtered.filter(p => (p.stock || 0) > 0);
      }

      const results = filtered.map(p => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        priceCOP: p.price,
        formattedPrice: `$${p.price.toLocaleString('es-CO')} COP`,
        category: p.category,
        badge: p.badge,
        tags: p.tags,
        stock: p.stock,
        sizes: p.availableSizes || [],
        colors: p.availableColors?.map(c => c.name) || []
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ count: results.length, products: results }, null, 2)
        }]
      };
    }

    case 'noctis_get_product_detail': {
      const prod = getProductById(args.productId) ||
        allProducts.find(p => p.id.toLowerCase() === String(args.productId).toLowerCase() || p.name.toLowerCase().includes(String(args.productId).toLowerCase()));

      if (!prod) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Producto con identificador "${args.productId}" no encontrado en el catálogo de NOCTIS URBANO.`
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            id: prod.id,
            name: prod.name,
            subtitle: prod.subtitle,
            description: prod.description,
            price: prod.price,
            formattedPrice: `$${prod.price.toLocaleString('es-CO')} COP`,
            category: prod.category,
            badge: prod.badge,
            tags: prod.tags,
            stockBogota: prod.stock,
            availableSizes: prod.availableSizes,
            availableColors: prod.availableColors,
            specifications: {
              fabric: prod.category === 'HOODIES' ? 'Algodón Pesado 450 GSM French Terry' : prod.category === 'TEES' ? 'Algodón Peinado 240 GSM Pesado' : prod.category === 'JACKETS' ? 'Ripstop Impermeable con Aislamiento Térmico' : 'Streetwear de Alto Rendimiento',
              origin: 'Bogotá D.C., Colombia',
              care: 'Lavar en frío, no usar secadora a altas temperaturas, planchar al revés.'
            }
          }, null, 2)
        }]
      };
    }

    case 'noctis_check_stock': {
      const prod = getProductById(args.productId) ||
        allProducts.find(p => p.id.toLowerCase() === String(args.productId).toLowerCase());

      if (!prod) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Producto "${args.productId}" no encontrado.` }]
        };
      }

      const inStock = (prod.stock || 0) > 0;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            productId: prod.id,
            productName: prod.name,
            requestedSize: args.size || 'M',
            available: inStock,
            stockQuantity: prod.stock,
            warehouse: 'Bodega Central Bogotá (Despacho Inmediato)',
            estimatedDeliveryBogota: '1 día hábil',
            estimatedDeliveryColombia: '2 a 3 días hábiles'
          }, null, 2)
        }]
      };
    }

    case 'noctis_calculate_order': {
      let itemsList: any[] = [];
      try {
        itemsList = typeof args.items === 'string' ? JSON.parse(args.items) : args.items;
      } catch {
        return {
          isError: true,
          content: [{ type: 'text', text: 'El parámetro items debe ser un array JSON válido.' }]
        };
      }

      let subtotal = 0;
      const parsedItems = itemsList.map((item: any) => {
        const prod = getProductById(item.productId) || allProducts.find(p => p.id === item.productId);
        const unitPrice = prod ? prod.price : (item.price || 0);
        const qty = item.quantity || 1;
        const total = unitPrice * qty;
        subtotal += total;
        return {
          productId: item.productId,
          name: prod ? prod.name : item.productId,
          size: item.size || 'M',
          color: item.color || 'Negro',
          unitPrice,
          quantity: qty,
          totalPrice: total
        };
      });

      let discount = 0;
      const coupon = String(args.couponCode || '').toUpperCase().trim();
      if (coupon === 'NOCTIS10') {
        discount = Math.round(subtotal * 0.10);
      } else if (coupon === 'WELCOME5') {
        discount = Math.round(subtotal * 0.05);
      }

      const isBogota = String(args.destinationCity || '').toLowerCase().includes('bogot');
      const freeShippingThreshold = 200000;
      const shippingCost = (subtotal >= freeShippingThreshold || isBogota) ? 0 : 15000;
      const total = Math.max(0, subtotal - discount + shippingCost);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            subtotal,
            formattedSubtotal: `$${subtotal.toLocaleString('es-CO')} COP`,
            couponApplied: coupon || null,
            discountAmount: discount,
            shippingCost,
            freeShippingApplied: shippingCost === 0,
            destinationCity: args.destinationCity || 'Bogotá D.C.',
            totalToPay: total,
            formattedTotal: `$${total.toLocaleString('es-CO')} COP`,
            items: parsedItems
          }, null, 2)
        }]
      };
    }

    case 'noctis_validate_coupon': {
      const code = String(args.couponCode || '').toUpperCase().trim();
      const validCoupons: Record<string, { percent: number; description: string }> = {
        'NOCTIS10': { percent: 10, description: '10% de descuento en toda la orden.' },
        'WELCOME5': { percent: 5, description: '5% de descuento para nuevos clientes.' }
      };

      if (validCoupons[code]) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              code,
              isValid: true,
              discountPercent: validCoupons[code].percent,
              description: validCoupons[code].description
            }, null, 2)
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            code,
            isValid: false,
            message: 'El código de cupón no existe o ha expirado.'
          }, null, 2)
        }]
      };
    }

    case 'noctis_get_brand_ethos': {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            brand: 'NOCTIS URBANO',
            altitude: '2.600 msnm (Bogotá D.C., Colombia)',
            aesthetic: 'Streetwear minimalista, paleta oscura, siluetas sobredimensionadas, cortes andinos estructurados.',
            materials: [
              'Heavyweight French Terry (450 GSM)',
              'Combed Cotton Oversized (240 GSM)',
              'Ripstop Thermal Water-repellent'
            ],
            paymentGateway: 'Wompi Colombia (Nequi, Bancolombia, Tarjetas, PSE)',
            logistics: 'Envíos asegurados a todo el territorio nacional.'
          }, null, 2)
        }]
      };
    }

    case 'noctis_get_graph_recommendations': {
      const { getConnectedEntities } = await import('@/lib/graph');
      const relations = getConnectedEntities(String(args.productId || ''));
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            targetProduct: args.productId,
            connectedGraphEntities: relations.map(r => ({
              id: r.product.id,
              name: r.product.name,
              category: r.product.category,
              price: r.product.price,
              relationship: r.relationship,
              compatibilityScore: r.weight,
              sharedAttributes: r.sharedAttributes
            }))
          }, null, 2)
        }]
      };
    }

    default:
      return {
        isError: true,
        content: [{ type: 'text', text: `Herramienta "${name}" no reconocida por el servidor MCP.` }]
      };
  }
}

/**
 * Manejador principal de Lectura de Recursos MCP
 */
async function handleResourceRead(uri: string): Promise<McpResourceContent> {
  const allProducts = getAllProducts();

  switch (uri) {
    case 'noctis://catalog/products':
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(allProducts, null, 2)
      };

    case 'noctis://catalog/categories':
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(DEFAULT_CATEGORY_GROUPS, null, 2)
      };

    case 'noctis://policies/shipping':
      return {
        uri,
        mimeType: 'text/markdown',
        text: `# Políticas de Envío — NOCTIS URBANO Bogotá

- **Bogotá D.C.:** Envío express (1 día hábil). Envío GRATIS en compras superiores a $200.000 COP.
- **Ciudades Principales (Medellín, Cali, Barranquilla, Bucaramanga):** 2 a 3 días hábiles vía Coordinadora / Servientrega.
- **Resto de Colombia:** 3 a 5 días hábiles.
- **Rastreo:** Cada pedido genera una guía de despacho rastreable en tiempo real desde la plataforma.
- **Cambios y Devoluciones:** 30 días calendario para cambio de talla sin costo de flete por defecto de fábrica.`
      };

    case 'noctis://brand/manifesto':
      return {
        uri,
        mimeType: 'text/markdown',
        text: `# Manifiesto NOCTIS URBANO — Noches Andinas a 2.600 Metros

NOCTIS URBANO nace de la niebla, el frío constante y el asfalto de Bogotá.
Nuestras prendas están diseñadas como armaduras urbanas térmicas con gramajes pesados (450 GSM), patronaje boxy fit y acabados sobrios de alta durabilidad.`
      };

    default:
      throw new Error(`Recurso no encontrado: ${uri}`);
  }
}

/**
 * Enrutador y Despachador de Protocolo JSON-RPC 2.0 para MCP
 */
export async function dispatchMcpRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const { id, method, params } = request;

  if (request.jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      id: id || null,
      error: JSON_RPC_ERRORS.INVALID_REQUEST
    };
  }

  try {
    switch (method) {
      case 'initialize': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: MCP_PROTOCOL_VERSION,
            serverInfo: MCP_SERVER_INFO,
            capabilities: MCP_CAPABILITIES
          }
        };
      }

      case 'notifications/initialized': {
        // Notification ack
        return {
          jsonrpc: '2.0',
          id,
          result: { initialized: true }
        };
      }

      case 'ping': {
        return {
          jsonrpc: '2.0',
          id,
          result: {}
        };
      }

      case 'tools/list': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS
          }
        };
      }

      case 'tools/call': {
        if (!params || !params.name) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              ...JSON_RPC_ERRORS.INVALID_PARAMS,
              data: 'El parámetro "name" es requerido en tools/call'
            }
          };
        }
        const callResult = await handleToolCall(params.name, params.arguments || {});
        return {
          jsonrpc: '2.0',
          id,
          result: callResult
        };
      }

      case 'resources/list': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            resources: MCP_RESOURCES
          }
        };
      }

      case 'resources/read': {
        if (!params || !params.uri) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              ...JSON_RPC_ERRORS.INVALID_PARAMS,
              data: 'El parámetro "uri" es requerido en resources/read'
            }
          };
        }
        const resourceContent = await handleResourceRead(params.uri);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [resourceContent]
          }
        };
      }

      case 'prompts/list': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            prompts: MCP_PROMPTS
          }
        };
      }

      case 'prompts/get': {
        const promptName = params?.name;
        if (promptName === 'bogota_streetwear_stylist') {
          return {
            jsonrpc: '2.0',
            id,
            result: {
              description: 'Estilista de Streetwear Bogotano',
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: 'Actúa como el Director Creativo y Estilista de NOCTIS URBANO. Recomienda outfits técnicos de 450 GSM considerando lluvia y temperatura de 12°C en Bogotá.'
                  }
                }
              ]
            }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          error: {
            ...JSON_RPC_ERRORS.INVALID_PARAMS,
            data: `Prompt "${promptName}" no encontrado.`
          }
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            ...JSON_RPC_ERRORS.METHOD_NOT_FOUND,
            data: `Método MCP no soportado: ${method}`
          }
        };
    }
  } catch (error: any) {
    console.error(`[MCP Server Error on ${method}]:`, error);
    return {
      jsonrpc: '2.0',
      id,
      error: {
        ...JSON_RPC_ERRORS.INTERNAL_ERROR,
        data: error?.message || 'Error desconocido procesando solicitud MCP'
      }
    };
  }
}
