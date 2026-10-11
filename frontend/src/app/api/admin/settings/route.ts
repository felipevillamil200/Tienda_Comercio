import { NextRequest, NextResponse } from 'next/server';
import { 
  getCouponsAsync, 
  saveCouponAsync, 
  deleteCouponAsync, 
  getStoreSettingsAsync, 
  updateStoreSettingsAsync 
} from '@/lib/settingsDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [coupons, settings] = await Promise.all([
      getCouponsAsync(),
      getStoreSettingsAsync()
    ]);
    return NextResponse.json({ success: true, coupons, settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener configuraciones de la base de datos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, coupon, settings, couponId } = body;

    if (action === 'save_coupon') {
      const saved = await saveCouponAsync(coupon);
      return NextResponse.json({ success: true, coupon: saved });
    }

    if (action === 'delete_coupon') {
      await deleteCouponAsync(couponId);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_settings') {
      const updated = await updateStoreSettingsAsync(settings);
      return NextResponse.json({ success: true, settings: updated });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al procesar configuración en la base de datos' }, { status: 500 });
  }
}
