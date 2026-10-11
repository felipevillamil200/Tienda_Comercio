import { NextRequest, NextResponse } from 'next/server';
import { queryDb } from '@/lib/db';
import { getAllOrders, saveOrder } from '@/lib/wompi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      orderNumber, 
      reference, 
      email, 
      reason = 'DERECHO_RETRACTO', 
      comments = '',
      customerName = '',
      customerPhone = '' 
    } = body;

    const cleanRef = (reference || orderNumber || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanRef) {
      return NextResponse.json({ error: 'Se requiere la referencia o número de pedido' }, { status: 400 });
    }

    // 1. Buscar la orden en memoria o DB
    let order: any = null;
    const allMemoryOrders = getAllOrders();
    order = allMemoryOrders.find(
      (o: any) => 
        (o.reference && o.reference.toUpperCase() === cleanRef.toUpperCase()) ||
        (o.orderNumber && o.orderNumber.toUpperCase() === cleanRef.toUpperCase()) ||
        (o.id && o.id.toUpperCase() === cleanRef.toUpperCase())
    );

    if (!order) {
      try {
        const rows = await queryDb(
          `SELECT id, order_number as "orderNumber", reference, total, status, delivery_status as "deliveryStatus", 
                  items, city, department, shipping_address as "shippingAddress", created_at as "createdAt", 
                  customer_name as "customerName", customer_email as "customerEmail", customer_phone as "customerPhone", 
                  payment_method as "paymentMethod", tracking_number as "trackingNumber", transaction_id as "transactionId"
           FROM orders 
           WHERE UPPER(reference) = $1 OR UPPER(order_number) = $1 OR UPPER(id) = $1
           LIMIT 1`,
          [cleanRef.toUpperCase()]
        );
        if (rows && rows.length > 0) {
          order = {
            ...rows[0],
            items: typeof rows[0].items === 'string' ? JSON.parse(rows[0].items) : (rows[0].items || [])
          };
        }
      } catch (dbFindErr) {
        console.warn('Error buscando orden para devolución en DB:', dbFindErr);
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // 2. Marcar orden como DEVUELTO
    order.deliveryStatus = 'DEVUELTO';
    order.updatedAt = new Date().toISOString();
    order.returnRequest = {
      reason,
      comments,
      requestedAt: new Date().toISOString(),
      requestedBy: cleanEmail || order.customerEmail || 'Cliente',
      legalFramework: 'Ley 1480 de 2011 (Estatuto del Consumidor - Art. 47)'
    };

    saveOrder(order);

    try {
      await queryDb(
        `UPDATE orders SET delivery_status = 'DEVUELTO', updated_at = NOW() WHERE reference = $1`,
        [order.reference]
      );
    } catch {
      // ignore db error in fallback mode
    }

    // 3. Crear registro en PQRS para trazabilidad legal y SIC
    const radicado = `RET-${Date.now().toString().slice(-6)}`;
    try {
      await queryDb(
        `INSERT INTO pqrs (radicado, type, description, status, email, name, phone, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          radicado,
          'RECLAMO',
          `[SOLICITUD DE RETRACTO / DEVOLUCIÓN - SIC LEY 1480] Pedido: ${order.orderNumber || order.reference} | Motivo: ${reason} | Observaciones: ${comments || 'Sin comentarios adicionales'}`,
          'ABIERTO',
          cleanEmail || order.customerEmail || '',
          customerName || order.customerName || 'Cliente',
          customerPhone || order.customerPhone || ''
        ]
      );
    } catch (pqrsErr) {
      console.warn('No se pudo insertar en pqrs:', pqrsErr);
    }

    console.log(`[NOCTIS RETRACTO/DEVOLUCIÓN REGISTRADO] Pedido ${order.reference} (${order.orderNumber}). Radicado: ${radicado}`);

    return NextResponse.json({
      success: true,
      radicado,
      message: 'Solicitud de retracto y devolución radicada exitosamente conforme a la Ley 1480 de 2011 (Estatuto del Consumidor).',
      order
    });
  } catch (error: any) {
    console.error('Error procesando solicitud de retracto:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud de devolución' }, { status: 500 });
  }
}
