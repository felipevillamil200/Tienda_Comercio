'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function TerminosPage() {
  const { lang } = useLanguage();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255, 85, 0, 0.07), transparent 65%), linear-gradient(180deg, #050505 0%, #0c0c0e 100%)',
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
            <Link href="/privacidad" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
              {lang === 'EN' ? 'Privacy Policy' : 'Política de Privacidad'}
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
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Badge & Title */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '32px' }}>
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
            {lang === 'EN' ? 'COLOMBIA CONSUMER STATUTE (LAW 1480 / 2011)' : 'ESTATUTO DEL CONSUMIDOR (LEY 1480 DE 2011 - COLOMBIA)'}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase' }}>
            {lang === 'EN' ? 'Terms of Service' : 'Términos y Condiciones del Servicio'}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.86rem', margin: 0 }}>
            {lang === 'EN' ? 'Last Updated: September 2026 | Bogotá D.C., Colombia' : 'Última actualización: Septiembre de 2026 | Bogotá D.C., Colombia'}
          </p>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.92rem', lineHeight: 1.75, color: '#d4d4d8' }}>
          
          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              1. {lang === 'EN' ? 'Identification & General Scope' : 'Identificación y Ámbito de Aplicación'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'Welcome to NOCTIS URBANO. These Terms and Conditions govern access to and use of our ecommerce platform, digital catalog, and purchase services in Colombia, in accordance with Law 1480 of 2011 (Consumer Statute), Law 527 of 1999 (Electronic Commerce), and relevant trade regulations.'
                : 'Bienvenido a NOCTIS URBANO. Los presentes Términos y Condiciones regulan el acceso, navegación y compras realizadas a través de nuestra plataforma de comercio electrónico en la República de Colombia, en estricto cumplimiento de la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 527 de 1999 (Comercio Electrónico) y directrices de la Superintendencia de Industria y Comercio (SIC).'}
            </p>
            <p style={{ margin: 0 }}>
              {lang === 'EN'
                ? 'Brand Headquarters: Bogotá D.C., Colombia. Contact: noirurbano1@gmail.com | Official WhatsApp: +57 313 585 9810.'
                : 'Sede de Operaciones: Bogotá D.C., Colombia. Contacto Oficial: noirurbano1@gmail.com | WhatsApp Oficial de Atención: +57 313 585 9810.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              2. {lang === 'EN' ? 'Drops, Editions & Product Availability' : 'Drops Exclusivos, Ediciones Limitadas y Disponibilidad'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'NOCTIS URBANO manufactures limited garment drops. All units are subject to real-time inventory availability. In the event an item sells out simultaneously during checkout, the customer will be notified immediately to process a replacement or full refund without unjustified delays.'
                : 'NOCTIS URBANO confecciona prendas de streetwear de alto gramaje y tirajes estrictamente limitados (Drops). La disponibilidad de inventario se actualiza en tiempo real. En caso fortuito de agotarse una prenda durante el proceso de pago, se informará de inmediato al consumidor para gestionar el cambio o la devolución íntegra del dinero.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              3. {lang === 'EN' ? 'Pricing & Secure Payments' : 'Precios y Pasarela de Pagos Segura (Wompi / Bancolombia)'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'All prices are displayed in Colombian Pesos (COP) and include statutory taxes. Payments are processed through authorized payment gateway Wompi (Bancolombia S.A.), supporting PSE, credit/debit cards, Nequi, and Bancolombia button, under PCI-DSS bank-grade encryption standards.'
                : 'Todos los precios publicados en la plataforma están expresados en Pesos Colombianos (COP) e incluyen los impuestos aplicables. Los pagos electrónicos son procesados de forma cifrada y segura a través de Wompi (Bancolombia S.A.), soportando transferencias PSE, Nequi, Botón Bancolombia y tarjetas de crédito/débito bajo estándares PCI-DSS.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              4. {lang === 'EN' ? 'Right of Withdrawal (Derecho de Retracto - Art. 47 Ley 1480)' : 'Derecho de Retracto (Art. 47 Ley 1480 de 2011)'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'Pursuant to Article 47 of Colombian Law 1480 of 2011, the customer has the right to exercise withdrawal within five (5) business days following delivery of the product. The garment must be returned in its original condition, unwashed, unused, with all brand tags intact. Shipping costs for return shall be borne by the consumer as established by law.'
                : 'Conforme al Artículo 47 de la Ley 1480 de 2011, en las compras realizadas mediante comercio electrónico el consumidor podrá ejercer el Derecho de Retracto dentro de los cinco (5) días hábiles siguientes a la entrega de la prenda. El producto debe devolverse en el mismo estado en que se recibió: sin uso, sin lavar y con sus etiquetas y empaques originales. Los costos de transporte para la devolución serán asumidos por el consumidor conforme a la ley.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              5. {lang === 'EN' ? 'Legal Warranty & Quality Policies' : 'Garantía Legal y Política de Calidad'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'All NOCTIS URBANO garments are covered by a 30-calendar-day legal warranty from delivery date against manufacturing defects, fabric stitching flaws, or color degradation under proper washing instructions. The warranty does not cover improper washing, tears caused by friction, or unauthorized alterations.'
                : 'Nuestras prendas cuentan con una garantía legal de treinta (30) días calendario a partir de la entrega por defectos de confección, costura o materiales, siguiendo las instrucciones de cuidado de la prenda. La garantía no cubre el desgaste natural, mal lavado o manipulaciones no autorizadas.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              6. {lang === 'EN' ? 'Shipping & Deliveries (Bogotá & Colombia)' : 'Envíos y Despachos (Bogotá y Cobertura Nacional)'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'Local deliveries in Bogotá D.C. operate with fast same-day/next-day courier options. National shipments across Colombia are handled via certified transport companies (Servientrega, Coordinadora, Interrapidísimo) with tracked guide numbers.'
                : 'Los envíos en Bogotá D.C. cuentan con cobertura urbana prioritaria. Los despachos nacionales al resto de Colombia se realizan mediante empresas de mensajería especializada certificada (Servientrega, Interrapidísimo, Coordinadora) con número de guía rastreable.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              7. {lang === 'EN' ? 'Dispute Resolution & Jurisdiction' : 'Peticiones, Reclamos (PQR) y Jurisdicción'}
            </h2>
            <p style={{ margin: 0 }}>
              {lang === 'EN'
                ? 'For any inquiry, petition, or claim (PQR), contact noirurbano1@gmail.com or WhatsApp +57 313 585 9810. These terms are governed by the laws of Colombia and subject to the jurisdiction of the Superintendence of Industry and Commerce (SIC) and Colombian civil courts.'
                : 'Para radicar cualquier Petición, Queja o Reclamo (PQR), disponemos del canal directo noirurbano1@gmail.com y WhatsApp (+57 313 585 9810), con tiempo de respuesta de máximo 15 días hábiles. La relación contractual se rige por la legislación de la República de Colombia y las directrices de la SIC.'}
            </p>
          </section>

        </div>

        {/* Back button bottom */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <Link href="/" className="btn btn-primary" style={{ minHeight: '48px', padding: '0 32px' }}>
            <span>{lang === 'EN' ? 'Return to Store' : 'Volver a la Tienda'}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
