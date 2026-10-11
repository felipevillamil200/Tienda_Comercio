import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, saveOrder, findOrderByReference, deleteOrder } from '@/lib/wompi';
import { queryDb } from '@/lib/db';

const DEMO_EMAILS = [
  'juan.cliente@gmail.com',
  'mateo.silva@gmail.com',
  'valeria.gomez@hotmail.com',
  'caicedo.carlos@outlook.com',
  'laura.mendoza@empresa.co'
];

export async function GET() {
  try {
    const memoryOrders = getAllOrders();
    let dbOrders: any[] = [];
    
    try {
      const rows = await queryDb(
        `SELECT id, order_number as "orderNumber", reference, access_token as "accessToken", 
                customer_name as "customerName", customer_email as "customerEmail",
                customer_phone as "customerPhone", shipping_address as "shippingAddress",
                city, department, items, total, status, delivery_status as "deliveryStatus",
                payment_method as "paymentMethod", tracking_number as "trackingNumber",
                transaction_id as "transactionId", created_at as "createdAt", updated_at as "updatedAt"
         FROM orders 
         ORDER BY created_at DESC`
      );
      if (rows && Array.isArray(rows)) {
        dbOrders = rows.map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
        }));
      }
    } catch (dbErr) {
      console.warn('Error fetching admin orders from DB:', dbErr);
    }

    const map = new Map();
    dbOrders.forEach((o: any) => map.set(o.reference || o.id || o.orderNumber, o));
    memoryOrders.forEach((o: any) => {
      const key = o.reference || o.id || o.orderNumber;
      map.set(key, { ...map.get(key), ...o });
    });

    const merged = Array.from(map.values()).sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return NextResponse.json({ orders: merged });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, deliveryStatus, status, trackingNumber } = body;

    let order = findOrderByReference(reference);
    if (!order) {
      try {
        const rows = await queryDb('SELECT * FROM orders WHERE reference = $1 OR order_number = $1', [reference]);
        if (rows && rows[0]) {
          const row = rows[0];
          order = {
            id: row.id,
            orderNumber: row.order_number,
            reference: row.reference,
            customerName: row.customer_name,
            customerEmail: row.customer_email,
            customerPhone: row.customer_phone,
            shippingAddress: row.shipping_address,
            city: row.city,
            department: row.department,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
            total: Number(row.total),
            status: row.status,
            deliveryStatus: row.delivery_status,
            paymentMethod: row.payment_method,
            trackingNumber: row.tracking_number,
            transactionId: row.transaction_id,
            accessToken: row.access_token,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
          saveOrder(order);
        }
      } catch (dbFindErr) {
        console.warn('Error querying order for PATCH:', dbFindErr);
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Validación estricta: No se puede avanzar a DESPACHADO o ENTREGADO sin número de guía
    if (deliveryStatus && ['DESPACHADO', 'ENTREGADO'].includes(deliveryStatus)) {
      const finalTracking = trackingNumber !== undefined ? trackingNumber : order.trackingNumber;
      if (!finalTracking || String(finalTracking).trim() === '') {
        return NextResponse.json({ 
          error: 'Se requiere asignar un número de guía / tracking antes de pasar el pedido a Despachado o Entregado' 
        }, { status: 400 });
      }
    }

    // Regla SIC: Una guía ya asignada no puede ser eliminada
    if (order.trackingNumber && trackingNumber !== undefined && String(trackingNumber).trim() === '') {
      return NextResponse.json({ 
        error: 'La guía de transporte no puede ser eliminada una vez registrada.' 
      }, { status: 400 });
    }

    // Regla de Integridad: No se puede regresar a CREADO si la orden ya tiene guía asignada o avanzó en el proceso
    if (deliveryStatus === 'CREADO' && ((order.trackingNumber && String(order.trackingNumber).trim().length > 0) || (order.deliveryStatus && order.deliveryStatus !== 'CREADO'))) {
      return NextResponse.json({ 
        error: 'No se puede regresar al estado "Creado" una orden que ya cuenta con guía de despacho o se encuentra en proceso.' 
      }, { status: 400 });
    }

    const oldStatus = order.deliveryStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (status) order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    saveOrder(order);

    try {
      await queryDb(
        `UPDATE orders SET delivery_status = $1, status = COALESCE($2, status), tracking_number = COALESCE($3, tracking_number), updated_at = NOW() WHERE reference = $4`,
        [order.deliveryStatus, order.status, order.trackingNumber || null, reference]
      );
    } catch {
      // ignore db error in fallback mode
    }

    // Registro de Notificación al Consumidor (Ley 1480 de 2011 / SIC Colombia)
    const statusLabels: Record<string, string> = {
      'CREADO': 'Orden Confirmada',
      'EN_PREPARACION': 'En Preparación y Empaque',
      'DESPACHADO': 'Despachado en Ruta',
      'ENTREGADO': 'Entregado con Éxito',
      'DEVUELTO': 'Devolución Registrada'
    };

    const notificationPayload = {
      recipient: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      reference: order.reference,
      deliveryStatus: order.deliveryStatus,
      statusLabel: statusLabels[order.deliveryStatus] || order.deliveryStatus,
      trackingNumber: order.trackingNumber || 'Pendiente',
      timestamp: new Date().toISOString(),
      dispatched: true,
      legalNote: 'Notificación obligatoria de estado de compra en cumplimiento de la Ley 1480 de 2011 y directrices de comercio electrónico de la SIC Colombia.'
    };

    console.log(`[NOCTIS NOTIFICACIÓN CONSUMIDOR SIC] Estado actualizado para pedido ${order.reference} (${order.orderNumber}). Correo despachado a: ${order.customerEmail}. Guía: ${order.trackingNumber || 'N/A'}. Estado: ${order.deliveryStatus}`);

    return NextResponse.json({ 
      success: true, 
      order,
      notification: notificationPayload
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference')?.trim();
    const id = searchParams.get('id')?.trim();

    if (!reference && !id) {
      return NextResponse.json({ error: 'Referencia o ID requerido' }, { status: 400 });
    }

    const order = reference ? findOrderByReference(reference) : (getAllOrders().find(o => o.id === id));

    const isDemo = Boolean(
      (id && id.startsWith('ord-demo-')) ||
      (order?.id && order.id.startsWith('ord-demo-')) ||
      (order?.customerEmail && DEMO_EMAILS.includes(order.customerEmail.toLowerCase().trim())) ||
      (order?.accessToken && order.accessToken.startsWith('tok_demo_')) ||
      (order?.reference && (order.reference.includes('M8A2') || order.reference.includes('M9K3') || order.reference.includes('M9Z1') || order.reference.includes('M7X9')))
    );

    if (!isDemo && order) {
      return NextResponse.json(
        { error: 'Por seguridad, únicamente los pedidos de prueba (demo) pueden ser eliminados.' },
        { status: 403 }
      );
    }

    if (reference) {
      deleteOrder(reference);
      try {
        await queryDb('DELETE FROM orders WHERE reference = $1', [reference]);
      } catch {}
    }
    if (id) {
      deleteOrder(id);
      try {
        await queryDb('DELETE FROM orders WHERE id = $1', [id]);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: 'Pedido demo de prueba eliminado exitosamente'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
