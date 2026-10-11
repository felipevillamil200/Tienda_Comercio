'use client';

import React from 'react';
import { Search, RefreshCw, Users, Phone, MapPin, Eye, Trash2 } from 'lucide-react';

interface CustomersTabProps {
  filteredCustomers: any[];
  customerSearch: string;
  setCustomerSearch: (val: string) => void;
  loadAllData: () => void;
  loading: boolean;
  setSelectedCustomer: (c: any) => void;
  handleDeleteDemoCustomer: (c: any) => void;
  actionLoading: boolean;
}

export default function CustomersTab({
  filteredCustomers,
  customerSearch,
  setCustomerSearch,
  loadAllData,
  loading,
  setSelectedCustomer,
  handleDeleteDemoCustomer,
  actionLoading
}: CustomersTabProps) {
  return (
    <section className="tab-pane">
      <div className="pane-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Buscar cliente por nombre, email, teléfono o ciudad..." 
            value={customerSearch}
            onChange={e => setCustomerSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
            Total: <strong style={{ color: '#fff' }}>{filteredCustomers.length}</strong> cliente(s)
          </span>
          <button className="btn-action-ghost" onClick={loadAllData} title="Sincronizar">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Sincronizar PostgreSQL</span>
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <Users size={40} className="empty-icon" />
          <h3>No se encontraron clientes</h3>
          <p>No hay usuarios registrados que coincidan con la búsqueda actual.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Ubicación / Dirección</th>
                <th>Órdenes</th>
                <th>Total Comprado</th>
                <th>Registro / Actividad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.email || c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {c.avatar ? (
                        <img 
                          src={c.avatar} 
                          alt={c.name} 
                          style={{ 
                            width: '38px', 
                            height: '38px', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            border: '1.5px solid #ff5500',
                            flexShrink: 0,
                            boxShadow: '0 0 10px rgba(255, 85, 0, 0.25)'
                          }} 
                        />
                      ) : (
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #18181b, #27272a)',
                          border: '1.5px solid rgba(255,255,255,0.15)',
                          color: '#ff7733',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 0 8px rgba(255, 85, 0, 0.15)'
                        }}>
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{c.name}</strong>
                          <span className={`role-badge role-${(c.role || 'CLIENTE').toLowerCase()}`}>
                            {c.role || 'CLIENTE'}
                          </span>
                          {(c.isDemo || c.id?.startsWith('usr-client-') || c.email?.includes('juan.cliente') || c.email?.includes('mateo.silva') || c.email?.includes('valeria.gomez') || c.email?.includes('caicedo.carlos') || c.email?.includes('laura.mendoza')) && (
                            <span style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              padding: '1px 6px',
                              borderRadius: '6px',
                              letterSpacing: '0.04em'
                            }}>
                              DEMO
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                          ID: {c.id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: '#e4e4e7', fontSize: '0.85rem' }}>{c.email}</div>
                    <div className="mini-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Phone size={11} color="#ff7733" />
                      <span>{c.phone || 'Sin teléfono'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: '#e4e4e7', fontSize: '0.85rem' }}>
                      {c.city || 'Bogotá D.C.'}{c.department ? `, ${c.department}` : ''}
                    </div>
                    <div className="mini-sub" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }} title={c.address}>
                      <MapPin size={11} color="#a1a1aa" />
                      <span>{c.address ? (c.address.length > 25 ? c.address.slice(0, 25) + '...' : c.address) : 'Sin dirección'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-number">
                      {c.orders?.length || c.ordersCount || 0}
                    </span>
                  </td>
                  <td>
                    <strong className="cell-price">
                      ${Number(c.totalSpent || 0).toLocaleString('es-CO')} COP
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#e4e4e7' }}>
                      {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('es-CO') : (c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-CO') : 'Reciente')}
                    </div>
                    <div className="mini-sub">
                      {c.orders?.length > 0 ? `${c.orders.length} pedido(s)` : 'Sin compras'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="btn-action-view"
                        onClick={() => setSelectedCustomer(c)}
                        title="Ver Ficha 360° del Cliente"
                      >
                        <Eye size={14} />
                        <span>Ver Ficha</span>
                      </button>

                      {/* Botón de eliminación visible para clientes (protege superadmin/admin) */}
                      {c.role !== 'SUPERADMIN' && c.role !== 'ADMIN' && (
                        <button 
                          className="btn-action-delete-demo"
                          onClick={() => handleDeleteDemoCustomer(c)}
                          title="Eliminar cliente y sus registros asociados"
                          disabled={actionLoading}
                        >
                          <Trash2 size={13} />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
