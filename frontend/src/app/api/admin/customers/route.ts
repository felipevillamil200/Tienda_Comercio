import { NextRequest, NextResponse } from 'next/server';
import { queryDb } from '@/lib/db';

const DEMO_EMAILS = [
  'juan.cliente@gmail.com',
  'mateo.silva@gmail.com',
  'valeria.gomez@hotmail.com',
  'caicedo.carlos@outlook.com',
  'laura.mendoza@empresa.co'
];

function checkIsDemo(id?: string, email?: string): boolean {
  const normEmail = (email || '').toLowerCase().trim();
  const strId = String(id || '');

  if (DEMO_EMAILS.includes(normEmail)) return true;
  if (strId.startsWith('usr-client-') || strId.startsWith('ord-usr-')) return true;
  if (
    normEmail.includes('juan.cliente') || 
    normEmail.includes('demo@') || 
    normEmail.includes('test@') || 
    normEmail.includes('prueba@') ||
    normEmail.includes('.cliente@')
  ) {
    return true;
  }

  return false;
}

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

    // 1. Obtener todos los usuarios registrados
    let users: any[] = [];
    try {
      users = await queryDb(
        `SELECT id, email, name, role, status, phone, city, department, address, avatar, created_at as "createdAt" 
         FROM users 
         ORDER BY created_at DESC`
      );
    } catch {
      users = [];
    }

    // 2. Obtener todas las órdenes
    let orders: any[] = [];
    try {
      orders = await queryDb(
        `SELECT id, order_number as "orderNumber", reference, total, status, 
                delivery_status as "deliveryStatus", items, city, department, 
                shipping_address as "shippingAddress", customer_name as "customerName", 
                customer_email as "customerEmail", customer_phone as "customerPhone", 
                tracking_number as "trackingNumber",
                created_at as "createdAt" 
         FROM orders 
         ORDER BY created_at DESC`
      );
    } catch {
      orders = [];
    }

    // 3. Obtener todas las PQRS
    let pqrs: any[] = [];
    try {
      pqrs = await queryDb(
        `SELECT id, radicado, type, description, status, email, phone, name, created_at as "createdAt" 
         FROM pqrs 
         ORDER BY created_at DESC`
      );
    } catch {
      pqrs = [];
    }

    // 4. Obtener logs de ciclo de vida y auditoría Habeas Data
    let lifecycleLogs: any[] = [];
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
      lifecycleLogs = await queryDb(
        `SELECT id, email, event_type as "eventType", description, metadata, created_at as "createdAt"
         FROM account_lifecycle_logs
         ORDER BY created_at DESC`
      );
    } catch {
      lifecycleLogs = [];
    }

    // Mapa para consolidar clientes por email normalizado
    const customerMap = new Map<string, any>();

    // Agregar usuarios de la tabla users
    for (const u of users) {
      const email = (u.email || '').trim().toLowerCase();
      if (!email) continue;

      const isDemo = checkIsDemo(u.id, email);

      customerMap.set(email, {
        id: u.id,
        name: u.name || email.split('@')[0],
        email: u.email,
        phone: u.phone || '',
        city: u.city || 'Bogotá D.C.',
        department: u.department || 'Cundinamarca',
        address: u.address || '',
        avatar: u.avatar || null,
        role: u.role || 'CLIENTE',
        status: u.status || 'ACTIVE',
        isDemo,
        createdAt: u.createdAt,
        orders: [],
        pqrs: [],
        lifecycleLogs: [],
        ordersCount: 0,
        totalSpent: 0,
        lastOrder: null
      });
    }

    // Distribuir órdenes a los clientes
    for (const ord of orders) {
      const email = (ord.customerEmail || '').trim().toLowerCase();
      if (!email) continue;

      let client = customerMap.get(email);
      if (!client) {
        const isDemo = checkIsDemo(`ord-usr-${email}`, email);
        client = {
          id: `ord-usr-${email}`,
          name: ord.customerName || email.split('@')[0],
          email: ord.customerEmail,
          phone: ord.customerPhone || '',
          city: ord.city || 'Colombia',
          department: ord.department || '',
          address: ord.shippingAddress || '',
          avatar: null,
          role: 'CLIENTE',
          status: 'ACTIVE',
          isDemo,
          createdAt: ord.createdAt,
          orders: [],
          pqrs: [],
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: null
        };
        customerMap.set(email, client);
      }

      // Enriquecer datos de contacto si faltaban
      if (!client.phone && ord.customerPhone) client.phone = ord.customerPhone;
      if (!client.address && ord.shippingAddress) client.address = ord.shippingAddress;
      if ((!client.city || client.city === 'Bogotá D.C.') && ord.city) client.city = ord.city;
      if (!client.department && ord.department) client.department = ord.department;

      client.orders.push(ord);
      client.ordersCount += 1;
      if (ord.deliveryStatus === 'DEVUELTO') {
        client.returnsCount = (client.returnsCount || 0) + 1;
        if (!client.returnedOrders) client.returnedOrders = [];
        client.returnedOrders.push(ord);
      }
      if (ord.status === 'APPROVED' && ord.deliveryStatus !== 'DEVUELTO') {
        client.totalSpent += Number(ord.total) || 0;
      }
      if (!client.lastOrder || new Date(ord.createdAt) > new Date(client.lastOrder)) {
        client.lastOrder = ord.createdAt;
      }
    }

    // Distribuir PQRS a los clientes
    for (const p of pqrs) {
      const email = (p.email || '').trim().toLowerCase();
      if (!email) continue;

      let client = customerMap.get(email);
      if (!client) {
        const isDemo = checkIsDemo(`pqr-usr-${email}`, email);
        client = {
          id: `pqr-usr-${email}`,
          name: p.name || email.split('@')[0],
          email: p.email,
          phone: p.phone || '',
          city: 'Colombia',
          department: '',
          address: '',
          avatar: null,
          role: 'CLIENTE',
          status: 'ACTIVE',
          isDemo,
          createdAt: p.createdAt,
          orders: [],
          pqrs: [],
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: null
        };
        customerMap.set(email, client);
      }

      client.pqrs.push(p);
    }

    // Distribuir logs de ciclo de vida (Habeas Data y supresión de cuenta)
    for (const log of lifecycleLogs) {
      const email = (log.email || '').trim().toLowerCase();
      if (!email) continue;

      let client = customerMap.get(email);
      if (!client) {
        client = {
          id: `archived-${email}`,
          name: email.split('@')[0],
          email: log.email,
          phone: '',
          city: 'Colombia',
          department: '',
          address: '',
          avatar: null,
          role: 'CLIENTE',
          status: 'SUPRIMIDO_HABEAS_DATA',
          isDemo: false,
          createdAt: log.createdAt,
          orders: [],
          pqrs: [],
          lifecycleLogs: [],
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: null
        };
        customerMap.set(email, client);
      }

      if (!client.lifecycleLogs) client.lifecycleLogs = [];
      client.lifecycleLogs.push(log);
    }

    // Calcular estado de ciclo de vida y trazabilidad de supresión/reingreso
    for (const client of customerMap.values()) {
      const hasDeletions = (client.lifecycleLogs || []).some((l: any) => l.eventType === 'SUPRESION_HABEAS_DATA');
      if (hasDeletions) {
        client.hasDeletionRecord = true;
        client.lastDeletionDate = client.lifecycleLogs.find((l: any) => l.eventType === 'SUPRESION_HABEAS_DATA')?.createdAt;
        if (client.status !== 'SUPRIMIDO_HABEAS_DATA') {
          client.accountLifecycleState = 'RE_REGISTRADO_POST_SUPRESION';
        } else {
          client.accountLifecycleState = 'CUENTA_SUPRIMIDA';
        }
      } else {
        client.hasDeletionRecord = false;
        client.accountLifecycleState = 'CUENTA_ACTIVA_REGULAR';
      }
    }

    const customersList = Array.from(customerMap.values()).sort((a, b) => {
      const dateA = new Date(a.lastOrder || a.createdAt).getTime();
      const dateB = new Date(b.lastOrder || b.createdAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      customers: customersList,
      totalCustomers: customersList.length
    });
  } catch (error: any) {
    console.error('Error fetching admin customers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase();
    const id = searchParams.get('id')?.trim();

    if (!email && !id) {
      return NextResponse.json({ error: 'Email o ID requerido' }, { status: 400 });
    }

    // Proteger cuentas principales de administración del sistema
    if (email === 'superadmin@noctisurbano.com' || email === 'admin@noctisurbano.com') {
      return NextResponse.json(
        { error: 'No está permitido eliminar cuentas principales de administración del sistema.' },
        { status: 403 }
      );
    }

    if (email) {
      try {
        await queryDb('DELETE FROM orders WHERE LOWER(customer_email) = $1 OR LOWER(email) = $1', [email]);
      } catch {}
      try {
        await queryDb('DELETE FROM pqrs WHERE LOWER(email) = $1', [email]);
      } catch {}
      try {
        await queryDb('DELETE FROM users WHERE LOWER(email) = $1', [email]);
      } catch {}
    }
    if (id) {
      try {
        await queryDb('DELETE FROM users WHERE id = $1', [id]);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil demo de prueba eliminado exitosamente'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
