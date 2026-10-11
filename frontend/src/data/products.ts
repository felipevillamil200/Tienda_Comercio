import { Product, ColorVariant } from '@/types';

export const STANDARD_COLORS: ColorVariant[] = [
  { name: 'Negro', hex: '#0d0d0d' },
  { name: 'Blanco', hex: '#f0ede6' },
  { name: 'Gris', hex: '#5f6368' },
  { name: 'Rojo', hex: '#991b1b' },
  { name: 'Verde', hex: '#264633' }
];

export const NOCTIS_PRODUCTS: Product[] = [
  {
    id: 'prod-shadow-palm-tee',
    name: 'SHADOW HERB TEE',
    subtitle: 'Algodón pesado 240g / fit oversized',
    description: 'Camiseta negra oversized confeccionada en algodón pesado peinado de 240 GSM. Diseñada con cuello cerrado reforzado en rib grueso para retener la temperatura en las noches frías de Bogotá. Estampado serigráfico en espalda de yerba oscura en tono sigilo (stealth).',
    price: 150000,
    badge: 'LIMITADA',
    image: '/assets/products/tee/noctis_herb_tee.jpg',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/tee/noctis_herb_tee.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/tee/noctis_herb_tee_blanco.png' },
      { name: 'Gris', hex: '#8a8d91', image: '/assets/products/tee/noctis_herb_tee_gris.png' },
      { name: 'Rojo', hex: '#801824', image: '/assets/products/tee/noctis_herb_tee_rojo.jpg' },
      { name: 'Verde', hex: '#3f6b45', image: '/assets/products/tee/noctis_herb_tee_verde.png' }
    ],
    features: [
      'Algodón peinado premium 240 GSM de alto gramaje',
      'Corte boxy fit / hombros caídos estructurado',
      'Estampado tacto cero de yerba en espalda',
      'Confección artesanal en Bogotá, Colombia'
    ],
    stock: 20,
    category: 'Camisetas & Tops',
    tags: ['camiseta', 'tee', 'tshirt', 'negro', 'oversized', 'algodon', 'yerba', 'cannabis', 'bogota', 'candelaria', 'frio']
  },
  {
    id: 'prod-andes-hoodie',
    name: 'ANDES HEAVY HOODIE',
    subtitle: 'Buzo con capucha pesado 450 GSM',
    description: 'Buzo oversized confeccionado en algodón perchado térmico de 450 gramos. Capucha estructurada de doble capa sin cordones, bolsillo canguro reforzado y corte boxy diseñado para el frío extremo y las noches capitalinas.',
    price: 210000,
    badge: 'TÉRMICO',
    image: '/assets/products/hoodie/noctis_heavy_hoodie.jpg',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/hoodie/noctis_heavy_hoodie.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/hoodie/noctis_heavy_hoodie_blanco.jpg' },
      { name: 'Gris', hex: '#636569', image: '/assets/products/hoodie/noctis_hoodie_gris.png' },
      { name: 'Rojo', hex: '#b31e2b', image: '/assets/products/hoodie/noctis_hoodie_rojo.png' },
      { name: 'Verde', hex: '#2d603a', image: '/assets/products/hoodie/noctis_hoodie_verde.png' }
    ],
    features: [
      'Algodón perchado ultra pesado 450 GSM',
      'Bordado NOCTIS frontal en tono sobre tono',
      'Capucha doble capa que no pierde estructura',
      'Puños y pretina reforzados en rib grueso'
    ],
    stock: 18,
    category: 'Hoodies & Buzos',
    tags: ['hoodie', 'buzo', 'capucha', 'negro', 'pesado', 'termico', 'bogota', 'frio', 'layering']
  },
  {
    id: 'prod-noctis-puffer',
    name: 'COLD PUFFER BOGOTÁ',
    subtitle: 'Chaqueta acolchada impermeable corta',
    description: 'Chaqueta puffer boxy en tejido ripstop impermeable con relleno térmico ultra ligero. Cuello alto cortaviento, cremallera sellada YKK y puños elásticos para soportar las lloviznas y el frío andino.',
    price: 280000,
    badge: 'IMPERMEABLE',
    image: '/assets/products/puffer/noctis_puffer_jacket.jpg',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/puffer/noctis_puffer_jacket.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/puffer/noctis_puffer_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/puffer/noctis_puffer_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/puffer/noctis_puffer_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/puffer/noctis_puffer_verde.png' }
    ],
    features: [
      'Tejido técnico Ripstop repelente al agua y viento',
      'Relleno térmico acolchado de alta retención de calor',
      'Cremallera frontal hermética YKK impermeable',
      'Silueta crop boxy con ajustadores laterales'
    ],
    stock: 12,
    category: 'Chaquetas & Abrigos',
    tags: ['chaqueta', 'puffer', 'acolchada', 'impermeable', 'ripstop', 'bogota', 'lluvia', 'frio']
  },
  {
    id: 'prod-void-cargo',
    name: 'VOID CARGO TÁCTICO',
    subtitle: 'Pantalón cargo ripstop con 6 bolsillos',
    description: 'Pantalón cargo en sarga técnica ripstop pesada con 6 bolsillos utilitarios con solapa, argollas tácticas y cordones ajustadores en botamanga para silueta ajustable de bota recta a tapered.',
    price: 220000,
    badge: 'UTILITARIO',
    image: '/assets/products/cargo/noctis_tactical_cargo.jpg',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/cargo/noctis_tactical_cargo.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/cargo/noctis_cargo_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/cargo/noctis_cargo_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/cargo/noctis_cargo_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/cargo/noctis_cargo_verde.png' }
    ],
    features: [
      'Sarga de algodón Ripstop reforzada antidesgarro',
      '6 bolsillos tácticos ergonómicos con fuelle',
      'Aislante contra viento y asfalto húmedo',
      'Ajustadores elásticos en tobillos con traba'
    ],
    stock: 15,
    category: 'Pantalones & Cargos',
    tags: ['cargo', 'pantalon', 'utilitario', 'bolsillos', 'tactico', 'void', 'bogota', 'ripstop', 'frio']
  },
  {
    id: 'prod-noctis-flask',
    name: 'TERMO NOCTIS 750ML',
    subtitle: 'Acero inoxidable térmico doble pared',
    description: 'Botella térmica de doble pared en acero inoxidable 18/8 grado alimenticio con acabado electrostático y tipografía grabada a láser NOCTIS. Mantiene bebidas calientes hasta por 18 horas y frías por 24 horas. Tapa hermética con asa en paracord táctico.',
    price: 85000,
    badge: 'ACCESORIO',
    image: '/assets/products/termo/noctis_termo_flask.jpg',
    availableSizes: ['UNICA'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/termo/noctis_termo_flask.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/termo/noctis_termo_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/termo/noctis_termo_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/termo/noctis_termo_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/termo/noctis_termo_verde.png' }
    ],
    features: [
      'Acero inoxidable 18/8 de doble pared con aislamiento al vacío',
      'Acabado electrostático antideslizante',
      'Asa de transporte tejida en cuerda paracord militar',
      'Libre de BPA y 100% hermético contra derrames'
    ],
    stock: 30,
    category: 'Accesorios & Equipo',
    tags: ['termo', 'botella', 'agua', 'termico', 'acero', 'flask', 'bogota', 'frio']
  },
  {
    id: 'prod-noctis-cap',
    name: 'GORRA NOCTIS DAD CAP',
    subtitle: 'Gabardina de algodón pesada con bordado 3D',
    description: 'Gorra estructurada de 6 paneles confeccionada en gabardina pesada de algodón lavado. Visera curva con costuras reforzadas, bordado frontal NOCTIS en relieve 3D y correa trasera con hebilla metálica.',
    price: 75000,
    badge: 'EDICIÓN',
    image: '/assets/products/cap/noctis_cap.jpg',
    availableSizes: ['UNICA'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/cap/noctis_cap.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/cap/noctis_cap_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/cap/noctis_cap_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/cap/noctis_cap_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/cap/noctis_cap_verde.png' }
    ],
    features: [
      '100% Gabardina de algodón pesado prelavado',
      'Bordado frontal NOCTIS en alto relieve 3D',
      'Cierre trasero graduable con hebilla metálica en tono mate',
      'Banda interior absorbente para confort prolongado'
    ],
    stock: 25,
    category: 'Accesorios & Equipo',
    tags: ['gorra', 'cachucha', 'cap', 'dad cap', 'bordado', 'streetwear', 'bogota']
  },
  {
    id: 'prod-noctis-umbrella',
    name: 'SOMBRILLA SHADOW BOGOTÁ',
    subtitle: 'Paraguas automático reforzado cortaviento',
    description: 'Sombrilla técnica compacta con mecanismo de apertura y cierre automático en un toque. Tejido repelente al agua de secado instantáneo con mango texturizado en fibra de carbono, varillaje reforzado de 8 puntas resistente a vientos andinos y funda protectora NOCTIS.',
    price: 95000,
    badge: 'ANTILLUVIA',
    image: '/assets/products/umbrella/noctis_umbrella.jpg',
    availableSizes: ['UNICA'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/umbrella/noctis_umbrella.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/umbrella/noctis_umbrella_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/umbrella/noctis_umbrella_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/umbrella/noctis_umbrella_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/umbrella/noctis_umbrella_verde.png' }
    ],
    features: [
      'Estructura de fibra de vidrio y varillaje reforzado anti-inversión',
      'Apertura y cierre automático One-Touch instantáneo',
      'Mango ergonómico con acabado en fibra de carbono y cordón',
      'Tela impermeable de alta densidad con recubrimiento de teflón'
    ],
    stock: 20,
    category: 'Accesorios & Equipo',
    tags: ['sombrilla', 'paraguas', 'lluvia', 'impermeable', 'antiviento', 'bogota', 'frio']
  },
  {
    id: 'prod-noctis-beanie',
    name: 'GORRO ANDES BEANIE',
    subtitle: 'Gorro tejido de lana acanalada térmica',
    description: 'Gorro beanie de punto acanalado grueso confeccionado en mezcla de lana térmica ultra suave. Dobladillo ancho estructurado con etiqueta tejida en alta definición NOCTIS en contraste sobrio. Máxima retención térmica para la noche bogotana.',
    price: 65000,
    badge: 'TÉRMICO',
    image: '/assets/products/beanie/noctis_beanie.jpg',
    availableSizes: ['UNICA'],
    availableColors: [
      { name: 'Negro', hex: '#0d0d0d', image: '/assets/products/beanie/noctis_beanie.jpg' },
      { name: 'Blanco', hex: '#f0ede6', image: '/assets/products/beanie/noctis_beanie_blanco.png' },
      { name: 'Gris', hex: '#5f6368', image: '/assets/products/beanie/noctis_beanie_gris.png' },
      { name: 'Rojo', hex: '#991b1b', image: '/assets/products/beanie/noctis_beanie_rojo.png' },
      { name: 'Verde', hex: '#264633', image: '/assets/products/beanie/noctis_beanie_verde.png' }
    ],
    features: [
      'Tejido acanalado grueso de alta densidad térmica',
      'Etiqueta tejida NOCTIS en parche frontal',
      'Elasticidad memory-fit que mantiene la forma',
      'Calidez superior para bajas temperaturas capitalinas'
    ],
    stock: 25,
    category: 'Accesorios & Equipo',
    tags: ['gorro', 'beanie', 'lana', 'tejido', 'termico', 'frio', 'bogota', 'layering']
  }
];

export const NOIR_PRODUCTS = NOCTIS_PRODUCTS;

export function getProductById(id: string): Product | undefined {
  return NOCTIS_PRODUCTS.find(p => p.id === id);
}
