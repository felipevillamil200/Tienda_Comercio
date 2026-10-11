import { NextRequest, NextResponse } from 'next/server';
import { searchProductsSemantic } from '@/lib/rag';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '4');

    const results = searchProductsSemantic(query, limit);
    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error en búsqueda semántica' }, { status: 500 });
  }
}
