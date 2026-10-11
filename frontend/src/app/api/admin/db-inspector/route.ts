import { NextRequest, NextResponse } from 'next/server';
import { testDbConnection, queryDb, getDbPool } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const selectedTable = searchParams.get('table') || 'users';

    const health = await testDbConnection();
    const hasPool = !!getDbPool();

    // Validar tablas permitidas para evitar inyecciones SQL
    const allowedTables = ['users', 'products', 'orders', 'coupons', 'store_settings'];
    const safeTable = allowedTables.includes(selectedTable) ? selectedTable : 'users';

    let tableCounts: Record<string, number> = {};
    let tableData: any[] = [];
    let tableColumns: string[] = [];

    if (health.ok) {
      // Obtener conteo de todas las tablas
      for (const t of allowedTables) {
        try {
          const countRes = await queryDb<{ count: string }>(`SELECT COUNT(*) as count FROM ${t}`);
          tableCounts[t] = parseInt(countRes[0]?.count || '0', 10);
        } catch {
          tableCounts[t] = 0;
        }
      }

      // Obtener datos de la tabla seleccionada
      try {
        tableData = await queryDb(`SELECT * FROM ${safeTable} ORDER BY created_at DESC LIMIT 50`);
        if (tableData.length > 0) {
          tableColumns = Object.keys(tableData[0]);
        }
      } catch (err: any) {
        console.error(`Error consultando tabla ${safeTable}:`, err.message);
      }
    }

    return NextResponse.json({
      success: true,
      health: {
        connected: health.ok,
        message: health.message,
        version: health.version || 'PostgreSQL 16.13 (Docker)',
        port: 5435,
        database: 'noctis_db',
        host: 'localhost',
        user: 'noctis_admin'
      },
      tableCounts,
      selectedTable: safeTable,
      tableColumns,
      tableData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      health: {
        connected: false,
        message: error.message,
        port: 5435,
        database: 'noctis_db'
      }
    }, { status: 500 });
  }
}
