import { NextResponse } from 'next/server';
import { getStoreSettingsAsync } from '@/lib/settingsDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getStoreSettingsAsync();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener configuraciones' }, { status: 500 });
  }
}
