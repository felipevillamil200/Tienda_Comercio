'use client';

import React from 'react';
import { Order } from '@/types';
import { 
  Package, 
  X, 
  Copy, 
  Truck, 
  CheckCircle2, 
  Lock, 
  Check, 
  RotateCcw 
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  modalTrackingInput: string;
  setModalTrackingInput: (val: string) => void;
  handleUpdateDelivery: (ref: string, newStatus?: string, customTracking?: string) => Promise<void>;
  requestReturnConfirmation: (order: Order) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  modalTrackingInput,
  setModalTrackingInput,
  handleUpdateDelivery,
  requestReturnConfirmation,
  showToast
}: OrderDetailModalProps) {
  if (!order) return null;

  const isTrackingFixed = !!(order.trackingNumber && order.trackingNumber.trim().length > 0);
  const hasTrackingModal = !!(modalTrackingInput.trim().length > 0 || isTrackingFixed);
  const isModalPastCreated = hasTrackingModal || (order.deliveryStatus && order.deliveryStatus !== 'CREADO');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#111015', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(189, 74, 44, 0.15)', border: '1px solid rgba(189, 74, 44, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff7733', flexShrink: 0 }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="modal-eyebrow" style={{ color: '#ff7733', fontSize: '0.72rem', fontWeight: 900 }}>ORDEN OFICIAL</span>
                <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#a1a1aa', fontFamily: 'monospace' }}>
                  {order.reference}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
                {order.orderNumber}
              </h2>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Cerrar"><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* BANNER PRINCIPAL DE IDENTIFICACIÓN Y ESTADO DE LA ORDEN */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.08), rgba(0, 0, 0, 0.4))',
            border: '1px solid rgba(255, 85, 0, 0.25)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#ff7733', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                NÚMERO DE ORDEN / REFERENCIA DE COMPRA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                <strong style={{ fontSize: '1.2rem', color: '#ffffff', fontFamily: 'monospace', fontWeight: 900 }}>
                  {order.orderNumber}
                </strong>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(order.orderNumber);
                    showToast('Número de orden copiado al portapapeles');
                  }}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '4px', padding: '3px 8px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  title="Copiar Número de Orden"
                >
                  <Copy size={12} />
                  <span>Copiar</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', color: '#a1a1aa', textTransform: 'uppercase', display: 'block' }}>Fecha de Registro</span>
                <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>
                  {new Date(order.createdAt).toLocaleDateString('es-CO')} - {new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </strong>
              </div>
            </div>
          </div>

          <div className="order-summary-grid">
            <div className="info-block">
              <label>Datos del Cliente</label>
              <strong>{order.customerName}</strong>
              <div>{order.customerEmail}</div>
              <div>Tel: {order.customerPhone}</div>
            </div>

            <div className="info-block">
              <label>Dirección de Despacho</label>
              <strong>{order.shippingAddress}</strong>
              <div>{order.city}, {order.department}</div>
            </div>

            <div className="info-block">
              <label>Estado de Pago Wompi</label>
              <div>
                <span className={`status-badge payment-${(order.status || 'PENDING').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              {order.transactionId && <div className="mini-sub">Trx: {order.transactionId}</div>}
              {order.paymentMethod && <div className="mini-sub">Método: {order.paymentMethod}</div>}
            </div>

            <div className="info-block" style={{ gridColumn: 'span 2', background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} style={{ color: '#bd4a2c' }} />
                  <span>Número de Guía de Envío / Tracking</span>
                </label>
                {isTrackingFixed ? (
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '3px 8px', borderRadius: '4px' }}>
                    <CheckCircle2 size={12} /> Guía Oficial Registrada (Inmutable - SIC)
                  </span>
                ) : modalTrackingInput.trim().length > 0 ? (
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '3px 8px', borderRadius: '4px' }}>
                    <CheckCircle2 size={12} /> Guía Lista para Guardar
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 8px', borderRadius: '4px' }}>
                    <Lock size={12} /> Requiere Guía para Despachar / Entregar
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={modalTrackingInput} 
                  readOnly={isTrackingFixed}
                  disabled={isTrackingFixed}
                  placeholder="Ingresa la guía de la transportadora (Ej. SERVI-89402, COORDINADORA-2849)..."
                  onChange={(e) => setModalTrackingInput(e.target.value)}
                  onBlur={() => {
                    if (!isTrackingFixed && modalTrackingInput !== (order.trackingNumber || '')) {
                      handleUpdateDelivery(order.reference, order.deliveryStatus, modalTrackingInput);
                    }
                  }}
                  className="input-tracking"
                  style={{ 
                    flex: 1, 
                    padding: '10px 14px', 
                    fontSize: '0.85rem', 
                    background: isTrackingFixed ? 'rgba(74, 222, 128, 0.06)' : '#121118', 
                    border: isTrackingFixed ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255, 255, 255, 0.14)', 
                    color: isTrackingFixed ? '#4ade80' : '#ffffff', 
                    fontWeight: isTrackingFixed ? 800 : 500,
                    fontFamily: isTrackingFixed ? 'monospace' : 'inherit',
                    borderRadius: '6px',
                    cursor: isTrackingFixed ? 'not-allowed' : 'text'
                  }}
                />
                {isTrackingFixed ? (
                  <div
                    style={{
                      background: 'rgba(74, 222, 128, 0.12)',
                      color: '#4ade80',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                    title="Guía de transporte oficial ya registrada ante la SIC"
                  >
                    <CheckCircle2 size={14} />
                    <span>Guía Asignada</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!modalTrackingInput.trim()) {
                        showToast('Ingresa un número de guía válido', 'error');
                        return;
                      }
                      handleUpdateDelivery(order.reference, order.deliveryStatus, modalTrackingInput);
                    }}
                    style={{
                      background: modalTrackingInput.trim() ? '#bd4a2c' : 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                    title="Guardar Número de Guía"
                  >
                    <Check size={14} />
                    <span>Guardar Guía</span>
                  </button>
                )}
              </div>
              
              <div style={{ fontSize: '0.74rem', marginTop: '7px', color: isTrackingFixed || modalTrackingInput.trim().length > 0 ? '#4ade80' : '#a1a1aa', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isTrackingFixed ? (
                  <>
                    <CheckCircle2 size={13} style={{ color: '#4ade80', flexShrink: 0 }} />
                    <span>Guía registrada e inmutable: La trazabilidad oficial ya fue notificada al cliente y SIC.</span>
                  </>
                ) : modalTrackingInput.trim().length > 0 ? (
                  <>
                    <CheckCircle2 size={13} style={{ color: '#4ade80', flexShrink: 0 }} />
                    <span>Guía activa: Puedes despachar y marcar como entregado el pedido con trazabilidad completa.</span>
                  </>
                ) : (
                  <>
                    <Lock size={13} style={{ color: '#f87171', flexShrink: 0 }} />
                    <span>Regla de Control: Los estados &quot;Despachado&quot; y &quot;Entregado&quot; requieren número de guía para garantizar la trazabilidad al cliente.</span>
                  </>
                )}
              </div>
            </div>

            <div className="info-block" style={{ gridColumn: 'span 2' }}>
              <label>Estado de Despacho & Devolución de Producto</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                <select 
                  className={`select-delivery delivery-${(order.deliveryStatus || 'CREADO').toLowerCase()}`}
                  value={order.deliveryStatus || 'CREADO'}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus === 'DEVUELTO') {
                      requestReturnConfirmation(order);
                      return;
                    }
                    if (newStatus === 'CREADO' && isModalPastCreated) {
                      showToast('No se puede regresar al estado "Creado" una orden que ya tiene guía o está en proceso', 'error');
                      return;
                    }
                    if (['DESPACHADO', 'ENTREGADO'].includes(newStatus) && !hasTrackingModal) {
                      showToast('Debes ingresar y guardar el número de guía antes de pasar a ' + (newStatus === 'DESPACHADO' ? 'Despachado' : 'Entregado'), 'error');
                      return;
                    }
                    handleUpdateDelivery(order.reference, newStatus, modalTrackingInput);
                  }}
                  style={{ padding: '8px 12px', fontSize: '0.82rem', minWidth: '220px' }}
                >
                  <option value="CREADO" disabled={isModalPastCreated}>
                    {isModalPastCreated ? 'Bloqueado: Creado (En Proceso)' : 'Creado'}
                  </option>
                  <option value="EN_PREPARACION">En Preparación</option>
                  <option value="DESPACHADO" disabled={!hasTrackingModal}>
                    {hasTrackingModal ? 'Despachado' : 'Bloqueado: Despachado (Requiere Guía)'}
                  </option>
                  <option value="ENTREGADO" disabled={!hasTrackingModal}>
                    {hasTrackingModal ? 'Entregado' : 'Bloqueado: Entregado (Requiere Guía)'}
                  </option>
                  <option value="DEVUELTO">Devuelto (Devolución de Producto)</option>
                </select>

                {order.deliveryStatus !== 'DEVUELTO' ? (
                  <button 
                    type="button"
                    onClick={() => requestReturnConfirmation(order)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid #ef4444',
                      color: '#ffffff',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    <RotateCcw size={13} color="#ef4444" />
                    <span>Devolver este Pedido / Producto</span>
                  </button>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <RotateCcw size={13} color="#f87171" />
                    <span>Producto Devuelto Registrado (Impacta Ficha Cliente)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-items-section">
            <h3>Prendas en este pedido</h3>
            <div className="items-list">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="item-row">
                  <img src={item.product?.image || '/assets/products/tee/noctis_herb_tee.jpg'} alt="" />
                  <div className="item-info">
                    <strong>{item.product?.name || 'Prenda Noctis'}</strong>
                    <div className="item-specs">Talla: {item.size} {item.color ? `| Color: ${item.color}` : ''} | Cantidad: {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    ${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')} COP
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total-bar">
              <span>Total Liquidado:</span>
              <strong>${(order.total || 0).toLocaleString('es-CO')} COP</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
