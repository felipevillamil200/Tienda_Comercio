'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacidadPage() {
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
            <Link href="/terminos" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
              {lang === 'EN' ? 'Terms of Service' : 'Términos del Servicio'}
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
            {lang === 'EN' ? 'HABEAS DATA POLICY (STATUTORY LAW 1581 / 2012 - COLOMBIA)' : 'POLÍTICA DE HABEAS DATA (LEY ESTATUTARIA 1581 DE 2012 - COLOMBIA)'}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase' }}>
            {lang === 'EN' ? 'Privacy Policy & Data Protection' : 'Política de Tratamiento y Privacidad de Datos'}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.86rem', margin: 0 }}>
            {lang === 'EN' ? 'Last Updated: September 2026 | Bogotá D.C., Colombia' : 'Última actualización: Septiembre de 2026 | Bogotá D.C., Colombia'}
          </p>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '0.92rem', lineHeight: 1.75, color: '#d4d4d8' }}>
          
          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              1. {lang === 'EN' ? 'Data Controller Identification' : 'Identificación del Responsable del Tratamiento'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'NOCTIS URBANO, based in Bogotá D.C., Colombia, acts as the Controller responsible for the processing and protection of personal data collected through its online store and communication channels, in compliance with Statutory Law 1581 of 2012 and Regulatory Decree 1377 of 2013.'
                : 'NOCTIS URBANO, con domicilio principal en Bogotá D.C., República de Colombia, actúa como Responsable del Tratamiento de los Datos Personales recolectados a través de su plataforma de comercio electrónico, en estricto apego a la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y las directrices de la Delegatura de Protección de Datos de la SIC.'}
            </p>
            <p style={{ margin: 0 }}>
              {lang === 'EN'
                ? 'Contact for data requests: noirurbano1@gmail.com | Official WhatsApp: +57 313 585 9810.'
                : 'Canal oficial de atención de Habeas Data: noirurbano1@gmail.com | WhatsApp: +57 313 585 9810.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              2. {lang === 'EN' ? 'Personal Data Collected' : 'Datos Personales Objeto de Tratamiento'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'We collect identification and transaction data provided voluntarily during registration, browsing, and purchase processes: Full name, Colombian national ID (cédula) or tax info when required for invoicing, email address, physical delivery address, city, phone/WhatsApp number, purchase history, and tracking notes.'
                : 'Recolectamos datos de identificación, contacto y facturación proporcionados de manera libre, previa, expresa e informada por el titular: Nombre completo, número de documento de identidad (para facturación y guía de transporte), dirección de entrega, ciudad/departamento, número telefónico/WhatsApp, correo electrónico e historial de compras.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              3. {lang === 'EN' ? 'Purposes of Data Processing' : 'Finalidades del Tratamiento de Datos'}
            </h2>
            <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                {lang === 'EN'
                  ? 'Order fulfillment, packing, electronic invoicing, and courier delivery tracking (Bogotá and national coverage).'
                  : 'Gestión, preparación, facturación electrónica y despacho de pedidos mediante transportadoras certificadas.'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {lang === 'EN'
                  ? 'Transaction verification and anti-fraud security protocols through licensed payment gateways (Wompi).'
                  : 'Validación de pagos y prevención de fraude en transacciones electrónicas (Wompi / Bancolombia).'}
              </li>
              <li style={{ marginBottom: '8px' }}>
                {lang === 'EN'
                  ? 'Private notifications regarding limited streetwear drops, restocks, and promotional offers when opted in.'
                  : 'Envío de notificaciones sobre nuevos drops exclusivos, reposiciones y beneficios de cliente (previo consentimiento).'}
              </li>
              <li>
                {lang === 'EN'
                  ? 'Customer service response to inquiries, warranties, and official PQR requests.'
                  : 'Atención de garantías, peticiones, quejas, reclamos y consultas de servicio postventa.'}
              </li>
            </ul>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              4. {lang === 'EN' ? 'Data Subject Rights (ARCO - Habeas Data)' : 'Derechos del Titular de la Información (Derechos ARCO)'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'Under Colombian Law 1581 of 2012, data subjects hold the following rights: (a) Access and consult their personal data stored in our databases; (b) Update and rectify inaccurate or incomplete records; (c) Request proof of authorization granted; (d) Revoke authorization and request deletion of data when legal principles are infringed or upon request; (e) File complaints before the Superintendence of Industry and Commerce (SIC).'
                : 'Conforme al Artículo 8 de la Ley 1581 de 2012, todo titular de datos personales tiene derecho a: (a) Conocer, actualizar y rectificar sus datos personales frente a NOCTIS URBANO; (b) Solicitar prueba de la autorización otorgada; (c) Ser informado del uso que se ha dado a sus datos; (d) Revocar la autorización y/o solicitar la supresión de sus datos cuando no medie un deber legal de conservarlos; (e) Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              5. {lang === 'EN' ? 'Security & Third-Party Transmission' : 'Seguridad de la Información y Pasarelas de Pago'}
            </h2>
            <p>
              {lang === 'EN'
                ? 'NOCTIS URBANO does not sell, rent, or trade your personal data to third parties. Data is shared strictly with essential logistical providers (couriers for delivery) and financial processors (Wompi Bancolombia) under strict confidentiality and security protocols. We do not store credit or debit card numbers on our local servers.'
                : 'NOCTIS URBANO no vende, alquila ni comercializa bases de datos personales. La información sólo se comparte de manera estrictamente necesaria con transportadoras (para la entrega del paquete) y la pasarela Wompi (para el procesamiento seguro del pago). NO almacenamos información de tarjetas débito o crédito en nuestros servidores.'}
            </p>
          </section>

          <section style={{ backgroundColor: '#0b0b0e', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '28px', borderRadius: '4px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px', letterSpacing: '0.05em' }}>
              6. {lang === 'EN' ? 'Procedure to Exercise Habeas Data Rights' : 'Procedimiento para Ejercer los Derechos de Habeas Data'}
            </h2>
            <p style={{ margin: 0 }}>
              {lang === 'EN'
                ? 'To consult, update, or request deletion of your information, send an email to noirurbano1@gmail.com with the subject "Habeas Data Request", indicating your full name and identification number. Responses will be delivered within ten (10) business days for queries and fifteen (15) business days for claims.'
                : 'Para ejercer sus derechos de consulta, rectificación o eliminación de datos, el titular puede enviar una comunicación formal a noirurbano1@gmail.com con el asunto "Solicitud Habeas Data - NOCTIS URBANO", adjuntando nombre y cédula. Las consultas serán resueltas en un plazo máximo de diez (10) días hábiles y los reclamos en quince (15) días hábiles.'}
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
