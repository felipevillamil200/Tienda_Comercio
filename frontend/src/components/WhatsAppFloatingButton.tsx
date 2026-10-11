'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function WhatsAppFloatingButton() {
  const { isCartOpen, isAiOpen } = useCart();
  const [showTooltip, setShowTooltip] = useState(true);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings) {
            if (data.settings.whatsappNumber) {
              const cleanNum = data.settings.whatsappNumber.replace(/\D/g, '');
              if (cleanNum) setPhone(cleanNum);
            }
            if (data.settings.whatsappMessage) {
              setMessage(data.settings.whatsappMessage);
            }
            if (data.settings.whatsappTooltip) {
              setTooltipText(data.settings.whatsappTooltip);
            }
          }
        })
        .catch(() => {});
    };

    fetchSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'noctis_settings_sync') {
        fetchSettings();
      }
    };

    window.addEventListener('focus', fetchSettings);
    window.addEventListener('noctis-settings-updated', fetchSettings);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', fetchSettings);
      window.removeEventListener('noctis-settings-updated', fetchSettings);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isAiOpen) return null;

  const targetPhone = phone || '573135859810';
  const defaultMsg = message || 'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.';
  const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: isCartOpen ? 'calc(min(100vw, 450px) + 20px)' : '20px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexDirection: 'row-reverse',
        transition: 'right 340ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Tooltip Persuasivo con botón de cerrar */}
      {showTooltip && (
        <div
          className="whatsapp-tooltip-box"
          style={{
            backgroundColor: '#18181b',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '10px 14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            color: '#f4f4f5',
            fontSize: '0.78rem',
            lineHeight: 1.35,
            maxWidth: '220px',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            aria-label="Cerrar mensaje"
            style={{
              position: 'absolute',
              top: '4px',
              right: '6px',
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={12} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <strong style={{ color: '#22c55e', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Asesoría Noctis
            </strong>
          </div>
          <p style={{ margin: 0, color: '#d4d4d8' }}>
            {tooltipText}
          </p>
        </div>
      )}

      {/* Botón Flotante con Icono Oficial */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar a NOCTIS URBANO por WhatsApp"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
          textDecoration: 'none',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.45)';
        }}
      >
        {/* SVG Oficial de WhatsApp */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="#25D366" stroke="#ffffff" />
        </svg>

        {/* Punto de estado En Línea */}
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            border: '2px solid #000000'
          }}
        />
      </a>
    </div>
  );
}
