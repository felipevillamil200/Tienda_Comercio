'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react';

interface LegalTermsModalProps {
  isOpen: boolean;
  initialTab?: 'terms' | 'privacy';
  onClose: () => void;
}

export default function LegalTermsModal({ isOpen, initialTab = 'terms', onClose }: LegalTermsModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          backgroundColor: '#0d0d10',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#121216'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: '#ff5500', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              NOCTIS URBANO // LEGAL
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '4px 0 0', letterSpacing: '0.04em' }}>
              {activeTab === 'terms' 
                ? (lang === 'EN' ? 'Terms of Service' : 'Términos del Servicio')
                : (lang === 'EN' ? 'Privacy Policy & Data' : 'Política de Privacidad y Datos')}
            </h2>
          </div>
          <button
            className="client-close-btn"
            onClick={onClose}
            aria-label="Cerrar términos legales"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#09090b' }}>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'terms' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'terms' ? '2px solid #ff5500' : '2px solid transparent',
              color: activeTab === 'terms' ? '#ffffff' : '#71717a',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {lang === 'EN' ? 'Terms & Conditions' : 'Términos y Condiciones'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'privacy' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'privacy' ? '2px solid #ff5500' : '2px solid transparent',
              color: activeTab === 'privacy' ? '#ffffff' : '#71717a',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {lang === 'EN' ? 'Privacy Policy (Data)' : 'Política de Privacidad'}
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '0.84rem', lineHeight: 1.7, color: '#d4d4d8' }}>
          {activeTab === 'terms' ? (
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px' }}>
                1. Naturaleza de los Drops y Confección Limitada
              </h3>
              <p>
                Cada prenda de NOCTIS URBANO es confeccionada éticamente en Bogotá D.C. con algodón peinado de alto gramaje (240g a 450g). Debido a la exclusividad de cada lanzamiento (Drop), las unidades son estrictamente limitadas hasta agotar existencias.
              </p>

              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '18px 0 8px' }}>
                2. Pagos Seguros con Wompi
              </h3>
              <p>
                Todas las transacciones son procesadas a través de la pasarela certificada Wompi (Bancolombia). Aceptamos Nequi, PSE, Tarjetas de Crédito y Débito. NOCTIS URBANO nunca almacena números de tarjeta ni datos financieros confidenciales.
              </p>

              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '18px 0 8px' }}>
                3. Envíos y Tiempos de Entrega
              </h3>
              <p>
                Los despachos en Bogotá D.C. se realizan en 24 a 48 horas hábiles. Para el resto de Colombia, las entregas toman entre 2 y 4 días hábiles mediante transportadoras autorizadas con código de rastreo.
              </p>

              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '18px 0 8px' }}>
                4. Cambios y Garantía
              </h3>
              <p>
                Dispones de 30 días calendario tras recibir tu pedido para solicitar cambios por talla o defectos de fábrica, siempre que la prenda conserve sus etiquetas originales y no presente signos de uso o lavado.
              </p>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px' }}>
                1. Tratamiento de Datos Personales (Ley 1581 de 2012)
              </h3>
              <p>
                En cumplimiento del Régimen General de Protección de Datos Personales de Colombia (Ley 1581 de 2012 y Decreto 1377 de 2013), NOCTIS URBANO es el Responsable del Tratamiento de la información personal suministrada al registrarte o comprar.
              </p>

              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '18px 0 8px' }}>
                2. Finalidad de la Recolección
              </h3>
              <p>
                Los datos solicitados (correo electrónico, nombre, teléfono y dirección de despacho) se utilizan exclusivamente para:
              </p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>Gestionar y entregar tus pedidos de forma segura.</li>
                <li>Notificarte el estado del envío y número de guía.</li>
                <li>Brindarte soporte a través de nuestro asesor Google Gemini AI y WhatsApp.</li>
                <li>Enviarte accesos prioritarios a nuevos Drops (si otorgas consentimiento expreso).</li>
              </ul>

              <h3 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, margin: '18px 0 8px' }}>
                3. Derechos del Titular (Habeas Data)
              </h3>
              <p>
                Como titular de los datos, tienes derecho a conocer, actualizar, rectificar o solicitar la supresión de tu información en cualquier momento escribiendo a <strong>contacto@noctisurbano.com</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#121216'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {lang === 'EN' ? 'I Understand' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
}
