import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL || 'postgresql://noctis_admin:noctis_password_2026@127.0.0.1:5435/noctis_db';

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    });

    pool.on('error', (err) => {
      console.warn('⚠️ [PostgreSQL Pool Error]:', err.message);
    });
  }

  return pool;
}

export async function queryDb<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (!p) {
    throw new Error('DATABASE_URL no configurada');
  }
  const res = await p.query(text, params);
  return res.rows;
}

export async function testDbConnection(): Promise<{ ok: boolean; message: string; version?: string }> {
  try {
    const p = getDbPool();
    if (!p) {
      return { ok: false, message: 'DATABASE_URL no encontrada en el entorno' };
    }
    const res = await p.query('SELECT version(), NOW() as server_time');
    return { 
      ok: true, 
      message: 'Conexión a PostgreSQL exitosa', 
      version: res.rows[0]?.version 
    };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
}
