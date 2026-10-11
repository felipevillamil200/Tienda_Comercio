export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // Porcentaje (ej. 15) o valor fijo en COP (ej. 20000)
  minPurchase: number;
  active: boolean;
  expiresAt?: string;
  usageCount: number;
}

export interface ProductGuideConfig {
  preset: 'sizes' | 'tech' | 'dimensions' | 'real_estate' | 'vehicle' | 'custom';
  buttonLabel: string;
  buttonIcon: string;
  modalTitle: string;
  description: string;
  tableHeaders: string[];
  tableRows: Array<Record<string, string>>;
  footerNote: string;
}

export interface StoreSettings {
  announcementText: string;
  announcementActive: boolean;
  freeShippingActive: boolean; // Flag para activar o pausar la meta de envío gratis en tienda
  freeShippingThreshold: number; // Monto mínimo en COP para envío gratis
  standardShippingCost: number; // Costo estándar en COP
  freeGiftActive: boolean; // Flag para activar o pausar el obsequio/regalo por compra
  freeGiftThreshold: number; // Monto mínimo en COP para desbloquear el regalo
  freeGiftName: string; // Nombre del producto o accesorio de obsequio
  freeGiftDescription: string; // Descripción del regalo
  freeGiftImage: string; // URL o foto del obsequio
  productGuide?: ProductGuideConfig; // Configuración universal de guía del producto para cualquier industria
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string; // Número internacional para WhatsApp (ej. 573135859810)
  whatsappMessage: string; // Mensaje predeterminado de inicio
  whatsappTooltip: string; // Texto del tooltip del botón flotante
  contactHeading: string; // Título sección contacto ("Habla con la marca.")
  contactSubtitle: string; // Subtítulo sección contacto
  contactPhoneDisplay: string; // Teléfono visible ("313 585 9810")
  contactEmail: string; // Correo visible ("noirurbano1@gmail.com")
  contactInstagram: string; // Instagram visible ("@noir_urbano")
  contactTiktok: string; // TikTok visible ("@noir.urbano")
}

declare global {
  var __noctisCouponsStore: Coupon[] | undefined;
  var __noctisSettingsStore: StoreSettings | undefined;
}

if (!global.__noctisCouponsStore) {
  global.__noctisCouponsStore = [
    {
      id: 'coup-noctis10',
      code: 'NOCTIS10',
      discountType: 'percentage',
      value: 10,
      minPurchase: 100000,
      active: true,
      expiresAt: '2026-12-31',
      usageCount: 14
    },
    {
      id: 'coup-welcome20',
      code: 'BOGOTA20K',
      discountType: 'fixed',
      value: 20000,
      minPurchase: 150000,
      active: true,
      expiresAt: '2026-12-31',
      usageCount: 8
    }
  ];
}

