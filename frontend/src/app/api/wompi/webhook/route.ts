import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/wompi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.data?.transaction;

    if (!event) {
      return NextResponse.json({ received: true, message: 'Evento sin datos de transacción' });
    }

    const { reference, status, id: transactionId, payment_method_type } = event;
    console.log(`[Wompi Webhook] Referencia: ${reference} | Estado: ${status} | ID: ${transactionId}`);

    const updated = updateOrderStatus(reference, status, transactionId, payment_method_type);

    return NextResponse.json({
      success: true,
      reference,
      status,
      updated: !!updated
    });
  } catch (error: any) {
    console.error('Error procesando Webhook de Wompi:', error);
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 });
  }
}
