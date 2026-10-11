import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CreditCard, Truck, Home, CheckCircle2, PackageCheck, ShieldCheck, RotateCcw, ExternalLink, X } from 'lucide-react';

export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen } = useCart();
  const [orderNumber, setOrderNumber] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isTrackingOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTrackingOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTrackingOpen, setIsTrackingOpen]);

  if (!isTrackingOpen) return null;

  const handleTrack = async (e?: React.FormEvent, customNum?: string) => {
    if (e) e.preventDefault();
    const queryNum = (customNum || orderNumber).replace(/^#/, '').trim().toUpperCase();
    if (!queryNum) return;

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(queryNum)}&token=${encodeURIComponent(token.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se encontró el pedido o token inválido.');
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="order-tracking" 
      aria-live="polite"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsTrackingOpen(false);
        }
      }}
    >
      <div className="tracking-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="tracking-head">
          <div>
            <p className="kicker">Seguimiento seguro</p>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Tu pedido</h2>
          </div>
          <button 
            className="client-close-btn" 
            type="button" 
            onClick={() => setIsTrackingOpen(false)}
            aria-label="Cerrar seguimiento"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form className="tracking-form" onSubmit={(e) => handleTrack(e)}>
          <label>
            Número de pedido
            <input 
              name="order_number" 
              maxLength={80} 
              required 
              placeholder="Ej. ORD-123456"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value.toUpperCase())}
            />
          </label>
          <label>
            Token de acceso (opcional)
            <input 
              name="token" 
              type="password" 
              maxLength={128} 
              placeholder="Token entregado al comprar"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </label>
          <button className="btn btn-secondary" type="submit" disabled={loading || !orderNumber.trim()}>
            {loading ? 'CONSULTANDO...' : 'CONSULTAR PEDIDO'}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: '16px', color: '#ffb4b4', fontSize: '0.85rem' }}>{error}</p>
        )}

        {orderData && (() => {
          const ds = (orderData.deliveryStatus || '').toUpperCase();
          const os = (orderData.status || '').toUpperCase();
          let activeIndex = 1;
          if (ds.includes('ENTREGAD') || ds.includes('DELIVER')) activeIndex = 3;
          else if (ds.includes('CAMINO') || ds.includes('DESPACH') || ds.includes('RUTA') || ds.includes('SHIP')) activeIndex = 2;
          else if (ds.includes('CONFECC') || ds.includes('PREPAR') || ds.includes('TALLER')) activeIndex = 1;
          else if (ds.includes('PAGO') || os.includes('APPROV') || os.includes('PAGAD')) activeIndex = 1;
          else activeIndex = 0;

          const stages = [
            { title: '1. Pago', desc: 'Aprobado', icon: CreditCard },
            { title: '2. En Preparación', desc: 'Empaque y Calidad', icon: PackageCheck },
            { title: '3. En Camino', desc: 'Mensajería', icon: Truck },
            { title: '4. Entregado', desc: 'En tus manos', icon: Home }
          ];

          return (
            <div style={{ marginTop: '20px', backgroundColor: '#101014', border: '1px solid #ff5500', borderRadius: '10px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                  Pedido #{orderData.orderNumber}
                </h3>
                <span style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  {orderData.status || 'PAGADO'}
                </span>
              </div>

              {/* Stepper Mercado Libre */}
              <div style={{ position: 'relative', margin: '20px 0' }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '6%',
                  right: '6%',
                  height: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1
                }} />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '6%',
                  width: `${(activeIndex / 3) * 88}%`,
                  height: '3px',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  zIndex: 2,
                  transition: 'width 0.4s'
                }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', zIndex: 3, textAlign: 'center' }}>
                  {stages.map((st, i) => {
                    const isCompletedOrActive = i <= activeIndex;
                    const isNextPending = i === activeIndex + 1;
                    const IconC = st.icon;

                    let bg = '#18181b';
                    let border = '1px solid rgba(255,255,255,0.15)';
                    let color = '#71717a';
                    let glow = 'none';

                    if (isCompletedOrActive) {
                      bg = '#052e16';
                      border = '2px solid #22c55e';
                      color = '#4ade80';
                      glow = '0 0 16px rgba(34, 197, 94, 0.45)';
                    } else if (isNextPending) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '2px solid #ef4444';
                      color = '#f87171';
                      glow = '0 0 14px rgba(239, 68, 68, 0.35)';
                    }

                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: bg,
                          border,
                          color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '6px',
                          boxShadow: glow,
                          transition: 'all 0.3s ease'
                        }}>
                          {isCompletedOrActive && i < activeIndex ? (
                            <CheckCircle2 size={20} color="#22c55e" />
                          ) : (
                            <IconC size={20} />
                          )}
                        </div>
                        <strong style={{ fontSize: '0.74rem', color: isCompletedOrActive ? '#4ade80' : (isNextPending ? '#f87171' : '#71717a'), fontWeight: 800 }}>
                          {st.title}
                        </strong>
                        <span style={{ fontSize: '0.64rem', color: isCompletedOrActive ? '#86efac' : (isNextPending ? '#fca5a5' : '#71717a') }}>
                          {isCompletedOrActive ? (i === activeIndex ? 'En Proceso' : 'Aprobado') : (isNextPending ? 'Próximo Paso' : st.desc)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Datos de orden */}
              <div className="modal-grid-2col" style={{ backgroundColor: '#18181b', padding: '14px 16px', borderRadius: '6px', fontSize: '0.78rem', gap: '10px', color: '#a1a1aa', marginBottom: '14px' }}>
                <div>Referencia Wompi: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{orderData.reference}</strong></div>
                <div>Destino: <strong style={{ color: '#fff' }}>{orderData.city || 'Bogotá D.C.'}</strong></div>
                <div>Estado de Despacho: <strong style={{ color: '#ff7733' }}>{orderData.deliveryStatus === 'ENTREGADO' ? 'Entregado' : orderData.deliveryStatus === 'DESPACHADO' ? 'Despachado en Ruta' : orderData.deliveryStatus === 'EN_PREPARACION' ? 'En Preparación' : orderData.deliveryStatus === 'DEVUELTO' ? 'Devolución' : (orderData.deliveryStatus || 'En Proceso')}</strong></div>
                <div>Total: <strong style={{ color: '#fff' }}>${Number(orderData.total || 0).toLocaleString('es-CO')} COP</strong></div>
                {orderData.trackingNumber && (
                  <div style={{ gridColumn: 'span 2', background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                      <Truck size={14} />
                      <span>Número de Guía / Tracking: <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{orderData.trackingNumber}</strong></span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700 }}>Transportadora Asignada</span>
                  </div>
                )}
              </div>

              {/* PRENDAS EN ESTE PEDIDO */}
              {orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0 && (
                <div style={{
                  backgroundColor: '#141418',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '14px 16px'
                }}>
                  <h4 style={{
                    margin: '0 0 10px',
                    fontSize: '0.76rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}>
                    PRENDAS EN ESTE PEDIDO
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orderData.items.map((it: any, iIdx: number) => {
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
                            gap: '10px',
                            padding: '8px 10px',
                            backgroundColor: '#1c1c22',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={pImg}
                              alt={pName}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '4px',
                                objectFit: 'cover',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                flexShrink: 0
                              }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.82rem', color: '#ffffff', display: 'block' }}>{pName}</strong>
                              <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                                {pSize ? `Talla: ${pSize}` : ''} {pColor ? `| Color: ${pColor}` : ''} | Cantidad: {pQty}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
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
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: '#a1a1aa' }}>Total Liquidado:</span>
                    <strong style={{ color: '#ff7733', fontWeight: 900, fontSize: '0.95rem' }}>
                      ${Number(orderData.total || 0).toLocaleString('es-CO')} COP
                    </strong>
                  </div>
                </div>
              )}

              {/* AVISO LEGAL SIC & RETRACTO */}
              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 85, 0, 0.05)',
                border: '1px solid rgba(255, 85, 0, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} style={{ color: '#ff7733', flexShrink: 0 }} />
                  <span>
                    <strong style={{ color: '#ffffff' }}>Derecho de Retracto (Ley 1480 / SIC):</strong> Dispones de 5 días hábiles desde la entrega para retractarte de tu compra.
                  </span>
                </div>
                <a 
                  href="/retracto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '0.74rem', 
                    color: '#ff7733', 
                    fontWeight: 800, 
                    textDecoration: 'underline',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Ver Política Oficial</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
