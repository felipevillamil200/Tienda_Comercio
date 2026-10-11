export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'UNICA';

export interface ColorVariant {
  name: 'Negro' | 'Blanco' | 'Gris' | 'Rojo' | 'Verde' | string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // In COP
  badge?: string;
  image: string;
  availableSizes: ProductSize[];
  sizeStock?: Partial<Record<ProductSize, number>>;
  availableColors?: ColorVariant[];
  features: string[];
  stock: number;
  category: string;
  tags: string[];
}


export interface CartItem {
  product: Product;
  size: ProductSize;
  color?: string;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface Order {
  id: string;
  orderNumber: string;
  reference: string;
  accessToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  department: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryStatus: 'CREADO' | 'EN_PREPARACION' | 'DESPACHADO' | 'ENTREGADO' | 'DEVUELTO';
  trackingNumber?: string;
  transactionId?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WompiCheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  department: string;
  items: CartItem[];
  couponCode?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 20000 for $20.000 COP
  minPurchase: number; // e.g. 100000 COP
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
  bannerAnnouncement?: string;
  announcementText?: string;
  announcementActive?: boolean;
  freeShippingActive?: boolean;
  freeShippingThreshold: number;
  standardShippingCost: number;
  freeGiftActive?: boolean;
  freeGiftThreshold?: number;
  freeGiftName?: string;
  freeGiftDescription?: string;
  freeGiftImage?: string;
  productGuide?: ProductGuideConfig;
  supportEmail: string;
  supportWhatsapp?: string;
  supportPhone?: string;
}


