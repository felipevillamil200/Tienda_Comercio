'use client';

import React from 'react';
import { Order } from '@/types';
import { 
  ShieldCheck, 
  X, 
  Mail, 
  MessageCircle, 
  MapPin, 
  ShoppingBag, 
  ArrowUpRight, 
  MessageSquare 
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: any | null;
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
}

export default function CustomerDetailModal({
  customer,
  onClose,
  onSelectOrder
}: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px'
      }}
    >
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
          backgroundColor: '#09080d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 85, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div 
          className="modal-header"
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(255, 85, 0, 0.06) 0%, transparent 100%)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {customer.avatar ? (
              <img 
                src={customer.avatar} 
                alt={customer.name} 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ff5500',
                  boxShadow: '0 0 15px rgba(255, 85, 0, 0.3)',
                  flexShrink: 0
                }} 
              />
            ) : (
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1f1d24, #121118)',
                border: '2px solid rgba(255, 85, 0, 0.5)',
                color: '#ff7733',
                fontSize: '1.35rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(255, 85, 0, 0.2)',
                flexShrink: 0
              }}>
                {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
                  {customer.name}
                </h2>
                <span className={`role-badge role-${(customer.role || 'CLIENTE').toLowerCase()}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {customer.role || 'CLIENTE'}
                </span>
                {customer.hasDeletionRecord || customer.accountLifecycleState === 'RE_REGISTRADO_POST_SUPRESION' ? (
                  <span style={{
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    color: '#facc15',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.03em'
                  }}>
                    ⚡ RE-REGISTRADO POST-SUPRESIÓN
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    ● CUENTA ACTIVA
                  </span>
                )}
              </div>
              <div style={{ color: '#a1a1aa', fontSize: '0.82rem', marginTop: '3px' }}>
                {customer.email} • Registrado el {new Date(customer.createdAt || Date.now()).toLocaleDateString('es-CO')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                title={`Enviar correo a ${customer.email}`}
              >
                <Mail size={14} color="#ffffff" />
                <span>Email</span>
              </a>
            )}

            {customer.phone && (
              <a
                href={`https://wa.me/57${customer.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(37, 211, 102, 0.1)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  color: '#4ade80',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Abrir chat de WhatsApp con este cliente"
              >
                <MessageCircle size={14} color="#4ade80" />
                <span>WhatsApp</span>
              </a>
            )}
            <button 
              type="button"
              className="btn-close" 
              onClick={onClose}
              title="Cerrar Ficha"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body (2-Column Grid Layout) */}
        <div 
          className="modal-body" 
          style={{ 
            padding: '24px 28px', 
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* COLUMNA IZQUIERDA: RESUMEN, CONTACTO Y ESTADO DE CUENTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Resumen Comercial */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Resumen Comercial
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Total Invertido (Aprobado)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#4ade80', marginTop: '2px' }}>
                    ${Number(customer.totalSpent || 0).toLocaleString('es-CO')} <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>COP</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Pedidos</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                      {customer.orders?.length || customer.ordersCount || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Devoluciones</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: ((customer.orders || []).filter((o: any) => o.deliveryStatus === 'DEVUELTO').length || customer.returnsCount || 0) > 0 ? '#ef4444' : '#71717a' }}>
                      {(customer.orders || []).filter((o: any) => o.deliveryStatus === 'DEVUELTO').length || customer.returnsCount || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>PQRS</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: (customer.pqrs?.length || 0) > 0 ? '#facc15' : '#71717a' }}>
                      {customer.pqrs?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Datos de Contacto y Envío */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#ff5500" />
                <span>Contacto & Despacho</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>Teléfono Móvil</span>
                  <strong style={{ color: '#ffffff' }}>{customer.phone || 'No registrado'}</strong>
                </div>
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>Ciudad & Departamento</span>
                  <strong style={{ color: '#ffffff' }}>
                    {customer.city || 'Bogotá D.C.'}{customer.department ? `, ${customer.department}` : ''}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>Dirección de Entrega</span>
                  <strong style={{ color: '#e4e4e7', wordBreak: 'break-word' }}>
                    {customer.address || 'No especificada'}
                  </strong>
                </div>
              </div>
            </div>

            {/* 3. Estado & Registro de Cuenta */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#ff5500" />
                <span>Estado & Seguridad de Cuenta</span>
              </div>

              {/* ID de Usuario Visible Arriba */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#8e8e93', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', letterSpacing: '0.5px' }}>
                  ID de Usuario (PostgreSQL)
                </span>
                <code style={{ color: '#ff7733', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', display: 'block', marginTop: '2px', wordBreak: 'break-all' }}>
                  {customer.id || 'N/A'}
                </code>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>Estado de la Cuenta</span>
                  {customer.hasDeletionRecord || customer.accountLifecycleState === 'RE_REGISTRADO_POST_SUPRESION' ? (
                    <span style={{ color: '#facc15', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      ⚡ Re-registrado (Activo)
                    </span>
                  ) : (
                    <span style={{ color: '#4ade80', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      🟢 Activa y Operativa
                    </span>
                  )}
                </div>

                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>¿Ha Eliminado Cuenta Previamente?</span>
                  {customer.hasDeletionRecord || customer.accountLifecycleState === 'RE_REGISTRADO_POST_SUPRESION' ? (
                    <div style={{
                      marginTop: '4px',
                      backgroundColor: 'rgba(234, 179, 8, 0.08)',
                      border: '1px solid rgba(234, 179, 8, 0.25)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#fef08a',
                      fontSize: '0.75rem',
                      lineHeight: '1.4'
                    }}>
                      <strong style={{ color: '#facc15' }}>⚠️ Sí, registró eliminación</strong>
                      <div style={{ color: '#fef9c3', marginTop: '2px' }}>
                        {customer.lastDeletionDate ? `Fecha: ${new Date(customer.lastDeletionDate).toLocaleDateString('es-CO')}` : 'Solicitud procesada'} (Reingreso posterior)
                      </div>
                    </div>
                  ) : (
                    <strong style={{ color: '#a1a1aa' }}>
                      No registra eliminaciones (Sin antecedentes)
                    </strong>
                  )}
                </div>

                <div>
                  <span style={{ color: '#71717a', fontSize: '0.72rem', display: 'block' }}>Devoluciones de Producto</span>
                  {(() => {
                    const returnedOrders = (customer.orders || []).filter((o: any) => o.deliveryStatus === 'DEVUELTO');
                    const totalReturns = returnedOrders.length || customer.returnsCount || 0;
                    if (totalReturns > 0) {
                      return (
                        <div style={{
                          marginTop: '4px',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: '#fca5a5',
                          fontSize: '0.75rem',
                          lineHeight: '1.4'
                        }}>
                          <strong style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ↩️ {totalReturns} Devolución(es) de producto
                          </strong>
                          <div style={{ color: '#fecaca', marginTop: '2px', fontSize: '0.72rem' }}>
                            {returnedOrders.length > 0 
                              ? returnedOrders.map((ro: any) => `#${ro.orderNumber} (${ro.reference})`).join(', ')
                              : 'Registrado en historial logístico'}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <strong style={{ color: '#a1a1aa' }}>
                        No registra devoluciones (0 pedidos devueltos)
                      </strong>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: HISTORIAL DE PEDIDOS, PQRS Y EVENTOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Historial de Compras */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={16} color="#ff5500" />
                  <span>Historial de Compras & Despachos ({customer.orders?.length || 0})</span>
                </h3>
              </div>

              {(!customer.orders || customer.orders.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: '#71717a', fontSize: '0.82rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', border: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                  Este cliente aún no ha registrado pedidos en la tienda.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {customer.orders.map((ord: any, idx: number) => (
                    <div 
                      key={idx} 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{ord.orderNumber}</strong>
                          <span style={{ color: '#71717a', fontSize: '0.74rem' }}>({ord.reference})</span>
                          <span className={`status-badge payment-${(ord.status || 'PENDING').toLowerCase()}`}>
                            {ord.status === 'APPROVED' ? 'Aprobado' : ord.status}
                          </span>
                          <span className={`delivery-badge del-${(ord.deliveryStatus || 'CREADO').toLowerCase()}`}>
                            {ord.deliveryStatus}
                          </span>
                        </div>
                        <div style={{ color: '#a1a1aa', fontSize: '0.78rem', marginTop: '4px' }}>
                          {new Date(ord.createdAt).toLocaleDateString('es-CO')} {new Date(ord.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} • {(ord.items || []).length} artículo(s)
                          {ord.trackingNumber && ` • Guía: ${ord.trackingNumber}`}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                          ${Number(ord.total || 0).toLocaleString('es-CO')} <span style={{ fontSize: '0.72rem', color: '#8e8e93' }}>COP</span>
                        </strong>
                        <button
                          type="button"
                          onClick={() => { onClose(); onSelectOrder(ord); }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff7733',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>Ver Detalle</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Historial de PQRS & Garantías */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 14px 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#ff5500" />
                <span>PQRS & Garantías Radicadas ({customer.pqrs?.length || 0})</span>
              </h3>

              {(!customer.pqrs || customer.pqrs.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: '#71717a', fontSize: '0.82rem', background: 'rgba(255, 255, 255, 0.01)', borderRadius: '8px', border: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                  El cliente no registra peticiones, quejas o reclamos pendientes.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {customer.pqrs.map((p: any, idx: number) => (
                    <div 
                      key={idx} 
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#ff7733', fontSize: '0.88rem' }}>{p.radicado}</strong>
                          <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', color: '#d4d4d8', fontWeight: 700 }}>
                            {p.type}
                          </span>
                        </div>
                        <span style={{
                          background: p.status === 'RESUELTO' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                          color: p.status === 'RESUELTO' ? '#4ade80' : '#facc15',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {p.status || 'PENDIENTE'}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#e4e4e7', lineHeight: 1.4 }}>
                        {p.description}
                      </p>
                      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                        Radicado el {new Date(p.createdAt).toLocaleDateString('es-CO')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="modal-footer"
          style={{
            padding: '14px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '0.76rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#4ade80" />
            <span>Ficha 360° auditada con PostgreSQL y normativa Habeas Data (SIC)</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 24px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1.5px solid #ef4444',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 18px rgba(220, 38, 38, 0.55)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
