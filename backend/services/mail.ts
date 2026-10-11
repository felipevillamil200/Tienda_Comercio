import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_PASS = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

const BRAND_NAME = 'NOCTIS URBANO';
const SENDER_EMAIL = process.env.MAIL_FROM || (GMAIL_USER ? `"${BRAND_NAME}" <${GMAIL_USER}>` : `"${BRAND_NAME}" <soporte@noctisurbano.com>`);

let transporterInstance: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });
  }
  return transporterInstance;
}

/**
 * 1. Correo de Bienvenida al Registrarse
 */
export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to: email,
      subject: `Bienvenido a ${BRAND_NAME} — Acceso a Drops Exclusivos`,
      html: `
        <div style="background-color: #050505; color: #f3f0e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; letter-spacing: 0.2em; font-size: 20px; font-weight: 900; margin: 0;">NOCTIS URBANO</h1>
            <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px;">Bogotá D.C. // Origen Urbano</p>
          </div>
          
          <div style="background-color: #0d0d11; border: 1px solid #1f1f27; padding: 30px; border-radius: 4px;">
            <h2 style="color: #ffffff; font-size: 18px; font-weight: 800; margin-top: 0;">¡Bienvenido, ${name}!</h2>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
              Tu cuenta ha sido creada exitosamente. Ahora tienes acceso anticipado a nuestras colecciones de edición limitada y notificaciones privadas de lanzamientos (Drops).
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://noctisurbano.com/#drop" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; display: inline-block;">
                EXPLORAR COLECCIÓN
              </a>
            </div>
            
            <p style="color: #71717a; font-size: 12px; line-height: 1.5; border-top: 1px solid #1f1f27; padding-top: 20px; margin-bottom: 0;">
              Atención directa vía WhatsApp Bogotá: +57 313 585 9810 | Correo: ${GMAIL_USER}
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[Nodemailer] Correo de bienvenida enviado a ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error al enviar correo de bienvenida con Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Correo de Código de Verificación (OTP / Autenticación)
 */
export async function sendVerificationOtpEmail({ email, name, code }: { email: string; name: string; code: string }) {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to: email,
      subject: `${code} es tu código de verificación — ${BRAND_NAME}`,
      html: `
        <div style="background-color: #050505; color: #f3f0e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; letter-spacing: 0.2em; font-size: 20px; font-weight: 900; margin: 0;">NOCTIS URBANO</h1>
          </div>
          
          <div style="background-color: #0d0d11; border: 1px solid #1f1f27; padding: 30px; border-radius: 4px; text-align: center;">
            <h2 style="color: #ffffff; font-size: 16px; font-weight: 700; margin-top: 0;">Código de Seguridad</h2>
            <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 24px;">
              ${name ? `Hola ${name}, usa` : 'Usa'} el siguiente código de 6 dígitos para verificar tu cuenta en ${BRAND_NAME}:
            </p>
            
            <div style="background-color: #000000; border: 1px dashed #ff5500; color: #ff7733; font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 0.25em; padding: 16px 24px; display: inline-block; margin-bottom: 24px;">
              ${code}
            </div>
            
            <p style="color: #71717a; font-size: 11px;">
              Este código expira en 10 minutos. Si no solicitaste este acceso, por favor ignora este mensaje.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[Nodemailer] OTP ${code} enviado exitosamente a ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error al enviar código OTP con Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 3. Correo de Confirmación de Pedido / Recibo Oficial
 */
