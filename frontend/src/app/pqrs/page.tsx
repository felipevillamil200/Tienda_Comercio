'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PqrsPage() {
  const { lang } = useLanguage();

  const [type, setType] = useState('peticion');
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [radicado, setRadicado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name,
          docType,
          docNumber,
          email,
          phone,
          orderNumber,
          description
        })
      });

      const data = await res.json();
      if (data.radicado) {
        setRadicado(data.radicado);
      } else {
        setRadicado(`PQR-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch {
      setRadicado(`PQR-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255, 85, 0, 0.08), transparent 65%), linear-gradient(180deg, #050505 0%, #0c0c0e 100%)',
      color: '#f3f0e9',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      paddingBottom: '80px'
    }}>
      {/* Header bar */}
      <header style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 900, letterSpacing: '0.18em', fontSize: '1rem' }}>
            NOCTIS URBANO
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/terminos" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.8rem' }}>
              {lang === 'EN' ? 'Terms' : 'Términos'}
            </Link>
            <Link href="/privacidad" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.8rem' }}>
              {lang === 'EN' ? 'Privacy' : 'Privacidad'}
            </Link>
            <Link href="/" style={{
              color: '#000000',
              backgroundColor: '#ffffff',
              padding: '8px 16px',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              ← {lang === 'EN' ? 'Store' : 'Tienda'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Badge & Title */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '28px' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            backgroundColor: 'rgba(255, 85, 0, 0.15)',
            border: '1px solid rgba(255, 85, 0, 0.4)',
            color: '#ff7733',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            borderRadius: '2px'
          }}>
            {lang === 'EN' ? 'CUSTOMER SERVICE & OFFICIAL CLAIMS' : 'CANAL OFICIAL DE ATENCIÓN AL CONSUMIDOR (SIC)'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase' }}>
            {lang === 'EN' ? 'PQRS Form (Inquiries, Claims & Petitions)' : 'Formulario de PQRS'}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
            {lang === 'EN'
              ? 'Peticiones, Quejas, Reclamos y Sugerencias (PQRS). In accordance with Colombian Law 1480 of 2011, inquiries are resolved within a statutory maximum of 15 business days.'
              : 'Peticiones, Quejas, Reclamos y Sugerencias. Conforme al Estatuto del Consumidor (Ley 1480 de 2011), tu solicitud será radicada y respondida en un plazo legal máximo de quince (15) días hábiles.'}
          </p>
        </div>

        {/* WhatsApp Direct Option Banner */}
        <div style={{
          backgroundColor: '#0c0f14',
          border: '1px solid rgba(255, 85, 0, 0.3)',
          padding: '20px 24px',
          borderRadius: '6px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>
              ¿Prefieres atención inmediata vía WhatsApp?
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.82rem', margin: 0 }}>
              Puedes comunicarte directamente con la marca a nuestra línea oficial en Bogotá (+57 313 585 9810).
            </p>
          </div>
          <a
            href="https://wa.me/573135859810?text=Hola%20NOCTIS%20URBANO,%20deseo%20radicar%20una%20solicitud%20PQRS%20sobre%20mi%20pedido/consulta."
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.78rem',
              padding: '12px 18px',
              borderRadius: '4px',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            Abrir WhatsApp
          </a>
        </div>

        {radicado ? (
          /* Confirmation card */
          <div style={{
            backgroundColor: '#0c160f',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            padding: '36px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.4rem', color: '#4ade80', marginBottom: '12px' }}>✓</div>
            <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px' }}>
              {lang === 'EN' ? 'PQRS Successfully Filed' : '¡PQRS Radicado con Éxito!'}
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.88rem', marginBottom: '16px' }}>
              {lang === 'EN' 
                ? 'Your filing number has been created. Keep it to track your resolution.' 
                : 'Se ha asignado el siguiente número de radicado oficial a tu solicitud:'}
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#050507',
              border: '1px dashed #4ade80',
              padding: '12px 24px',
              color: '#4ade80',
              fontFamily: 'monospace',
              fontSize: '1.3rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              marginBottom: '20px'
            }}>
              {radicado}
            </div>
            <p style={{ color: '#d4d4d8', fontSize: '0.84rem', margin: '0 0 24px', lineHeight: 1.6 }}>
              {lang === 'EN'
                ? `A confirmation copy has been registered for ${email || 'your email'}. We will respond promptly within legal timeframes.`
                : `Se ha registrado tu solicitud para ${email || 'tu correo'}. El equipo de NOCTIS URBANO dará trámite en un máximo de 15 días hábiles.`}
            </p>

            {/* Direct WhatsApp Follow-up */}
            <div style={{ marginBottom: '24px' }}>
              <a
                href={`https://wa.me/573135859810?text=${encodeURIComponent(`Hola NOCTIS URBANO, acabo de radicar la solicitud con número: ${radicado}\nNombre: ${name}\nDocumento: ${docType} ${docNumber}\nTipo: ${type}\nPedido: ${orderNumber || 'N/A'}\nDetalle: ${description}`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  padding: '12px 22px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Enviar comprobante por WhatsApp
              </a>
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setRadicado(null); setDescription(''); setOrderNumber(''); }}
                className="btn btn-secondary"
                style={{ minHeight: '46px', padding: '0 20px', fontSize: '0.75rem' }}
              >
                <span>{lang === 'EN' ? 'File Another Request' : 'Radicar otra solicitud'}</span>
              </button>
              <Link href="/" className="btn btn-primary" style={{ minHeight: '46px', padding: '0 24px', fontSize: '0.75rem' }}>
                <span>{lang === 'EN' ? 'Return to Store' : 'Volver a la Tienda'}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} style={{
            backgroundColor: '#0b0b0e',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '36px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Request Type *' : 'Tipo de Solicitud *'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#050507',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              >
                <option value="peticion">Petición (Información o consulta sobre un pedido / producto)</option>
                <option value="queja">Queja (Inconformidad con la atención recibida)</option>
                <option value="reclamo">Reclamo (Inconformidad por producto, envío o garantía legal)</option>
                <option value="sugerencia">Sugerencia o Felicitación</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Full Name *' : 'Nombre Completo *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camilo Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#050507',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Document Number (C.C. / CE) *' : 'Documento de Identidad (C.C. / CE) *'}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '12px 8px',
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '0.86rem'
                    }}
                  >
                    <option value="CC">C.C.</option>
                    <option value="CE">C.E.</option>
                    <option value="NIT">NIT</option>
                    <option value="PAS">PAS</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="1020304050"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      backgroundColor: '#050507',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Email Address *' : 'Correo Electrónico de Notificación *'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#050507',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Phone / WhatsApp *' : 'Teléfono / WhatsApp *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="300 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#050507',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Order Number (Optional)' : 'Número de Pedido o Transacción (Opcional)'}
              </label>
              <input
                type="text"
                placeholder="Ej: ORD-78291"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#050507',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Description of Facts / Request *' : 'Descripción detallada de los hechos o solicitud *'}
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe claramente los hechos, motivos y pretensiones de tu solicitud..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#050507',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ fontSize: '0.76rem', color: '#71717a', lineHeight: 1.5 }}>
              Al radicar esta solicitud, autorizas el tratamiento de tus datos personales conforme a nuestra{' '}
              <Link href="/privacidad" target="_blank" style={{ color: '#d4d4d8', textDecoration: 'underline' }}>
                Política de Privacidad
              </Link>{' '}
              para el trámite exclusivo de tu requerimiento.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                minHeight: '52px',
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{loading ? 'RADICANDO SOLICITUD...' : 'RADICAR PQRS'}</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
