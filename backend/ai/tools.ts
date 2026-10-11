import { UniversalToolDefinition } from './types';

export const STORE_TOOLS: UniversalToolDefinition[] = [
  {
    name: 'addToCart',
    description: 'Agrega un producto específico del catálogo al carrito de compras del cliente con talla y color.',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'El ID exacto del producto (ej: prod-andes-hoodie, prod-noctis-termo, prod-noctis-umbrella, prod-shadow-palm-tee, prod-noctis-cap, prod-andes-beanie, prod-cold-puffer, prod-candelaria-pant).'
        },
        size: {
          type: 'string',
          description: 'La talla seleccionada (S, M, L, XL o UNICA).'
        },
        color: {
          type: 'string',
          description: 'El color seleccionado (Negro, Blanco, Gris, Rojo, Verde).'
        },
        quantity: {
          type: 'number',
          description: 'La cantidad a agregar (por defecto 1).'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'removeFromCart',
    description: 'Retira una prenda específica del carrito de compras del cliente.',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'El ID o nombre de la prenda a retirar.'
        },
        size: {
          type: 'string',
          description: 'La talla de la prenda a retirar.'
        },
        color: {
          type: 'string',
          description: 'El color de la prenda a retirar.'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'clearCart',
    description: 'Vacía y limpia completamente todo el carrito de compras del cliente.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'openCart',
    description: 'Despliega el panel lateral de la bolsa de compras en la pantalla del cliente.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'closeCart',
    description: 'Cierra y oculta el panel lateral del carrito de compras.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'openCheckout',
    description: 'Abre la pasarela de pago seguro Wompi (Nequi, Bancolombia, PSE, Tarjetas) para que el cliente finalice su orden.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'openTracking',
    description: 'Abre el módulo de rastreo en vivo de pedidos y guías de transporte.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'applyCoupon',
    description: 'Aplica un cupón oficial de descuento al carrito (ej: NOCTIS10).',
    parameters: {
      type: 'object',
      properties: {
        couponCode: {
          type: 'string',
          description: 'El código del cupón (ej: NOCTIS10).'
        }
      },
      required: ['couponCode']
    }
  },
  {
    name: 'filterCategory',
    description: 'Filtra el catálogo de productos de la tienda por categoría.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'La categoría a filtrar.',
          enum: ['HOODIES', 'PANTS', 'TEES', 'JACKETS', 'ACCESSORIES', 'ALL']
        }
      },
      required: ['category']
    }
  },
  {
    name: 'openAccount',
    description: 'Abre el panel de perfil del cliente, compras históricas, direcciones y PQRS.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'scrollToSection',
    description: 'Desplaza suavemente la página a una sección específica.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: {
          type: 'string',
          description: 'El ID del elemento o sección (drop, historia, contacto, hero).',
          enum: ['drop', 'historia', 'contacto', 'hero']
        }
      },
      required: ['sectionId']
    }
  },
  {
    name: 'addToWishlist',
    description: 'Guarda o añade una prenda a la lista de Favoritos (Deseos/Wishlist) del cliente.',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'El ID exacto de la prenda a guardar en favoritos (ej: prod-noctis-umbrella, prod-andes-hoodie).'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'removeFromWishlist',
    description: 'Elimina o retira una prenda de la lista de Favoritos del cliente.',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'El ID o nombre de la prenda a retirar de favoritos.'
        }
      },
      required: ['productId']
    }
  },
  {
    name: 'openWishlist',
    description: 'Abre la pestaña de Favoritos / Lista de Deseos en el panel de cuenta del cliente.',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];
