'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order, Product, ProductGuideConfig } from '@/types';
import { Coupon, StoreSettings, DEFAULT_PRODUCT_GUIDES } from '@/lib/settingsStore';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Menu, 
  X, 
  RefreshCw, 
  Package, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  Users, 
  Settings as SettingsIcon, 
  Database,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

// Modular Admin Components
import AdminStyles from '@/components/admin/AdminStyles';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import OrdersTab from '@/components/admin/tabs/OrdersTab';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import InventoryTab from '@/components/admin/tabs/InventoryTab';
import AnalyticsTab from '@/components/admin/tabs/AnalyticsTab';
import CustomersTab from '@/components/admin/tabs/CustomersTab';
import SettingsTab from '@/components/admin/tabs/SettingsTab';
import DatabaseTab from '@/components/admin/tabs/DatabaseTab';

// Modular Modals
import OrderDetailModal from '@/components/admin/modals/OrderDetailModal';
import ReturnWarningModal from '@/components/admin/modals/ReturnWarningModal';
import CustomerDetailModal from '@/components/admin/modals/CustomerDetailModal';
import ProductFormModal from '@/components/admin/modals/ProductFormModal';
import CouponFormModal from '@/components/admin/modals/CouponFormModal';
import ResetCatalogModal from '@/components/admin/modals/ResetCatalogModal';
import SeedDemoModal from '@/components/admin/modals/SeedDemoModal';
import AdminCategoriesManagerModal from '@/components/AdminCategoriesManagerModal';
import ProductGuideModal from '@/components/admin/modals/ProductGuideModal';