export const DEFAULT_PRODUCT_GUIDES: Record<string, ProductGuideConfig> = {
  sizes: {
    preset: 'sizes',
    buttonLabel: 'Guía del Producto',
    buttonIcon: 'ruler',
    modalTitle: '📐 Guía del Producto & Medidas',
    description: 'Nuestras prendas cuentan con un corte Boxy / Oversized diseñado para el clima y la silueta urbana de Bogotá. Si prefieres un ajuste más entallado, pide una talla menos.',
    tableHeaders: ['TALLA', 'PECHO (cm)', 'LARGO (cm)', 'MANGA (cm)'],
    tableRows: [
      { c0: 'S (Small)', c1: '56 cm', c2: '68 cm', c3: '58 cm' },
      { c0: 'M (Medium)', c1: '60 cm', c2: '72 cm', c3: '60 cm' },
      { c0: 'L (Large)', c1: '64 cm', c2: '75 cm', c3: '62 cm' },
      { c0: 'XL (Extra Large)', c1: '68 cm', c2: '78 cm', c3: '64 cm' }
    ],
    footerNote: '💡 Referencia de Modelo: 1.82m / 76kg viste talla L para look holgado.'
  },
  tech: {
    preset: 'tech',
    buttonLabel: 'Ficha Técnica',
    buttonIcon: 'zap',
    modalTitle: '⚡ Ficha Técnica & Especificaciones',
    description: 'Especificaciones técnicas oficiales, rendimiento de componentes, arquitectura de hardware y compatibilidad probada.',
    tableHeaders: ['COMPONENTE', 'ESPECIFICACIÓN', 'DETALLE', 'COMPATIBILIDAD'],
    tableRows: [
      { c0: 'Procesador', c1: 'Octa-Core High-Freq', c2: 'Rendimiento ultra fluido', c3: 'Universal' },
      { c0: 'Memoria RAM', c1: '16 GB LPDDR5X', c2: 'Multitarea de alta velocidad', c3: 'Dual-Channel' },
      { c0: 'Batería', c1: '5000 mAh Fast-Charge', c2: 'Hasta 36h de autonomía', c3: 'Carga USB-C 65W' },
      { c0: 'Conectividad', c1: 'Wi-Fi 6E + BT 5.3', c2: 'Baja latencia asegurada', c3: 'iOS / Android / PC' }
    ],
    footerNote: '⚡ Certificación oficial y garantía directa de 12 meses por defectos de fábrica.'
  },
  dimensions: {
    preset: 'dimensions',
    buttonLabel: 'Dimensiones del Producto',
    buttonIcon: 'maximize',
    modalTitle: '📐 Dimensiones, Materiales & Espacio',
    description: 'Consulta las dimensiones exactas y el espacio requerido para asegurar el ajuste perfecto en tus áreas y accesos.',
    tableHeaders: ['VARIANTE', 'ALTO (cm)', 'ANCHO (cm)', 'PROFUNDIDAD (cm)', 'CAPACIDAD MÁX.'],
    tableRows: [
      { c0: 'Compacto / 1 Puesto', c1: '85 cm', c2: '90 cm', c3: '75 cm', c4: 'Hasta 120 kg' },
      { c0: 'Mediano / 2 Puestos', c1: '85 cm', c2: '160 cm', c3: '85 cm', c4: 'Hasta 220 kg' },
      { c0: 'Familiar / 3 Puestos', c1: '88 cm', c2: '210 cm', c3: '90 cm', c4: 'Hasta 320 kg' }
    ],
    footerNote: '📦 Incluye kit de armado rápido y manual detallado de instalación.'
  },
  real_estate: {
    preset: 'real_estate',
    buttonLabel: 'Plano & Especificaciones',
    buttonIcon: 'building',
    modalTitle: '🏢 Ficha Inmobiliaria & Distribución',
    description: 'Distribución arquitectónica, áreas privadas y especificaciones estructurales del inmueble listas para entrega.',
    tableHeaders: ['TIPO DE INMUEBLE', 'ÁREA TOTAL (m²)', 'HABITACIONES', 'BAÑOS', 'PARQUEADERO'],
    tableRows: [
      { c0: 'Suite Ejecutiva', c1: '45 m²', c2: '1 Habitación', c3: '1 Baño', c4: '1 Cubierto' },
      { c0: 'Apartamento Familiar', c1: '85 m²', c2: '3 Habitaciones', c3: '2 Baños', c4: '1 Cubierto + Depósito' },
      { c0: 'Penthouse Exclusivo', c1: '140 m²', c2: '4 Habitaciones', c3: '3 Baños', c4: '2 Paralelos + Terraza' }
    ],
    footerNote: '🏢 Estrato 5/6, acabados de lujo, vigilancia privada 24/7 y áreas sociales completas.'
  },
  vehicle: {
    preset: 'vehicle',
    buttonLabel: 'Ficha del Vehículo',
    buttonIcon: 'truck',
    modalTitle: '🚗 Especificaciones Mecánicas & Rendimiento',
    description: 'Ficha de ingeniería, motorización, potencia y consumo para vehículos o maquinaria certificada.',
    tableHeaders: ['VERSIÓN / MODELO', 'MOTOR', 'POTENCIA (HP)', 'TRANSMISIÓN', 'RENDIMIENTO'],
    tableRows: [
      { c0: 'Base Urbana', c1: '1.6L Gasolina', c2: '125 HP', c3: 'Manual 5 vel.', c4: '60 km/gal' },
      { c0: 'Sport Turbo', c1: '2.0L Turbo', c2: '220 HP', c3: 'Automática 7 vel.', c4: '48 km/gal' },
      { c0: 'Eco Hybrid', c1: '1.8L Híbrido', c2: '140 HP', c3: 'e-CVT Automática', c4: '75 km/gal' }
    ],
    footerNote: '🛡️ Respaldo de fábrica por 5 años o 100.000 km con mantenimientos preventivos incluidos.'
  },
  custom: {
    preset: 'custom',
    buttonLabel: 'Guía del Producto',
    buttonIcon: 'file-text',
    modalTitle: '📋 Guía & Especificaciones del Producto',
    description: 'Información detallada, características técnicas y recomendaciones para tu compra.',
    tableHeaders: ['CARACTERÍSTICA', 'ESPECIFICACIÓN', 'DETALLE ADICIONAL'],
    tableRows: [
      { c0: 'Material Principal', c1: 'Alta Resistencia', c2: 'Certificado de calidad' },
      { c0: 'Garantía Directa', c1: '12 Meses', c2: 'Cobertura nacional' }
    ],
    footerNote: '💡 Producto original garantizado por la tienda.'
  }
};

