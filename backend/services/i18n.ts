export type Language = 'ES' | 'EN';

export interface ProductTranslation {
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
  category?: string;
  features?: string[];
}

export const COLOR_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ES: {
    'Negro': 'Negro',
    'Blanco': 'Blanco',
    'Gris': 'Gris',
    'Rojo': 'Rojo',
    'Verde': 'Verde',
  },
  EN: {
    'Negro': 'Black',
    'Blanco': 'White',
    'Gris': 'Grey',
    'Rojo': 'Crimson Red',
    'Verde': 'Pine Green',
  }
};

export const PRODUCT_TRANSLATIONS: Record<string, ProductTranslation> = {
  'prod-shadow-palm-tee': {
    name: 'SHADOW HERB TEE',
    subtitle: 'Heavyweight 240 GSM Cotton / Oversized Cut',
    description: 'Black oversized tee crafted from premium 240 GSM combed heavyweight cotton. Engineered with a tight reinforced thick-rib collar to seal in body warmth during chilly Bogota nights. Minimalist front signature and dark stealth herb silk-screen back graphic.',
    badge: 'LIMITED',
    category: 'Tees & Tops',
    features: [
      'Premium 240 GSM combed heavyweight cotton',
      'Structured boxy fit with dropped shoulders',
      'Zero-feel stealth herb screenprint on back',
      'Ethically handcrafted in Bogota, Colombia'
    ]
  },
  'prod-andes-hoodie': {
    name: 'ANDES HEAVY HOODIE',
    subtitle: 'Thermal Heavyweight 450 GSM Fleece Hoodie',
    description: 'Oversized hoodie engineered from ultra-heavy 450-gram thermal brushed fleece cotton. Features a cordless double-layer structured hood, reinforced kangaroo pocket, and boxy silhouette tailored for freezing mountain nights.',
    badge: 'THERMAL',
    category: 'Hoodies & Sweats',
    features: [
      'Ultra-heavyweight 450 GSM brushed fleece cotton',
      'Subtle tone-on-tone NOCTIS front embroidery',
      'Double-layer hood that maintains its structural shape',
      'Heavy-duty ribbing at cuffs and hem'
    ]
  },
  'prod-noctis-puffer': {
    name: 'COLD PUFFER BOGOTÁ',
    subtitle: 'Cropped Waterproof Insulated Puffer Jacket',
    description: 'Boxy cropped puffer jacket in technical ripstop waterproof fabric with ultra-lightweight thermal down-fill insulation. Features a high windproof collar, YKK sealed waterproof zipper, and elasticated hem adjusters built to endure Andean rain.',
    badge: 'WATERPROOF',
    category: 'Jackets & Coats',
    features: [
      'Technical Ripstop shell with water and wind repellent coating',
      'High-loft thermal insulation for extreme cold retention',
      'Hermetic YKK waterproof front zip closure',
      'Cropped boxy silhouette with cinch bungee side toggles'
    ]
  },
  'prod-void-cargo': {
    name: 'VOID TACTICAL CARGO',
    subtitle: '6-Pocket Heavy Ripstop Tactical Pants',
    description: 'Tactical cargo trousers made of heavy ripstop cotton twill. Equipped with 6 utilitarian flap bellows pockets, matte tactical D-rings, and ankle bungee cords allowing quick adjustment from straight leg to tapered cuff.',
    badge: 'UTILITY',
    category: 'Pants & Cargos',
    features: [
      'Tear-resistant reinforced Ripstop cotton twill',
      '6 ergonomic tactical bellow pockets with flap closures',
      'Insulated barrier against biting wind and wet pavement',
      'Elastic toggle drawstrings at ankles for adjustable taper'
    ]
  },
  'prod-noctis-flask': {
    name: 'NOCTIS THERMAL FLASK 750ML',
    subtitle: 'Double-Wall Vacuum Insulated Stainless Steel',
    description: 'Double-wall food-grade 18/8 stainless steel thermal flask with electrostatic stealth finish and laser-etched NOCTIS typography. Keeps drinks piping hot for 18 hours and ice-cold for 24 hours. Leakproof lid with military-grade tactical paracord handle.',
    badge: 'GEAR',
    category: 'Accessories & Gear',
    features: [
      '18/8 food-grade double-wall vacuum insulated stainless steel',
      'Non-slip textured electrostatic powder coating',
      'Heavy-duty military braided 550 paracord lanyard',
      '100% BPA-free and leakproof spill-safe seal'
    ]
  },
  'prod-noctis-cap': {
    name: 'NOCTIS DAD CAP',
    subtitle: 'Heavy Washed Cotton Twill with 3D Embroidery',
    description: 'Structured 6-panel dad cap tailored from heavyweight washed cotton twill. Features curved brim with reinforced topstitching, high-relief 3D NOCTIS front embroidery, and adjustable antique metal buckle closure.',
    badge: 'EDITION',
    category: 'Accessories & Gear',
    features: [
      '100% Heavyweight pre-washed cotton twill',
      'High-density 3D embossed NOCTIS front embroidery',
      'Adjustable back strap with matte metallic slider buckle',
      'Internal moisture-wicking sweatband for all-day wear'
    ]
  },
  'prod-noctis-umbrella': {
    name: 'SHADOW BOGOTÁ UMBRELLA',
    subtitle: 'Reinforced Windproof Auto Open/Close Umbrella',
    description: 'Compact engineered tactical umbrella with instant one-touch auto open and close mechanism. Quick-drying Teflon-coated canopy, carbon-fiber textured ergonomic handle, and 8-rib reinforced wind-defying frame built for Bogota downpours.',
    badge: 'RAINPROOF',
    category: 'Accessories & Gear',
    features: [
      'Fiberglass frame with reinforced 8-point inversion resistance',
      'Instant One-Touch automatic open & close button',
      'Ergonomic carbon fiber textured grip with wrist lanyard',
      'High-density hydrophobic fabric with Teflon coating'
    ]
  },
  'prod-noctis-beanie': {
    name: 'ANDES BEANIE',
    subtitle: 'Ribbed Thermal Wool-Blend Knit Watch Cap',
    description: 'Chunky ribbed knit watch cap crafted from ultra-soft thermal wool blend. Features a structured wide fold-over cuff with a high-definition NOCTIS woven badge in understated tonal contrast. Maximum heat retention for freezing nights.',
    badge: 'THERMAL',
    category: 'Accessories & Gear',
    features: [
      'High-density thermal ribbed knit construction',
      'High-definition woven NOCTIS label patch',
      'Memory-fit stretch that retains original shape',
      'Superior warmth insulation for freezing altitudes'
    ]
  }
};

