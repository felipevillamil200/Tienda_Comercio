'use client';

import React from 'react';
import { Server, RefreshCw, Database } from 'lucide-react';

interface DbInspectorData {
  health?: {
    database: string;
    host: string;
    port: number;
    user: string;
  };
  tableCounts?: Record<string, number>;
  tableData?: any[];
  tableColumns?: string[];
}

interface DatabaseTabProps {
  dbInspectorData: DbInspectorData | null;
  selectedDbTable: string;
  loadDbInspector: (table: string) => void;
  dbLoading: boolean;
}

export default function DatabaseTab({
  dbInspectorData,
  selectedDbTable,
  loadDbInspector,
  dbLoading
}: DatabaseTabProps) {
  return (
    <section className="tab-pane">
      {/* Header de Estado del Motor */}
      <div className="db-server-card">
        <div className="db-server-left">
          <div className="db-status-icon-wrap">
            <Server size={24} className="server-icon" />
            <span className="live-ping-dot" />
          </div>
          <div>
            <div className="db-tag-row">
              <span className="badge-live-db">POSTGRESQL 16 ACTIVO</span>
              <span className="badge-env-db">DOCKER ENGINE</span>
            </div>
            <h2 className="db-server-title">Base de Datos: {dbInspectorData?.health?.database || 'noctis_db'}</h2>
            <div className="db-sub-meta">
              <span>Host: <code>{dbInspectorData?.health?.host || 'localhost'}</code></span>
              <span>Puerto: <code>:{dbInspectorData?.health?.port || 5435}</code></span>
              <span>Usuario: <code>{dbInspectorData?.health?.user || 'noctis_admin'}</code></span>
            </div>
          </div>
        </div>

        <div className="db-server-right">
          <button 
            className="btn-action-ghost" 
            onClick={() => loadDbInspector(selectedDbTable)}
            disabled={dbLoading}
          >
            <RefreshCw size={14} className={dbLoading ? 'spin' : ''} />
            <span>Consultar Tablas en Vivo</span>
          </button>
        </div>
      </div>

      {/* Selector de Tablas Relacionales */}
      <div className="db-tables-grid">
        {[
          { id: 'users', name: 'users', label: 'Usuarios & Roles (RBAC)', desc: 'SuperAdmin (Dueño), Administradores y Clientes' },
          { id: 'products', name: 'products', label: 'Catálogo de Prendas', desc: 'Precios, stock, tallas, fotos y variantes' },
          { id: 'orders', name: 'orders', label: 'Órdenes & Envíos', desc: 'Clientes, referencias Wompi y despachos' },
          { id: 'coupons', name: 'coupons', label: 'Cupones de Descuento', desc: 'Promociones activas y montos mínimos' },
          { id: 'store_settings', name: 'store_settings', label: 'Configuración Tienda', desc: 'Banners de anuncio y políticas de envío' },
        ].map(tabInfo => (
          <div 
            key={tabInfo.id} 
            className={`db-table-card ${selectedDbTable === tabInfo.id ? 'selected' : ''}`}
            onClick={() => loadDbInspector(tabInfo.id)}
          >
            <div className="table-card-top">
              <Database size={16} className="table-icon" />
              <span className="table-row-count">
                {dbInspectorData?.tableCounts?.[tabInfo.id] ?? 0} registros
              </span>
            </div>
            <strong className="table-name-code">{tabInfo.name}</strong>
            <div className="table-label-text">{tabInfo.label}</div>
            <div className="table-desc-text">{tabInfo.desc}</div>
          </div>
        ))}
      </div>

      {/* Visor de Filas / Data Viewer */}
      <div className="db-data-viewer">
        <div className="viewer-header">
          <div>
            <span className="viewer-eyebrow">CONSULTA SQL EN TIEMPO REAL</span>
            <h3>Tabla: <code>{selectedDbTable}</code> ({dbInspectorData?.tableData?.length || 0} filas devueltas)</h3>
          </div>
          <div className="viewer-query-pill">
            <code>SELECT * FROM {selectedDbTable} LIMIT 50;</code>
          </div>
        </div>

        {dbLoading ? (
          <div className="db-loading-box">
            <RefreshCw size={24} className="spin" />
            <p>Consultando registros en PostgreSQL...</p>
          </div>
        ) : !dbInspectorData?.tableData || dbInspectorData.tableData.length === 0 ? (
          <div className="empty-state">
            <Database size={36} className="empty-icon" />
            <h4>No hay registros en la tabla {selectedDbTable}</h4>
            <p>Los datos aparecerán aquí tan pronto se inserten o puedes restablecer el catálogo.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table db-sql-table">
              <thead>
                <tr>
                  {dbInspectorData.tableColumns?.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dbInspectorData.tableData.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {dbInspectorData.tableColumns?.map(col => {
                      const val = row[col];
                      const isJson = typeof val === 'object' && val !== null;
                      return (
                        <td key={col} className="sql-cell">
                          {col === 'role' ? (
                            <span className={`role-badge role-${String(val || '').toLowerCase()}`}>
                              {val === 'SUPERADMIN' ? 'SUPERADMIN' : val === 'ADMIN' ? 'ADMIN' : 'CLIENTE'}
                            </span>
                          ) : isJson ? (
                            <span className="json-cell" title={JSON.stringify(val)}>
                              {JSON.stringify(val).slice(0, 45)}...
                            </span>
                          ) : typeof val === 'boolean' ? (
                            <span className={`status-pill ${val ? 'active' : 'inactive'}`}>
                              {val ? 'TRUE' : 'FALSE'}
                            </span>
                          ) : (
                            String(val ?? '')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bloque Explicativo para el Dueño del Negocio */}
      <div className="db-value-explainer">
        <h3>¿Por qué PostgreSQL le da tranquilidad y valor a tu tienda?</h3>
        <div className="explainer-grid">
          <div className="explainer-card">
            <div className="explainer-num">01</div>
            <h4>Persistencia Real</h4>
            <p>Tus pedidos, clientes y catálogo nunca se borran si reinicias tu equipo o apagas el navegador. Todo queda escrito en disco seguro.</p>
          </div>

          <div className="explainer-card">
            <div className="explainer-num">02</div>
            <h4>Garantía de Pagos ACID</h4>
            <p>Cumple con el estándar bancario mundial (ACID): si una compra se procesa en Wompi, el stock y el pedido se actualizan sin riesgo de duplicados.</p>
          </div>

          <div className="explainer-card">
            <div className="explainer-num">03</div>
            <h4>Fácil Migración a la Nube</h4>
            <p>Cuando decidas llevar la tienda a producción, este mismo esquema se traslada con 1 clic a proveedores como Neon, AWS RDS o Supabase sin cambiar código.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
