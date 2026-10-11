'use client';

import React from 'react';
import { Search, FileSpreadsheet, Package, Sparkles, Truck, Trash2, MapPin } from 'lucide-react';
import { Order } from '@/types';

interface OrdersTabProps {
  orders: Order[];
  filteredOrders: Order[];
  orderSearch: string;
  setOrderSearch: (val: string) => void;
  orderPaymentFilter: string;
  setOrderPaymentFilter: (val: string) => void;
  orderDeliveryFilter: string;
  setOrderDeliveryFilter: (val: string) => void;
  exportOrdersCSV: () => void;
  setIsSeedDemoModalOpen: (val: boolean) => void;
  openOrderDetail: (order: Order) => void;
  requestReturnConfirmation: (order: Order) => void;
  handleUpdateDelivery: (reference: string, deliveryStatus: string, trackingNumber?: string) => void;
  handleDeleteDemoOrder: (order: Order) => void;
  actionLoading: boolean;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function OrdersTab({
  orders,
  filteredOrders,
  orderSearch,
  setOrderSearch,
  orderPaymentFilter,
  setOrderPaymentFilter,
  orderDeliveryFilter,
  setOrderDeliveryFilter,
  exportOrdersCSV,
  setIsSeedDemoModalOpen,
  openOrderDetail,
  requestReturnConfirmation,
  handleUpdateDelivery,
  handleDeleteDemoOrder,
  actionLoading,
  showToast
}: OrdersTabProps) {
  return (
    <section className="tab-pane">
      <div className="pane-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Buscar orden, cliente, ciudad o referencia..." 
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={orderPaymentFilter} onChange={e => setOrderPaymentFilter(e.target.value)}>
            <option value="">Estado Wompi: Todos</option>
            <option value="APPROVED">Aprobados</option>
            <option value="PENDING">Pendientes</option>
            <option value="DECLINED">Rechazados</option>
            <option value="ERROR">Error</option>
          </select>

          <select value={orderDeliveryFilter} onChange={e => setOrderDeliveryFilter(e.target.value)}>
            <option value="">Despacho: Todos</option>
            <option value="CREADO">Creado</option>
            <option value="EN_PREPARACION">En Preparación</option>
            <option value="DESPACHADO">Despachado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="DEVUELTO">Devuelto (Devolución)</option>
          </select>

          <button className="btn-action-ghost" onClick={exportOrdersCSV}>
            <FileSpreadsheet size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <Package size={40} className="empty-icon" />
          <h3>No se encontraron pedidos</h3>
          <p>No hay órdenes registradas o ninguna coincide con los filtros aplicados.</p>
          {orders.length === 0 && (
            <button className="btn-primary" onClick={() => setIsSeedDemoModalOpen(true)} style={{ marginTop: '16px' }}>
              <Sparkles size={15} />
              <span>Cargar Pedidos de Ejemplo</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 1. VISTA ESCRITORIO (TABLA EXTENDIDA) */}
          <div className="table-responsive admin-desktop-table">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Ubicación</th>
                  <th>Total</th>
                  <th>Pago Wompi</th>
                  <th>Despacho</th>
                  <th>Guía</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const isOrderDemo = Boolean(
                    (order.id && order.id.startsWith('ord-demo-')) ||
                    (order.accessToken && order.accessToken.startsWith('tok_demo_')) ||
                    ['juan.cliente@gmail.com', 'mateo.silva@gmail.com', 'valeria.gomez@hotmail.com', 'caicedo.carlos@outlook.com', 'laura.mendoza@empresa.co'].includes((order.customerEmail || '').toLowerCase().trim()) ||
                    (order.reference && (order.reference.includes('M8A2') || order.reference.includes('M9K3') || order.reference.includes('M9Z1') || order.reference.includes('M7X9')))
                  );

                  return (
                    <tr key={order.id || order.reference}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong className="order-code">{order.orderNumber}</strong>
                          {isOrderDemo && (
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
                        <div className="order-ref">{order.reference}</div>
                      </td>
                      <td>
                        <div className="cell-date">{new Date(order.createdAt).toLocaleDateString('es-CO')}</div>
                        <div className="cell-time">{new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td>
                        <div className="cell-name">{order.customerName}</div>
                        <div className="cell-email">{order.customerEmail}</div>
                      </td>
                      <td>
                        <div className="cell-city">{order.city}</div>
                        <div className="cell-address" title={order.shippingAddress}>{order.shippingAddress}</div>
                      </td>
                      <td>
                        <strong className="cell-price">${(order.total || 0).toLocaleString('es-CO')} COP</strong>
                        <div className="cell-items-count">{(order.items || []).length} artículo(s)</div>
                      </td>
                      <td>
                        <span className={`status-badge payment-${(order.status || 'PENDING').toLowerCase()}`}>
                          {order.status === 'APPROVED' ? 'Aprobado' : order.status === 'PENDING' ? 'Pendiente' : order.status}
                        </span>
                      </td>
                      <td>
                        {(() => {
                          const hasTracking = !!(order.trackingNumber && order.trackingNumber.trim().length > 0);
                          const isPastCreated = hasTracking || (order.deliveryStatus && order.deliveryStatus !== 'CREADO');
                          return (
                            <select 
                              className={`select-delivery delivery-${(order.deliveryStatus || 'CREADO').toLowerCase()}`}
                              value={order.deliveryStatus || 'CREADO'}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (newStatus === 'DEVUELTO') {
                                  requestReturnConfirmation(order);
                                  return;
                                }
                                if (newStatus === 'CREADO' && isPastCreated) {
                                  showToast('No se puede regresar al estado "Creado" una orden que ya tiene guía o está en proceso', 'error');
                                  return;
                                }
                                if (['DESPACHADO', 'ENTREGADO'].includes(newStatus) && !hasTracking) {
                                  showToast('Asigna primero la guía de envío en "Ver Detalle" antes de despachar este pedido', 'error');
                                  openOrderDetail(order);
                                  return;
                                }
                                handleUpdateDelivery(order.reference, newStatus, order.trackingNumber);
                              }}
                            >
                              <option value="CREADO" disabled={isPastCreated}>
                                {isPastCreated ? 'Bloqueado: Creado (En Proceso)' : 'Creado'}
                              </option>
                              <option value="EN_PREPARACION">En Preparación</option>
                              <option value="DESPACHADO" disabled={!hasTracking}>
                                {hasTracking ? 'Despachado' : 'Bloqueado: Despachado (Falta Guía)'}
                              </option>
                              <option value="ENTREGADO" disabled={!hasTracking}>
                                {hasTracking ? 'Entregado' : 'Bloqueado: Entregado (Falta Guía)'}
                              </option>
                              <option value="DEVUELTO">Devuelto (Devolución)</option>
                            </select>
                          );
                        })()}
                      </td>
                      <td>
                        {order.trackingNumber && order.trackingNumber.trim().length > 0 ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'rgba(74, 222, 128, 0.08)',
                            border: '1px solid rgba(74, 222, 128, 0.25)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: '#4ade80',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap'
                          }}>
                            <Truck size={12} />
                            <span>{order.trackingNumber}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#71717a', fontSize: '0.72rem', fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#71717a', display: 'inline-block' }}></span>
                            Sin Guía
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button className="btn-detail" onClick={() => openOrderDetail(order)}>
                            Ver Detalle
                          </button>
                          {isOrderDemo && (
                            <button 
                              className="btn-action-delete-demo"
                              onClick={() => handleDeleteDemoOrder(order)}
                              title="Eliminar pedido demo de prueba"
                              disabled={actionLoading}
                            >
                              <Trash2 size={13} />
                              <span>Eliminar Demo</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 2. VISTA MÓVIL EN TARJETAS COMPACTAS (BENTO CARDS) */}
          <div className="admin-orders-mobile-list">
            {filteredOrders.map(order => {
              const isOrderDemo = Boolean(
                (order.id && order.id.startsWith('ord-demo-')) ||
                (order.accessToken && order.accessToken.startsWith('tok_demo_')) ||
                ['juan.cliente@gmail.com', 'mateo.silva@gmail.com', 'valeria.gomez@hotmail.com', 'caicedo.carlos@outlook.com', 'laura.mendoza@empresa.co'].includes((order.customerEmail || '').toLowerCase().trim()) ||
                (order.reference && (order.reference.includes('M8A2') || order.reference.includes('M9K3') || order.reference.includes('M9Z1') || order.reference.includes('M7X9')))
              );
              const hasTracking = !!(order.trackingNumber && order.trackingNumber.trim().length > 0);
              const isPastCreated = hasTracking || (order.deliveryStatus && order.deliveryStatus !== 'CREADO');

              return (
                <div key={order.id || order.reference} className="admin-order-mobile-card">
                  <div className="order-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong className="order-code">{order.orderNumber}</strong>
                      {isOrderDemo && (
                        <span className="badge-demo">DEMO</span>
                      )}
                    </div>
                    <span className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString('es-CO')} • {new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-card-customer">
                      <span className="customer-name">{order.customerName}</span>
                      <span className="customer-email">{order.customerEmail}</span>
                      <span className="customer-location">
                        <MapPin size={11} color="#ff5500" style={{ flexShrink: 0 }} />
                        <span>{order.city}</span>
                      </span>
                    </div>
                    <div className="order-card-total">
                      <strong className="cell-price">${(order.total || 0).toLocaleString('es-CO')} COP</strong>
                      <span className="cell-items-count">{(order.items || []).length} artículo(s)</span>
                    </div>
                  </div>

                  <div className="order-card-status-bar">
                    <span className={`status-badge payment-${(order.status || 'PENDING').toLowerCase()}`}>
                      {order.status === 'APPROVED' ? 'Aprobado' : order.status === 'PENDING' ? 'Pendiente' : order.status}
                    </span>

                    <select 
                      className={`select-delivery delivery-${(order.deliveryStatus || 'CREADO').toLowerCase()}`}
                      value={order.deliveryStatus || 'CREADO'}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus === 'DEVUELTO') {
                          requestReturnConfirmation(order);
                          return;
                        }
                        if (newStatus === 'CREADO' && isPastCreated) {
                          showToast('No se puede regresar al estado "Creado" una orden que ya tiene guía o está en proceso', 'error');
                          return;
                        }
                        if (['DESPACHADO', 'ENTREGADO'].includes(newStatus) && !hasTracking) {
                          showToast('Asigna primero la guía de envío en "Ver Detalle" antes de despachar este pedido', 'error');
                          openOrderDetail(order);
                          return;
                        }
                        handleUpdateDelivery(order.reference, newStatus, order.trackingNumber);
                      }}
                    >
                      <option value="CREADO" disabled={isPastCreated}>
                        {isPastCreated ? 'Creado (En Proceso)' : 'Creado'}
                      </option>
                      <option value="EN_PREPARACION">En Preparación</option>
                      <option value="DESPACHADO" disabled={!hasTracking}>
                        {hasTracking ? 'Despachado' : 'Falta Guía'}
                      </option>
                      <option value="ENTREGADO" disabled={!hasTracking}>
                        {hasTracking ? 'Entregado' : 'Falta Guía'}
                      </option>
                      <option value="DEVUELTO">Devuelto (Devolución)</option>
                    </select>
                  </div>

                  <div className="order-card-footer">
                    {hasTracking ? (
                      <div className="tracking-pill">
                        <Truck size={12} />
                        <span>{order.trackingNumber}</span>
                      </div>
                    ) : (
                      <span className="no-tracking-pill">Sin Guía</span>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-detail" onClick={() => openOrderDetail(order)}>
                        Ver Detalle
                      </button>
                      {isOrderDemo && (
                        <button 
                          className="btn-action-delete-demo"
                          onClick={() => handleDeleteDemoOrder(order)}
                          title="Eliminar pedido demo"
                          disabled={actionLoading}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
