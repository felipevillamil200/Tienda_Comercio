import { NextRequest, NextResponse } from 'next/server';
import { findOrderByNumberAndToken } from '@/lib/wompi';
import { queryDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawOrderNumber = searchParams.get('orderNumber') || '';
    const cleanNumber = rawOrderNumber.replace(/^#/, '').trim().toUpperCase();
    const token = (searchParams.get('token') || '').trim();

    if (!cleanNumber) {
      return NextResponse.json({ error: 'Número de pedido requerido' }, { status: 400 });
    }

    let order = findOrderByNumberAndToken(cleanNumber, token);
    
    // Si no está en memoria, consultar en PostgreSQL
    if (!order) {
      try {
        const withoutPrefix = cleanNumber.replace(/^ORD-/, '');
        const withPrefix = `ORD-${withoutPrefix}`;

        const rows = await queryDb(
          `SELECT id, order_number as "orderNumber", reference, access_token as "accessToken",
                  customer_name as "customerName", customer_email as "customerEmail",
                  customer_phone as "customerPhone", shipping_address as "shippingAddress",
                  city, department, items, total, status, delivery_status as "deliveryStatus",
                  payment_method as "paymentMethod", tracking_number as "trackingNumber",
                  created_at as "createdAt", updated_at as "updatedAt"
           FROM orders
           WHERE UPPER(order_number) = $1 
              OR UPPER(order_number) = $2
              OR UPPER(reference) = $1
              OR UPPER(reference) = $2
              OR UPPER(order_number) LIKE '%' || $3 || '%'
              OR UPPER(reference) LIKE '%' || $3 || '%'`,
          [cleanNumber, withPrefix, withoutPrefix]
        );
        if (rows && rows.length > 0) {
          order = rows[0];
        }
      } catch (dbErr) {
        console.warn('⚠️ [Tracking DB Query Warning]:', dbErr);
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado o token inválido' }, { status: 404 });
    }

    let parsedItems = [];
    try {
      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    } catch {
      parsedItems = [];
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      reference: order.reference,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      total: order.total,
      items: parsedItems,
      city: order.city,
      shippingAddress: order.shippingAddress,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al consultar pedido' }, { status: 500 });
  }
}
