'use client';

import React from 'react';
import { Edit3 } from 'lucide-react';
import { Product } from '@/types';

interface InventoryTabProps {
  products: Product[];
  handleAdjustStock: (id: string, delta: number) => void;
  setEditingProduct: (p: Product | null) => void;
  setIsNewProductModalOpen: (val: boolean) => void;
}

export default function InventoryTab({
  products,
  handleAdjustStock,
  setEditingProduct,
  setIsNewProductModalOpen
}: InventoryTabProps) {
  return (
    <section className="tab-pane">
      <div className="pane-header-box">
        <div>
          <h2>Control Rápido de Stock</h2>
          <p>Monitorea y ajusta las existencias en bodega en tiempo real.</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Prenda & Colores</th>
              <th>Categoría</th>
              <th>Precio Unitario</th>
              <th>Nivel de Stock</th>
              <th>Estado</th>
              <th>Ajuste de Stock</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const displayImage = p.availableColors?.[0]?.image || p.image;
              return (
                <tr key={p.id}>
                  <td>
                    <div className="inventory-product-cell">
                      <img 
                        src={displayImage} 
                        alt={p.name} 
                        className="mini-thumb" 
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ color: '#fff', fontSize: '13px' }}>{p.name}</strong>
                        <div className="mini-sub">{p.subtitle}</div>
                        {p.availableColors && p.availableColors.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {p.availableColors.map(c => (
                              <span 
                                key={c.name}
                                title={c.name}
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: c.hex,
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  display: 'inline-block'
                                }}
                              />
                            ))}
                            <span style={{ fontSize: '10px', color: '#8e8e93', marginLeft: '4px' }}>
                              {p.availableColors.length} colores
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#e5e5ea', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <strong className="cell-price" style={{ color: '#fff', fontSize: '13px' }}>
                      ${(p.price || 0).toLocaleString('es-CO')} <span style={{ fontSize: '10px', color: '#8e8e93' }}>COP</span>
                    </strong>
                  </td>
                  <td>
                    <div className="stock-level-wrap">
                      <strong style={{ color: p.stock <= 5 ? '#f87171' : '#fff' }}>{p.stock ?? 0} unidades</strong>
                      <div className="stock-bar-bg">
                        <div 
                          className={`stock-bar-fill ${p.stock <= 5 ? 'critical' : p.stock <= 15 ? 'warning' : 'ok'}`}
                          style={{ width: `${Math.min(100, ((p.stock || 0) / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    {(p.stock || 0) <= 0 ? (
                      <span className="stock-status-pill out">Agotado</span>
                    ) : (p.stock || 0) <= 5 ? (
                      <span className="stock-status-pill low">Stock Crítico</span>
                    ) : (
                      <span className="stock-status-pill ok">Disponible</span>
                    )}
                  </td>
                  <td>
                    <div className="stock-quick-btns">
                      <button className="btn-qty" onClick={() => handleAdjustStock(p.id, -1)} title="Restar 1">-1</button>
                      <button className="btn-qty" onClick={() => handleAdjustStock(p.id, 1)} title="Sumar 1">+1</button>
                      <button className="btn-qty highlight" onClick={() => handleAdjustStock(p.id, 5)} title="Sumar 5">+5</button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-card-action edit"
                      onClick={() => { setEditingProduct(p); setIsNewProductModalOpen(true); }}
                      style={{ padding: '6px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                    >
                      <Edit3 size={13} />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
