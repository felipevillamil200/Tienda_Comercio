'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  Users, 
  Settings, 
  Database,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
  LogOut
} from 'lucide-react';

export type AdminTab = 'orders' | 'products' | 'inventory' | 'analytics' | 'customers' | 'settings' | 'database';

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
  customersCount: number;
  loading: boolean;
  actionLoading: boolean;
  onOpenSeedModal: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  onSelectDatabaseTab: () => void;
}

export default function AdminSidebar({
  currentTab,
  setCurrentTab,
  ordersCount,
  productsCount,
  lowStockCount,
  customersCount,
  loading,
  actionLoading,
  onOpenSeedModal,
  onRefresh,
  onLogout,
  onSelectDatabaseTab
}: AdminSidebarProps) {
  const handleTabClick = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (tab === 'database') {
      onSelectDatabaseTab();
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* Header de Marca / Portal */}
      <div className="admin-sidebar-header">
        <div className="admin-badge">
          <ShieldCheck size={13} />
          <span>PORTAL OPERACIONAL</span>
        </div>
        <h1 className="admin-title">NOCTIS URBANO</h1>
        <p className="admin-sidebar-subtitle">Panel de Control General</p>
      </div>

      {/* Ficha de Identidad del Administrador */}
      <div className="admin-user-card">
        <div className="admin-user-avatar">
          F
        </div>
        <div className="admin-user-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="admin-user-name">Felipe Villamil</span>
            <span className="admin-user-pill">ADMIN</span>
          </div>
          <span className="admin-user-email">admin@noctisurbano.com</span>
        </div>
      </div>

      {/* Menú Vertical de Navegación */}
      <nav className="admin-sidebar-nav">
        <button 
          className={`admin-nav-btn ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabClick('orders')}
        >
          <div className="admin-nav-btn-left">
            <Package size={17} />
            <span>Pedidos</span>
          </div>
          <span className="tab-pill">{ordersCount}</span>
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabClick('products')}
        >
          <div className="admin-nav-btn-left">
            <ShoppingBag size={17} />
            <span>Catálogo</span>
          </div>
          <span className="tab-pill">{productsCount}</span>
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'inventory' ? 'active' : ''}`}
          onClick={() => handleTabClick('inventory')}
        >
          <div className="admin-nav-btn-left">
            <Layers size={17} />
            <span>Inventario</span>
          </div>
          {lowStockCount > 0 && <span className="tab-pill alert">{lowStockCount}</span>}
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabClick('analytics')}
        >
          <div className="admin-nav-btn-left">
            <TrendingUp size={17} />
            <span>Métricas</span>
          </div>
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'customers' ? 'active' : ''}`}
          onClick={() => handleTabClick('customers')}
        >
          <div className="admin-nav-btn-left">
            <Users size={17} />
            <span>Clientes</span>
          </div>
          <span className="tab-pill">{customersCount}</span>
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          <div className="admin-nav-btn-left">
            <Settings size={17} />
            <span>Configuración Tienda</span>
          </div>
        </button>

        <button 
          className={`admin-nav-btn ${currentTab === 'database' ? 'active' : ''}`}
          onClick={() => handleTabClick('database')}
        >
          <div className="admin-nav-btn-left">
            <Database size={17} />
            <span>Base de Datos</span>
          </div>
          <span className="tab-pill" style={{ background: '#16a34a', color: '#ffffff', fontWeight: 700, fontSize: '9px' }}>DOCKER :5435</span>
        </button>
      </nav>

      {/* Acciones Rápidas y Cerrar Sesión al pie del Sidebar */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-actions-grid">
          <button 
            className="btn-action-ghost-mini" 
            onClick={onOpenSeedModal} 
            disabled={actionLoading}
            title="Cargar pedidos y clientes de prueba"
          >
            <Sparkles size={13} />
            <span>Demo Data</span>
          </button>

          <button className="btn-action-ghost-mini" onClick={onRefresh} title="Refrescar">
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refrescar</span>
          </button>

          <Link href="/" target="_blank" className="btn-action-ghost-mini" title="Ver Tienda">
            <ExternalLink size={13} />
            <span>Ver Tienda</span>
          </Link>
        </div>

        <button 
          className="btn-logout-side" 
          onClick={onLogout} 
          title="Cerrar Sesión"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
