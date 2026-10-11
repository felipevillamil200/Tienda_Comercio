'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Eye, 
  BarChart3, 
  ShoppingBag, 
  Trophy, 
  Zap, 
  TrendingUp, 
  ExternalLink, 
  Copy, 
  Package, 
  Activity 
} from 'lucide-react';
import { Order, Product } from '@/types';

export interface AnalyticsData {
  totalRevenue: number;
  approvedOrdersCount: number;
  pendingOrdersCount: number;
  avgTicket: number;
  approvalRate: number;
  lowStockProducts: Product[];
  categorySales: Record<string, { units: number; revenue: number }>;
  categoryViews: Record<string, number>;
  productSalesList: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
    unitsSold: number;
    revenueCOP: number;
    stock: number;
    price: number;
  }>;
  productViewsList: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
    views: number;
    unitsSold: number;
    revenueCOP: number;
    conversionRate: string;
    stock: number;
    price: number;
  }>;
  topSellingProduct: {
    id: string;
    name: string;
    category: string;
    image: string;
    unitsSold: number;
    revenueCOP: number;
    stock: number;
    price: number;
  } | null;
  topViewedProduct: {
    id: string;
    name: string;
    category: string;
    image: string;
    views: number;
    unitsSold: number;
    revenueCOP: number;
    conversionRate: string;
    stock: number;
    price: number;
  } | null;
  totalSoldUnits: number;
  totalViews: number;
  customers: Array<{
    name: string;
    email: string;
    phone: string;
    city: string;
    ordersCount: number;
    totalSpent: number;
    lastOrder: string;
  }>;
}

