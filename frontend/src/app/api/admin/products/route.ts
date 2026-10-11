import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, saveProduct, deleteProduct, updateProductStock, resetProductsToFactory } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset_factory') {
      const products = resetProductsToFactory();
      return NextResponse.json({ success: true, products });
    }

    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 });
    }

    const saved = saveProduct(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al procesar producto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    const updated = saveProduct(body);
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, delta } = body;
    if (!id || delta === undefined) {
      return NextResponse.json({ error: 'ID y delta de stock requeridos' }, { status: 400 });
    }

    const updated = updateProductStock(id, Number(delta));
    if (!updated) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al modificar stock' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
