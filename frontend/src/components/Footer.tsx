'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, ShieldCheck, Scale, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [waPhone, setWaPhone] = useState('');

  React.useEffect(() => {
    const fetchSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings?.whatsappNumber) {
            const clean = data.settings.whatsappNumber.replace(/\D/g, '');
            if (clean) setWaPhone(clean);
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="noctis-footer">
      <div className="noctis-footer-container">
        {/* Columna 1: Empresa & Servicio */}
        <div className="noctis-footer-col">
          <h4 className="noctis-footer-heading">
            {lang === 'EN' ? 'Company & Service' : 'Empresa & Servicio'}
          </h4>
          <ul className="noctis-footer-list">
            <li>
              <a href="#about">
                {lang === 'EN' ? 'About Us' : 'Quiénes Somos'}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer">
                {lang === 'EN' ? 'Contact Us (WhatsApp)' : 'Contáctanos (WhatsApp)'}
              </a>
            </li>
            <li>
              <Link href="/pqrs">
                {lang === 'EN' ? 'Customer Service & PQRS' : 'Servicio al Cliente & PQRS'}
              </Link>
            </li>
            <li>
              <a href="#drop">
                {lang === 'EN' ? "What's New (Drops)" : 'Novedades & Drops'}
              </a>
            </li>
            <li>
              <Link href="/terminos">
                {lang === 'EN' ? 'Terms of Use' : 'Términos de Uso'}
              </Link>
            </li>
            <li>
              <Link href="/terminos">
                {lang === 'EN' ? 'Terms & Conditions' : 'Términos y Condiciones'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 2: Políticas & Cumplimiento Legal */}
        <div className="noctis-footer-col">
          <h4 className="noctis-footer-heading">
            {lang === 'EN' ? 'Policies & Compliance' : 'Políticas & Ley'}
          </h4>
          <ul className="noctis-footer-list">
            <li>
              <Link href="/privacidad">
                {lang === 'EN' ? 'Privacy Policy' : 'Política de Privacidad (Habeas Data)'}
              </Link>
            </li>
            <li>
              <Link href="/terminos#pagos">
                {lang === 'EN' ? 'Payment Policy' : 'Política de Pagos (Wompi)'}
              </Link>
            </li>
            <li>
              <Link href="/terminos#envios">
                {lang === 'EN' ? 'Shipping Policy' : 'Política de Envíos Nacionales'}
              </Link>
            </li>
            <li>
              <Link href="/retracto">
                {lang === 'EN' ? 'Refund Policy' : 'Política de Reembolsos'}
              </Link>
            </li>
            <li>
              <Link href="/retracto" style={{ color: '#ff5500', fontWeight: 700 }}>
                {lang === 'EN' ? 'Return Policy (5 Days)' : 'Política de Devolución (Retracto 5 Días)'}
              </Link>
            </li>
            <li>
              <a
                href="https://www.sic.gov.co"
                target="_blank"
                rel="noreferrer"
                className="noctis-sic-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Scale size={14} style={{ color: '#ff5500' }} />
                <span>{lang === 'EN' ? 'Superintendence (SIC)' : 'Portal Oficial SIC (Ley 1480)'}</span>
                <ExternalLink size={12} style={{ opacity: 0.7 }} />
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Newsletter & Suscripción */}
        <div className="noctis-footer-col noctis-newsletter-col">
          <h3 className="noctis-newsletter-title">
            {lang === 'EN' ? 'Get Ready for our Exclusive Drops!' : '¡Sé el primero en enterarte de cada Drop!'}
          </h3>
          <p className="noctis-newsletter-desc">
            {lang === 'EN'
              ? 'Subscribe to stay in touch, secret promos and limited releases.'
              : 'Suscríbete para recibir lanzamientos de prendas limitadas y accesos VIP.'}
          </p>

          <form onSubmit={handleSubscribe} className="noctis-subscribe-form">
            <div className="noctis-subscribe-input-wrap">
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="noctis-subscribe-input"
              />
              <button type="submit" className="noctis-subscribe-btn">
                {lang === 'EN' ? 'Subscribe' : 'Suscribirme'}
              </button>
            </div>
            {subscribed && (
              <p className="noctis-subscribed-msg" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
                <span>{lang === 'EN' ? 'Thank you for subscribing!' : '¡Gracias por suscribirte a NOCTIS!'}</span>
              </p>
            )}
          </form>

          <div className="noctis-footer-socials">
            <a href="https://www.instagram.com/noir_urbano/" target="_blank" rel="noreferrer">Instagram</a>
            <span>•</span>
            <a href="https://www.tiktok.com/@noir.urbano" target="_blank" rel="noreferrer">TikTok</a>
            <span>•</span>
            <Link href="/admin" className="noctis-admin-link">Admin</Link>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="noctis-footer-bottom">
        <div className="noctis-footer-bottom-container">
          <p className="noctis-footer-copy">
            © Copyright 2026, <strong>NOCTIS URBANO S.A.S.</strong> (Bogotá D.C., Colombia). All rights reserved.
          </p>
          <div className="noctis-footer-badges">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} style={{ color: '#ff5500' }} />
              <span>Pagos Seguros con <strong>Wompi Bancolombia</strong></span>
            </span>
            <span className="noctis-dot">•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: '#22c55e' }} />
              <span>Cumplimiento Ley 1480 y Ley 1581</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