export default function AdminPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<AdminTab>('orders');
  const [adminMobileView, setAdminMobileView] = useState<'hub' | 'detail'>('hub');
  const [isCategoriesManagerOpen, setIsCategoriesManagerOpen] = useState(false);
  const [isProductGuideModalOpen, setIsProductGuideModalOpen] = useState(false);
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [viewsData, setViewsData] = useState<Record<string, number>>({});
  const [analyticsViewMode, setAnalyticsViewMode] = useState<'all' | 'sales' | 'views'>('all');
  const [settings, setSettings] = useState<StoreSettings>({
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
  });

  // DB Inspector State
  const [selectedDbTable, setSelectedDbTable] = useState<string>('products');
  const [dbInspectorData, setDbInspectorData] = useState<{
    health?: {
      connected: boolean;
      message: string;
      version: string;
      port: number;
      database: string;
      host: string;
      user: string;
    };
    tableCounts?: Record<string, number>;
    tableColumns?: string[];
    tableData?: any[];
  } | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('');
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState('');

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('featured');

  const [customerSearch, setCustomerSearch] = useState('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalTrackingInput, setModalTrackingInput] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isResetFactoryModalOpen, setIsResetFactoryModalOpen] = useState(false);
  const [isSeedDemoModalOpen, setIsSeedDemoModalOpen] = useState(false);

  // Modal de Advertencia y Confirmación de Devolución / Reembolso (Ley 1480 / SIC)
  const [isReturnWarningModalOpen, setIsReturnWarningModalOpen] = useState(false);
  const [orderPendingReturn, setOrderPendingReturn] = useState<Order | null>(null);
  const [returnConsentCheck, setReturnConsentCheck] = useState(false);
  const [customRefundAmount, setCustomRefundAmount] = useState<number>(0);
  const [isEditingRefundAmount, setIsEditingRefundAmount] = useState(false);

  const requestReturnConfirmation = (order: Order) => {
    setOrderPendingReturn(order);
    setCustomRefundAmount(order.total || 0);
    setIsEditingRefundAmount(false);
    setReturnConsentCheck(false);
    setIsReturnWarningModalOpen(true);
  };

  const handleConfirmReturnOrder = async () => {
    if (!orderPendingReturn || !returnConsentCheck) return;
    const orderRef = orderPendingReturn.reference;
    const orderTracking = orderPendingReturn.trackingNumber;
    const finalRefund = Number(customRefundAmount || 0);
    setIsReturnWarningModalOpen(false);
    await handleUpdateDelivery(orderRef, 'DEVUELTO', orderTracking);
    showToast(`✓ Devolución registrada y reembolso por $${finalRefund.toLocaleString('es-CO')} COP autorizado`);
    setOrderPendingReturn(null);
    setReturnConsentCheck(false);
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setModalTrackingInput(order.trackingNumber || '');
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Fetch All Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Orders
      const resOrders = await fetch('/api/admin/orders');
      if (resOrders.status === 401) {
        router.push('/admin/login');
        return;
      }
      const dataOrders = await resOrders.json();
      setOrders(dataOrders.orders || []);

      // 2. Products
      const resProducts = await fetch('/api/admin/products');
      const dataProducts = await resProducts.json();
      setProducts(dataProducts.products || []);

      // 3. Settings & Coupons
      const resSettings = await fetch('/api/admin/settings');
      const dataSettings = await resSettings.json();
      if (dataSettings.coupons) setCoupons(dataSettings.coupons);
      if (dataSettings.settings) setSettings(dataSettings.settings);

      // 4. Customers Real-Time PostgreSQL Sync
      const resCustomers = await fetch('/api/admin/customers');
      if (resCustomers.ok) {
        const dataCustomers = await resCustomers.json();
        setCustomersList(dataCustomers.customers || []);
      }

    } catch (err) {
      console.error('Error cargando datos del panel:', err);
      showToast('Error al sincronizar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load DB Inspector Data
  const loadDbInspector = async (tableName: string = selectedDbTable) => {
    setDbLoading(true);
    setSelectedDbTable(tableName);
    try {
      const res = await fetch(`/api/admin/db-inspector?table=${tableName}`);
      const data = await res.json();
      setDbInspectorData(data);
    } catch {
      showToast('Error al inspeccionar PostgreSQL', 'error');
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'NOCTIS URBANO | Administración';
    loadAllData();
    loadDbInspector('products');
  }, []);

  // Sync Views Data for Analytics
  useEffect(() => {
    const syncViews = () => {
      try {
        const raw = localStorage.getItem('noctis_product_views');
        if (raw) {
          setViewsData(JSON.parse(raw));
        } else {
          const initialViews: Record<string, number> = {
            'prod-andes-hoodie': 142,
            'prod-monserrate-jacket': 189,
            'prod-distrito-tee': 96,
            'prod-candelaria-pants': 78,
            'prod-heavy-hoodie': 115,
            'prod-tech-jacket': 84
          };
          localStorage.setItem('noctis_product_views', JSON.stringify(initialViews));
          setViewsData(initialViews);
        }
      } catch {}
    };

    syncViews();
    window.addEventListener('noctis-views-updated', syncViews);
    return () => window.removeEventListener('noctis-views-updated', syncViews);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  // Confirm and Seed Demo Orders
  const handleConfirmSeedDemoData = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        showToast('✓ Datos de demostración y pedidos de prueba cargados exitosamente');
        setIsSeedDemoModalOpen(false);
        await loadAllData();
      } else {
        showToast('Error al sembrar datos de prueba', 'error');
      }
    } catch {
      showToast('Error de conexión al cargar demo', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Order Delivery
  const handleUpdateDelivery = async (reference: string, deliveryStatus: string, trackingNumber?: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, deliveryStatus, trackingNumber })
      });
      const data = await res.json();
      if (res.ok) {
        const notifEmail = data.notification?.recipient ? ` — Notificación SIC enviada a ${data.notification.recipient}` : '';
        const msg = deliveryStatus === 'DEVUELTO' 
          ? `Pedido ${reference} marcado como DEVUELTO${notifEmail}` 
          : `Despacho actualizado para ${reference}${notifEmail}`;
        showToast(msg);
        loadAllData();
        try {
          localStorage.setItem('noctis_orders_updated', Date.now().toString());
          window.dispatchEvent(new Event('noctis-orders-updated'));
        } catch {}
        if (selectedOrder && selectedOrder.reference === reference) {
          setSelectedOrder(prev => prev ? { 
            ...prev, 
            deliveryStatus: deliveryStatus as any, 
            trackingNumber: trackingNumber !== undefined ? trackingNumber : prev.trackingNumber 
          } : null);
          if (trackingNumber !== undefined) {
            setModalTrackingInput(trackingNumber);
          }
        }
        if (selectedCustomer) {
          setSelectedCustomer((prev: any) => {
            if (!prev) return null;
            const updatedOrders = (prev.orders || []).map((o: any) => o.reference === reference ? { 
              ...o, 
              deliveryStatus: deliveryStatus as any, 
              trackingNumber: trackingNumber || o.trackingNumber 
            } : o);
            const returnedCount = updatedOrders.filter((o: any) => o.deliveryStatus === 'DEVUELTO').length;
            return { ...prev, orders: updatedOrders, returnsCount: returnedCount };
          });
        }
      } else {
        showToast(data.error || 'Error al actualizar despacho', 'error');
      }
    } catch {
      showToast('Error al actualizar estado', 'error');
    }
  };

  // Update Stock Delta
  const handleAdjustStock = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? data.product : p));
        showToast(`✓ Stock actualizado (${delta > 0 ? '+' : ''}${delta})`);
        try {
          localStorage.setItem('noctis_catalog_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-catalog-updated'));
        } catch {}
      }
    } catch {
      showToast('Error al actualizar stock', 'error');
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (productData: Partial<Product>) => {
    setActionLoading(true);
    try {
      const isEdit = !!productData.id && products.some(p => p.id === productData.id);
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast(isEdit ? '✓ Producto actualizado' : '✓ Producto creado exitosamente');
        setIsNewProductModalOpen(false);
        setEditingProduct(null);
        loadAllData();
        try {
          localStorage.setItem('noctis_catalog_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-catalog-updated'));
        } catch {}
      } else {
        const err = await res.json();
        showToast(err.error || 'Error al guardar producto', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}" del catálogo?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('✓ Producto eliminado');
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
          localStorage.setItem('noctis_catalog_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-catalog-updated'));
        } catch {}
      }
    } catch {
      showToast('Error al eliminar producto', 'error');
    }
  };

  // Delete Demo Customer
  const handleDeleteDemoCustomer = async (customer: any) => {
    if (!confirm(`¿Estás seguro de eliminar el cliente demo "${customer.name}" (${customer.email})? Se borrarán sus pedidos y datos demo asociados.`)) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?id=${encodeURIComponent(customer.id || '')}&email=${encodeURIComponent(customer.email || '')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('✓ Perfil demo eliminado correctamente');
        setCustomersList(prev => prev.filter(c => c.email !== customer.email));
        if (selectedCustomer && selectedCustomer.email === customer.email) {
          setSelectedCustomer(null);
        }
      } else {
        const data = await res.json();
        showToast(data.error || 'Error al eliminar demo', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Demo Order
  const handleDeleteDemoOrder = async (order: Order) => {
    if (!confirm(`¿Estás seguro de eliminar el pedido demo "${order.orderNumber}" (${order.reference})? Se borrará este pedido de prueba.`)) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?reference=${encodeURIComponent(order.reference)}&id=${encodeURIComponent(order.id || '')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('✓ Pedido demo eliminado correctamente');
        setOrders(prev => prev.filter(o => o.reference !== order.reference && o.id !== order.id));
        if (selectedOrder && (selectedOrder.reference === order.reference || selectedOrder.id === order.id)) {
          setSelectedOrder(null);
        }
        const resCust = await fetch('/api/admin/customers');
        if (resCust.ok) {
          const dataCust = await resCust.json();
          setCustomersList(dataCust.customers || []);
        }
      } else {
        const data = await res.json();
        showToast(data.error || 'Error al eliminar pedido demo', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Products to Factory Confirmation
  const handleConfirmResetFactory = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_factory' })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        showToast('✓ Catálogo restablecido con éxito a los productos originales de fábrica');
        setIsResetFactoryModalOpen(false);
        try {
          localStorage.setItem('noctis_catalog_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-catalog-updated'));
        } catch {}
      } else {
        showToast('Error al restablecer catálogo', 'error');
      }
    } catch {
      showToast('Error de conexión al restablecer catálogo', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Coupon
  const handleSaveCoupon = async (couponData: Partial<Coupon>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_coupon', coupon: couponData })
      });
      if (res.ok) {
        showToast('✓ Cupón guardado');
        setIsCouponModalOpen(false);
        setEditingCoupon(null);
        loadAllData();
      }
    } catch {
      showToast('Error al guardar cupón', 'error');
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('¿Eliminar este cupón de descuento?')) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_coupon', couponId })
      });
      if (res.ok) {
        showToast('✓ Cupón eliminado');
        setCoupons(prev => prev.filter(c => c.id !== couponId));
      }
    } catch {
      showToast('Error al eliminar cupón', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings })
      });
      if (res.ok) {
        showToast('✓ Configuración de tienda y contactos guardada en base de datos');
        try {
          localStorage.setItem('noctis_settings_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-settings-updated'));
        } catch {}
      }
    } catch {
      showToast('Error al guardar configuración', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Product Guide Settings (Universal Industry Preset)
  const handleSaveProductGuide = async (guideData: ProductGuideConfig) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: { productGuide: guideData }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, productGuide: guideData }));
        showToast('✓ Guía del Producto guardada y sincronizada para toda la tienda');
        try {
          localStorage.setItem('noctis_settings_sync', Date.now().toString());
          window.dispatchEvent(new Event('noctis-settings-updated'));
        } catch {}
      } else {
        showToast('Error al guardar guía del producto', 'error');
      }
    } catch {
      showToast('Error de conexión al guardar guía', 'error');
    }
  };

  // Export to CSV
  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast('No hay pedidos para exportar', 'error');
      return;
    }
    const headers = ['Orden', 'Referencia', 'Fecha', 'Cliente', 'Email', 'Telefono', 'Ciudad', 'Total', 'Estado Pago', 'Estado Despacho', 'Guia Envio'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.reference,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerEmail,
      o.customerPhone,
      `"${o.city}"`,
      o.total,
      o.status,
      o.deliveryStatus,
      `"${o.trackingNumber || 'Sin Guía'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `noctis_pedidos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Archivo CSV descargado');
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    const approvedOrders = orders.filter(o => o.status === 'APPROVED');
    const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
    const avgTicket = approvedOrders.length > 0 ? totalRevenue / approvedOrders.length : 0;
    const approvalRate = orders.length > 0 ? Math.round((approvedOrders.length / orders.length) * 100) : 0;
    
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);

    const categorySales: Record<string, { units: number; revenue: number }> = {};
    const productSalesMap: Record<string, { 
      id: string; 
      name: string; 
      category: string; 
      image: string; 
      unitsSold: number; 
      revenueCOP: number; 
      stock: number; 
      price: number 
    }> = {};

    products.forEach(p => {
      productSalesMap[p.id] = {
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        image: p.image || '',
        unitsSold: 0,
        revenueCOP: 0,
        stock: p.stock || 0,
        price: p.price || 0
      };
    });

    let totalSoldUnits = 0;
    approvedOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const cat = item.product?.category || 'General';
        const qty = item.quantity || 1;
        const price = (item.product ? item.product.price : 0) || 0;
        const itemRevenue = price * qty;
        totalSoldUnits += qty;

        if (!categorySales[cat]) {
          categorySales[cat] = { units: 0, revenue: 0 };
        }
        categorySales[cat].units += qty;
        categorySales[cat].revenue += itemRevenue;

        const pId = (item.product ? item.product.id : '');
        if (pId && productSalesMap[pId]) {
          productSalesMap[pId].unitsSold += qty;
          productSalesMap[pId].revenueCOP += itemRevenue;
        } else if (item.product && item.product.id) {
          if (!productSalesMap[item.product.id]) {
            productSalesMap[item.product.id] = {
              id: item.product.id,
              name: item.product.name,
              category: item.product.category || 'General',
              image: item.product.image || '',
              unitsSold: 0,
              revenueCOP: 0,
              stock: item.product.stock || 0,
              price: item.product.price || 0
            };
          }
          productSalesMap[item.product.id].unitsSold += qty;
          productSalesMap[item.product.id].revenueCOP += itemRevenue;
        }
      });
    });

    const productViewsList = products.map(p => {
      const views = viewsData[p.id] !== undefined ? viewsData[p.id] : 0;
      const sales = productSalesMap[p.id] || { unitsSold: 0, revenueCOP: 0 };
      const convRate = views > 0 ? ((sales.unitsSold / views) * 100) : 0;
      return {
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        image: p.image || '',
        views,
        unitsSold: sales.unitsSold,
        revenueCOP: sales.revenueCOP,
        conversionRate: convRate.toFixed(1),
        stock: p.stock || 0,
        price: p.price || 0
      };
    });

    const categoryViews: Record<string, number> = {};
    let totalViews = 0;
    productViewsList.forEach(pv => {
      categoryViews[pv.category] = (categoryViews[pv.category] || 0) + pv.views;
      totalViews += pv.views;
    });

    const sortedBySales = [...Object.values(productSalesMap)].sort((a, b) => b.unitsSold - a.unitsSold || b.revenueCOP - a.revenueCOP);
    const topSellingProduct = sortedBySales.length > 0 ? sortedBySales[0] : null;

    const sortedByViews = [...productViewsList].sort((a, b) => b.views - a.views);
    const topViewedProduct = sortedByViews.length > 0 ? sortedByViews[0] : null;

    const customerMap = new Map<string, { name: string; email: string; phone: string; city: string; ordersCount: number; totalSpent: number; lastOrder: string }>();
    orders.forEach(o => {
      const email = o.customerEmail.toLowerCase().trim();
      const existing = customerMap.get(email);
      if (existing) {
        existing.ordersCount += 1;
        if (o.status === 'APPROVED') existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt;
          existing.city = o.city;
        }
      } else {
        customerMap.set(email, {
          name: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          city: o.city,
          ordersCount: 1,
          totalSpent: o.status === 'APPROVED' ? o.total : 0,
          lastOrder: o.createdAt
        });
      }
    });

    return {
      totalRevenue,
      approvedOrdersCount: approvedOrders.length,
      pendingOrdersCount,
      avgTicket,
      approvalRate,
      lowStockProducts,
      categorySales,
      categoryViews,
      productSalesList: sortedBySales,
      productViewsList: sortedByViews,
      topSellingProduct,
      topViewedProduct,
      totalSoldUnits,
      totalViews,
      customers: Array.from(customerMap.values())
    };
  }, [orders, products, viewsData]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !orderSearch || 
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.reference.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.city.toLowerCase().includes(orderSearch.toLowerCase());
      
      const matchPayment = !orderPaymentFilter || o.status === orderPaymentFilter;
      const matchDelivery = !orderDeliveryFilter || o.deliveryStatus === orderDeliveryFilter;

      return matchSearch && matchPayment && matchDelivery;
    });
  }, [orders, orderSearch, orderPaymentFilter, orderDeliveryFilter]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (!productSearch) return true;
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });

    if (productCategoryFilter === 'price_desc') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (productCategoryFilter === 'price_asc') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return result;
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => {
      if (!customerSearch) return true;
      const q = customerSearch.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.department || '').toLowerCase().includes(q) ||
        (c.address || '').toLowerCase().includes(q)
      );
    });
  }, [customersList, customerSearch]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [products]);

  return (
    <div className="admin-root">
      {/* Estilos CSS Globales Modulares */}
      <AdminStyles />

      {/* Toast Feedback */}
      {feedback && (
        <div className={`toast-notification ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* TOPBAR MÓVIL (<= 900px) */}
      <header className="admin-mobile-topbar">
        <div className="admin-mobile-topbar-left">
          <div>
            <div className="admin-mobile-badge">
              <span>ADMIN OPERACIONAL</span>
            </div>
            <strong className="admin-mobile-title">NOCTIS URBANO</strong>
          </div>
        </div>

        <div className="admin-mobile-topbar-right">
          <Link href="/" target="_blank" className="admin-mobile-store-btn" title="Ir a la Tienda">
            <span>Tienda</span>
            <ExternalLink size={13} />
          </Link>
          <button 
            type="button"
            className="admin-mobile-refresh-btn"
            onClick={loadAllData}
            title="Refrescar datos"
            aria-label="Refrescar datos"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {/* 1. HUB BENTO MÓVIL (VISIBLE EN MÓVIL CUANDO adminMobileView === 'hub') */}
      <div className={`admin-mobile-hub-container ${adminMobileView === 'hub' ? 'is-active' : 'is-hidden'}`}>
        {/* Ficha Superior de Identidad del Administrador */}
        <div className="admin-hub-user-header">
          <div className="admin-hub-user-avatar">
            F
          </div>
          <div className="admin-hub-user-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 className="admin-hub-user-name">Felipe Villamil</h2>
              <span className="admin-hub-badge-verified">
                <ShieldCheck size={11} /> ADMIN
              </span>
            </div>
            <p className="admin-hub-user-email">admin@noctisurbano.com</p>
          </div>
        </div>

        <div className="admin-hub-divider" />

        {/* Grilla Bento en 2 Columnas de Módulos */}
        <div className="admin-hub-section-title">
          SELECCIONA UN MÓDULO:
        </div>

        <div className="admin-mobile-bento-grid">
          {/* 1. Pedidos */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('orders');
              setAdminMobileView('detail');
            }}
          >
            <Package size={24} color={currentTab === 'orders' ? '#ff5500' : '#ffffff'} />
            <strong>Pedidos</strong>
            <span>Gestión y Envíos</span>
            <span className="bento-badge">{orders.length} pedidos</span>
          </button>

          {/* 2. Catálogo */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('products');
              setAdminMobileView('detail');
            }}
          >
            <ShoppingBag size={24} color={currentTab === 'products' ? '#ff5500' : '#ffffff'} />
            <strong>Catálogo</strong>
            <span>Prendas y Precios</span>
            <span className="bento-badge">{products.length} productos</span>
          </button>

          {/* 3. Inventario */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'inventory' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('inventory');
              setAdminMobileView('detail');
            }}
          >
            <Layers size={24} color={currentTab === 'inventory' ? '#ff5500' : '#ffffff'} />
            <strong>Inventario</strong>
            <span>Bodega Bogotá</span>
            {analytics.lowStockProducts.length > 0 ? (
              <span className="bento-badge alert">{analytics.lowStockProducts.length} alertas</span>
            ) : (
              <span className="bento-badge ok">Stock OK</span>
            )}
          </button>

          {/* 4. Métricas */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('analytics');
              setAdminMobileView('detail');
            }}
          >
            <TrendingUp size={24} color={currentTab === 'analytics' ? '#ff5500' : '#ffffff'} />
            <strong>Métricas</strong>
            <span>Ventas y Visitas</span>
            <span className="bento-badge">En Vivo</span>
          </button>

          {/* 5. Clientes */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'customers' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('customers');
              setAdminMobileView('detail');
            }}
          >
            <Users size={24} color={currentTab === 'customers' ? '#ff5500' : '#ffffff'} />
            <strong>Clientes</strong>
            <span>Directorio y Compras</span>
            <span className="bento-badge">{customersList.length} registrados</span>
          </button>

          {/* 6. Configuración */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('settings');
              setAdminMobileView('detail');
            }}
          >
            <SettingsIcon size={24} color={currentTab === 'settings' ? '#ff5500' : '#ffffff'} />
            <strong>Configuración</strong>
            <span>Envíos y WhatsApp</span>
            <span className="bento-badge">General</span>
          </button>

          {/* 7. Base de Datos */}
          <button
            type="button"
            className={`admin-bento-card ${currentTab === 'database' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('database');
              loadDbInspector('products');
              setAdminMobileView('detail');
            }}
          >
            <Database size={24} color={currentTab === 'database' ? '#ff5500' : '#ffffff'} />
            <strong>Base de Datos</strong>
            <span>Postgres / Neon</span>
            <span className="bento-badge db-badge">:5435</span>
          </button>

          {/* 8. Cerrar Sesión */}
          <button
            type="button"
            className="admin-bento-card logout-bento-card"
            onClick={handleLogout}
          >
            <LogOut size={24} color="#f87171" />
            <strong style={{ color: '#f87171' }}>Cerrar Sesión</strong>
            <span>Salir del panel</span>
          </button>
        </div>
      </div>

      {/* 2. VISTA DE DETALLE / DESKTOP (admin-app-layout) */}
      <div className={`admin-app-layout ${adminMobileView === 'detail' ? 'mobile-detail-active' : 'mobile-hub-active'}`}>
        {/* SIDEBAR MODULAR */}
        <AdminSidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setAdminMobileView('detail');
          }}
          ordersCount={orders.length}
          productsCount={products.length}
          lowStockCount={analytics.lowStockProducts.length}
          customersCount={customersList.length}
          loading={loading}
          actionLoading={actionLoading}
          onOpenSeedModal={() => setIsSeedDemoModalOpen(true)}
          onRefresh={loadAllData}
          onLogout={handleLogout}
          onSelectDatabaseTab={() => {
            setCurrentTab('database');
            loadDbInspector('products');
          }}
        />

        {/* ÁREA PRINCIPAL MODULAR */}
        <main className="admin-main-area">
          {/* Botón de Retorno al Bento Hub en Móvil */}
          <div className="admin-mobile-back-bar">
            <button
              type="button"
              className="admin-mobile-back-btn"
              onClick={() => setAdminMobileView('hub')}
            >
              <ChevronLeft size={16} />
              <span>Menú Principal</span>
            </button>

            <span className="admin-active-tab-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {currentTab === 'orders' && <><Package size={14} color="#ff5500" /> Pedidos ({orders.length})</>}
              {currentTab === 'products' && <><ShoppingBag size={14} color="#ff5500" /> Catálogo ({products.length})</>}
              {currentTab === 'inventory' && <><Layers size={14} color="#ff5500" /> Inventario</>}
              {currentTab === 'analytics' && <><TrendingUp size={14} color="#ff5500" /> Métricas</>}
              {currentTab === 'customers' && <><Users size={14} color="#ff5500" /> Clientes ({customersList.length})</>}
              {currentTab === 'settings' && <><SettingsIcon size={14} color="#ff5500" /> Configuración</>}
              {currentTab === 'database' && <><Database size={14} color="#ff5500" /> Base de Datos</>}
            </span>
          </div>
          {currentTab === 'orders' && (
            <OrdersTab
              orders={orders}
              filteredOrders={filteredOrders}
              orderSearch={orderSearch}
              setOrderSearch={setOrderSearch}
              orderPaymentFilter={orderPaymentFilter}
              setOrderPaymentFilter={setOrderPaymentFilter}
              orderDeliveryFilter={orderDeliveryFilter}
              setOrderDeliveryFilter={setOrderDeliveryFilter}
              exportOrdersCSV={exportOrdersCSV}
              setIsSeedDemoModalOpen={setIsSeedDemoModalOpen}
              openOrderDetail={openOrderDetail}
              requestReturnConfirmation={requestReturnConfirmation}
              handleUpdateDelivery={handleUpdateDelivery}
              handleDeleteDemoOrder={handleDeleteDemoOrder}
              actionLoading={actionLoading}
              showToast={showToast}
            />
          )}

          {currentTab === 'products' && (
            <ProductsTab
              products={products}
              filteredProducts={filteredProducts}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              productCategoryFilter={productCategoryFilter}
              setProductCategoryFilter={setProductCategoryFilter}
              categories={categories}
              setIsCategoriesManagerOpen={setIsCategoriesManagerOpen}
              setIsProductGuideModalOpen={setIsProductGuideModalOpen}
              productGuide={settings.productGuide}
              setIsResetFactoryModalOpen={setIsResetFactoryModalOpen}
              setIsNewProductModalOpen={setIsNewProductModalOpen}
              setEditingProduct={setEditingProduct}
              handleDeleteProduct={handleDeleteProduct}
              actionLoading={actionLoading}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryTab
              products={products}
              handleAdjustStock={handleAdjustStock}
              setEditingProduct={setEditingProduct}
              setIsNewProductModalOpen={setIsNewProductModalOpen}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsTab
              analytics={analytics}
              products={products}
              orders={orders}
              analyticsViewMode={analyticsViewMode}
              setAnalyticsViewMode={setAnalyticsViewMode}
              showToast={showToast}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersTab
              filteredCustomers={filteredCustomers}
              customerSearch={customerSearch}
              setCustomerSearch={setCustomerSearch}
              loadAllData={loadAllData}
              loading={loading}
              setSelectedCustomer={setSelectedCustomer}
              handleDeleteDemoCustomer={handleDeleteDemoCustomer}
              actionLoading={actionLoading}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              coupons={coupons}
              setEditingCoupon={setEditingCoupon}
              setIsCouponModalOpen={setIsCouponModalOpen}
              handleDeleteCoupon={handleDeleteCoupon}
              settings={settings}
              setSettings={setSettings}
              handleSaveSettings={handleSaveSettings}
              actionLoading={actionLoading}
            />
          )}

          {currentTab === 'database' && (
            <DatabaseTab
              dbInspectorData={dbInspectorData}
              selectedDbTable={selectedDbTable}
              loadDbInspector={loadDbInspector}
              dbLoading={dbLoading}
            />
          )}
        </main>
      </div>

      {/* MODALES MODULARES */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        modalTrackingInput={modalTrackingInput}
        setModalTrackingInput={setModalTrackingInput}
        handleUpdateDelivery={handleUpdateDelivery}
        requestReturnConfirmation={requestReturnConfirmation}
        showToast={showToast}
      />

      <ReturnWarningModal
        isOpen={isReturnWarningModalOpen}
        order={orderPendingReturn}
        onClose={() => {
          setIsReturnWarningModalOpen(false);
          setOrderPendingReturn(null);
          setReturnConsentCheck(false);
        }}
        customRefundAmount={customRefundAmount}
        setCustomRefundAmount={setCustomRefundAmount}
        isEditingRefundAmount={isEditingRefundAmount}
        setIsEditingRefundAmount={setIsEditingRefundAmount}
        returnConsentCheck={returnConsentCheck}
        setReturnConsentCheck={setReturnConsentCheck}
        actionLoading={actionLoading}
        onConfirmReturn={handleConfirmReturnOrder}
      />

      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onSelectOrder={(order) => {
          setSelectedCustomer(null);
          openOrderDetail(order);
        }}
      />

      {isNewProductModalOpen && (
        <ProductFormModal
          initialData={editingProduct}
          categories={categories}
          onClose={() => { setIsNewProductModalOpen(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {isCouponModalOpen && (
        <CouponFormModal 
          initialData={editingCoupon}
          onClose={() => { setIsCouponModalOpen(false); setEditingCoupon(null); }}
          onSave={handleSaveCoupon}
        />
      )}

      <ResetCatalogModal
        isOpen={isResetFactoryModalOpen}
        actionLoading={actionLoading}
        onClose={() => setIsResetFactoryModalOpen(false)}
        onConfirm={handleConfirmResetFactory}
      />

      <SeedDemoModal
        isOpen={isSeedDemoModalOpen}
        actionLoading={actionLoading}
        onClose={() => setIsSeedDemoModalOpen(false)}
        onConfirm={handleConfirmSeedDemoData}
      />

      <AdminCategoriesManagerModal
        isOpen={isCategoriesManagerOpen}
        onClose={() => setIsCategoriesManagerOpen(false)}
        products={products}
        onCategoriesSaved={() => {
          setFeedback({ msg: '¡Estructura de Tienda & Categorías actualizada!', type: 'success' });
          setTimeout(() => setFeedback(null), 3000);
          loadAllData();
        }}
      />

      <ProductGuideModal
        isOpen={isProductGuideModalOpen}
        onClose={() => setIsProductGuideModalOpen(false)}
        currentGuide={settings.productGuide}
        onSave={handleSaveProductGuide}
      />
    </div>
  );
}
