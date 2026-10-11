'use client';

import React from 'react';
import { Order } from '@/types';
import { AlertTriangle, ShieldCheck, X, Edit3, RotateCcw } from 'lucide-react';

interface ReturnWarningModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  customRefundAmount: number;
  setCustomRefundAmount: (val: number) => void;
  isEditingRefundAmount: boolean;
  setIsEditingRefundAmount: (val: boolean) => void;
  returnConsentCheck: boolean;
  setReturnConsentCheck: (val: boolean) => void;
  actionLoading: boolean;
  onConfirmReturn: () => Promise<void>;
}

export default function ReturnWarningModal({
  isOpen,
  order,
  onClose,
  customRefundAmount,
  setCustomRefundAmount,
  isEditingRefundAmount,
  setIsEditingRefundAmount,
  returnConsentCheck,
  setReturnConsentCheck,
  actionLoading,
  onConfirmReturn
}: ReturnWarningModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !actionLoading) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: '#0d0b10',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(239, 68, 68, 0.2)',
          borderRadius: '14px',
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.66rem', fontWeight: 900, letterSpacing: '0.08em', color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>
                <ShieldCheck size={12} />
                <span>SIC • Estatuto del Consumidor (Ley 1480 de 2011)</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', letterSpacing: '-0.01em' }}>
                Autorización de Devolución & Reembolso
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '2px' }}>
                Orden <strong style={{ color: '#fff', fontFamily: 'monospace' }}>#{order.orderNumber}</strong> — Ref: <span style={{ fontFamily: 'monospace' }}>{order.reference}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar advertencia"
          >
            <X size={18} />
          </button>
        </div>

        {/* Recuadro de Valor a Reembolsar con Edición */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fca5a5' }}>
              Valor a Reembolsar al Cliente:
            </span>
            {Number(customRefundAmount || 0) < (order.total || 0) && (
              <span style={{ fontSize: '0.65rem', background: 'rgba(255, 85, 0, 0.2)', border: '1px solid rgba(255, 85, 0, 0.4)', color: '#ff7733', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                Reembolso Parcial
              </span>
            )}
          </div>

          {!isEditingRefundAmount ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                ${Number(customRefundAmount || 0).toLocaleString('es-CO')} COP
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRefundAmount(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  transition: 'all 0.2s'
                }}
                title="Editar monto del reembolso (devolución parcial o deducción acordada)"
              >
                <Edit3 size={13} style={{ color: '#f87171' }} />
                <span>Editar Monto</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '360px', width: '100%', justifyContent: 'center' }}>
                <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.2rem' }}>$</span>
                <input 
                  type="number" 
                  min={0} 
                  max={order.total || 0}
                  value={customRefundAmount}
                  onChange={(e) => setCustomRefundAmount(Number(e.target.value))}
                  style={{
                    backgroundColor: '#18181b',
                    border: '2px solid #ef4444',
                    color: '#ffffff',
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    width: '180px',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsEditingRefundAmount(false)}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#000000',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Aplicar
                </button>
              </div>

              {/* Botones de Selección Rápida de Prendas / Total */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.72rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCustomRefundAmount(order.total || 0);
                    setIsEditingRefundAmount(false);
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Total Completo (${(order.total || 0).toLocaleString('es-CO')})
                </button>
                {(order.items || []).map((it, pIdx) => {
                  const itemSub = (it.product?.price || 0) * (it.quantity || 1);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        setCustomRefundAmount(itemSub);
                        setIsEditingRefundAmount(false);
                      }}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Solo {it.product?.name || `Prenda ${pIdx + 1}`} (${itemSub.toLocaleString('es-CO')})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.78rem', color: '#d4d4d8', marginTop: '6px' }}>
            Beneficiario: <strong>{order.customerName}</strong> ({order.customerEmail})
          </div>
        </div>

        {/* Cuadro de Consecuencias y Advertencias Legales */}
        <div style={{
          backgroundColor: '#141218',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '0.8rem',
          color: '#d4d4d8',
          lineHeight: 1.5,
          marginBottom: '16px'
        }}>
          <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} style={{ color: '#ef4444' }} />
            <span>Consecuencias Operativas y Legales de Confirmar:</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
            <li>
              <strong style={{ color: '#ffffff' }}>Obligación de Reembolso Liquidado:</strong> Debes restituir la suma pactada de <strong>${Number(customRefundAmount || 0).toLocaleString('es-CO')} COP</strong> al comprador en un plazo máximo de <strong>treinta (30) días calendario</strong> según el Artículo 47 de la Ley 1480 de 2011.
            </li>
            <li>
              <strong style={{ color: '#ffffff' }}>Afectación de Métricas:</strong> Este pedido dejará de sumar a los ingresos comerciales liquidados del establecimiento.
            </li>
            <li>
              <strong style={{ color: '#ffffff' }}>Recepción en Bodega:</strong> Las prendas devueltas deberán ser inspeccionadas físicamente antes de reingresar al inventario disponible.
            </li>
            <li>
              <strong style={{ color: '#ffffff' }}>Trazabilidad Oficial SIC:</strong> El cliente será notificado de inmediato en su portal y se abrirá el registro formal de devolución.
            </li>
          </ul>
        </div>

        {/* Checkbox de Consentimiento Obligatorio */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: returnConsentCheck ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '18px',
          transition: 'all 0.2s ease'
        }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.78rem', lineHeight: 1.45, color: returnConsentCheck ? '#ffffff' : '#a1a1aa' }}>
            <input 
              type="checkbox" 
              checked={returnConsentCheck} 
              onChange={(e) => setReturnConsentCheck(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#ef4444', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
            />
            <span>
              <strong>Certifico y Acepto:</strong> He revisado los datos de esta orden y <strong>autorizo formalmente el reembolso de ${Number(customRefundAmount || 0).toLocaleString('es-CO')} COP</strong> al cliente, asumiendo los compromisos legales y operativos ante la SIC.
            </span>
          </label>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: actionLoading ? 'not-allowed' : 'pointer'
            }}
          >
            CANCELAR
          </button>

          <button
            type="button"
            onClick={onConfirmReturn}
            disabled={!returnConsentCheck || actionLoading}
            style={{
              flex: 1.6,
              backgroundColor: returnConsentCheck && !actionLoading ? '#dc2626' : 'rgba(239, 68, 68, 0.2)',
              border: returnConsentCheck && !actionLoading ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              cursor: returnConsentCheck && !actionLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: returnConsentCheck && !actionLoading ? 1 : 0.5,
              boxShadow: returnConsentCheck && !actionLoading ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={15} />
            <span>{actionLoading ? 'PROCESANDO...' : `AUTORIZAR REEMBOLSO ($${Number(customRefundAmount || 0).toLocaleString('es-CO')})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