export async function sendOrderConfirmationEmail({
  email,
  name,
  orderId,
  reference,
  total,
  items,
  address,
  city,
  department,
  phone,
  paymentMethod,
}: {
  email: string;
  name: string;
  orderId: string;
  reference?: string;
  total: number;
  items: Array<any>;
  address?: string;
  city?: string;
  department?: string;
  phone?: string;
  paymentMethod?: string;
}) {
  try {
    const transporter = getTransporter();
    
    // Normalizar items del carrito
    const formattedItems = (items || []).map((item: any) => {
      const title = item.product?.name || item.title || item.name || 'Prenda Noctis';
      const price = Number(item.product?.price || item.price || 0);
      const quantity = Number(item.quantity || 1);
      const size = item.size ? `Talla ${item.size}` : '';
      const color = item.color || item.selectedColor || '';
      const details = [size, color].filter(Boolean).join(' • ');
      
      return {
        title,
        details,
        quantity,
        price,
        subtotal: price * quantity
      };
    });

    const itemsRowsHtml = formattedItems
      .map(
        (i) => `
        <tr style="border-bottom: 1px solid #1f1f27;">
          <td style="padding: 12px 8px; color: #ffffff; font-size: 13px;">
            <div style="font-weight: 700;">${i.title}</div>
            ${i.details ? `<div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">${i.details}</div>` : ''}
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #d4d4d8; font-size: 13px;">x${i.quantity}</td>
          <td style="padding: 12px 8px; text-align: right; color: #a1a1aa; font-size: 12px;">$${i.price.toLocaleString('es-CO')}</td>
          <td style="padding: 12px 8px; text-align: right; color: #ffffff; font-weight: 700; font-size: 13px;">$${i.subtotal.toLocaleString('es-CO')}</td>
        </tr>
      `
      )
      .join('');

    const formattedDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to: email,
      subject: `Recibo Oficial #${orderId} — Pago Confirmado en ${BRAND_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="background-color: #050505; color: #f3f0e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px 12px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0d0d11; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <!-- Encabezado de Marca Oficial -->
            <div style="background-color: #121217; padding: 28px 24px; border-bottom: 2px solid #ff5500; text-align: center;">
              <h1 style="color: #ffffff; letter-spacing: 0.25em; font-size: 22px; font-weight: 900; margin: 0;">NOCTIS URBANO</h1>
              <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin: 6px 0 2px;">Streetwear de Alto Calibre • Bogotá D.C., Colombia</p>
              <p style="color: #71717a; font-size: 10px; margin: 0;">NIT: 901.554.892-1 • WhatsApp: +57 313 585 9810</p>
            </div>

            <div style="padding: 24px;">
              
              <!-- Badge de Confirmación -->
              <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <span style="display: inline-block; background-color: #22c55e; color: #000000; font-weight: 900; font-size: 11px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
                  ✓ PAGO CONFIRMADO & APROBADO
                </span>
                <h2 style="color: #ffffff; font-size: 18px; font-weight: 800; margin: 6px 0 2px;">¡Gracias por tu compra, ${name}!</h2>
                <p style="color: #a1a1aa; font-size: 12px; margin: 0;">Tu orden ha sido registrada en nuestro taller y se encuentra en preparación de empaque.</p>
              </div>

              <!-- Ficha de Datos (Cliente y Despacho) -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 8px;">
                    <div style="background-color: #18181b; padding: 14px; border-radius: 6px; border: 1px solid #27272a; min-height: 100px;">
                      <span style="font-size: 10px; color: #ff7733; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 6px;">
                        DATOS DEL CLIENTE
                      </span>
                      <strong style="color: #ffffff; font-size: 13px; display: block;">${name}</strong>
                      <div style="color: #a1a1aa; font-size: 12px; margin-top: 2px;">${email}</div>
                      ${phone ? `<div style="color: #a1a1aa; font-size: 12px; margin-top: 2px;">Tel: ${phone}</div>` : ''}
                    </div>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 8px;">
                    <div style="background-color: #18181b; padding: 14px; border-radius: 6px; border: 1px solid #27272a; min-height: 100px;">
                      <span style="font-size: 10px; color: #ff7733; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 6px;">
                        DESTINO DE ENVÍO
                      </span>
                      <div style="color: #ffffff; font-size: 12px; font-weight: 600;">${address || 'Dirección acordada'}</div>
                      <div style="color: #a1a1aa; font-size: 12px; margin-top: 2px;">${city || 'Bogotá D.C.'}${department ? `, ${department}` : ''}</div>
                      <div style="color: #71717a; font-size: 11px; margin-top: 4px;">Envío Nacional Asegurado</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Metadatos de la Orden -->
              <div style="background-color: #141419; border: 1px solid #27272a; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #71717a; padding: 3px 0;">Número de Orden:</td>
                    <td style="color: #ffffff; font-weight: 800; font-family: monospace; text-align: right;">#${orderId}</td>
                  </tr>
                  ${reference ? `
                  <tr>
                    <td style="color: #71717a; padding: 3px 0;">Referencia:</td>
                    <td style="color: #ffffff; font-family: monospace; text-align: right;">${reference}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="color: #71717a; padding: 3px 0;">Fecha de Emisión:</td>
                    <td style="color: #d4d4d8; text-align: right;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; padding: 3px 0;">Medio de Pago:</td>
                    <td style="color: #ff7733; font-weight: 700; text-align: right;">${paymentMethod || 'Pasarela Segura PSE'}</td>
                  </tr>
                </table>
              </div>

              <!-- Tabla de Prendas -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #18181b; color: #a1a1aa; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em;">
                    <th style="text-align: left; padding: 10px 8px; border-radius: 4px 0 0 4px;">Prenda</th>
                    <th style="text-align: center; padding: 10px 8px;">Cant.</th>
                    <th style="text-align: right; padding: 10px 8px;">Unitario</th>
                    <th style="text-align: right; padding: 10px 8px; border-radius: 0 4px 4px 0;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRowsHtml}
                </tbody>
              </table>

              <!-- Resumen de Totales -->
              <div style="background-color: #141419; border: 1px solid #27272a; border-radius: 6px; padding: 16px; margin-bottom: 28px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="color: #a1a1aa; padding-bottom: 6px;">Subtotal Prendas:</td>
                    <td style="color: #ffffff; text-align: right; padding-bottom: 6px;">$${Number(total).toLocaleString('es-CO')} COP</td>
                  </tr>
                  <tr>
                    <td style="color: #a1a1aa; padding-bottom: 8px;">Envío Nacional Express:</td>
                    <td style="color: #22c55e; font-weight: 800; text-align: right; padding-bottom: 8px;">GRATIS ($0 COP)</td>
                  </tr>
                  <tr style="border-top: 1px solid #27272a;">
                    <td style="color: #ffffff; font-size: 15px; font-weight: 900; padding-top: 10px;">TOTAL PAGADO:</td>
                    <td style="color: #ffffff; font-size: 16px; font-weight: 900; text-align: right; padding-top: 10px;">
                      $${Number(total).toLocaleString('es-CO')} COP
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Botón de Rastreo en Vivo -->
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="http://localhost:4173/#tracking" style="background-color: #ff5500; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; display: inline-block;">
                  RASTREAR ESTADO DE MI PEDIDO
                </a>
              </div>

              <!-- Pie de Comprobante -->
              <div style="border-top: 1px dashed #27272a; padding-top: 16px; font-size: 11px; color: #71717a; text-align: center; line-height: 1.5;">
                <p style="margin: 0 0 6px;">Este comprobante fue emitido electrónicamente como constancia de pago satisfactorio.</p>
                <p style="margin: 0;">Para cambios de talla, garantías o dudas de despacho, contáctanos a <span style="color: #ff7733;">${GMAIL_USER}</span> o vía WhatsApp al <strong style="color: #d4d4d8;">+57 313 585 9810</strong>.</p>
              </div>

            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[Nodemailer] Confirmación y recibo de pedido #${orderId} enviada a ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error al enviar confirmación de pedido con Nodemailer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 4. Correo de Confirmación de PQRS Radicado
 */
export async function sendPqrsConfirmationEmail({
  email,
  name,
  radicado,
  type,
  description,
}: {
  email: string;
  name: string;
  radicado: string;
  type: string;
  description: string;
}) {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to: email,
      subject: `Confirmación de Radicado ${radicado} — ${BRAND_NAME}`,
      html: `
        <div style="background-color: #050505; color: #f3f0e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; letter-spacing: 0.2em; font-size: 20px; font-weight: 900; margin: 0;">NOCTIS URBANO</h1>
          </div>
          
          <div style="background-color: #0d0d11; border: 1px solid #1f1f27; padding: 30px; border-radius: 4px;">
            <h2 style="color: #ffffff; font-size: 18px; font-weight: 800; margin-top: 0;">Constancia de Radicación PQRS</h2>
            <p style="color: #a1a1aa; font-size: 13px;">Estimado/a ${name}, hemos recibido formalmente tu solicitud.</p>
            
            <div style="background-color: #050507; border: 1px dashed #ff5500; padding: 16px; margin: 20px 0; text-align: center;">
              <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Número de Radicado Oficial</span>
              <strong style="font-family: monospace; font-size: 22px; color: #ff7733; letter-spacing: 0.1em;">${radicado}</strong>
            </div>
            
            <div style="font-size: 13px; color: #d4d4d8; line-height: 1.6; margin-bottom: 20px;">
              <p><strong>Tipo:</strong> ${type.toUpperCase()}</p>
              <p><strong>Detalle:</strong> ${description}</p>
            </div>
            
            <p style="color: #71717a; font-size: 11px; line-height: 1.5; border-top: 1px solid #1f1f27; padding-top: 16px; margin: 0;">
              Conforme a la Ley 1480 de 2011, tu caso será resuelto en un plazo máximo de quince (15) días hábiles.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[Nodemailer] PQRS ${radicado} enviada a ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error al enviar PQRS con Nodemailer:', error);
    return { success: false, error: error.message };
  }
}
