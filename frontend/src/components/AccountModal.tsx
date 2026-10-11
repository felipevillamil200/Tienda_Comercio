'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { NOCTIS_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { 
  User, 
  Package, 
  Truck, 
  FileText, 
  LogOut, 
  X, 
  Check, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Heart, 
  Printer, 
  Download, 
  ShoppingCart, 
  Trash2, 
  MessageCircle,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Camera,
  CreditCard,
  Scissors,
  Home,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Info,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AccountModal() {
  const { isAccountOpen, setIsAccountOpen, setIsTrackingOpen, addToCart } = useCart();
  const { lang, t } = useLanguage();

  const [clientUser, setClientUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'tracking' | 'pqrs'>('profile');
  const [mobileView, setMobileView] = useState<'menu' | 'detail'>('menu');

  // Form edit fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabsNavRef = useRef<HTMLElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsNavRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      tabsNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // Delete account fields (Habeas Data - Ley 1581 de 2012)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePass, setShowDeletePass] = useState(false);
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);


  // Orders & PQRS list
  const [orders, setOrders] = useState<any[]>([]);
  const [pqrsList, setPqrsList] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tracking tab state in AccountModal
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackToken, setTrackToken] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackData, setTrackData] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleAccountTrack = async (e?: React.FormEvent, customOrderNum?: string) => {
    if (e) e.preventDefault();
    const queryNum = (customOrderNum || trackOrderNumber).trim();
    if (!queryNum) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackData(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(queryNum)}&token=${encodeURIComponent(trackToken.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setTrackError(data.error || (lang === 'EN' ? 'Order not found.' : 'No se encontró el pedido.'));
      } else {
        setTrackData(data);
      }
    } catch (err) {
      setTrackError(lang === 'EN' ? 'Error connecting to server.' : 'Error al conectar con el servidor.');
    } finally {
      setTrackLoading(false);
    }
  };

  const handleQuickTrackOrder = (ordNum: string) => {
    setTrackOrderNumber(ordNum);
    setActiveTab('tracking');
    setMobileView('detail');
    handleAccountTrack(undefined, ordNum);
  };

  // Return & Retracto Modal state (Ley 1480 de 2011 / SIC Colombia)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any>(null);
  const [returnReason, setReturnReason] = useState('RETRACTO');
  const [returnComments, setReturnComments] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [returnRadicado, setReturnRadicado] = useState('');

  const handleOpenReturnModal = (order: any) => {
    setSelectedReturnOrder(order);
    setReturnReason('RETRACTO');
    setReturnComments('');
    setReturnError('');
    setReturnSuccess(false);
    setReturnRadicado('');
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;

    setReturnLoading(true);
    setReturnError('');

    try {
      const res = await fetch('/api/client/orders/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: selectedReturnOrder.orderNumber || selectedReturnOrder.id,
          reference: selectedReturnOrder.reference,
          email: clientUser?.email || selectedReturnOrder.customerEmail,
          customerName: clientUser?.name || selectedReturnOrder.customerName || name,
          customerPhone: clientUser?.phone || selectedReturnOrder.customerPhone || phone,
          reason: returnReason,
          comments: returnComments.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setReturnSuccess(true);
        setReturnRadicado(data.radicado || 'RET-OFICIAL');
        
        // Actualizar la orden en la lista local
        setOrders(prev => prev.map(o => {
          if ((o.reference && o.reference === selectedReturnOrder.reference) || (o.id && o.id === selectedReturnOrder.id)) {
            return { ...o, deliveryStatus: 'DEVUELTO' };
          }
          return o;
        }));

        // Actualizar storage
        try {
          const currentSaved = localStorage.getItem('noctis_client_user');
          if (currentSaved) {
            const parsed = JSON.parse(currentSaved);
            if (parsed.orders && Array.isArray(parsed.orders)) {
              parsed.orders = parsed.orders.map((o: any) => {
                if ((o.reference && o.reference === selectedReturnOrder.reference) || (o.id && o.id === selectedReturnOrder.id)) {
                  return { ...o, deliveryStatus: 'DEVUELTO' };
                }
                return o;
              });
              localStorage.setItem('noctis_client_user', JSON.stringify(parsed));
            }
          }
        } catch {
          // ignore
        }
      } else {
        setReturnError(data.error || 'No se pudo procesar la solicitud de devolución.');
      }
    } catch (err) {
      setReturnError('Error al comunicarse con el servidor.');
    } finally {
      setReturnLoading(false);
    }
  };



  useEffect(() => {
    if (!isAccountOpen) return;

    loadWishlist();

    const syncUserData = () => {
      try {
        const saved = localStorage.getItem('noctis_client_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setClientUser(parsed);
          setName(parsed.name || '');
          setPhone(parsed.phone || '');
          setCity(parsed.city || 'Bogotá D.C.');
          setDepartment(parsed.department || 'Cundinamarca');
          setAddress(parsed.address || '');
          setAvatar(parsed.avatar || null);

          if (parsed.orders && Array.isArray(parsed.orders) && parsed.orders.length > 0) {
            setOrders(parsed.orders);
          }

          // Fetch fresh orders, profile and PQRS from server
          if (parsed.email) {
            fetchUserData(parsed.email);
          }
        }
      } catch {
        // ignore
      }
    };

    syncUserData();

    const handleWishlistSync = () => loadWishlist();
    const handleOrdersSync = () => syncUserData();

    window.addEventListener('noctis-wishlist-updated', handleWishlistSync);
    window.addEventListener('noctis-orders-updated', handleOrdersSync);
    window.addEventListener('noctis-user-updated', handleOrdersSync);
    window.addEventListener('storage', handleOrdersSync);

    return () => {
      window.removeEventListener('noctis-wishlist-updated', handleWishlistSync);
      window.removeEventListener('noctis-orders-updated', handleOrdersSync);
      window.removeEventListener('noctis-user-updated', handleOrdersSync);
      window.removeEventListener('storage', handleOrdersSync);
    };
  }, [isAccountOpen]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatar(base64);
        const updated = { ...clientUser, avatar: base64 };
        setClientUser(updated);
        localStorage.setItem('noctis_client_user', JSON.stringify(updated));
        window.dispatchEvent(new Event('noctis-user-updated'));

        if (clientUser?.email) {
          try {
            await fetch('/api/client/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: clientUser.email,
                avatar: base64
              })
            });
          } catch (err) {
            console.warn('Error saving avatar to server:', err);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };


  const loadWishlist = () => {
    try {
      const saved = localStorage.getItem('noctis_wishlist');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const prods = NOCTIS_PRODUCTS.filter(p => ids.includes(p.id));
        setWishlistProducts(prods);
      } else {
        setWishlistProducts([]);
      }
    } catch {
      setWishlistProducts([]);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    try {
      const saved = localStorage.getItem('noctis_wishlist');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const filtered = ids.filter(id => id !== productId);
        localStorage.setItem('noctis_wishlist', JSON.stringify(filtered));
        loadWishlist();
        window.dispatchEvent(new Event('noctis-wishlist-updated'));
      }
    } catch {
      // ignore
    }
  };

  const handlePrintReceipt = (ord: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const items = ord.items || [];
    const itemsHtml = Array.isArray(items) && items.length > 0
      ? items.map((it: any) => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 12px 8px; font-weight: 600;">${it.product?.name || it.name || 'Prenda NOCTIS'} ${it.size ? `(Talla ${it.size})` : ''} ${it.color ? ` - ${it.color}` : ''}</td>
          <td style="padding: 12px 8px; text-align: center;">${it.quantity || 1}</td>
          <td style="padding: 12px 8px; text-align: right;">$${Number(it.product?.price || it.price || 0).toLocaleString('es-CO')} COP</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${Number((it.product?.price || it.price || 0) * (it.quantity || 1)).toLocaleString('es-CO')} COP</td>
        </tr>
      `).join('')
      : `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 12px 8px; font-weight: 600;">Orden Oficial #${ord.orderNumber || ord.id}</td>
          <td style="padding: 12px 8px; text-align: center;">1</td>
          <td style="padding: 12px 8px; text-align: right;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
        </tr>
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo Oficial NOCTIS - #${ord.orderNumber || ord.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #18181b; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #18181b; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
          .meta { font-size: 13px; color: #71717a; text-align: right; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; font-size: 13px; }
          .box { background: #f4f4f5; padding: 16px; border-radius: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
          th { background: #18181b; color: #ffffff; padding: 10px 8px; text-align: left; font-size: 12px; letter-spacing: 0.5px; }
          .total-box { display: flex; justify-content: flex-end; font-size: 16px; }
          .total-table { width: 300px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px dashed #d4d4d8; font-size: 11px; color: #71717a; text-align: center; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">NOCTIS URBANO</div>
            <div style="font-size: 12px; color: #71717a; margin-top: 4px;">Streetwear de Alto Calibre • Bogotá D.C., Colombia</div>
            <div style="font-size: 12px; color: #71717a;">NIT: 901.554.892-1 • WhatsApp: +57 313 585 9810</div>
          </div>
          <div class="meta">
            <div style="font-size: 16px; font-weight: bold; color: #18181b;">COMPROBANTE ELECTRÓNICO</div>
            <div><strong>Orden:</strong> #${ord.orderNumber || ord.id}</div>
            <div><strong>Fecha:</strong> ${ord.createdAt ? new Date(ord.createdAt).toLocaleString('es-CO') : new Date().toLocaleDateString('es-CO')}</div>
            <div><strong>Medio de Pago:</strong> Pasarela Wompi (Bancolombia/Nequi/PSE)</div>
            <div><strong>Estado:</strong> <span style="color: #16a34a; font-weight: bold;">${ord.status || 'PAGADO'}</span></div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <strong>DATOS DEL CLIENTE</strong>
            <div style="margin-top: 6px;">${ord.customerName || name || clientUser?.name || 'Cliente'}</div>
            <div style="color: #71717a;">${ord.customerEmail || clientUser?.email || ''}</div>
            <div style="color: #71717a;">Tel: ${ord.customerPhone || phone || clientUser?.phone || 'No registrado'}</div>
          </div>
          <div class="box">
            <strong>DATOS DE DESPACHO / ENVÍO</strong>
            <div style="margin-top: 6px;">${ord.shippingAddress || address || clientUser?.address || 'Dirección no especificada'}</div>
            <div style="color: #71717a;">${ord.city || city || 'Bogotá D.C.'}, ${ord.department || department || 'Cundinamarca'}</div>
            <div style="color: #71717a;">Guía / Tracking: ${ord.trackingNumber || 'En asignación de mensajería'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>DESCRIPCIÓN DE PRENDA</th>
              <th style="text-align: center;">CANT</th>
              <th style="text-align: right;">PRECIO UNIT</th>
              <th style="text-align: right;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <table class="total-table">
            <tr>
              <td style="padding: 6px 0; color: #71717a;">Subtotal:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #71717a;">Envío Nacional / Local:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #16a34a;">GRATIS ($0 COP)</td>
            </tr>
            <tr style="border-top: 2px solid #18181b;">
              <td style="padding: 10px 0; font-size: 16px; font-weight: 900;">TOTAL PAGADO:</td>
              <td style="padding: 10px 0; text-align: right; font-size: 16px; font-weight: 900; color: #ff5500;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Gracias por elegir NOCTIS URBANO. Este documento constituye un recibo digital de compra emitido automáticamente tras la validación de pago por Wompi Colombia.</p>
          <p>Soporte y Garantías: soporte@noctisurbano.com | WhatsApp: +57 313 585 9810</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };


  const fetchUserData = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/client/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.name) setName(data.user.name);
        if (data.user.phone) setPhone(data.user.phone);
        if (data.user.city) setCity(data.user.city);
        if (data.user.department) setDepartment(data.user.department);
        if (data.user.address) setAddress(data.user.address);
        if (data.user.avatar) setAvatar(data.user.avatar);

        const currentSaved = localStorage.getItem('noctis_client_user');
        const parsedSaved = currentSaved ? JSON.parse(currentSaved) : {};

        const combinedOrdersMap = new Map();
        (parsedSaved.orders || []).forEach((o: any) => combinedOrdersMap.set(o.reference || o.id || o.orderNumber, o));
        (data.orders || []).forEach((o: any) => {
          const key = o.reference || o.id || o.orderNumber;
          const prev = combinedOrdersMap.get(key) || {};
          combinedOrdersMap.set(key, { ...prev, ...o });
        });
        const mergedOrders = Array.from(combinedOrdersMap.values()).sort((a: any, b: any) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        const freshUser = {
          ...parsedSaved,
          ...data.user,
          orders: mergedOrders,
          avatar: data.user.avatar || parsedSaved.avatar || avatar
        };
        setClientUser(freshUser);
        localStorage.setItem('noctis_client_user', JSON.stringify(freshUser));

        setOrders(mergedOrders);
        setPqrsList(data.pqrs || []);

        if (trackOrderNumber) {
          const matched = mergedOrders.find((o: any) => 
            (o.orderNumber && o.orderNumber.toUpperCase() === trackOrderNumber.toUpperCase()) ||
            (o.reference && o.reference.toUpperCase() === trackOrderNumber.toUpperCase()) ||
            (o.id && o.id.toUpperCase() === trackOrderNumber.toUpperCase())
          );
          if (matched) {
            setTrackData((prev: any) => prev ? { ...prev, ...matched } : matched);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientUser?.email) return;

    setSaving(true);
    try {
      const currentAvatar = avatar || clientUser.avatar;
      const res = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientUser.email,
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          department: department.trim(),
          address: address.trim(),
          avatar: currentAvatar
        })
      });

      const data = await res.json();
      if (data.success) {
        const updated = {
          ...clientUser,
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          department: department.trim(),
          address: address.trim(),
          avatar: currentAvatar
        };
        localStorage.setItem('noctis_client_user', JSON.stringify(updated));
        setClientUser(updated);
        window.dispatchEvent(new Event('noctis-user-updated'));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };


  const handleLogout = () => {
    try {
      localStorage.removeItem('noctis_client_user');
      setClientUser(null);
      setIsAccountOpen(false);
      window.location.reload();
    } catch {
      // ignore
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientUser?.email) return;

    setPassError('');
    setPassSuccess(false);

    if (newPassword.length < 6) {
      setPassError(lang === 'EN' ? 'New password must have at least 6 characters.' : 'La nueva contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError(lang === 'EN' ? 'Passwords do not match.' : 'Las nuevas contraseñas no coinciden.');
      return;
    }

    setSavingPass(true);
    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          email: clientUser.email,
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setPassError(data.error || (lang === 'EN' ? 'Failed to update password.' : 'No fue posible actualizar la contraseña.'));
      } else {
        setPassSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassSuccess(false), 4000);
      }
    } catch (err: any) {
      setPassError(err.message || 'Error de conexión');
    } finally {
      setSavingPass(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientUser?.email) return;

    if (deleteConfirmPhrase.trim().toLowerCase() !== 'acepto eliminacion de cuenta') {
      setDeleteError(
        lang === 'EN'
          ? 'You must type exactly: "acepto eliminacion de cuenta"'
          : 'Debes escribir exactamente la frase: "acepto eliminacion de cuenta"'
      );
      return;
    }

    if (!deletePassword) {
      setDeleteError(
        lang === 'EN'
          ? 'Please enter your current password.'
          : 'Por favor ingresa tu contraseña actual para confirmar tu identidad.'
      );
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-account',
          email: clientUser.email,
          password: deletePassword.trim(),
          confirmationText: deleteConfirmPhrase.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setDeleteError(data.error || 'Error al eliminar la cuenta');
        setDeleteLoading(false);
        return;
      }

      setDeleteSuccess(true);
      setTimeout(() => {
        // Limpiar sesión del cliente y carrito/favoritos
        try {
          localStorage.removeItem('noctis_client_user');
          localStorage.removeItem('noctis_wishlist');
          window.dispatchEvent(new Event('noctis-user-updated'));
          window.dispatchEvent(new Event('noctis-wishlist-updated'));
        } catch {}
        setClientUser(null);
        setIsDeleteModalOpen(false);
        setIsAccountOpen(false);
        alert(
          lang === 'EN'
            ? 'Your account and personal data have been permanently deleted in compliance with Colombian Data Protection Law 1581 of 2012.'
            : 'Tu cuenta y datos personales han sido eliminados de manera definitiva en cumplimiento de la Ley 1581 de 2012 (Habeas Data).'
        );
      }, 1500);
    } catch (err: any) {
      setDeleteError(err.message || 'Error de conexión con el servidor');
    } finally {
      setDeleteLoading(false);
    }
  };


  if (!isAccountOpen) return null;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    profile: {
      title: lang === 'EN' ? 'Personal Details & Security' : 'Datos Personales y Seguridad',
      subtitle: lang === 'EN' ? 'Manage your contact info, shipping address and password' : 'Gestiona tus datos de contacto, dirección de despacho y contraseña'
    },
    orders: {
      title: lang === 'EN' ? 'My Orders & Invoices' : 'Mis Compras y Facturas',
      subtitle: lang === 'EN' ? 'History of purchases and verified digital receipts' : 'Historial de compras realizadas y recibos digitales verificados'
    },
    wishlist: {
      title: lang === 'EN' ? 'Wishlist' : 'Lista de Deseos / Favoritos',
      subtitle: lang === 'EN' ? 'Items you have saved for later' : 'Prendas que guardaste para tu próxima compra'
    },
    tracking: {
      title: lang === 'EN' ? 'Live Order Tracking' : 'Seguimiento de Envíos en Vivo',
      subtitle: lang === 'EN' ? 'Real-time courier dispatch and status' : 'Estado logístico y guía de mensajería en tiempo real'
    },
    pqrs: {
      title: lang === 'EN' ? 'Support & PQRS Tickets' : 'PQRS y Soporte al Cliente',
      subtitle: lang === 'EN' ? 'Customer service tickets and warranty management' : 'Peticiones, quejas, reclamos y garantías directas'
    }
  };

  return (
    <div
      className="account-modal-backdrop"
      onClick={() => setIsAccountOpen(false)}
    >
      <div
        className="account-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* COLUMNA IZQUIERDA: SIDEBAR EN DESKTOP / HUB EN MOBILE */}
        <aside
          style={{
            width: '290px',
            minWidth: '270px',
            backgroundColor: '#070709',
            borderRight: '1px solid rgba(255, 255, 255, 0.09)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px 20px'
          }}
          className={`account-modal-sidebar ${mobileView === 'detail' ? 'mobile-hidden' : 'mobile-visible'}`}
        >
          {/* Top Profile Summary */}
          <div>
            <div className="account-modal-sidebar-top" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title={lang === 'EN' ? 'Click to change profile photo' : 'Clic para cambiar foto de perfil'}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#18181b',
                      border: '2px solid #ff5500',
                      color: '#ff7733',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                      position: 'relative',
                      boxShadow: '0 0 16px rgba(255, 85, 0, 0.25)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {avatar || clientUser?.avatar ? (
                      <img
                        src={avatar || clientUser?.avatar}
                        alt={clientUser?.name || 'Foto de perfil'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      clientUser?.name ? clientUser.name.charAt(0).toUpperCase() : 'U'
                    )}

                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <Camera size={16} color="#ffffff" />
                    </div>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />

                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    backgroundColor: '#ff5500',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    border: '2px solid #070709'
                  }}>
                    <Camera size={9} color="#ffffff" />
                  </div>
                </div>

                <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 900, margin: 0, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                      {clientUser?.name || 'Cliente'}
                    </h2>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '10px',
                    marginTop: '2px'
                  }}>
                    <ShieldCheck size={9} /> VERIFICADO
                  </span>
                  <p style={{ fontSize: '0.68rem', color: '#a1a1aa', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                    {clientUser?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="account-modal-sidebar-divider" style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: '16px' }} />

            {/* VISTA MÓVIL: HUB DE NAVEGACIÓN EN 2 COLUMNAS */}
            <div className="account-mobile-hub-section">
              <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                {lang === 'EN' ? 'SELECT A SECTION:' : 'SELECCIONA UNA SECCIÓN:'}
              </span>
              <div className="account-mobile-hub-grid">
                <button
                  type="button"
                  className={`hub-card ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('profile'); setMobileView('detail'); }}
                >
                  <User size={22} color={activeTab === 'profile' ? '#ff5500' : '#ffffff'} />
                  <strong>{lang === 'EN' ? 'Personal Details' : 'Datos Personales'}</strong>
                  <span>{lang === 'EN' ? 'Contact & Address' : 'Contacto y Dirección'}</span>
                </button>

                <button
                  type="button"
                  className={`hub-card ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('orders'); setMobileView('detail'); }}
                >
                  <Package size={22} color={activeTab === 'orders' ? '#ff5500' : '#ffffff'} />
                  <strong>{lang === 'EN' ? 'My Orders' : 'Mis Compras'}</strong>
                  <span className="hub-badge">{orders.length} {lang === 'EN' ? 'orders' : 'pedidos'}</span>
                </button>

                <button
                  type="button"
                  className={`hub-card ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('wishlist'); setMobileView('detail'); }}
                >
                  <Heart size={22} color={activeTab === 'wishlist' ? '#ff5500' : '#ffffff'} fill={wishlistProducts.length > 0 ? '#ef4444' : 'none'} />
                  <strong>{lang === 'EN' ? 'Wishlist' : 'Favoritos'}</strong>
                  <span className="hub-badge">{wishlistProducts.length} {lang === 'EN' ? 'items' : 'prendas'}</span>
                </button>

                <button
                  type="button"
                  className={`hub-card ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('tracking'); setMobileView('detail'); }}
                >
                  <Truck size={22} color={activeTab === 'tracking' ? '#ff5500' : '#ffffff'} />
                  <strong>{lang === 'EN' ? 'Tracking' : 'Seguimiento'}</strong>
                  <span>{lang === 'EN' ? 'Live status' : 'Rastreo en vivo'}</span>
                </button>

                <button
                  type="button"
                  className={`hub-card ${activeTab === 'pqrs' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('pqrs'); setMobileView('detail'); }}
                >
                  <FileText size={22} color={activeTab === 'pqrs' ? '#ff5500' : '#ffffff'} />
                  <strong>PQRS</strong>
                  <span className="hub-badge">{pqrsList.length} tickets</span>
                </button>

                <button
                  type="button"
                  className="hub-card logout-card"
                  onClick={handleLogout}
                >
                  <LogOut size={22} color="#f87171" />
                  <strong style={{ color: '#f87171' }}>{lang === 'EN' ? 'Sign Out' : 'Cerrar Sesión'}</strong>
                  <span>{lang === 'EN' ? 'Exit account' : 'Salir de la cuenta'}</span>
                </button>
              </div>
            </div>

            {/* VISTA DESKTOP: BARRA VERTICAL CLÁSICA */}
            <div className="account-desktop-nav-section">
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'profile' ? 'rgba(255, 85, 0, 0.14)' : 'transparent',
                    color: activeTab === 'profile' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'profile' ? '3px solid #ff5500' : '3px solid transparent',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === 'profile' ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={17} color={activeTab === 'profile' ? '#ff5500' : '#71717a'} />
                    <span>{lang === 'EN' ? 'Personal Details' : 'Datos Personales'}</span>
                  </div>
                </button>

                <button
                  className={activeTab === 'orders' ? 'active' : ''}
                  onClick={() => setActiveTab('orders')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'orders' ? 'rgba(255, 85, 0, 0.14)' : 'transparent',
                    color: activeTab === 'orders' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'orders' ? '3px solid #ff5500' : '3px solid transparent',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === 'orders' ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={17} color={activeTab === 'orders' ? '#ff5500' : '#71717a'} />
                    <span>{lang === 'EN' ? 'My Orders' : 'Mis Compras'}</span>
                  </div>
                  <span style={{
                    backgroundColor: activeTab === 'orders' ? '#ff5500' : 'rgba(255, 255, 255, 0.08)',
                    color: activeTab === 'orders' ? '#ffffff' : '#a1a1aa',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '12px'
                  }}>
                    {orders.length}
                  </span>
                </button>

                <button
                  className={activeTab === 'wishlist' ? 'active' : ''}
                  onClick={() => setActiveTab('wishlist')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'wishlist' ? 'rgba(255, 85, 0, 0.14)' : 'transparent',
                    color: activeTab === 'wishlist' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'wishlist' ? '3px solid #ff5500' : '3px solid transparent',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === 'wishlist' ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Heart
                      size={17}
                      fill={wishlistProducts.length > 0 ? (activeTab === 'wishlist' ? '#ff5500' : '#ef4444') : 'none'}
                      color={wishlistProducts.length > 0 ? (activeTab === 'wishlist' ? '#ff5500' : '#ef4444') : (activeTab === 'wishlist' ? '#ff5500' : '#71717a')}
                    />
                    <span>{lang === 'EN' ? 'Wishlist' : 'Favoritos'}</span>
                  </div>
                  <span style={{
                    backgroundColor: activeTab === 'wishlist' ? '#ff5500' : 'rgba(255, 255, 255, 0.08)',
                    color: activeTab === 'wishlist' ? '#ffffff' : '#a1a1aa',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '12px'
                  }}>
                    {wishlistProducts.length}
                  </span>
                </button>

                <button
                  className={activeTab === 'tracking' ? 'active' : ''}
                  onClick={() => setActiveTab('tracking')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'tracking' ? 'rgba(255, 85, 0, 0.14)' : 'transparent',
                    color: activeTab === 'tracking' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'tracking' ? '3px solid #ff5500' : '3px solid transparent',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === 'tracking' ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={17} color={activeTab === 'tracking' ? '#ff5500' : '#71717a'} />
                    <span>{lang === 'EN' ? 'Live Tracking' : 'Seguimiento'}</span>
                  </div>
                </button>

                <button
                  className={activeTab === 'pqrs' ? 'active' : ''}
                  onClick={() => setActiveTab('pqrs')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'pqrs' ? 'rgba(255, 85, 0, 0.14)' : 'transparent',
                    color: activeTab === 'pqrs' ? '#ffffff' : '#9ca3af',
                    borderLeft: activeTab === 'pqrs' ? '3px solid #ff5500' : '3px solid transparent',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === 'pqrs' ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={17} color={activeTab === 'pqrs' ? '#ff5500' : '#71717a'} />
                    <span>PQRS</span>
                  </div>
                  <span style={{
                    backgroundColor: activeTab === 'pqrs' ? '#ff5500' : 'rgba(255, 255, 255, 0.08)',
                    color: activeTab === 'pqrs' ? '#ffffff' : '#a1a1aa',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '12px'
                  }}>
                    {pqrsList.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Action: Logout Desktop */}
          <div className="account-desktop-logout" style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                backgroundColor: 'rgba(239, 68, 68, 0.06)',
                color: '#f87171',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={15} />
              <span>{lang === 'EN' ? 'Sign Out' : 'Cerrar Sesión'}</span>
            </button>
          </div>
        </aside>

        {/* COLUMNA DERECHA: PANEL DE CONTENIDO Y CABECERA DE SECCIÓN */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#0c0c0e'
          }}
          className={`account-modal-main ${mobileView === 'menu' ? 'mobile-hidden' : 'mobile-visible'}`}
        >
          {/* Header Superior del Panel Activo con Botón de Flecha Izquierda para Móvil */}
          <div
            className="account-modal-main-header"
            style={{
              padding: '22px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
              backgroundColor: '#0a0a0c'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                className="mobile-back-to-menu-btn"
                onClick={() => setMobileView('menu')}
                aria-label="Volver al menú de cuenta"
                title="Volver al menú de secciones"
              >
                <ChevronLeft size={18} />
                <span>{lang === 'EN' ? 'Menu' : 'Menú'}</span>
              </button>

              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {tabTitles[activeTab]?.title}
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '3px 0 0' }}>
                  {tabTitles[activeTab]?.subtitle}
                </p>
              </div>
            </div>

            <button
              className="client-close-btn"
              onClick={() => setIsAccountOpen(false)}
              aria-label="Cerrar modal de cuenta"
              title="Cerrar (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Área de Contenido Scrolleable */}
          <div className="account-content-scroll">
            {/* TAB 1: DATOS PERSONALES */}
            {activeTab === 'profile' && (
            <div>
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="account-grid-2col">

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Full Name' : 'Nombre Completo'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +57 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="account-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'City' : 'Ciudad'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Department' : 'Departamento'}
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Default Shipping Address' : 'Dirección de Despacho Predilecta'}
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cra 15 # 85-30 Apto 402, Chapinero"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              {saveSuccess && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check size={16} />
                  <span>{lang === 'EN' ? 'Profile saved successfully!' : '¡Datos guardados exitosamente!'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <Save size={15} />
                <span>{saving ? (lang === 'EN' ? 'SAVING...' : 'GUARDANDO...') : (lang === 'EN' ? 'SAVE CHANGES' : 'GUARDAR CAMBIOS')}</span>
              </button>
            </form>

            {/* SECCIÓN: SEGURIDAD Y CAMBIO DE CONTRASEÑA */}
            <div style={{
              marginTop: '28px',
              paddingTop: '22px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Key size={16} style={{ color: '#ff5500' }} />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#ffffff' }}>
                  {lang === 'EN' ? 'Security & Password' : 'Seguridad y Cambio de Contraseña'}
                </h3>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Contraseña Actual */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Current Password' : 'Contraseña Actual'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder={lang === 'EN' ? 'Enter current password' : 'Tu contraseña actual'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 14px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#a1a1aa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Nueva Contraseña y Confirmación */}
                <div className="account-grid-2col">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {lang === 'EN' ? 'New Password' : 'Nueva Contraseña'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder={lang === 'EN' ? 'Min. 6 chars' : 'Mínimo 6 caracteres'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '0.86rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#a1a1aa',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {lang === 'EN' ? 'Confirm New Password' : 'Confirmar Nueva Contraseña'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        placeholder={lang === 'EN' ? 'Repeat new password' : 'Repite nueva contraseña'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '0.86rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#a1a1aa',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error & Success Messages */}
                {passError && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{passError}</span>
                  </div>
                )}

                {passSuccess && (
                  <div style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={16} />
                    <span>{lang === 'EN' ? 'Password updated successfully!' : '¡Contraseña actualizada exitosamente!'}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPass}
                  style={{
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '11px 20px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    cursor: savingPass ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff5500';
                    e.currentTarget.style.borderColor = '#ff5500';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#18181b';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <Lock size={14} />
                  <span>{savingPass ? (lang === 'EN' ? 'UPDATING...' : 'ACTUALIZANDO...') : (lang === 'EN' ? 'CHANGE PASSWORD' : 'CAMBIAR CONTRASEÑA')}</span>
                </button>
              </form>
            </div>

            {/* SECCIÓN: GESTIÓN DE PRIVACIDAD Y SUPRESIÓN DE CUENTA (LEY 1581 DE 2012) */}
            <div style={{
              marginTop: '34px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 85, 0, 0.12)',
                      padding: '8px',
                      borderRadius: '6px',
                      color: '#ff5500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                        {lang === 'EN' ? 'Privacy & Account Erasure' : 'Gestión de Privacidad y Supresión de Cuenta'}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#a1a1aa' }}>
                        {lang === 'EN' ? 'Exercise of Habeas Data rights (Colombian Statutory Law 1581 / 2012)' : 'Ejercicio del derecho legal de supresión de datos (Ley Estatutaria 1581 de 2012 - Habeas Data)'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setDeleteError('');
                      setDeletePassword('');
                      setDeleteConfirmPhrase('');
                      setDeleteSuccess(false);
                    }}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#f87171',
                      padding: '9px 18px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                      e.currentTarget.style.color = '#f87171';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
                    }}
                  >
                    <Trash2 size={14} />
                    <span>{lang === 'EN' ? 'Delete Account' : 'Eliminar Cuenta'}</span>
                  </button>
                </div>

                <p style={{ margin: 0, fontSize: '0.74rem', color: '#71717a', lineHeight: 1.45 }}>
                  {lang === 'EN'
                    ? 'In compliance with Colombian Habeas Data regulations and the Superintendence of Industry and Commerce (SIC), you can permanently delete your personal information, delivery addresses, and account credentials at any time.'
                    : 'En cumplimiento del marco legal colombiano de protección al consumidor y la Superintendencia de Industria y Comercio (SIC), puedes ejercer tu derecho a la eliminación permanente e irreversible de tus datos personales, direcciones y credenciales de acceso.'}
                </p>
              </div>
            </div>
          </div>
        )}


          {/* TAB 2: MIS COMPRAS */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a' }}>
                  <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700, color: '#a1a1aa' }}>
                    {lang === 'EN' ? 'No orders registered yet' : 'Aún no tienes compras registradas'}
                  </p>
                  <p style={{ fontSize: '0.78rem', margin: '6px 0 20px' }}>
                    {lang === 'EN' ? 'Your purchases made with this email will appear here automatically.' : 'Tus compras pagadas mediante Wompi aparecerán aquí con su estado en tiempo real.'}
                  </p>
                  <button
                    onClick={() => setIsAccountOpen(false)}
                    style={{
                      backgroundColor: '#ff5500',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'EN' ? 'EXPLORE DROPS' : 'VER COLECCIÓN'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((ord, idx) => (
                    <div
                      key={ord.id || idx}
                      style={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '16px 18px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#ff7733', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 900 }}>
                              Pedido Oficial
                            </span>
                            {ord.reference && (
                              <span style={{ fontSize: '0.66rem', color: '#71717a', fontFamily: 'monospace' }}>
                                ({ord.reference})
                              </span>
                            )}
                          </div>
                          <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                            #{ord.orderNumber || ord.id}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{
                            backgroundColor: ord.status === 'APPROVED' || ord.status === 'PAGADO' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: ord.status === 'APPROVED' || ord.status === 'PAGADO' ? '#4ade80' : '#facc15',
                            border: `1px solid ${ord.status === 'APPROVED' || ord.status === 'PAGADO' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {ord.status === 'APPROVED' ? 'PAGO APROBADO' : (ord.status || 'CONFIRMADO')}
                          </span>

                          <span style={{
                            backgroundColor: ord.deliveryStatus === 'ENTREGADO' 
                              ? 'rgba(34, 197, 94, 0.15)' 
                              : ord.deliveryStatus === 'DESPACHADO' 
                              ? 'rgba(59, 130, 246, 0.15)' 
                              : ord.deliveryStatus === 'EN_PREPARACION' 
                              ? 'rgba(249, 115, 22, 0.15)' 
                              : ord.deliveryStatus === 'DEVUELTO'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(255, 255, 255, 0.08)',
                            color: ord.deliveryStatus === 'ENTREGADO' 
                              ? '#4ade80' 
                              : ord.deliveryStatus === 'DESPACHADO' 
                              ? '#60a5fa' 
                              : ord.deliveryStatus === 'EN_PREPARACION' 
                              ? '#fb923c' 
                              : ord.deliveryStatus === 'DEVUELTO'
                              ? '#f87171'
                              : '#d4d4d8',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {ord.deliveryStatus === 'ENTREGADO' ? 'Entregado' : ord.deliveryStatus === 'DESPACHADO' ? 'Despachado en Ruta' : ord.deliveryStatus === 'EN_PREPARACION' ? 'En Preparación' : ord.deliveryStatus === 'DEVUELTO' ? 'Devolución' : 'En Espera'}
                          </span>
                        </div>
                      </div>

                      {ord.trackingNumber && (
                        <div style={{
                          backgroundColor: 'rgba(74, 222, 128, 0.08)',
                          border: '1px solid rgba(74, 222, 128, 0.25)',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          fontSize: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                            <Truck size={13} />
                            <span>Guía Transportadora: <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{ord.trackingNumber}</strong></span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700 }}>Trazabilidad Oficial</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '10px' }}>
                        <span>Total: <strong style={{ color: '#ffffff' }}>${Number(ord.total || 0).toLocaleString('es-CO')} COP</strong></span>
                        <span>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Reciente'}</span>
                      </div>

                      {/* Lista de Prendas en este pedido */}
                      {ord.items && Array.isArray(ord.items) && ord.items.length > 0 && (
                        <div style={{
                          backgroundColor: '#111114',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          marginBottom: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '0.68rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
                            {lang === 'EN' ? 'ITEMS IN THIS ORDER:' : 'PRENDAS EN ESTE PEDIDO:'}
                          </span>
                          {ord.items.map((item: any, iIdx: number) => {
                            const pName = item.product?.name || item.title || item.name || 'Prenda Noctis';
                            const pImg = item.product?.image || item.image || '/assets/products/tee/noctis_herb_tee.jpg';
                            const pPrice = Number(item.product?.price || item.price || 0);
                            const pQty = Number(item.quantity || 1);
                            const pSize = item.size || '';
                            const pColor = item.color || item.selectedColor || '';

                            return (
                              <div key={iIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <img 
                                    src={pImg} 
                                    alt={pName} 
                                    style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0 }} 
                                  />
                                  <div>
                                    <strong style={{ fontSize: '0.8rem', color: '#ffffff', display: 'block' }}>{pName}</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                                      {pSize ? `Talla: ${pSize}` : ''} {pColor ? `| Color: ${pColor}` : ''} | Cantidad: {pQty}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                  ${(pPrice * pQty).toLocaleString('es-CO')} COP
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Botones de Acción de Pedido: Recibo PDF, Rastrear y Notificar WhatsApp */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleQuickTrackOrder(ord.orderNumber || ord.id)}
                          style={{
                            backgroundColor: '#27272a',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Truck size={13} />
                          <span>{lang === 'EN' ? 'TRACK ORDER' : 'RASTREAR PEDIDO'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(ord)}
                          style={{
                            backgroundColor: '#27272a',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Printer size={13} />
                          <span>{lang === 'EN' ? 'PRINT / PDF RECEIPT' : 'DESCARGAR RECIBO PDF'}</span>
                        </button>

                        <a
                          href={`https://wa.me/573135859810?text=${encodeURIComponent(`¡Hola NOCTIS! Quisiera consultar el estado y guía de despacho de mi pedido #${ord.orderNumber || ord.id} ($${Number(ord.total || 0).toLocaleString('es-CO')} COP). Mi nombre es ${ord.customerName || name || clientUser?.name || 'Cliente'}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={13} />
                          <span>{lang === 'EN' ? 'WHATSAPP UPDATE' : 'AVISO WHATSAPP'}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenReturnModal(ord)}
                          style={{
                            backgroundColor: ord.deliveryStatus === 'DEVUELTO' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.08)',
                            color: '#f87171',
                            border: ord.deliveryStatus === 'DEVUELTO' ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          title="Derecho de Retracto y Devolución (Ley 1480 de 2011 / SIC)"
                        >
                          <RotateCcw size={13} />
                          <span>
                            {ord.deliveryStatus === 'DEVUELTO'
                              ? (lang === 'EN' ? 'RETURN IN PROGRESS' : 'DEVOLUCIÓN RADICADA')
                              : (lang === 'EN' ? 'RETURNS & WITHDRAWAL' : 'SOLICITAR DEVOLUCIÓN')}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LISTA DE DESEOS / FAVORITOS */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a' }}>
                  <Heart size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700, color: '#a1a1aa' }}>
                    {lang === 'EN' ? 'Your wishlist is empty' : 'No tienes prendas guardadas en Favoritos'}
                  </p>
                  <p style={{ fontSize: '0.78rem', margin: '6px 0 20px' }}>
                    {lang === 'EN' ? 'Click the heart icon on any piece to save it for later.' : 'Haz clic en el icono de corazón ❤️ en cualquier prenda de la tienda para guardarla aquí.'}
                  </p>
                  <button
                    onClick={() => setIsAccountOpen(false)}
                    style={{
                      backgroundColor: '#ff5500',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'EN' ? 'EXPLORE CATALOG' : 'EXPLORAR CATÁLOGO'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                  {wishlistProducts.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ height: '140px', position: 'relative', backgroundColor: '#09090b' }}>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#ff5500',
                          color: '#ffffff',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          {prod.badge || 'NOCTIS'}
                        </span>
                      </div>

                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                            {prod.name}
                          </h4>
                          <p style={{ margin: '0 0 8px', fontSize: '0.74rem', color: '#a1a1aa' }}>
                            {prod.subtitle}
                          </p>
                          <p style={{ margin: '0 0 12px', fontSize: '0.86rem', fontWeight: 900, color: '#ff7733' }}>
                            ${prod.price.toLocaleString('es-CO')} COP
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, prod.availableSizes[0] || 'M', 1);
                              setIsAccountOpen(false);
                            }}
                            style={{
                              flex: 1,
                              backgroundColor: '#ffffff',
                              color: '#000000',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <ShoppingCart size={13} />
                            <span>{lang === 'EN' ? 'ADD TO BAG' : 'AGREGAR'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(prod.id)}
                            title="Eliminar de favoritos"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '8px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* TAB 3: SEGUIMIENTO EN VIVO DIRECTO */}
          {activeTab === 'tracking' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <Truck size={22} style={{ color: '#ff5500' }} />
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#ff5500', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      {lang === 'EN' ? 'SECURE TRACKING' : 'SEGUIMIENTO SEGURO'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                      {lang === 'EN' ? 'Track your order' : 'Tu pedido'}
                    </h3>
                  </div>
                </div>

                {/* Accesos rápidos si el usuario tiene compras registradas */}
                {orders.length > 0 && (
                  <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                      {lang === 'EN' ? 'Select a recent order to track:' : 'O selecciona una de tus compras recientes:'}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {orders.map((ord, i) => (
                        <button
                          key={ord.id || i}
                          type="button"
                          onClick={() => handleQuickTrackOrder(ord.orderNumber || ord.id)}
                          style={{
                            backgroundColor: trackOrderNumber === (ord.orderNumber || ord.id) ? '#ff5500' : 'rgba(255, 255, 255, 0.06)',
                            color: trackOrderNumber === (ord.orderNumber || ord.id) ? '#ffffff' : '#e4e4e7',
                            border: `1px solid ${trackOrderNumber === (ord.orderNumber || ord.id) ? '#ff5500' : 'rgba(255, 255, 255, 0.15)'}`,
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>#{ord.orderNumber || ord.id}</span>
                          <span style={{ fontSize: '0.66rem', opacity: 0.8 }}>(${Number(ord.total || 0).toLocaleString('es-CO')})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleAccountTrack} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'EN' ? 'ORDER NUMBER' : 'NÚMERO DE PEDIDO'}
                    </label>
                    <input
                      name="order_number"
                      maxLength={80}
                      required
                      placeholder="Ej. ORD-123456"
                      value={trackOrderNumber}
                      onChange={(e) => setTrackOrderNumber(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        backgroundColor: '#09090b',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {lang === 'EN' ? 'ACCESS TOKEN (OPTIONAL)' : 'TOKEN DE ACCESO (OPCIONAL)'}
                    </label>
                    <input
                      name="token"
                      type="password"
                      maxLength={128}
                      placeholder={lang === 'EN' ? 'Token given on purchase' : 'Token entregado al comprar'}
                      value={trackToken}
                      onChange={(e) => setTrackToken(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#09090b',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '12px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={trackLoading || !trackOrderNumber.trim()}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      padding: '14px 24px',
                      borderRadius: '6px',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: trackLoading || !trackOrderNumber.trim() ? 'not-allowed' : 'pointer',
                      opacity: trackLoading || !trackOrderNumber.trim() ? 0.6 : 1,
                      marginTop: '4px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {trackLoading ? (lang === 'EN' ? 'CHECKING...' : 'CONSULTANDO...') : (lang === 'EN' ? 'TRACK ORDER' : 'CONSULTAR PEDIDO')}
                  </button>
                </form>

                {trackError && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    color: '#f87171',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{trackError}</span>
                  </div>
                )}
              </div>

              {/* Resultado del seguimiento */}
              {trackData && (
                <div style={{
                  backgroundColor: '#18181b',
                  border: '1px solid #ff5500',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 10px 30px rgba(255, 85, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                      Pedido #{trackData.orderNumber}
                    </h4>
                    <span style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {trackData.status || 'PAGADO'}
                    </span>
                  </div>

                  <div className="account-grid-2col" style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '16px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Referencia Wompi</span>
                      <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{trackData.reference || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Estado Logístico</span>
                      <strong style={{ color: '#ff7733' }}>
                        {trackData.deliveryStatus === 'ENTREGADO' 
                          ? 'Entregado con Éxito' 
                          : trackData.deliveryStatus === 'DESPACHADO' 
                          ? 'Despachado en Ruta' 
                          : trackData.deliveryStatus === 'EN_PREPARACION' 
                          ? 'En Preparación y Empaque' 
                          : trackData.deliveryStatus === 'DEVUELTO' 
                          ? 'Devolución de Producto' 
                          : (trackData.deliveryStatus || 'En Proceso')}
                      </strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Ciudad de Despacho</span>
                      <strong style={{ color: '#ffffff' }}>{trackData.city || 'Bogotá D.C.'}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Total de la Orden</span>
                      <strong style={{ color: '#ffffff' }}>${Number(trackData.total || 0).toLocaleString('es-CO')} COP</strong>
                    </div>

                    {/* Badge de Guía de Envío */}
                    <div style={{
                      gridColumn: 'span 2',
                      backgroundColor: trackData.trackingNumber ? 'rgba(74, 222, 128, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${trackData.trackingNumber ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={16} color={trackData.trackingNumber ? '#4ade80' : '#a1a1aa'} />
                        <div>
                          <span style={{ fontSize: '0.68rem', color: trackData.trackingNumber ? '#86efac' : '#71717a', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                            NÚMERO DE GUÍA / TRACKING
                          </span>
                          <strong style={{ fontSize: '0.92rem', color: trackData.trackingNumber ? '#ffffff' : '#a1a1aa', fontFamily: 'monospace' }}>
                            {trackData.trackingNumber || 'En asignación de mensajería'}
                          </strong>
                        </div>
                      </div>
                      {trackData.trackingNumber && (
                        <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          Guía Oficial Activa
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Línea de tiempo interactiva estilo Mercado Libre con Iconos Oficiales */}
                  {(() => {
                    const ds = (trackData.deliveryStatus || '').toUpperCase();
                    const os = (trackData.status || '').toUpperCase();
                    let activeIndex = 1; // Por defecto pago aprobado -> en confección
                    if (ds.includes('ENTREGAD') || ds.includes('DELIVER')) activeIndex = 3;
                    else if (ds.includes('CAMINO') || ds.includes('DESPACH') || ds.includes('RUTA') || ds.includes('SHIP')) activeIndex = 2;
                    else if (ds.includes('CONFECC') || ds.includes('PREPAR') || ds.includes('TALLER')) activeIndex = 1;
                    else if (ds.includes('PAGO') || os.includes('APPROV') || os.includes('PAGAD')) activeIndex = 1;
                    else activeIndex = 0;

                    const stages = [
                      {
                        title: lang === 'EN' ? 'Payment Approved' : 'Pago Aprobado',
                        desc: lang === 'EN' ? 'Wompi Verified' : 'Comprobante OK',
                        icon: CreditCard,
                        statusText: lang === 'EN' ? 'Approved' : '✓ Aprobado'
                      },
                      {
                        title: lang === 'EN' ? 'Preparing Order' : 'En Preparación',
                        desc: lang === 'EN' ? 'Packing & Quality' : 'Empaque y Calidad',
                        icon: PackageCheck,
                        statusText: activeIndex > 1 ? (lang === 'EN' ? 'Packed' : '✓ Empacado') : (activeIndex === 1 ? (lang === 'EN' ? 'In Progress' : '● En preparación') : (lang === 'EN' ? 'Pending' : 'Pendiente'))
                      },
                      {
                        title: lang === 'EN' ? 'On The Way' : 'En Camino',
                        desc: lang === 'EN' ? 'Courier Dispatch' : 'Mensajería Express',
                        icon: Truck,
                        statusText: activeIndex > 2 ? (lang === 'EN' ? 'Dispatched' : '✓ Despachado') : (activeIndex === 2 ? (lang === 'EN' ? 'In Transit' : '● En camino') : (lang === 'EN' ? 'Pending' : 'Pendiente'))
                      },
                      {
                        title: lang === 'EN' ? 'Delivered' : 'Entregado',
                        desc: lang === 'EN' ? 'In your hands' : 'En tus manos',
                        icon: Home,
                        statusText: activeIndex === 3 ? (lang === 'EN' ? 'Delivered' : '✓ Entregado') : (lang === 'EN' ? 'Pending' : 'Pendiente')
                      }
                    ];

                    return (
                      <div style={{
                        backgroundColor: '#101014',
                        padding: '24px 20px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {lang === 'EN' ? 'LIVE SHIPMENT PROGRESS' : 'PROGRESO DEL ENVÍO EN TIEMPO REAL'}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: activeIndex === 3 ? '#4ade80' : '#ff7733',
                            backgroundColor: activeIndex === 3 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 85, 0, 0.15)',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            border: `1px solid ${activeIndex === 3 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 85, 0, 0.3)'}`
                          }}>
                            {stages[activeIndex]?.title}: {stages[activeIndex]?.desc}
                          </span>
                        </div>

                        {/* Stepper horizontal con barra conectora */}
                        <div style={{ position: 'relative', margin: '10px 0 20px' }}>
                          {/* Línea conectora de fondo */}
                          <div style={{
                            position: 'absolute',
                            top: '23px',
                            left: '6%',
                            right: '6%',
                            height: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '4px',
                            zIndex: 1
                          }} />

                          {/* Línea conectora activa con color según progreso */}
                          <div style={{
                            position: 'absolute',
                            top: '23px',
                            left: '6%',
                            width: `${(activeIndex / 3) * 88}%`,
                            height: '4px',
                            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                            borderRadius: '4px',
                            zIndex: 2,
                            transition: 'width 0.4s ease'
                          }} />

                          {/* Los 4 Nodos con Iconos estilo Mercado Libre */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            position: 'relative',
                            zIndex: 3
                          }}>
                            {stages.map((stage, idx) => {
                              const isCompletedOrActive = idx <= activeIndex;
                              const isNextPending = idx === activeIndex + 1;
                              const IconComp = stage.icon || (idx === 1 ? Scissors : Check);

                              let bg = '#18181b';
                              let border = '2px solid rgba(255, 255, 255, 0.12)';
                              let color = '#71717a';
                              let glow = 'none';

                              if (isCompletedOrActive) {
                                bg = '#052e16';
                                border = '2px solid #22c55e';
                                color = '#4ade80';
                                glow = '0 0 18px rgba(34, 197, 94, 0.45)';
                              } else if (isNextPending) {
                                bg = 'rgba(239, 68, 68, 0.15)';
                                border = '2px solid #ef4444';
                                color = '#f87171';
                                glow = '0 0 16px rgba(239, 68, 68, 0.35)';
                              }

                              return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                  {/* Círculo con Icono */}
                                  <div style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    backgroundColor: bg,
                                    border,
                                    color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: glow,
                                    marginBottom: '10px',
                                    transition: 'all 0.3s ease'
                                  }}>
                                    {isCompletedOrActive && idx < activeIndex ? (
                                      <CheckCircle2 size={22} color="#22c55e" />
                                    ) : (
                                      <IconComp size={20} />
                                    )}
                                  </div>

                                  {/* Título de etapa */}
                                  <strong style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    color: isCompletedOrActive ? '#4ade80' : (isNextPending ? '#f87171' : '#a1a1aa'),
                                    marginBottom: '2px'
                                  }}>
                                    {stage.title}
                                  </strong>

                                  {/* Subtítulo / Ubicación */}
                                  <span style={{ fontSize: '0.68rem', color: isCompletedOrActive ? '#86efac' : (isNextPending ? '#fca5a5' : '#71717a'), marginBottom: '4px' }}>
                                    {isCompletedOrActive ? (idx === activeIndex ? 'En Proceso' : 'Completado') : (isNextPending ? 'Próximo Paso' : stage.desc)}
                                  </span>

                                  {/* Mini Badge de Estado */}
                                  <span style={{
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    backgroundColor: isCompletedOrActive 
                                      ? 'rgba(34, 197, 94, 0.15)' 
                                      : (isNextPending ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)'),
                                    color: isCompletedOrActive 
                                      ? '#4ade80' 
                                      : (isNextPending ? '#f87171' : '#71717a'),
                                    border: isCompletedOrActive 
                                      ? '1px solid rgba(34, 197, 94, 0.3)' 
                                      : (isNextPending ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)')
                                  }}>
                                    {isCompletedOrActive ? (idx === activeIndex ? 'En Proceso' : 'Aprobado') : (isNextPending ? 'Pendiente' : 'En Espera')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tarjeta de Resumen Detallado estilo Mercado Libre */}
                        <div style={{
                          backgroundColor: '#18181c',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 85, 0, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ff5500'
                            }}>
                              <Truck size={18} />
                            </div>
                            <div>
                              <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                                {lang === 'EN' ? 'Courier & Destination' : 'Transportadora y Destino'}
                              </span>
                              <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>
                                {trackData.city || 'Bogotá D.C.'} • {trackData.shippingAddress || 'Envío Express Nacional'}
                              </strong>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                              {lang === 'EN' ? 'Tracking & Carrier' : 'Guía de Rastreo & Operador'}
                            </span>
                            <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#4ade80', fontFamily: 'monospace' }}>
                              {trackData.trackingNumber ? `Guía: ${trackData.trackingNumber}` : 'Coordinadora / Servientrega'}
                            </span>
                          </div>
                        </div>

                        {/* PRENDAS EN ESTE PEDIDO */}
                        {trackData.items && Array.isArray(trackData.items) && trackData.items.length > 0 && (
                          <div style={{
                            marginTop: '16px',
                            backgroundColor: '#141418',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '16px'
                          }}>
                            <h5 style={{
                              margin: '0 0 12px',
                              fontSize: '0.78rem',
                              fontWeight: 900,
                              color: '#ffffff',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase'
                            }}>
                              {lang === 'EN' ? 'ITEMS IN THIS ORDER' : 'PRENDAS EN ESTE PEDIDO'}
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {trackData.items.map((it: any, iIdx: number) => {
                                const pName = it.product?.name || it.title || it.name || 'Prenda Noctis';
                                const pImg = it.product?.image || it.image || '/assets/products/tee/noctis_herb_tee.jpg';
                                const pPrice = Number(it.product?.price || it.price || 0);
                                const pQty = Number(it.quantity || 1);
                                const pSize = it.size || '';
                                const pColor = it.color || it.selectedColor || '';

                                return (
                                  <div
                                    key={iIdx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: '12px',
                                      padding: '10px 12px',
                                      backgroundColor: '#1a1a20',
                                      borderRadius: '6px',
                                      border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <img
                                        src={pImg}
                                        alt={pName}
                                        style={{
                                          width: '44px',
                                          height: '44px',
                                          borderRadius: '6px',
                                          objectFit: 'cover',
                                          border: '1px solid rgba(255, 255, 255, 0.1)',
                                          flexShrink: 0
                                        }}
                                      />
                                      <div>
                                        <strong style={{ fontSize: '0.84rem', color: '#ffffff', display: 'block' }}>{pName}</strong>
                                        <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' }}>
                                          {pSize ? `Talla: ${pSize}` : ''} {pColor ? `| Color: ${pColor}` : ''} | Cantidad: {pQty}
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                                      ${(pPrice * pQty).toLocaleString('es-CO')} COP
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: '12px',
                              paddingTop: '12px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                              fontSize: '0.85rem'
                            }}>
                              <span style={{ color: '#a1a1aa' }}>Total Liquidado:</span>
                              <strong style={{ fontSize: '1rem', color: '#ff7733', fontWeight: 900 }}>
                                ${Number(trackData.total || 0).toLocaleString('es-CO')} COP
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Guía informativa de fases cuando aún no se ha consultado */}
              {!trackData && (
                <div style={{ backgroundColor: '#101014', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '16px' }}>
                    {lang === 'EN' ? 'NOCTIS 4-STEP LOGISTICS PIPELINE:' : 'FASES DEL PROCESO DE ENTREGA NOCTIS:'}
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '10px', textAlign: 'center' }}>
                    <div style={{ padding: '12px 8px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #22c55e' }}>
                      <CreditCard size={20} color="#22c55e" style={{ margin: '0 auto 6px' }} />
                      <strong style={{ color: '#22c55e', display: 'block', fontSize: '0.78rem' }}>1. Pago</strong>
                      <span style={{ color: '#71717a', fontSize: '0.68rem' }}>Wompi OK</span>
                    </div>
                    <div style={{ padding: '12px 8px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #ff5500' }}>
                      <PackageCheck size={20} color="#ff5500" style={{ margin: '0 auto 6px' }} />
                      <strong style={{ color: '#ff5500', display: 'block', fontSize: '0.78rem' }}>2. En Preparación</strong>
                      <span style={{ color: '#71717a', fontSize: '0.68rem' }}>Empaque y Calidad</span>
                    </div>
                    <div style={{ padding: '12px 8px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Truck size={20} color="#a1a1aa" style={{ margin: '0 auto 6px' }} />
                      <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.78rem' }}>3. En Camino</strong>
                      <span style={{ color: '#71717a', fontSize: '0.68rem' }}>Mensajería</span>
                    </div>
                    <div style={{ padding: '12px 8px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Home size={20} color="#a1a1aa" style={{ margin: '0 auto 6px' }} />
                      <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.78rem' }}>4. Entregado</strong>
                      <span style={{ color: '#71717a', fontSize: '0.68rem' }}>En tus manos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MIS PQRS */}
          {activeTab === 'pqrs' && (
            <div>
              {pqrsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: '#71717a' }}>
                  <FileText size={38} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.88rem', margin: 0, fontWeight: 700, color: '#a1a1aa' }}>
                    {lang === 'EN' ? 'No active PQRS requests' : 'No tienes solicitudes o quejas radicadas'}
                  </p>
                  <p style={{ fontSize: '0.76rem', margin: '4px 0 16px' }}>
                    {lang === 'EN' ? 'File any formal inquiry or warranty claim in our PQRS center.' : 'Si requieres radicar un cambio, garantía o petición formal, puedes hacerlo en nuestra sección legal.'}
                  </p>
                  <a
                    href="/pqrs"
                    style={{
                      color: '#ff5500',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textDecoration: 'underline'
                    }}
                  >
                    {lang === 'EN' ? 'Go to PQRS Center' : 'Ir al Centro de Radicación PQRS →'}
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pqrsList.map((pqr, idx) => (
                    <div
                      key={pqr.id || idx}
                      style={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '14px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ff7733', fontFamily: 'monospace' }}>
                          {pqr.radicado}
                        </span>
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          backgroundColor: 'rgba(255, 85, 0, 0.15)',
                          color: '#ff7733',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {pqr.status || 'EN TRÁMITE'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#d4d4d8', margin: '0 0 6px', lineHeight: 1.4 }}>
                        {pqr.description}
                      </p>
                      <span style={{ fontSize: '0.68rem', color: '#71717a' }}>
                        Radicado el: {pqr.createdAt ? new Date(pqr.createdAt).toLocaleDateString() : 'Reciente'} (Plazo de Ley: 15 días hábiles)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE CUENTA (LEY 1581 DE 2012) */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(12px)',
            zIndex: 100005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#0f0e11',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              borderRadius: '14px',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.95), 0 0 45px rgba(239, 68, 68, 0.2)',
              color: '#ffffff',
              padding: '26px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  color: '#ef4444',
                  padding: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                    {lang === 'EN' ? 'Account & Personal Data Erasure' : 'Supresión de Cuenta y Datos Personales'}
                  </h3>
                  <span style={{ fontSize: '0.68rem', color: '#ff7733', fontWeight: 800, letterSpacing: '0.04em' }}>
                    LEY ESTATUTARIA 1581 DE 2012 — HABEAS DATA (SIC COLOMBIA)
                  </span>
                </div>
              </div>

              {!deleteLoading && (
                <button
                  className="client-close-btn"
                  onClick={() => setIsDeleteModalOpen(false)}
                  title="Cancelar"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Advertencia Legal */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '14px 16px',
              fontSize: '0.78rem',
              color: '#a1a1aa',
              lineHeight: 1.5
            }}>
              Esta acción es <strong style={{ color: '#ef4444' }}>definitiva e irreversible</strong>. Se eliminará tu perfil, direcciones guardadas, lista de favoritos y acceso general a la tienda.
              <br /><br />
              <em style={{ fontSize: '0.72rem', color: '#71717a', display: 'block' }}>
                * En cumplimiento de la legislación colombiana (Estatuto Tributario / DIAN), los registros de órdenes previamente facturadas se conservan exclusivamente con fines fiscales y de garantía legal.
              </em>
            </div>

            {/* Formulario */}
            <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. Contraseña Actual */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  1. {lang === 'EN' ? 'Current Password *' : 'Ingresa tu Contraseña Actual *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showDeletePass ? 'text' : 'password'}
                    placeholder={lang === 'EN' ? 'Enter current password' : 'Tu contraseña actual'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePass(!showDeletePass)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {showDeletePass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 2. Frase de Confirmación */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  2. {lang === 'EN' ? 'Type confirmation phrase *' : 'Escribe exactamente la frase requerida *'}
                </label>
                <p style={{ margin: '0 0 6px', fontSize: '0.76rem', color: '#71717a' }}>
                  Escribe: <code style={{ color: '#ff5500', backgroundColor: '#18181b', padding: '3px 7px', borderRadius: '4px', fontWeight: 800 }}>acepto eliminacion de cuenta</code>
                </p>
                <input
                  type="text"
                  placeholder="acepto eliminacion de cuenta"
                  value={deleteConfirmPhrase}
                  onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#18181b',
                    border: deleteConfirmPhrase.trim().toLowerCase() === 'acepto eliminacion de cuenta'
                      ? '1.5px solid #16a34a'
                      : '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
                {deleteConfirmPhrase.trim().toLowerCase() === 'acepto eliminacion de cuenta' && (
                  <span style={{ fontSize: '0.74rem', color: '#4ade80', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
                    <Check size={13} /> Frase de confirmación legal verificada
                  </span>
                )}
              </div>

              {/* Error / Success feedback */}
              {deleteError && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{deleteError}</span>
                </div>
              )}

              {deleteSuccess && (
                <div style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  color: '#4ade80',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check size={16} />
                  <span>¡Cuenta y datos personales eliminados con éxito! Cerrando sesión...</span>
                </div>
              )}

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: deleteLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  CANCELAR
                </button>

                <button
                  type="submit"
                  disabled={
                    deleteLoading ||
                    deleteConfirmPhrase.trim().toLowerCase() !== 'acepto eliminacion de cuenta' ||
                    !deletePassword
                  }
                  style={{
                    flex: 1.5,
                    backgroundColor:
                      deleteConfirmPhrase.trim().toLowerCase() === 'acepto eliminacion de cuenta' && deletePassword
                        ? '#dc2626'
                        : '#3f1a1a',
                    border: 'none',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    cursor:
                      deleteConfirmPhrase.trim().toLowerCase() === 'acepto eliminacion de cuenta' && deletePassword && !deleteLoading
                        ? 'pointer'
                        : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity:
                      deleteConfirmPhrase.trim().toLowerCase() === 'acepto eliminacion de cuenta' && deletePassword ? 1 : 0.5
                  }}
                >
                  <Trash2 size={15} />
                  <span>{deleteLoading ? 'ELIMINANDO...' : 'CONFIRMAR ELIMINACIÓN'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DERECHO DE RETRACTO Y DEVOLUCIÓN (LEY 1480 DE 2011 / SIC COLOMBIA) */}
      {isReturnModalOpen && selectedReturnOrder && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !returnLoading) {
              setIsReturnModalOpen(false);
            }
          }}
        >
          <div 
            style={{
              backgroundColor: '#0c0c0f',
              border: '1px solid rgba(255, 85, 0, 0.35)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 85, 0, 0.15)',
              borderRadius: '12px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              color: '#ffffff',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 85, 0, 0.12)', border: '1px solid rgba(255, 85, 0, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.08em', color: '#ff7733', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <ShieldCheck size={12} />
                  <span>SIC • Estatuto del Consumidor (Ley 1480 de 2011)</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#ffffff' }}>
                  Solicitud de Devolución & Retracto
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '3px' }}>
                  Pedido <strong style={{ color: '#fff', fontFamily: 'monospace' }}>#{selectedReturnOrder.orderNumber || selectedReturnOrder.id}</strong> — Ref: <span style={{ fontFamily: 'monospace' }}>{selectedReturnOrder.reference}</span>
                </div>
              </div>
              <button
                type="button"
                className="client-close-btn"
                onClick={() => setIsReturnModalOpen(false)}
                title="Cerrar"
                aria-label="Cerrar solicitud de devolución"
              >
                <X size={18} />
              </button>
            </div>

            {!returnSuccess ? (
              <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Cuadro de Información Legal SIC */}
                <div style={{
                  backgroundColor: 'rgba(255, 85, 0, 0.06)',
                  border: '1px solid rgba(255, 85, 0, 0.25)',
                  borderLeft: '4px solid #ff5500',
                  borderRadius: '6px',
                  padding: '14px',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#e4e4e7'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff7733', fontWeight: 800, marginBottom: '6px' }}>
                    <Info size={15} />
                    <span>Condiciones Obligatorias antes de Radicar:</span>
                  </div>
                  <ul style={{ margin: '0 0 10px 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: '#d4d4d8' }}>
                    <li><strong>Plazo Legal de Retracto:</strong> Tienes hasta <strong>5 días hábiles</strong> posteriores a la fecha de entrega del pedido.</li>
                    <li><strong>Estado de la Prenda:</strong> Debe encontrarse sin uso, sin olores ni manchas, con etiquetas originales intactas y empaque original.</li>
                    <li><strong>Costos de Envío:</strong> En ejercicio del retracto, el flete de transporte es asumido por el comprador (salvo garantías de 90 días por defecto de fábrica).</li>
                  </ul>
                  <div style={{ borderTop: '1px solid rgba(255, 85, 0, 0.15)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>Conoce todos los detalles del procedimiento:</span>
                    <a 
                      href="/retracto" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        color: '#ff7733', 
                        fontWeight: 800, 
                        fontSize: '0.76rem', 
                        textDecoration: 'underline' 
                      }}
                    >
                      <span>Leer Política Completa de Retracto</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Resumen de Prendas del Pedido */}
                <div style={{ backgroundColor: '#141418', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Prendas a Devolver en esta Orden:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                    {(selectedReturnOrder.items || []).map((it: any, idx: number) => {
                      const pName = it.product?.name || it.title || it.name || 'Prenda Noctis';
                      const pQty = Number(it.quantity || 1);
                      const pSize = it.size || '';
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#d4d4d8', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '4px' }}>
                          <span>• {pName} {pSize ? `(Talla: ${pSize})` : ''} x {pQty}</span>
                          <strong style={{ color: '#ffffff' }}>${Number(it.product?.price || it.price || 0 * pQty).toLocaleString('es-CO')} COP</strong>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px', paddingTop: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#a1a1aa' }}>Total Liquidado:</span>
                    <strong style={{ color: '#ff7733', fontWeight: 900 }}>${Number(selectedReturnOrder.total || 0).toLocaleString('es-CO')} COP</strong>
                  </div>
                </div>

                {/* Selección del Motivo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e4e4e7', marginBottom: '6px' }}>
                    Motivo de la Devolución / Solicitud:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  >
                    <option value="RETRACTO">Derecho de Retracto (Cambio de parecer / No me convenció — Art. 47 Ley 1480)</option>
                    <option value="CAMBIO_TALLA">Cambio de Talla o Color</option>
                    <option value="GARANTIA_DEFECTO">Garantía Legal por Defecto de Fábrica (90 días)</option>
                    <option value="PRODUCTO_ERRONEO">Producto recibido no corresponde al comprado</option>
                  </select>
                </div>

                {/* Comentarios u Observaciones */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e4e4e7', marginBottom: '6px' }}>
                    Detalles u Observaciones (Opcional):
                  </label>
                  <textarea
                    rows={3}
                    value={returnComments}
                    onChange={(e) => setReturnComments(e.target.value)}
                    placeholder="Describe brevemente el motivo o si requieres cambio de talla específica..."
                    style={{
                      width: '100%',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {returnError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 12px', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} />
                    <span>{returnError}</span>
                  </div>
                )}

                {/* Botones de Acción */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsReturnModalOpen(false)}
                    disabled={returnLoading}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: returnLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    CANCELAR
                  </button>

                  <a
                    href={`https://wa.me/573135859810?text=${encodeURIComponent(`¡Hola NOCTIS! Deseo gestionar una devolución/retracto para mi pedido #${selectedReturnOrder.orderNumber || selectedReturnOrder.id} (Ref: ${selectedReturnOrder.reference}). Motivo: ${returnReason}. Mi nombre es ${clientUser?.name || selectedReturnOrder.customerName || 'Cliente'}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1.2,
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      color: '#4ade80',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>AYUDA WHATSAPP</span>
                  </a>

                  <button
                    type="submit"
                    disabled={returnLoading}
                    style={{
                      flex: 1.5,
                      backgroundColor: '#ff5500',
                      border: 'none',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      cursor: returnLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>{returnLoading ? 'RADICANDO...' : 'CONFIRMAR RADICACIÓN'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Pantalla de Éxito */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22c55e', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
                  ¡Solicitud de Devolución Radicada con Éxito!
                </h4>
                <div style={{ display: 'inline-block', backgroundColor: '#18181b', border: '1px dashed #ff5500', padding: '6px 14px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#ff7733', fontWeight: 800, marginBottom: '14px' }}>
                  Radicado Oficial: {returnRadicado}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 18px' }}>
                  Hemos recibido tu solicitud bajo el marco legal de la <strong>Ley 1480 de 2011 (Estatuto del Consumidor)</strong>. Nuestro equipo de calidad se pondrá en contacto contigo para coordinar la recepción de las prendas en nuestra bodega en Bogotá D.C.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/573135859810?text=${encodeURIComponent(`¡Hola NOCTIS! Acabo de radicar la solicitud de devolución con Radicado ${returnRadicado} para mi pedido #${selectedReturnOrder.orderNumber || selectedReturnOrder.id}. Quisiera coordinar el envío de las prendas a bodega.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#22c55e',
                      color: '#000000',
                      fontWeight: 900,
                      padding: '10px 18px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>COORDINAR POR WHATSAPP</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsReturnModalOpen(false)}
                    style={{
                      backgroundColor: '#27272a',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 800,
                      padding: '10px 18px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    CERRAR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
