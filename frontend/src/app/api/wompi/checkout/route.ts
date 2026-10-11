import { NextRequest, NextResponse } from 'next/server';
import { generateWompiSignature, generateOrderReference, generateAccessToken, saveOrder, WOMPI_CONFIG } from '@/lib/wompi';
import { getCoupons } from '@/lib/settingsStore';
import { queryDb } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { Order, CartItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      city, 
      department, 
      items, 
      couponCode,
      simulated = true,
      paymentMethod = 'Bancolombia PSE (Demo)'
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    if (!customerName || !customerEmail || !shippingAddress || !city) {
      return NextResponse.json({ error: 'Faltan datos de envío obligatorios' }, { status: 400 });
    }

    // Calcular subtotal
    const subtotal = items.reduce((acc: number, item: CartItem) => acc + (item.product.price * item.quantity), 0);
    let discount = 0;
    let appliedCouponName = '';

    // Validar y aplicar cupón si se proporcionó
    if (couponCode && typeof couponCode === 'string') {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupons = getCoupons();
      const validCoupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

      if (validCoupon) {
        const isNotExpired = !validCoupon.expiresAt || new Date(validCoupon.expiresAt) >= new Date();
        const meetsMinPurchase = !validCoupon.minPurchase || subtotal >= validCoupon.minPurchase;

        if (isNotExpired && meetsMinPurchase) {
          if (validCoupon.discountType === 'percentage') {
            discount = Math.round((subtotal * validCoupon.value) / 100);
          } else {
            discount = Math.min(subtotal, validCoupon.value);
          }
          appliedCouponName = validCoupon.code;
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const amountInCents = total * 100;
    const reference = generateOrderReference();
    const accessToken = generateAccessToken();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Generar firma de integridad Wompi
    const signature = generateWompiSignature(reference, amountInCents, 'COP');

    const status = simulated ? 'APPROVED' : 'PENDING';
    const deliveryStatus = simulated ? 'PAGO_RECIBIDO' : 'CREADO';
    const transactionId = `txn_demo_${Date.now()}`;

    // Registrar la orden
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      reference,
      accessToken,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      shippingAddress,
      city,
      department: department || '',
      items,
      total,
      status: status as any,
      deliveryStatus: deliveryStatus as any,
      paymentMethod,
      transactionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveOrder(newOrder);

    // Persistir en PostgreSQL si está disponible
    try {
      await queryDb(
        `INSERT INTO orders (
          id, order_number, reference, access_token, customer_name, customer_email,
          customer_phone, shipping_address, city, department, items, total,
          status, delivery_status, payment_method, transaction_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        ON CONFLICT (reference) DO UPDATE SET
          status = EXCLUDED.status,
          delivery_status = EXCLUDED.delivery_status,
          updated_at = NOW()`,
        [
          newOrder.id,
          newOrder.orderNumber,
          newOrder.reference,
          newOrder.accessToken,
          newOrder.customerName,
          newOrder.customerEmail,
          newOrder.customerPhone,
          newOrder.shippingAddress,
          newOrder.city,
          newOrder.department,
          JSON.stringify(newOrder.items),
          newOrder.total,
          newOrder.status,
          newOrder.deliveryStatus,
          newOrder.paymentMethod,
          newOrder.transactionId
        ]
      );
    } catch (dbErr) {
      console.warn('⚠️ [Checkout DB Order Save Warning]:', dbErr);
    }

    // Enviar correo de confirmación y comprobante oficial al cliente
    sendOrderConfirmationEmail({
      email: newOrder.customerEmail,
      name: newOrder.customerName,
      orderId: newOrder.orderNumber,
      reference: newOrder.reference,
      total: newOrder.total,
      items: newOrder.items,
      address: newOrder.shippingAddress,
      city: newOrder.city,
      department: newOrder.department,
      phone: newOrder.customerPhone,
      paymentMethod: newOrder.paymentMethod,
    }).catch((mailErr) => {
      console.warn('⚠️ [Checkout Email Notification Warning]:', mailErr);
    });

    return NextResponse.json({
      success: true,
      simulated,
      order: newOrder,
      reference,
      orderNumber,
      accessToken,
      subtotal,
      discount,
      appliedCouponName,
      total,
      amountInCents,
      currency: 'COP',
      status: newOrder.status,
      deliveryStatus: newOrder.deliveryStatus,
      paymentMethod: newOrder.paymentMethod,
      signature,
      publicKey: WOMPI_CONFIG.publicKey,
      redirectUrl: WOMPI_CONFIG.redirectUrl
    });
  } catch (error: any) {
    console.error('Error creando checkout:', error);
    return NextResponse.json({ error: 'Error al procesar el checkout' }, { status: 500 });
  }
}
