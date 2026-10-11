'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('noctis_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

  const handleAccept = () => {
    localStorage.setItem('noctis_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('noctis_cookie_consent', 'essential_only');
    setVisible(false);
  };

  return (
    <aside
      aria-label={lang === 'EN' ? 'Cookie Consent Banner' : 'Banner de Consentimiento de Cookies'}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '520px',
        zIndex: 9999,
        backgroundColor: '#0c0c0e',
        border: '1px solid rgba(255, 85, 0, 0.35)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.85), 0 0 24px -6px rgba(255, 85, 0, 0.2)',
        padding: '20px',
        color: '#f3f0e9',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        backdropFilter: 'blur(16px)',
        animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#ff5500',
            borderRadius: '50%',
            boxShadow: '0 0 10px #ff5500',
            marginTop: '6px',
            flexShrink: 0
          }}
        />
        <div>
          <h4
            style={{
              margin: '0 0 6px 0',
              fontSize: '0.85rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff'
            }}
          >
            {lang === 'EN' ? 'PRIVACY & COOKIES (GDPR / LEY 1581)' : 'PRIVACIDAD & COOKIES (GDPR / LEY 1581)'}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '0.78rem',
              lineHeight: 1.55,
              color: '#a1a1aa'
            }}
          >
            {lang === 'EN' ? (
              <>
                We use strictly essential and analytical cookies to ensure safe payments via Wompi and power your AI shopping experience. Read our{' '}
                <Link href="/privacidad" style={{ color: '#ff5500', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/terminos" style={{ color: '#ff5500', textDecoration: 'underline' }}>
                  Terms
                </Link>.
              </>
            ) : (
              <>
                Utilizamos cookies esenciales y analíticas para procesar pagos seguros con Wompi y alimentar tu experiencia de asesoría con IA. Conoce nuestra{' '}
                <Link href="/privacidad" style={{ color: '#ff5500', textDecoration: 'underline' }}>
                  Política de Tratamiento de Datos
                </Link>{' '}
                y{' '}
                <Link href="/terminos" style={{ color: '#ff5500', textDecoration: 'underline' }}>
                  Términos del Servicio
                </Link>.
              </>
            )}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDecline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#a1a1aa',
            padding: '8px 14px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {lang === 'EN' ? 'Only Essential' : 'Solo Esenciales'}
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: '#ff5500',
            border: 'none',
            color: '#ffffff',
            padding: '8px 18px',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 85, 0, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          {lang === 'EN' ? 'Accept All' : 'Aceptar Todo'}
        </button>
      </div>
    </aside>
  );
}