const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: 'ENVIOS A TODA COLOMBIA — STREETWEAR PREMIUM HECHO EN BOGOTA',
  announcementActive: true,
  freeShippingActive: true,
  freeShippingThreshold: 200000,
  standardShippingCost: 15000,
  freeGiftActive: false,
  freeGiftThreshold: 250000,
  freeGiftName: 'Llavero Táctico & Sticker Pack NOCTIS',
  freeGiftDescription: 'Obsequio exclusivo de la marca incluido en tu paquete por compras superiores a $250.000 COP.',
  freeGiftImage: '/assets/products/umbrella/noctis_umbrella.jpg',
  productGuide: DEFAULT_PRODUCT_GUIDES.sizes,
  supportEmail: 'contacto@noctisurbano.com',
  supportPhone: '+57 313 585 9810',
  whatsappNumber: '573135859810',
  whatsappMessage: 'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.',
  whatsappTooltip: '¿Dudas con tu talla o envío? Chatea con nosotros.',
  contactHeading: 'Habla con la marca.',
  contactSubtitle: 'Envíos locales en Bogotá el mismo día y despachos nacionales. Respondemos por WhatsApp e Instagram.',
  contactPhoneDisplay: '313 585 9810',
  contactEmail: 'noirurbano1@gmail.com',
  contactInstagram: '@noir_urbano',
  contactTiktok: '@noir.urbano'
};

if (!global.__noctisSettingsStore) {
  global.__noctisSettingsStore = { ...DEFAULT_SETTINGS };
}

export function getCoupons(): Coupon[] {
  return global.__noctisCouponsStore || [];
}

export function saveCoupon(coupon: Partial<Coupon>): Coupon {
  const coupons = getCoupons();
  const id = coupon.id || `coup-${Date.now().toString(36)}`;
  const index = coupons.findIndex(c => c.id === id || c.code.toUpperCase() === coupon.code?.toUpperCase());
  
  const formattedCoupon: Coupon = {
    id,
    code: (coupon.code || 'CODE').toUpperCase().trim(),
    discountType: coupon.discountType || 'percentage',
    value: Number(coupon.value) || 0,
    minPurchase: Number(coupon.minPurchase) || 0,
    active: coupon.active !== undefined ? coupon.active : true,
    expiresAt: coupon.expiresAt || '',
    usageCount: coupon.usageCount || 0
  };

  if (index >= 0) {
    coupons[index] = { ...coupons[index], ...formattedCoupon };
    return coupons[index];
  } else {
    coupons.unshift(formattedCoupon);
    return formattedCoupon;
  }
}

export function deleteCoupon(id: string): boolean {
  const coupons = getCoupons();
  const index = coupons.findIndex(c => c.id === id);
  if (index >= 0) {
    coupons.splice(index, 1);
    return true;
  }
  return false;
}

export function getStoreSettings(): StoreSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(global.__noctisSettingsStore || {}),
    productGuide: global.__noctisSettingsStore?.productGuide || DEFAULT_PRODUCT_GUIDES.sizes
  };
}

export function updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getStoreSettings();
  global.__noctisSettingsStore = {
    ...current,
    ...settings,
    productGuide: settings.productGuide ? { ...(current.productGuide || DEFAULT_PRODUCT_GUIDES.sizes), ...settings.productGuide } : current.productGuide
  };
  return global.__noctisSettingsStore;
}