interface AnalyticsTabProps {
  analytics: AnalyticsData;
  products: Product[];
  orders: Order[];
  analyticsViewMode: 'all' | 'sales' | 'views';
  setAnalyticsViewMode: (mode: 'all' | 'sales' | 'views') => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AnalyticsTab({
  analytics,
  products,
  orders,
  analyticsViewMode,
  setAnalyticsViewMode,
  showToast
}: AnalyticsTabProps) {
  return (
    <section className="tab-pane">
      {/* KPI Cards Overview */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi-card highlight">
          <div className="kpi-label">Ventas Aprobadas</div>
          <div className="kpi-value">${analytics.totalRevenue.toLocaleString('es-CO')} <span className="kpi-currency">COP</span></div>
          <div className="kpi-sub">{analytics.approvedOrdersCount} transacciones liquidadas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Ticket Promedio</div>
          <div className="kpi-value">${Math.round(analytics.avgTicket).toLocaleString('es-CO')} <span className="kpi-currency">COP</span></div>
          <div className="kpi-sub">Por orden aprobada</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '3px solid #38bdf8' }}>
          <div className="kpi-label" style={{ color: '#38bdf8' }}>Tráfico del Catálogo</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>{analytics.totalViews} <span className="kpi-currency" style={{ color: '#94a3b8' }}>vistas</span></div>
          <div className="kpi-sub">{products.length} prendas monitoreadas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Pendientes de Pago</div>
          <div className="kpi-value">{analytics.pendingOrdersCount}</div>
          <div className="kpi-sub">{orders.length} órdenes registradas</div>
        </div>

        <div className="kpi-card alert">
          <div className="kpi-label">Alertas Stock Crítico</div>
          <div className="kpi-value">{analytics.lowStockProducts.length}</div>
          <div className="kpi-sub">{analytics.lowStockProducts.length > 0 ? '≤ 5 unidades disponibles' : 'Inventario óptimo'}</div>
        </div>
      </div>

      {/* HERO DESTACADOS: TOP #1 VENTAS VS TOP #1 VISTAS */}
      <div className="analytics-hero-grid">
        {/* Card 1: Más Vendido */}
        <div className="hero-kpi-card sales">
          <div className="hero-kpi-badge sales">
            <Flame size={14} />
            <span>#1 PRENDA MÁS VENDIDA</span>
          </div>

          {analytics.topSellingProduct && analytics.topSellingProduct.unitsSold > 0 ? (
            <div className="hero-kpi-content">
              <div className="hero-kpi-img-wrap">
                {analytics.topSellingProduct.image ? (
                  <img src={analytics.topSellingProduct.image} alt={analytics.topSellingProduct.name} className="hero-kpi-img" />
                ) : (
                  <div className="hero-kpi-img-fallback"><Package size={28} /></div>
                )}
              </div>
              <div className="hero-kpi-details">
                <span className="hero-kpi-cat">{analytics.topSellingProduct.category}</span>
                <h4 className="hero-kpi-title">{analytics.topSellingProduct.name}</h4>
                
                <div className="hero-kpi-stats">
                  <div className="hero-stat-block">
                    <span className="stat-label">Unidades Vendidas</span>
                    <strong className="stat-val sales">{analytics.topSellingProduct.unitsSold} uds.</strong>
                  </div>
                  <div className="hero-stat-block">
                    <span className="stat-label">Facturado COP</span>
                    <strong className="stat-val">${(analytics.topSellingProduct.revenueCOP || 0).toLocaleString('es-CO')}</strong>
                  </div>
                  <div className="hero-stat-block">
                    <span className="stat-label">Stock Restante</span>
                    <strong className="stat-val">{analytics.topSellingProduct.stock} uds.</strong>
                  </div>
                </div>

                <div className="hero-kpi-actions">
                  <Link 
                    href={`/producto/${encodeURIComponent(analytics.topSellingProduct.id)}`} 
                    target="_blank"
                    className="hero-action-link"
                  >
                    <span>Ver en Tienda</span>
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/producto/${analytics.topSellingProduct?.id}`;
                      navigator.clipboard.writeText(url);
                      showToast('✓ Link copiado al portapapeles');
                    }}
                    className="hero-action-btn"
                    title="Copiar link"
                  >
                    <Copy size={13} />
                    <span>Copiar URL</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-hero">
              <ShoppingBag size={32} style={{ opacity: 0.4, margin: '0 auto 10px' }} />
              <p>Aún no hay prendas con ventas aprobadas liquidadas.</p>
            </div>
          )}
        </div>

        {/* Card 2: Más Visto */}
        <div className="hero-kpi-card views">
          <div className="hero-kpi-badge views">
            <Eye size={14} />
            <span>#1 PRENDA MÁS VISTA & POPULAR</span>
          </div>

          {analytics.topViewedProduct ? (
            <div className="hero-kpi-content">
              <div className="hero-kpi-img-wrap">
                {analytics.topViewedProduct.image ? (
                  <img src={analytics.topViewedProduct.image} alt={analytics.topViewedProduct.name} className="hero-kpi-img" />
                ) : (
                  <div className="hero-kpi-img-fallback"><Package size={28} /></div>
                )}
              </div>
              <div className="hero-kpi-details">
                <span className="hero-kpi-cat">{analytics.topViewedProduct.category}</span>
                <h4 className="hero-kpi-title">{analytics.topViewedProduct.name}</h4>
                
                <div className="hero-kpi-stats">
                  <div className="hero-stat-block">
                    <span className="stat-label">Visualizaciones</span>
                    <strong className="stat-val views">{analytics.topViewedProduct.views} vistas</strong>
                  </div>
                  <div className="hero-stat-block">
                    <span className="stat-label">Tasa Conversión</span>
                    <strong className="stat-val">{analytics.topViewedProduct.conversionRate}%</strong>
                  </div>
                  <div className="hero-stat-block">
                    <span className="stat-label">Precio Unitario</span>
                    <strong className="stat-val">${(analytics.topViewedProduct.price || 0).toLocaleString('es-CO')}</strong>
                  </div>
                </div>

                <div className="hero-kpi-actions">
                  <Link 
                    href={`/producto/${encodeURIComponent(analytics.topViewedProduct.id)}`} 
                    target="_blank"
                    className="hero-action-link views"
                  >
                    <span>Ver en Tienda</span>
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/producto/${analytics.topViewedProduct?.id}`;
                      navigator.clipboard.writeText(url);
                      showToast('✓ Link copiado al portapapeles');
                    }}
                    className="hero-action-btn"
                    title="Copiar link"
                  >
                    <Copy size={13} />
                    <span>Copiar URL</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-hero">
              <Eye size={32} style={{ opacity: 0.4, margin: '0 auto 10px' }} />
              <p>Sin datos de visitas registradas en el catálogo.</p>
            </div>
          )}
        </div>
      </div>

      {/* SUB-NAV SELECTOR DE MÉTRICAS */}
      <div className="analytics-subnav-bar">
        <div className="subnav-title">
          <BarChart3 size={17} style={{ color: '#bd4a2c' }} />
          <span>Desglose Detallado de Rendimiento:</span>
        </div>
        <div className="subnav-buttons">
          <button 
            className={`btn-subnav ${analyticsViewMode === 'all' ? 'active' : ''}`}
            onClick={() => setAnalyticsViewMode('all')}
          >
            <BarChart3 size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-1px' }} />
            <span>Comparativa 360° (Ventas & Vistas)</span>
          </button>
          <button 
            className={`btn-subnav sales ${analyticsViewMode === 'sales' ? 'active' : ''}`}
            onClick={() => setAnalyticsViewMode('sales')}
          >
            <ShoppingBag size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-1px' }} />
            <span>Solo Rendimiento de Ventas ({analytics.totalSoldUnits} uds)</span>
          </button>
          <button 
            className={`btn-subnav views ${analyticsViewMode === 'views' ? 'active' : ''}`}
            onClick={() => setAnalyticsViewMode('views')}
          >
            <Eye size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-1px' }} />
            <span>Solo Rendimiento de Vistas ({analytics.totalViews} visitas)</span>
          </button>
        </div>
      </div>

      <div className="analytics-grid-flexible">
        {/* SECCIÓN 1: RENDIMIENTO DE VENTAS */}
        {(analyticsViewMode === 'all' || analyticsViewMode === 'sales') && (
          <div className="analytics-box large">
            <div className="box-header-row">
              <div>
                <div className="box-tag sales">
                  <Flame size={13} />
                  <span>SECCIÓN VENTAS</span>
                </div>
                <h3>Rendimiento de Ventas del Catálogo</h3>
                <p className="box-sub">Artículos vendidos en transacciones aprobadas y facturación real en COP</p>
              </div>
              <div className="box-header-stat">
                <span className="stat-sub">Total Unidades:</span>
                <strong>{analytics.totalSoldUnits} uds.</strong>
              </div>
            </div>

            {/* Barras de ventas por Categoría */}
            <h4 className="section-subtitle">Ventas por Categoría</h4>
            <div className="category-bars">
              {Object.keys(analytics.categorySales).length === 0 ? (
                <div className="empty-sub">Aún no hay ventas registradas para graficar por categoría.</div>
              ) : (
                Object.entries(analytics.categorySales).map(([cat, data]) => {
                  const maxUnits = Math.max(...Object.values(analytics.categorySales).map(d => d.units), 1);
                  const pct = Math.round((data.units / maxUnits) * 100);
                  return (
                    <div key={cat} className="bar-item">
                      <div className="bar-info">
                        <span className="bar-label">{cat}</span>
                        <div className="bar-values">
                          <span className="bar-revenue">${data.revenue.toLocaleString('es-CO')} COP</span>
                          <strong className="bar-units sales">{data.units} uds.</strong>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill sales" style={{ width: `${Math.max(8, pct)}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tabla de ventas por Prenda */}
            <h4 className="section-subtitle" style={{ marginTop: '28px' }}>Ranking de Prendas por Ventas</h4>
            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Prenda</th>
                    <th>Categoría</th>
                    <th>Unidades Vendidas</th>
                    <th>Total Facturado</th>
                    <th>Stock Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.productSalesList.map((prod, idx) => {
                    const isTop = idx === 0 && prod.unitsSold > 0;
                    return (
                      <tr key={prod.id} className={isTop ? 'highlight-row sales' : ''}>
                        <td className="cell-rank">
                          {isTop ? (
                            <span className="rank-badge top-sales">
                              <Trophy size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />
                              1
                            </span>
                          ) : (
                            `#${idx + 1}`
                          )}
                        </td>
                        <td>
                          <div className="table-prod-info">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="table-prod-img" />
                            ) : (
                              <div className="table-prod-fallback"><Package size={16} /></div>
                            )}
                            <div>
                              <strong className="table-prod-name">{prod.name}</strong>
                              <span className="table-prod-id">{prod.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="table-cat-pill">{prod.category}</span>
                        </td>
                        <td>
                          <span className={`uds-badge ${prod.unitsSold > 0 ? 'active' : 'zero'}`}>
                            {prod.unitsSold} uds.
                          </span>
                        </td>
                        <td>
                          <strong className="revenue-val">
                            ${prod.revenueCOP.toLocaleString('es-CO')} <span className="curr">COP</span>
                          </strong>
                        </td>
                        <td>
                          <span className={`stock-badge ${prod.stock <= 5 ? 'critical' : 'normal'}`}>
                            {prod.stock} uds.
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: RENDIMIENTO DE VISTAS & TRÁFICO */}
        {(analyticsViewMode === 'all' || analyticsViewMode === 'views') && (
          <div className="analytics-box large">
            <div className="box-header-row">
              <div>
                <div className="box-tag views">
                  <Eye size={13} />
                  <span>SECCIÓN VISTAS & TRÁFICO</span>
                </div>
                <h3>Rendimiento de Vistas & Interés del Catálogo</h3>
                <p className="box-sub">Monitoreo de tráfico en páginas de producto y tasa de conversión</p>
              </div>
              <div className="box-header-stat views">
                <span className="stat-sub">Total Visualizaciones:</span>
                <strong>{analytics.totalViews} vistas</strong>
              </div>
            </div>

            {/* Barras de vistas por Categoría */}
            <h4 className="section-subtitle">Visualizaciones por Categoría</h4>
            <div className="category-bars">
              {Object.keys(analytics.categoryViews).length === 0 ? (
                <div className="empty-sub">Sin visualizaciones registradas aún.</div>
              ) : (
                Object.entries(analytics.categoryViews).map(([cat, viewsCount]) => {
                  const maxViews = Math.max(...Object.values(analytics.categoryViews), 1);
                  const pct = Math.round((viewsCount / maxViews) * 100);
                  return (
                    <div key={cat} className="bar-item">
                      <div className="bar-info">
                        <span className="bar-label">{cat}</span>
                        <div className="bar-values">
                          <strong className="bar-units views">{viewsCount} vistas</strong>
                        </div>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill views" style={{ width: `${Math.max(8, pct)}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Tabla de vistas por Prenda */}
            <h4 className="section-subtitle" style={{ marginTop: '28px' }}>Ranking de Prendas por Visitas & Interés</h4>
            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Prenda</th>
                    <th>Categoría</th>
                    <th>Vistas Registradas</th>
                    <th>Tasa Conversión</th>
                    <th>Nivel de Interés</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.productViewsList.map((prod, idx) => {
                    const isTop = idx === 0 && prod.views > 0;
                    return (
                      <tr key={prod.id} className={isTop ? 'highlight-row views' : ''}>
                        <td className="cell-rank">
                          {isTop ? (
                            <span className="rank-badge top-views">
                              <Eye size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />
                              1
                            </span>
                          ) : (
                            `#${idx + 1}`
                          )}
                        </td>
                        <td>
                          <div className="table-prod-info">
                            {prod.image ? (
                              <img src={prod.image} alt={prod.name} className="table-prod-img" />
                            ) : (
                              <div className="table-prod-fallback"><Package size={16} /></div>
                            )}
                            <div>
                              <strong className="table-prod-name">{prod.name}</strong>
                              <span className="table-prod-id">{prod.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="table-cat-pill">{prod.category}</span>
                        </td>
                        <td>
                          <span className="views-badge">
                            <Eye size={12} style={{ marginRight: '4px' }} />
                            {prod.views} vistas
                          </span>
                        </td>
                        <td>
                          <div className="conversion-wrap">
                            <strong className="conv-pct">{prod.conversionRate}%</strong>
                            <span className="conv-sub">{prod.unitsSold} compras</span>
                          </div>
                        </td>
                        <td>
                          {prod.views > 120 ? (
                            <span className="interest-pill high">
                              <Flame size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />
                              Muy Alto
                            </span>
                          ) : prod.views > 60 ? (
                            <span className="interest-pill medium">
                              <Zap size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />
                              Alto
                            </span>
                          ) : (
                            <span className="interest-pill normal">
                              <TrendingUp size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} />
                              Moderado
                            </span>
                          )}
                        </td>
                        <td>
                          <Link 
                            href={`/producto/${encodeURIComponent(prod.id)}`} 
                            target="_blank"
                            className="table-link-btn"
                            title="Ver en tienda"
                          >
                            <span>Ver</span>
                            <ExternalLink size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: EMBUDO DE CONVERSIÓN WOMPI */}
        <div className="analytics-box side-box">
          <div className="box-header-row">
            <div>
              <div className="box-tag neutral">
                <Activity size={13} />
                <span>PASARELA WOMPI</span>
              </div>
              <h3>Embudo de Conversión</h3>
              <p className="box-sub">Tasa de éxito en el checkout de la tienda</p>
            </div>
          </div>

          <div className="funnel-stats">
            <div className="funnel-item">
              <div className="funnel-label">Total Intentos</div>
              <div className="funnel-val">{orders.length}</div>
            </div>
            <div className="funnel-item success">
              <div className="funnel-label">Aprobados</div>
              <div className="funnel-val">{analytics.approvedOrdersCount}</div>
            </div>
            <div className="funnel-item pending">
              <div className="funnel-label">Pendientes / En Proceso</div>
              <div className="funnel-val">{analytics.pendingOrdersCount}</div>
            </div>
          </div>

          <div className="rate-circle-wrap">
            <div className="rate-num">{analytics.approvalRate}%</div>
            <div className="rate-text">Tasa de Efectividad en Pagos</div>
          </div>

          <div className="wompi-summary-box">
            <div className="wompi-stat-line">
              <span>Ticket promedio:</span>
              <strong>${Math.round(analytics.avgTicket).toLocaleString('es-CO')} COP</strong>
            </div>
            <div className="wompi-stat-line">
              <span>Facturación total liquidada:</span>
              <strong style={{ color: '#4ade80' }}>${analytics.totalRevenue.toLocaleString('es-CO')} COP</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
