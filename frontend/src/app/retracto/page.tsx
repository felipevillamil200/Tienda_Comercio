'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function RetractoPage() {
  const { lang } = useLanguage();

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
            <Link href="/pqrs" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
              {lang === 'EN' ? 'PQRS Form' : 'Radicar PQRS'}
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

      {/* Main Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '24px' }}>
          <span style={{ color: '#ff5500', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Marco Legal • Ley 1480 de 2011 (Colombia)
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '12px 0 8px 0', textTransform: 'uppercase' }}>
            {lang === 'EN' ? 'Right of Withdrawal & Returns' : 'Derecho de Retracto y Devoluciones'}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
            {lang === 'EN'
              ? 'Standard compliant with Article 47 of Law 1480 of 2011 (Consumer Statute) and international EU Withdrawal Directives.'
              : 'Procedimiento oficial en cumplimiento del Artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor) y directrices de comercio electrónico de la SIC.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: 1.7, fontSize: '0.92rem', color: '#d4d4d8' }}>
          
          {/* Card Highlight */}
          <div style={{
            backgroundColor: 'rgba(255, 85, 0, 0.05)',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            padding: '24px',
            borderLeft: '4px solid #ff5500'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
              ⏱️ Plazo Legal: 5 Días Hábiles
            </h3>
            <p style={{ margin: 0, color: '#d4d4d8', fontSize: '0.88rem' }}>
              En las ventas realizadas mediante métodos no tradicionales o a distancia (comercio electrónico), el consumidor tiene derecho a retractarse de la compra dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la fecha de entrega del producto.
            </p>
          </div>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              1. Condiciones para Ejercer el Retracto
            </h2>
            <p>
              Para que la devolución sea aprobada y se proceda con el reembolso total del dinero:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>La prenda o accesorio debe devolverse en el mismo estado en que fue recibido (nueva, limpia, sin uso, sin olores ni manchas).</li>
              <li>Debe conservar todas sus etiquetas originales adheridas y empaque original de NOCTIS URBANO.</li>
              <li>El cliente asume los costos directos de flete y transporte de devolución hacia nuestro centro de distribución en Bogotá D.C.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              2. Procedimiento Paso a Paso
            </h2>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <strong>Radicación de la solicitud:</strong> Escribe a nuestro correo oficial <code style={{ color: '#ff5500' }}>noirurbano1@gmail.com</code> o al canal de <a href="https://wa.me/573135859810" target="_blank" rel="noreferrer" style={{ color: '#ff5500' }}>WhatsApp Oficial (+57 313 585 9810)</a> con el asunto: <em>"Solicitud de Retracto - Orden #XXXX"</em>.
              </li>
              <li>
                <strong>Adjuntar comprobante:</strong> Incluye el número de referencia generado por Wompi y fotografías del estado de la prenda.
              </li>
              <li>
                <strong>Envío de la prenda:</strong> Nuestro equipo te suministrará la dirección física de recepción en Bogotá D.C.
              </li>
              <li>
                <strong>Inspección y Reembolso:</strong> Una vez recibido el producto e inspeccionado por el equipo de calidad, se procederá con el reembolso íntegro de tu dinero en un plazo no mayor a <strong>treinta (30) días calendario</strong> a través del mismo método de pago utilizado (Wompi / PSE / Transferencia).
              </li>
            </ol>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              3. Política de Garantía Legal por Defectos de Fábrica (90 Días)
            </h2>
            <p>
              Adicional al derecho de retracto, todas las prendas de NOCTIS URBANO cuentan con una garantía de <strong>noventa (90) días calendario</strong> contra defectos de confección, costura o materiales. Si la prenda presenta un desperfecto no atribuible al mal uso o lavado indebido, NOCTIS URBANO asume el 100% de los costos de envío para reparación o reposición inmediata.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              4. Canales de Radicación y Enlace Oficial SIC
            </h2>
            <p>
              Si tienes cualquier duda respecto a tus derechos como consumidor o deseas interponer una Petición, Queja o Reclamo (PQR), puedes hacerlo a través de nuestra página de <Link href="/pqrs" style={{ color: '#ff5500', fontWeight: 700 }}>Radicación de PQRS</Link> o consultar los canales oficiales de la <strong>Superintendencia de Industria y Comercio (SIC)</strong> en <a href="https://www.sic.gov.co" target="_blank" rel="noreferrer" style={{ color: '#ff5500', fontWeight: 700 }}>www.sic.gov.co</a>.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
