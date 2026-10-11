import { NextRequest, NextResponse } from 'next/server';
import { getCoupons } from '@/lib/settingsStore';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, message: 'Por favor ingresa un código de cupón' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupons = getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return NextResponse.json({ success: false, message: `El cupón "${cleanCode}" no existe o ha expirado.` }, { status: 404 });
    }

    if (!coupon.active) {
      return NextResponse.json({ success: false, message: `El cupón "${cleanCode}" está inactivo actualmente.` }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: `El cupón "${cleanCode}" ha caducado.` }, { status: 400 });
    }

    const currentSubtotal = Number(subtotal) || 0;
    if (coupon.minPurchase && currentSubtotal < coupon.minPurchase) {
      return NextResponse.json({
        success: false,
        message: `Este cupón requiere una compra mínima de $${coupon.minPurchase.toLocaleString('es-CO')} COP (Monto actual: $${currentSubtotal.toLocaleString('es-CO')} COP).`
      }, { status: 400 });
    }

    // Calcular descuento
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((currentSubtotal * coupon.value) / 100);
    } else {
      discount = Math.min(currentSubtotal, coupon.value);
    }

    return NextResponse.json({
      success: true,
      message: `¡Cupón "${cleanCode}" aplicado con éxito!`,
      coupon,
      discount,
      finalTotal: Math.max(0, currentSubtotal - discount)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error validando cupón' }, { status: 500 });
  }
}
