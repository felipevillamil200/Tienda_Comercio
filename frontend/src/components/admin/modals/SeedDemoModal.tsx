'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';

interface SeedDemoModalProps {
  isOpen: boolean;
  actionLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SeedDemoModal({
  isOpen,
  actionLoading,
  onClose,
  onConfirm
}: SeedDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={() => !actionLoading && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '20px'
      }}
    >
      <div 
        className="modal-container" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0c0b10',
          border: '1px solid rgba(249, 115, 22, 0.35)',
          borderRadius: '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(249, 115, 22, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div 
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={20} color="#f97316" />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', color: '#f97316', textTransform: 'uppercase' }}>
                Datos de Prueba
              </div>
              <h2 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                ¿Cargar Pedidos y Datos Demo?
              </h2>
            </div>
          </div>
          <button 
            type="button"
            className="btn-close" 
            onClick={() => !actionLoading && onClose()}
            title="Cerrar Ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Function explanation */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              ℹ️ ¿Para qué sirve esta opción?
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#a1a1aa', lineHeight: '1.5' }}>
              Genera pedidos de prueba simulados con diferentes métodos de pago (Wompi, Tarjeta, PSE, Nequi), guías de rastreo de logística y clientes demo para probar y evaluar las funciones del panel administrativo.
            </p>
          </div>

          {/* Warning for existing products */}
          <div style={{
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.28)',
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fb923c', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="#fb923c" /> Advertencia para el Administrador
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#fed7aa', lineHeight: '1.5' }}>
              Si tu tienda <strong>ya tiene productos propios creados, precios finales establecidos o ventas reales</strong>, no es recomendable usar este botón, ya que insertará transacciones ficticias en tus reportes y restablecerá el catálogo base de prendas.
            </p>
          </div>

          {/* Safety note */}
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.06)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} color="#4ade80" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.78rem', color: '#86efac', lineHeight: '1.4' }}>
              <strong>Control Total:</strong> Todas las órdenes y clientes insertados están identificados con la etiqueta <code>DEMO</code> y podrás eliminarlos individualmente cuando lo desees.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="modal-footer"
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button 
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            style={{
              padding: '9px 18px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1.5px solid #ef4444',
              color: '#ffffff',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(220, 38, 38, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancelar (Mantener mis datos actuales)
          </button>

          <button 
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '6px',
              cursor: actionLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <Sparkles size={14} className={actionLoading ? 'spin' : ''} />
            <span>{actionLoading ? 'Cargando Demo...' : 'Sí, Cargar Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
