'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductSize, CartItem, Coupon } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: ProductSize, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string, size: ProductSize, color?: string) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  couponDiscount: number;
  totalPrice: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isAiOpen: boolean;
  setIsAiOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isCategoriesOpen: boolean;
  setIsCategoriesOpen: (open: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  openProductDetail: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  const openProductDetail = (product: Product) => {
    if (product?.id) {
      router.push(`/producto/${product.id}`);
    }
  };

  // Cargar carrito y cupón desde localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('noctis_cart') || localStorage.getItem('noir_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('noctis_applied_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Error cargando carrito:', e);
    }
  }, []);

  // Sincronizar stock y precios en tiempo real desde el catálogo
  useEffect(() => {
    const syncCatalogData = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            setItems(prev => prev.map(item => {
              const liveProd = data.products.find((p: Product) => p.id === item.product.id);
              if (liveProd) {
                const liveStock = liveProd.stock ?? 20;
                const clampedQty = Math.min(liveStock, item.quantity);
                return {
                  ...item,
                  product: liveProd,
                  quantity: clampedQty > 0 ? clampedQty : 1
                };
              }
              return item;
            }));
          }
        }
      } catch (e) {
        // Silencioso
      }
    };

    syncCatalogData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'noctis_catalog_sync') {
        syncCatalogData();
      }
    };

    window.addEventListener('focus', syncCatalogData);
    window.addEventListener('noctis-catalog-updated', syncCatalogData);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', syncCatalogData);
      window.removeEventListener('noctis-catalog-updated', syncCatalogData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noctis_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  }, [items]);

  // Guardar cupón en localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('noctis_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('noctis_applied_coupon');
      }
    } catch (e) {
      // ignore
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, size: ProductSize = 'M', quantity: number = 1, color: string = 'Negro') => {
    const maxStock = product.stock ?? 20;
    if (maxStock <= 0) return;

    setItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.size === size && 
        (item.color || 'Negro') === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(maxStock, updated[existingIdx].quantity + quantity);
        updated[existingIdx].quantity = newQty;
        return updated;
      } else {
        const initialQty = Math.min(maxStock, Math.max(1, quantity));
        return [...prev, { product, size, quantity: initialQty, color }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: ProductSize, color?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.size === size && (!color || (item.color || 'Negro') === color))
    ));
  };

  const updateQuantity = (productId: string, size: ProductSize, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.size === size && (!color || (item.color || 'Negro') === color)) {
        const maxStock = item.product.stock ?? 20;
        const clampedQty = Math.min(maxStock, quantity);
        return { ...item, quantity: clampedQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Cálculo de Descuento por Cupón
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.minPurchase && subtotal < appliedCoupon.minPurchase) {
      return 0; // No cumple compra mínima
    }
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(subtotal, appliedCoupon.value);
  }, [appliedCoupon, subtotal]);

  const totalPrice = Math.max(0, subtotal - couponDiscount);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Cupón inválido' };
    } catch {
      return { success: false, message: 'Error de conexión al validar cupón' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        couponDiscount,
        totalPrice,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAiOpen,
        setIsAiOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        isCategoriesOpen,
        setIsCategoriesOpen,
        categoryFilter,
        setCategoryFilter,
        activeProductModal,
        setActiveProductModal,
        openProductDetail
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
}
