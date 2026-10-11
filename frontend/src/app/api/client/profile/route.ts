import { NextRequest, NextResponse } from 'next/server';
import { queryDb } from '@/lib/db';
import { getAllOrders } from '@/lib/wompi';

async function ensureClientColumns() {
  try {
    await queryDb('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;');
    await queryDb('ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;');
    await queryDb('ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;');
    await queryDb('ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;');
    await queryDb('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;');
  } catch {
    // ignore
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureClientColumns();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    let user: any = null;
    let orders: any[] = [];
    let pqrs: any[] = [];

    try {
      const userRows = await queryDb('SELECT id, email, name, role, status, phone, city, department, address, avatar, created_at FROM users WHERE email = $1', [email]);
      if (userRows && userRows.length > 0) {
        user = userRows[0];
      }
    } catch (e) {
      try {
        const fallbackRows = await queryDb('SELECT id, email, name, role, status, phone, city, department, address FROM users WHERE email = $1', [email]);
        if (fallbackRows && fallbackRows.length > 0) {
          user = fallbackRows[0];
        }
      } catch {
        // ignore
      }
    }

    // 1. Obtener órdenes de base de datos PostgreSQL
    try {
      const dbOrders = await queryDb(
        `SELECT id, order_number as "orderNumber", reference, total, status, delivery_status as "deliveryStatus", 
                items, city, department, shipping_address as "shippingAddress", created_at as "createdAt", 
                customer_name as "customerName", customer_email as "customerEmail", customer_phone as "customerPhone", 
                payment_method as "paymentMethod", tracking_number as "trackingNumber", transaction_id as "transactionId",
                access_token as "accessToken"
         FROM orders 
         WHERE LOWER(customer_email) = $1 
         ORDER BY created_at DESC`,
        [email]
      );
      if (dbOrders && Array.isArray(dbOrders)) {
        orders = dbOrders.map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
        }));
      }
    } catch (dbErr) {
      console.warn('Error querying client orders from DB:', dbErr);
    }

    // 2. Complementar y sincronizar con órdenes de memoria (global.__noctisOrdersStore)
    const memoryOrders = getAllOrders().filter(
      (o: any) => o.customerEmail && o.customerEmail.trim().toLowerCase() === email
    );

    const mergedOrdersMap = new Map();
    orders.forEach((o: any) => mergedOrdersMap.set(o.reference || o.id || o.orderNumber, o));
    memoryOrders.forEach((o: any) => {
      const key = o.reference || o.id || o.orderNumber;
      if (mergedOrdersMap.has(key)) {
        mergedOrdersMap.set(key, { ...mergedOrdersMap.get(key), ...o });
      } else {
        mergedOrdersMap.set(key, o);
      }
    });

    orders = Array.from(mergedOrdersMap.values()).sort((a: any, b: any) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    try {
      pqrs = await queryDb(
        `SELECT id, radicado, type, description, status, created_at as "createdAt"
         FROM pqrs 
         WHERE LOWER(email) = $1 
         ORDER BY created_at DESC`,
        [email]
      );
    } catch {
      pqrs = [];
    }

    return NextResponse.json({
      success: true,
      user: user || {
        email,
        name: email.split('@')[0].toUpperCase(),
        role: 'CLIENTE',
        city: 'Bogotá D.C.',
        department: 'Cundinamarca',
        phone: '',
        avatar: null
      },
      orders: orders || [],
      pqrs: pqrs || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, city, department, address, avatar } = body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    try {
      await queryDb(
        `UPDATE users SET
           name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           city = COALESCE($3, city),
           department = COALESCE($4, department),
           address = COALESCE($5, address),
           avatar = COALESCE($6, avatar)
         WHERE LOWER(email) = $7`,
        [name?.trim(), phone?.trim(), city?.trim(), department?.trim(), address?.trim(), avatar, normalizedEmail]
      );
    } catch (e) {
      try {
        await queryDb(
          `UPDATE users SET
             name = COALESCE($1, name),
             phone = COALESCE($2, phone),
             city = COALESCE($3, city),
             department = COALESCE($4, department),
             address = COALESCE($5, address)
           WHERE LOWER(email) = $6`,
          [name?.trim(), phone?.trim(), city?.trim(), department?.trim(), address?.trim(), normalizedEmail]
        );
      } catch {
        // ignore
      }
    }


    return NextResponse.json({
      success: true,
      message: 'Datos personales actualizados correctamente'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, confirmationText } = body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const normalizedConfirm = (confirmationText || '').trim().toLowerCase();
    if (normalizedConfirm !== 'acepto eliminacion de cuenta') {
      return NextResponse.json(
        { error: 'Debes escribir exactamente la frase: "acepto eliminacion de cuenta"' },
        { status: 400 }
      );
    }

    try {
      const rows = await queryDb('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
      if (rows && rows.length > 0) {
        const user = rows[0];
        if (user.password && password && user.password !== password.trim()) {
          return NextResponse.json({ error: 'La contraseña actual no es correcta.' }, { status: 400 });
        }
      }

      try {
        await queryDb(`
          CREATE TABLE IF NOT EXISTS account_lifecycle_logs (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        const logId = `habeas-del-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await queryDb(
          `INSERT INTO account_lifecycle_logs (id, email, event_type, description, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            logId,
            normalizedEmail,
            'SUPRESION_HABEAS_DATA',
            'Titular solicitó supresión y eliminación de cuenta conforme a la Ley 1581 de 2012 (Habeas Data).',
            JSON.stringify({
              reason: 'Solicitud voluntaria de supresión de datos del titular',
              confirmedPhrase: 'acepto eliminacion de cuenta',
              channel: 'Portal Web Clientes - Modal Mi Cuenta'
            })
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log Warning]:', logErr);
      }

      await queryDb('DELETE FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    } catch (e) {
      console.warn('[Profile DELETE DB Warning]:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Cuenta y datos personales suprimidos conforme a la Ley 1581 de 2012.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
