'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  Lock, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Tag, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  CreditCard, 
  Printer, 
  Truck, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function WompiCheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    setIsAccountOpen,
    setIsTrackingOpen,
    clearCart,
    items, 
    subtotal, 
    couponDiscount, 
    totalPrice, 
    appliedCoupon 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'pse' | 'card'>('pse');
  const [checkoutTermsAccepted, setCheckoutTermsAccepted] = useState(true);

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Bogotá D.C.',
    department: 'Cundinamarca',
    notes: ''
  });

  // Cargar automáticamente los datos del perfil de cliente si ha iniciado sesión
  useEffect(() => {
    if (isCheckoutOpen) {
      try {
        const saved = localStorage.getItem('noctis_client_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.email)) {
            setCustomer(prev => ({
              ...prev,
              name: parsed.name || prev.name,
              email: parsed.email || prev.email,
              phone: parsed.phone || prev.phone,
              address: parsed.address || prev.address,
              city: parsed.city || prev.city || 'Bogotá D.C.',
              department: parsed.department || prev.department || 'Cundinamarca'
            }));
            setIsAutoFilled(true);

            // Sincronizar datos frescos desde la base de datos si tiene email
            if (parsed.email) {
              fetch(`/api/client/profile?email=${encodeURIComponent(parsed.email)}`)
                .then(res => res.json())
                .then(data => {
                  if (data.user) {
                    setCustomer(prev => ({
                      ...prev,
                      name: data.user.name || parsed.name || prev.name,
                      email: data.user.email || parsed.email || prev.email,
                      phone: data.user.phone || parsed.phone || prev.phone,
                      address: data.user.address || parsed.address || prev.address,
                      city: data.user.city || parsed.city || prev.city || 'Bogotá D.C.',
                      department: data.user.department || parsed.department || prev.department || 'Cundinamarca'
                    }));
                  }
                })
                .catch(() => {});
            }
          }
        }
      } catch (err) {
        console.warn('Error cargando usuario para checkout:', err);
      }
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        setIsCheckoutOpen(false);
      }
    };

    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setOrderCreated(null);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const getMethodName = () => {
    switch (paymentMethod) {
      case 'nequi': return 'Nequi Colombia (Demo)';
      case 'pse': return 'Bancolombia PSE (Demo)';
      case 'card': return 'Tarjeta Débito/Crédito (Demo)';
      default: return 'Pasarela Simulada';
    }
  };

  const handlePrintReceipt = (ord: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const orderItems = ord.items || items || [];
    const itemsHtml = Array.isArray(orderItems) && orderItems.length > 0
      ? orderItems.map((it: any) => `
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
            <div><strong>Medio de Pago:</strong> ${ord.paymentMethod || 'Simulación Pasarela Segura'}</div>
            <div><strong>Estado:</strong> <span style="color: #16a34a; font-weight: bold;">${ord.status || 'PAGADO'}</span></div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <strong>DATOS DEL CLIENTE</strong>
            <div style="margin-top: 6px;">${ord.customerName || customer.name || 'Cliente'}</div>
            <div style="color: #71717a;">${ord.customerEmail || customer.email || ''}</div>
            <div style="color: #71717a;">Tel: ${ord.customerPhone || customer.phone || 'No registrado'}</div>
          </div>
          <div class="box">
            <strong>DATOS DE DESPACHO / ENVÍO</strong>
            <div style="margin-top: 6px;">${ord.shippingAddress || customer.address || 'Dirección no especificada'}</div>
            <div style="color: #71717a;">${ord.city || customer.city || 'Bogotá D.C.'}, ${ord.department || customer.department || 'Cundinamarca'}</div>
            <div style="color: #71717a;">Guía / Tracking: ${ord.trackingNumber || ord.orderNumber || 'En asignación de mensajería'}</div>
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
              <td style="padding: 6px 0; text-align: right;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #71717a;">Envío Nacional:</td>
              <td style="padding: 6px 0; text-align: right; color: #16a34a; font-weight: bold;">GRATIS ($0)</td>
            </tr>
            <tr style="border-top: 2px solid #18181b; font-weight: 900; font-size: 15px;">
              <td style="padding: 10px 0;">TOTAL PAGADO:</td>
              <td style="padding: 10px 0; text-align: right;">$${Number(ord.total || 0).toLocaleString('es-CO')} COP</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Este comprobante es generado digitalmente por el sistema de pagos seguros de NOCTIS URBANO.</p>
          <p>Línea de soporte y despachos: +57 313 585 9810 • Bogotá D.C., Colombia</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const methodName = getMethodName();

      const res = await fetch('/api/wompi/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          shippingAddress: customer.address,
          city: customer.city,
          department: customer.department,
          couponCode: appliedCoupon?.code,
          items,
          simulated: true,
          paymentMethod: methodName
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error procesando compra');
        setLoading(false);
        return;
      }

      const created = data.order || data;
      setOrderCreated(created);

      // Limpiar carrito tras pago exitoso
      clearCart();

      // Guardar orden en la sesión del cliente
      try {
        const saved = localStorage.getItem('noctis_client_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          const currentOrders = parsed.orders || [];
          const updated = {
            ...parsed,
            orders: [created, ...currentOrders]
          };
          localStorage.setItem('noctis_client_user', JSON.stringify(updated));
          window.dispatchEvent(new Event('noctis-user-updated'));
          window.dispatchEvent(new Event('noctis-orders-updated'));
        }
      } catch {}

    } catch (err: any) {
      console.error('Error procesando checkout:', err);
      alert('Error de conexión al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noir-modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
      <div className="noir-modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="kicker">Pasarela Segura</span>
              <span style={{
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.04em'
              }}>
                MODO SIMULACIÓN / TEST
              </span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: '2.2rem' }}>
              {orderCreated ? '¡Pedido Confirmado!' : 'Finalizar Pedido'}
            </h2>
          </div>
          <button 
            type="button" 
            className="client-close-btn"
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Cerrar pasarela de pago"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* PANTALLA DE ÉXITO TRAS PAGO SIMULADO */}
        {orderCreated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.25s ease' }}>
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#4ade80'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                ¡Pago Simulado Aprobado!
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#a1a1aa' }}>
                Tu compra ha sido registrada en el sistema con estado <strong style={{ color: '#4ade80' }}>PAGADO</strong>.
              </p>
            </div>

            {/* Detalles de la orden */}
            <div style={{
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div className="modal-grid-2col" style={{ fontSize: '0.82rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Número de Orden</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '0.95rem' }}>#{orderCreated.orderNumber}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Medio de Pago</span>
                  <strong style={{ color: '#ff7733' }}>{orderCreated.paymentMethod || getMethodName()}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Destino de Entrega</span>
                  <strong style={{ color: '#ffffff' }}>{orderCreated.city || customer.city}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Total Pagado</span>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>${Number(orderCreated.total || totalPrice).toLocaleString('es-CO')} COP</strong>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsTrackingOpen(true);
                }}
                style={{
                  backgroundColor: '#ff5500',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '0.86rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
              >
                <Truck size={18} />
                <span>RASTREAR ESTE PEDIDO EN VIVO</span>
              </button>

              <div className="modal-grid-2col" style={{ gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handlePrintReceipt(orderCreated)}
                  style={{
                    backgroundColor: '#27272a',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} />
                  <span>DESCARGAR RECIBO PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>SEGUIR COMPRANDO</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE PAGO */
          <form className="tracking-form" onSubmit={handleSubmitCheckout}>
            {/* Desglose de Pago & Cupón */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px'
              }}
            >
              {couponDiscount > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#a1a1aa' }}>
                    <span>Subtotal prendas:</span>
                    <span>${subtotal.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#ffffff', fontWeight: 800 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Tag size={13} />
                      Cupón aplicado ({appliedCoupon?.code}):
                    </span>
                    <span>-${couponDiscount.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#ffffff', fontWeight: 900, borderTop: '1px dashed rgba(255, 255, 255, 0.15)', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Total liquidado:</span>
                    <span>${totalPrice.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#a1a1aa', fontSize: '0.88rem' }}>Total a pagar:</span>
                  <strong style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 900 }}>
                    ${totalPrice.toLocaleString('es-CO')} COP
                  </strong>
                </div>
              )}

              {isAutoFilled && (
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#4ade80',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} style={{ color: '#4ade80' }} />
                    <span>✓ Datos de envío verificados desde tu cuenta</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsAccountOpen(true);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ff7733',
                      textDecoration: 'underline',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Editar en Mi Cuenta →
                  </button>
                </div>
              )}
            </div>

            {/* Selector de Método de Pago Simulado */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Selecciona Método de Pago (Simulación de Prueba)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 100px), 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pse')}
                  style={{
                    backgroundColor: paymentMethod === 'pse' ? 'rgba(255, 85, 0, 0.15)' : '#18181b',
                    border: `1px solid ${paymentMethod === 'pse' ? '#ff5500' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '6px',
                    padding: '10px 8px',
                    color: paymentMethod === 'pse' ? '#ffffff' : '#a1a1aa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  <Building2 size={18} style={{ color: paymentMethod === 'pse' ? '#ff7733' : '#a1a1aa' }} />
                  <span>Bancolombia PSE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  style={{
                    backgroundColor: paymentMethod === 'nequi' ? 'rgba(255, 85, 0, 0.15)' : '#18181b',
                    border: `1px solid ${paymentMethod === 'nequi' ? '#ff5500' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '6px',
                    padding: '10px 8px',
                    color: paymentMethod === 'nequi' ? '#ffffff' : '#a1a1aa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  <Smartphone size={18} style={{ color: paymentMethod === 'nequi' ? '#ff7733' : '#a1a1aa' }} />
                  <span>Nequi Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    backgroundColor: paymentMethod === 'card' ? 'rgba(255, 85, 0, 0.15)' : '#18181b',
                    border: `1px solid ${paymentMethod === 'card' ? '#ff5500' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '6px',
                    padding: '10px 8px',
                    color: paymentMethod === 'card' ? '#ffffff' : '#a1a1aa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}
                >
                  <CreditCard size={18} style={{ color: paymentMethod === 'card' ? '#ff7733' : '#a1a1aa' }} />
                  <span>Tarjeta Débito</span>
                </button>
              </div>
            </div>

            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Nombre Completo *</span>
                {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
              </div>
              <input
                required
                readOnly={isAutoFilled}
                placeholder="Ej. Mateo Gómez"
                value={customer.name}
                onChange={e => !isAutoFilled && setCustomer({ ...customer, name: e.target.value })}
                style={{
                  backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                  borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                  color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                  cursor: isAutoFilled ? 'default' : 'text'
                }}
              />
            </label>

            <div className="modal-grid-2col">
              <label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Correo Electrónico *</span>
                  {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
                </div>
                <input
                  type="email"
                  required
                  readOnly={isAutoFilled}
                  placeholder="correo@ejemplo.com"
                  value={customer.email}
                  onChange={e => !isAutoFilled && setCustomer({ ...customer, email: e.target.value })}
                  style={{
                    backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                    borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                    cursor: isAutoFilled ? 'default' : 'text'
                  }}
                />
              </label>

              <label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Teléfono Celular *</span>
                  {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
                </div>
                <input
                  type="tel"
                  required
                  readOnly={isAutoFilled}
                  placeholder="3001234567"
                  value={customer.phone}
                  onChange={e => !isAutoFilled && setCustomer({ ...customer, phone: e.target.value })}
                  style={{
                    backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                    borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                    cursor: isAutoFilled ? 'default' : 'text'
                  }}
                />
              </label>
            </div>

            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Dirección de Entrega *</span>
                {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
              </div>
              <input
                required
                readOnly={isAutoFilled}
                placeholder="Calle 85 # 11-53, Apto 402"
                value={customer.address}
                onChange={e => !isAutoFilled && setCustomer({ ...customer, address: e.target.value })}
                style={{
                  backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                  borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                  color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                  cursor: isAutoFilled ? 'default' : 'text'
                }}
              />
            </label>

            <div className="modal-grid-2col">
              <label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Ciudad *</span>
                  {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
                </div>
                <input
                  required
                  readOnly={isAutoFilled}
                  placeholder="Bogotá D.C."
                  value={customer.city}
                  onChange={e => !isAutoFilled && setCustomer({ ...customer, city: e.target.value })}
                  style={{
                    backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                    borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                    cursor: isAutoFilled ? 'default' : 'text'
                  }}
                />
              </label>

              <label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Departamento *</span>
                  {isAutoFilled && <Lock size={12} style={{ color: '#71717a' }} />}
                </div>
                <input
                  required
                  readOnly={isAutoFilled}
                  placeholder="Cundinamarca"
                  value={customer.department}
                  onChange={e => !isAutoFilled && setCustomer({ ...customer, department: e.target.value })}
                  style={{
                    backgroundColor: isAutoFilled ? '#121215' : '#09090b',
                    borderColor: isAutoFilled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    color: isAutoFilled ? '#d4d4d8' : '#ffffff',
                    cursor: isAutoFilled ? 'default' : 'text'
                  }}
                />
              </label>
            </div>

            <label>
              Notas de Entrega (Opcional)
              <input
                placeholder="Ej. Dejar en portería o timbre 402"
                value={customer.notes}
                onChange={e => setCustomer({ ...customer, notes: e.target.value })}
              />
            </label>

            {/* Micro-sección de Confianza Legal Colombia */}
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.74rem',
                color: '#8e8e93'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f3f0e9', fontWeight: 600 }}>
                <Lock size={14} style={{ color: '#ffffff' }} />
                <span>Simulador Seguro de Pasarela de Pagos (Modo Prueba)</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.4 }}>
                Al confirmar, se procesará la simulación de pago aprobada sin cargos bancarios reales y se generará tu orden con seguimiento logístico en vivo.
              </p>
            </div>

            {/* Checkbox Obligatorio SIC / Ley 1480 y Ley 1581 */}
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              backgroundColor: checkoutTermsAccepted ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
              border: checkoutTermsAccepted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.74rem',
                color: checkoutTermsAccepted ? '#ffffff' : '#a1a1aa',
                lineHeight: 1.4,
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={checkoutTermsAccepted}
                  onChange={(e) => setCheckoutTermsAccepted(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#ff5500',
                    cursor: 'pointer',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                />
                <span>
                  Acepto los <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>Términos y Condiciones</strong> de la compra y la <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>Política de Tratamiento de Datos Personales</strong> (SIC / Ley 1480 y 1581).
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !checkoutTermsAccepted}
              className="btn btn-primary"
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '14px',
                fontWeight: 900,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: checkoutTermsAccepted ? '#ffffff' : '#333338',
                color: checkoutTermsAccepted ? '#000000' : '#888888',
                cursor: checkoutTermsAccepted ? 'pointer' : 'not-allowed',
                opacity: checkoutTermsAccepted ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <span>Procesando pago seguro...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>CONFIRMAR PAGO SIMULADO — ${totalPrice.toLocaleString('es-CO')} COP</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