export const TRANSLATIONS = {
  ES: {
    // Navbar
    'nav.shop': 'TIENDA',
    'nav.collections': 'COLECCIONES',
    'nav.history': 'HISTORIA',
    'nav.contact': 'CONTACTO',
    'nav.cart': 'CARRITO',
    'nav.track': 'SEGUIR PEDIDO',
    'nav.ai': 'NOCTIS AI',
    'nav.login': 'LOGIN',
    'nav.register': 'REGISTRO',

    // Hero
    'hero.eyebrow': 'Bogotá D.C., Colombia // 2.600 M',
    'hero.title': 'NOCTIS URBANO',
    'hero.subtitle': 'Nacido en frío. Hecho en sombra.',
    'hero.cta': 'COMPRAR EL DROP',
    'hero.dropTag': 'DROP 001',
    'hero.cityTag': 'BOGOTÁ NOCTURNA',
    'hero.editionTag': 'EDICIÓN LIMITADA',

    // Drop Signal
    'drop.num': '001',
    'drop.title': 'NOCHES DE BOGOTÁ',
    'drop.desc': 'Entrega limitada. Producción local. Algodón pesado y siluetas oversized para el clima frío.',
    'drop.meta': '19:30 / 11°C NIEBLA URBANA',

    // Identity
    'identity.kicker': 'Identidad de Marca',
    'identity.h2_1': 'No es ropa.',
    'identity.h2_2': 'Es identidad.',
    'identity.p_lead': 'Nacido en Bogotá. / Diseñado para el frío. / Construido en la sombra.',
    'identity.p_body': 'NOCTIS URBANO nace en las calles de la capital colombiana. A 2.600 metros de altura, el asfalto mojado y las noches frías exigen siluetas pesadas, algodón de alto gramaje y presencia sobria sin concesiones.',
    'identity.caption': 'Monserrate & Noche Bogotana. 3.152 M // Frío Andino.',

    // Manifesto
    'manifesto.p1': 'Silencio habla.',
    'manifesto.p2': 'Frío afuera.',
    'manifesto.p3': 'Sombra encima.',

    // Featured Piece
    'featured.kicker': 'Pieza principal',
    'featured.note': 'Una camiseta de algodón pesado para la noche fría capitalina. Logo pequeño al frente, figura de yerba oscura en espalda. Casi invisible. Totalmente intencional.',
    'featured.f1': 'Fit oversized estructurado',
    'featured.f2': 'Algodón premium 240g de alto gramaje',
    'featured.f3': 'Hecha para el frío andino',
    'featured.f4': 'Corte boxy con hombros caídos',
    'featured.cta': 'COMPRAR PIEZA ($150.000 COP)',

    // Product Grid
    'catalog.title': 'CATÁLOGO DE LANZAMIENTO',
    'catalog.subtitle': 'Prendas confeccionadas en sarga y algodón peinado pesado.',
    'catalog.filterAll': 'Todas las piezas',
    'catalog.filterTops': 'Camisetas & Tops',
    'catalog.filterHoodies': 'Hoodies & Buzos',
    'catalog.filterOuterwear': 'Chaquetas & Abrigos',
    'catalog.filterBottoms': 'Pantalones & Cargos',
    'catalog.filterAccessories': 'Accesorios & Equipo',
    'catalog.addToCart': 'AGREGAR',
    'catalog.viewPiece': 'VER PRENDA',
    'catalog.stockUnits': 'unidades en bodega',

    // Modal & Details
    'modal.color': 'COLOR:',
    'modal.size': 'TALLA:',
    'modal.addBtn': 'AGREGAR A LA BOLSA',
    'modal.specs': 'Especificaciones técnicas:',
    'modal.reviewsHeading': 'OPINIONES DE COMPRADORES',
    'modal.withMedia': 'con fotos/videos',
    'modal.hideReviews': '▲ Ocultar',
    'modal.showReviews': '▼ Ver opiniones',
    'modal.verifiedReviews': 'opiniones verificadas',
    'modal.fabricQuality': 'Calidad de tela',
    'modal.fabricRating': '99% Excelente',
    'modal.fitQuality': 'Calce / Fit',
    'modal.fitRating': '98% A la medida',
    'modal.shippingQuality': 'Envío Bogotá',
    'modal.shippingRating': '100% Rápido',
    'modal.buyerGallery': 'Fotos y videos de compradores:',
    'modal.leaveReviewBtn': '+ Dejar mi opinión con Fotos/Videos',
    'modal.cancelReviewBtn': '✕ Cancelar',
    'modal.reviewFormTitle': 'Comparte tu experiencia y look con NOCTIS',
    'modal.yourRating': 'Tu calificación:',
    'modal.inputName': 'Tu nombre (ej: Camilo M.)',
    'modal.inputCity': 'Ciudad (ej: Bogotá)',
    'modal.inputComment': 'Cuéntanos qué te pareció la prenda, el fit, la tela y el acabado...',
    'modal.uploadMediaLabel': '📷 Subir Fotos o Videos de tu prenda / unboxing:',
    'modal.selectDevice': '+ Seleccionar desde tu dispositivo',
    'modal.submitReview': 'PUBLICAR OPINIÓN CON FOTOS / VIDEOS',
    'modal.successReview': '✓ ¡Gracias por tu opinión! Se ha publicado con éxito.',
    'modal.scrollUp': '▲ SUBIR',
    'modal.scrollDown': '▼ BAJAR',
    'modal.verifiedBadge': '✓ Verificado',
    'modal.variantLabel': 'Variante:',

    // Cart Drawer
    'cart.heading': 'TU SELECCIÓN',
    'cart.empty': 'Tu carrito está vacío.',
    'cart.emptySub': 'Explora el catálogo y añade piezas del Drop 001.',
    'cart.size': 'Talla',
    'cart.color': 'Color',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío',
    'cart.freeShipping': 'GRATIS',
    'cart.total': 'Total a Pagar',
    'cart.checkoutBtn': 'PAGAR CON WOMPI',

    // Footer
    'footer.tagline': 'Silencio habla. Bogotá D.C. // 4.7110° N, 74.0721° W',
    'footer.admin': '[Panel de Administración]',
    'footer.shopCol': 'TIENDA',
    'footer.companyCol': 'COMPAÑÍA',
    'footer.followCol': 'SEGUIR'
  },
  EN: {
    // Navbar
    'nav.shop': 'SHOP',
    'nav.collections': 'COLLECTIONS',
    'nav.history': 'STORY',
    'nav.contact': 'CONTACT',
    'nav.cart': 'CART',
    'nav.track': 'TRACK ORDER',
    'nav.ai': 'NOCTIS AI',
    'nav.login': 'LOGIN',
    'nav.register': 'REGISTER',

    // Hero
    'hero.eyebrow': 'Bogotá D.C., Colombia // 8,500 FT',
    'hero.title': 'NOCTIS URBANO',
    'hero.subtitle': 'Born in cold. Made in shadow.',
    'hero.cta': 'SHOP THE DROP',
    'hero.dropTag': 'DROP 001',
    'hero.cityTag': 'NIGHT IN BOGOTA',
    'hero.editionTag': 'LIMITED EDITION',

    // Drop Signal
    'drop.num': '001',
    'drop.title': 'BOGOTA NIGHTS',
    'drop.desc': 'Limited release. Local craftsmanship. Heavyweight cotton and oversized cuts built for the mountain chill.',
    'drop.meta': '19:30 / 11°C URBAN FOG',

    // Identity
    'identity.kicker': 'Brand Identity',
    'identity.h2_1': 'It is not clothing.',
    'identity.h2_2': 'It is identity.',
    'identity.p_lead': 'Born in Bogota. / Engineered for the cold. / Built in the shadows.',
    'identity.p_body': 'NOCTIS URBANO is born on the high-altitude streets of Colombia’s capital. At 8,500 feet above sea level, wet asphalt and freezing nights demand heavy silhouettes, heavyweight cotton, and uncompromising stealth presence.',
    'identity.caption': 'Monserrate & Bogota Nightscape. 3,152 M // Andean Cold.',

    // Manifesto
    'manifesto.p1': 'Silence speaks.',
    'manifesto.p2': 'Cold outside.',
    'manifesto.p3': 'Shadows above.',

    // Featured Piece
    'featured.kicker': 'Hero Piece',
    'featured.note': 'A heavyweight cotton tee tailored for chilly capital nights. Minimalist front signature, dark stealth herb artwork on back. Subtle and intentional.',
    'featured.f1': 'Structured oversized boxy fit',
    'featured.f2': 'Premium 240 GSM heavyweight combed cotton',
    'featured.f3': 'Engineered for Andean cold climate',
    'featured.f4': 'Dropped shoulder boxy construction',
    'featured.cta': 'BUY PIECE ($150,000 COP)',

    // Product Grid
    'catalog.title': 'OFFICIAL LAUNCH CATALOG',
    'catalog.subtitle': 'Garments tailored in tactical twill and heavyweight combed cotton.',
    'catalog.filterAll': 'All Pieces',
    'catalog.filterTops': 'Tees & Tops',
    'catalog.filterHoodies': 'Hoodies & Sweats',
    'catalog.filterOuterwear': 'Jackets & Coats',
    'catalog.filterBottoms': 'Pants & Cargos',
    'catalog.filterAccessories': 'Accessories & Gear',
    'catalog.addToCart': 'ADD TO CART',
    'catalog.viewPiece': 'VIEW DETAILS',
    'catalog.stockUnits': 'units available',

    // Modal & Details
    'modal.color': 'COLOR:',
    'modal.size': 'SIZE:',
    'modal.addBtn': 'ADD TO BAG',
    'modal.specs': 'Technical specifications:',
    'modal.reviewsHeading': 'CUSTOMER REVIEWS',
    'modal.withMedia': 'with photos/videos',
    'modal.hideReviews': '▲ Hide',
    'modal.showReviews': '▼ View reviews',
    'modal.verifiedReviews': 'verified reviews',
    'modal.fabricQuality': 'Fabric Quality',
    'modal.fabricRating': '99% Outstanding',
    'modal.fitQuality': 'Fit / Silhouette',
    'modal.fitRating': '98% True to size',
    'modal.shippingQuality': 'Fast Delivery',
    'modal.shippingRating': '100% Express',
    'modal.buyerGallery': 'Customer photos and unboxing videos:',
    'modal.leaveReviewBtn': '+ Leave Review with Photos/Videos',
    'modal.cancelReviewBtn': '✕ Cancel',
    'modal.reviewFormTitle': 'Share your NOCTIS look and experience',
    'modal.yourRating': 'Your rating:',
    'modal.inputName': 'Your name (e.g. Liam S.)',
    'modal.inputCity': 'City / Country (e.g. London / NY)',
    'modal.inputComment': 'Tell us about the fabric weight, fit, stitching and finishing...',
    'modal.uploadMediaLabel': '📷 Upload Photos or Videos of your piece / fit:',
    'modal.selectDevice': '+ Select from your device',
    'modal.submitReview': 'PUBLISH REVIEW WITH PHOTOS / VIDEOS',
    'modal.successReview': '✓ Thank you! Your review has been published successfully.',
    'modal.scrollUp': '▲ SCROLL UP',
    'modal.scrollDown': '▼ SCROLL DOWN',
    'modal.verifiedBadge': '✓ Verified Buyer',
    'modal.variantLabel': 'Variant:',

    // Cart Drawer
    'cart.heading': 'YOUR SELECTION',
    'cart.empty': 'Your cart is empty.',
    'cart.emptySub': 'Explore the launch catalog and add pieces from Drop 001.',
    'cart.size': 'Size',
    'cart.color': 'Color',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.freeShipping': 'FREE',
    'cart.total': 'Total to Pay',
    'cart.checkoutBtn': 'PROCEED TO WOMPI CHECKOUT',

    // Footer
    'footer.tagline': 'Silence speaks. Bogotá D.C. // 4.7110° N, 74.0721° W',
    'footer.admin': '[Admin Control Panel]',
    'footer.shopCol': 'SHOP',
    'footer.companyCol': 'COMPANY',
    'footer.followCol': 'FOLLOW'
  }
};

export function getTranslation(key: string, lang: Language = 'ES'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ES;
  return (dict as Record<string, string>)[key] || key;
}

export function translateColor(color: string, lang: Language = 'ES'): string {
  return COLOR_TRANSLATIONS[lang]?.[color] || color;
}

/**
 * Returns a translated version of a Product object according to the selected language
 */
export function getTranslatedProduct<T extends { id: string; name: string; subtitle?: string; description?: string; badge?: string; category?: string; features?: string[] }>(
  product: T,
  lang: Language = 'ES'
): T {
  if (lang === 'ES') return product;

  const translation = PRODUCT_TRANSLATIONS[product.id];
  if (!translation) return product;

  return {
    ...product,
    name: translation.name || product.name,
    subtitle: translation.subtitle || product.subtitle,
    description: translation.description || product.description,
    badge: translation.badge || product.badge,
    category: translation.category || product.category,
    features: translation.features || product.features
  };
}

