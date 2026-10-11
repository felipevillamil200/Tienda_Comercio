'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedProduct, translateColor } from '@/lib/i18n';
import { Trash2, Tag, CheckCircle2, AlertCircle, X, Truck, ShieldCheck, Gift } from 'lucide-react';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    couponDiscount,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen 
  } = useCart();
  const { language, t } = useLanguage();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200000);
  const [freeShippingActive, setFreeShippingActive] = useState(true);

  // Estados para Obsequio / Regalo por Compra
  const [freeGiftActive, setFreeGiftActive] = useState(false);
  const [freeGiftThreshold, setFreeGiftThreshold] = useState(250000);
  const [freeGiftName, setFreeGiftName] = useState('Llavero Táctico & Sticker Pack NOCTIS');
  const [freeGiftDescription, setFreeGiftDescription] = useState('Obsequio exclusivo incluido automáticamente en tu paquete.');
  const [freeGiftImage, setFreeGiftImage] = useState('/assets/products/umbrella/noctis_umbrella.jpg');

  // Estado obligatorio SIC: Aceptación de Términos y Condiciones antes de pagar
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Cargar umbrales y promociones configurados en la base de datos
  React.useEffect(() => {
    const loadStoreSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.freeShippingThreshold) {
            setFreeShippingThreshold(Number(data.settings.freeShippingThreshold) || 200000);
          }
          if (data.settings?.freeShippingActive !== undefined) {
            setFreeShippingActive(Boolean(data.settings.freeShippingActive));
          }
          if (data.settings?.freeGiftActive !== undefined) {
            setFreeGiftActive(Boolean(data.settings.freeGiftActive));
          }
          if (data.settings?.freeGiftThreshold) {
            setFreeGiftThreshold(Number(data.settings.freeGiftThreshold) || 250000);
          }
          if (data.settings?.freeGiftName) {
            setFreeGiftName(data.settings.freeGiftName);
          }
          if (data.settings?.freeGiftDescription) {
            setFreeGiftDescription(data.settings.freeGiftDescription);
          }
          if (data.settings?.freeGiftImage) {
            setFreeGiftImage(data.settings.freeGiftImage);
          }
        })
        .catch(() => {});
    };

    loadStoreSettings();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'noctis_settings_sync') {
        loadStoreSettings();
      }
    };

    window.addEventListener('focus', loadStoreSettings);
    window.addEventListener('noctis-settings-updated', loadStoreSettings);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('focus', loadStoreSettings);
      window.removeEventListener('noctis-settings-updated', loadStoreSettings);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const isSpanish = language === 'ES';
  const FREE_SHIPPING_THRESHOLD = freeShippingThreshold;
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD && items.length > 0;

  // Cálculo de Obsequio por Compra
  const missingForFreeGift = Math.max(0, freeGiftThreshold - subtotal);
  const giftProgress = Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100));
  const hasUnlockedGift = freeGiftActive && subtotal >= freeGiftThreshold && items.length > 0;

  // Cerrar carrito al presionar la tecla Escape
  React.useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponFeedback(null);

    const result = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);

    if (result.success) {
      setCouponFeedback({ type: 'success', message: result.message });
      setCouponCodeInput('');
      setTimeout(() => setCouponFeedback(null), 4000);
    } else {
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <aside 
      className={`cart-drawer ${isCartOpen ? 'is-open' : ''}`} 
      aria-label="Carrito de compras"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsCartOpen(false);
        }
      }}
    >
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Carrito con botón X que rota en rojo */}
        <div className="cart-head">
          <div>
            <p className="kicker">{t('nav.cart')}</p>
            <h2>{t('cart.heading')}</h2>
          </div>
          <button 
            type="button" 
            className="client-close-btn"
            aria-label="Cerrar carrito"
            title="Cerrar"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Progreso de Envío Gratis (Condicionada por el interruptor ON/OFF del Admin) */}
        {items.length > 0 && freeShippingActive && (
          <div style={{
            padding: '12px 24px',
            backgroundColor: hasFreeShipping ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 85, 0, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: hasFreeShipping ? '#22c55e' : '#ff7733' }}>
                <Truck size={14} />
                {hasFreeShipping 
                  ? (isSpanish ? '🎉 ¡Tus prendas tienen ENVÍO GRATIS!' : '🎉 You unlocked FREE SHIPPING!') 
                  : (isSpanish ? `Te faltan $${missingForFreeShipping.toLocaleString('es-CO')} COP para ENVÍO GRATIS` : `Add $${missingForFreeShipping.toLocaleString('es-CO')} COP for FREE SHIPPING`)}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 800 }}>{shippingProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${shippingProgress}%`,
                height: '100%',
                backgroundColor: hasFreeShipping ? '#22c55e' : '#ff5500',
                transition: 'width 0.35s ease-in-out',
                boxShadow: hasFreeShipping ? '0 0 8px #22c55e' : '0 0 8px #ff5500'
              }} />
            </div>
          </div>
        )}

        {/* Lista de Prendas en Bolsa */}
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">{t('cart.empty')}</p>
          ) : (
            <>
              {items.map((item) => {
                const translatedProd = getTranslatedProduct(item.product, language);
                const colorDisplay = translateColor(item.color || 'Negro', language);

                return (
                  <div key={`${item.product.id}-${item.size}-${item.color || 'Negro'}`} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <h3>{translatedProd.name}</h3>
                      <p>
                        {t('cart.size')}: <strong>{item.size}</strong> | {t('cart.color')}: <strong style={{ color: '#ffffff' }}>{colorDisplay}</strong>
                      </p>
                      <p>${(item.product.price * item.quantity).toLocaleString('es-CO')} COP</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.color)}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.color)}
                        disabled={item.quantity >= (item.product.stock ?? 20)}
                        style={{
                          opacity: item.quantity >= (item.product.stock ?? 20) ? 0.35 : 1,
                          cursor: item.quantity >= (item.product.stock ?? 20) ? 'not-allowed' : 'pointer'
                        }}
                        title={item.quantity >= (item.product.stock ?? 20) ? `Stock máximo (${item.product.stock}) alcanzado` : 'Aumentar cantidad'}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        style={{
                          marginLeft: '8px',
                          color: '#a1a1aa',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          width: '30px',
                          height: '30px',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.color = '#a1a1aa';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="Eliminar de la bolsa"
                        aria-label="Eliminar prenda de la bolsa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* TARJETA VISUAL DE OBSEQUIO: MENSAJE O PRENDA DESBLOQUEADA */}
              {freeGiftActive && (
                hasUnlockedGift ? (
                  /* CASO A: OBSEQUIO DESBLOQUEADO ($0 COP) */
                  <div 
                    className="cart-item" 
                    style={{
                      border: '1.5px solid rgba(34, 197, 94, 0.5)',
                      backgroundColor: 'rgba(34, 197, 94, 0.08)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '10px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      backgroundColor: '#0c0c0e',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {freeGiftImage ? (
                        <img 
                          src={freeGiftImage} 
                          alt={freeGiftName} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <Gift size={24} color="#22c55e" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ margin: 0, fontSize: '0.86rem', color: '#ffffff' }}>{freeGiftName || 'Obsequio NOCTIS'}</strong>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(34, 197, 94, 0.25)',
                          color: '#22c55e',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          🎁 ¡OBSEQUIO INCLUIDO!
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#a1a1aa' }}>
                        {freeGiftDescription || 'Obsequio especial añadido automáticamente por tu compra superior a la meta'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#71717a', textDecoration: 'line-through', display: 'block' }}>
                        $45.000 COP
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: 900 }}>
                        $0 COP
                      </strong>
                    </div>
                  </div>
                ) : (
                  /* CASO B: MENSAJE VISUAL DE INCENTIVO DE OBSEQUIO CON FOTO */
                  <div 
                    className="cart-item" 
                    style={{
                      border: '1px dashed rgba(255, 85, 0, 0.45)',
                      backgroundColor: 'rgba(255, 85, 0, 0.04)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '10px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      backgroundColor: '#0c0c0e',
                      border: '1px solid rgba(255, 85, 0, 0.35)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {freeGiftImage ? (
                        <img 
                          src={freeGiftImage} 
                          alt={freeGiftName} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <Gift size={24} color="#ff7733" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ margin: 0, fontSize: '0.84rem', color: '#ffffff' }}>{freeGiftName || 'Obsequio Especial'}</strong>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 85, 0, 0.15)',
                          color: '#ff7733',
                          border: '1px solid rgba(255, 85, 0, 0.3)',
                          textTransform: 'uppercase'
                        }}>
                          🎁 POR COMPRAS &gt; ${(freeGiftThreshold).toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#ff7733', fontWeight: 600 }}>
                        {isSpanish 
                          ? `Te faltan $${missingForFreeGift.toLocaleString('es-CO')} COP para recibir este obsequio GRATIS` 
                          : `Add $${missingForFreeGift.toLocaleString('es-CO')} COP to receive this FREE gift`}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', color: '#71717a', textDecoration: 'line-through', display: 'block' }}>
                        $45.000 COP
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#ff7733', fontWeight: 800 }}>
                        ¡GRATIS!
                      </span>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <>
            {/* Sección de Cupón de Descuento */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={15} style={{ color: '#ffffff' }} />
                    <div>
                      <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>{appliedCoupon.code}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#a1a1aa', marginLeft: '6px' }}>
                        ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}% OFF` : `-$${appliedCoupon.value.toLocaleString('es-CO')} COP`})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#a1a1aa',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                    title="Remover cupón"
                  >
                    <X size={14} />
                    <span>Quitar</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCouponSubmit} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder={isSpanish ? 'Código de cupón (ej. NOCTIS10)...' : 'Promo code (e.g. NOCTIS10)...'}
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCodeInput.trim()}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: couponCodeInput.trim() ? 'pointer' : 'not-allowed',
                      opacity: couponCodeInput.trim() ? 1 : 0.5,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {couponLoading ? '...' : (isSpanish ? 'Aplicar' : 'Apply')}
                  </button>
                </form>
              )}

              {/* Mensaje de Feedback */}
              {couponFeedback && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    fontSize: '0.74rem',
                    color: couponFeedback.type === 'success' ? '#ffffff' : '#f87171'
                  }}
                >
                  {couponFeedback.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  <span>{couponFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Desglose de Totales */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {couponDiscount > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#a1a1aa', marginBottom: '6px' }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString('es-CO')} COP</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#ffffff', fontWeight: 800, marginBottom: '8px' }}>
                    <span>Descuento cupón ({appliedCoupon?.code}):</span>
                    <span>-${couponDiscount.toLocaleString('es-CO')} COP</span>
                  </div>
                </>
              )}

              <div className="cart-total" style={{ borderTop: couponDiscount > 0 ? '1px dashed rgba(255, 255, 255, 0.15)' : 'none', paddingTop: couponDiscount > 0 ? '8px' : '0' }}>
                <span>{t('cart.total')}</span>
                <strong>${totalPrice.toLocaleString('es-CO')} COP</strong>
              </div>
            </div>

            {/* Checkbox Obligatorio SIC / Ley 1480 y Ley 1581 (Términos y Condiciones) */}
            <div style={{
              margin: '0 24px 14px 24px',
              padding: '10px 12px',
              backgroundColor: termsAccepted ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
              border: termsAccepted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '0.73rem',
                  color: termsAccepted ? '#ffffff' : '#d4d4d8',
                  lineHeight: 1.4,
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  id="cart-terms-accepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
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
                  {isSpanish ? (
                    <>
                      Acepto los{' '}
                      <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>
                        Términos y Condiciones
                      </strong>{' '}
                      y la{' '}
                      <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>
                        Política de Tratamiento de Datos
                      </strong>{' '}
                      (SIC / Ley 1480 y 1581).
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>
                        Terms & Conditions
                      </strong>{' '}
                      and{' '}
                      <strong style={{ color: '#ff7733', textDecoration: 'underline' }}>
                        Privacy Policy
                      </strong>.
                    </>
                  )}
                </span>
              </label>
            </div>

            <div style={{ margin: '0 24px 14px 24px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#a1a1aa' }}>
              <ShieldCheck size={14} style={{ color: '#22c55e' }} />
              <span>
                {language === 'EN' 
                  ? '100% Encrypted Payment powered by Wompi (Bancolombia)' 
                  : 'Pago 100% cifrado y respaldado por Wompi (Bancolombia)'}
              </span>
            </div>

            <button 
              className="btn btn-primary checkout-button" 
              type="button"
              disabled={!termsAccepted}
              onClick={handleCheckout}
              style={{
                opacity: termsAccepted ? 1 : 0.45,
                cursor: termsAccepted ? 'pointer' : 'not-allowed',
                filter: termsAccepted ? 'none' : 'grayscale(0.8)',
                transition: 'all 0.2s ease'
              }}
              title={!termsAccepted ? 'Debes aceptar los Términos y Condiciones para continuar al pago' : 'Continuar al pago seguro'}
            >
              {t('cart.checkoutBtn')}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
