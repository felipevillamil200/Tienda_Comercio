import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const { totalItems, setIsCartOpen, setIsTrackingOpen, setIsAiOpen, setIsAccountOpen, setIsCategoriesOpen } = useCart();
  const { lang, setLang, t } = useLanguage();

  const [clientUser, setClientUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = localStorage.getItem('noctis_client_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setClientUser(parsed);

          // Sincronizar avatar desde la BD si existe
          if (parsed.email) {
            try {
              const res = await fetch(`/api/client/profile?email=${encodeURIComponent(parsed.email)}`);
              const data = await res.json();
              if (data.success && data.user?.avatar && data.user.avatar !== parsed.avatar) {
                const updated = { ...parsed, avatar: data.user.avatar };
                setClientUser(updated);
                localStorage.setItem('noctis_client_user', JSON.stringify(updated));
              }
            } catch {
              // ignore
            }
          }
        } else {
          setClientUser(null);
        }
      } catch {
        // ignore
      }
    };

    loadUser();
    window.addEventListener('noctis-user-updated', loadUser);
    window.addEventListener('storage', loadUser);
    return () => {
      window.removeEventListener('noctis-user-updated', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('noctis_client_user');
      setClientUser(null);
      window.dispatchEvent(new Event('noctis-user-updated'));
    } catch {
      // ignore
    }
  };

  return (
    <header className="nav" aria-label="Navegación principal">
      <Link className="brand-mark" href="/" aria-label="Inicio NOCTIS URBANO">
        NOCTIS URBANO
      </Link>

      {/* 1. NAVEGACIÓN COMPLETA PARA ESCRITORIO (>= 980px) */}
      <nav className="nav-desktop-links" aria-label="Secciones de tienda">
        <button 
          className="cart-link" 
          type="button" 
          onClick={() => setIsCategoriesOpen(true)}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            letterSpacing: 'inherit',
            textTransform: 'uppercase',
            color: 'inherit',
            cursor: 'pointer'
          }}
          title={lang === 'EN' ? 'Shop & Categories' : 'Tienda & Categorías'}
        >
          <Menu size={14} style={{ color: '#ffffff' }} />
          {t('nav.shop')}
        </button>
        <a href="#collections">{t('nav.collections')}</a>
        <a href="#about">{t('nav.history')}</a>
        <a href="#contacto">{t('nav.contact')}</a>
        
        <button 
          className="cart-link" 
          type="button" 
          onClick={() => setIsCartOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={lang === 'EN' ? 'Shopping Cart' : 'Carrito de compras'}
        >
          <ShoppingCart size={14} style={{ color: '#ffffff' }} />
          <span>{t('nav.cart')}</span>
          <span className="cart-count">{totalItems}</span>
        </button>
        
        <button 
          className="cart-link" 
          type="button" 
          onClick={() => setIsTrackingOpen(true)}
        >
          {t('nav.track')}
        </button>
        
        <button 
          className="cart-link btn-noctis-ai" 
          type="button" 
          onClick={() => setIsAiOpen(true)}
        >
          {t('nav.ai')}
        </button>

        {/* Selector de Idiomas: ES / EN */}
        <div className="nav-lang-switcher" title="Seleccionar Idioma">
          <button 
            type="button" 
            className={`lang-option ${lang === 'ES' ? 'active' : ''}`}
            onClick={() => setLang('ES')}
          >
            ES
          </button>
          <span className="nav-divider">/</span>
          <button 
            type="button" 
            className={`lang-option ${lang === 'EN' ? 'active' : ''}`}
            onClick={() => setLang('EN')}
          >
            EN
          </button>
        </div>

        {/* Login | Registro */}
        {clientUser ? (
          <div className="nav-auth-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsAccountOpen(true)}
              className="nav-auth-profile-btn"
              title={lang === 'EN' ? 'My Account, Orders & Tracking' : 'Mi Cuenta, Datos y Compras'}
              style={{
                background: 'rgba(255, 85, 0, 0.08)',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                borderRadius: '20px',
                padding: '3px 10px 3px 4px',
                color: '#ff7733',
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#18181b',
                  border: '1.5px solid #ff5500',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.68rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {clientUser.avatar ? (
                  <img
                    src={clientUser.avatar}
                    alt={clientUser.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  clientUser.name ? clientUser.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span>{clientUser.name.split(' ')[0]}</span>
            </button>

            <span className="nav-divider">|</span>
            <button 
              type="button" 
              onClick={handleLogout}
              className="nav-auth-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title={lang === 'EN' ? 'Sign out' : 'Cerrar sesión'}
            >
              {lang === 'EN' ? 'EXIT' : 'SALIR'}
            </button>
          </div>
        ) : (
          <div className="nav-auth-links">
            <Link href="/sign-in" className="nav-auth-btn">
              {t('nav.login')}
            </Link>
            <span className="nav-divider">|</span>
            <Link href="/sign-up" className="nav-auth-btn">
              {t('nav.register')}
            </Link>
          </div>
        )}
      </nav>

      {/* 2. BARRA DE ACCIONES COMPACTA PARA MÓVIL (< 980px): AI -> Carrito -> Foto -> Hamburguesa */}
      <div className="nav-mobile-actions" aria-label="Acciones móviles">
        {/* 1. AI */}
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          className="mobile-nav-btn mobile-ai-btn"
          title="Asistente NOCTIS AI"
        >
          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ff5500' }}>AI</span>
        </button>

        {/* 2. CARRITO */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="mobile-nav-btn mobile-cart-btn"
          title="Carrito de compras"
        >
          <ShoppingCart size={18} style={{ color: '#ffffff' }} />
          {totalItems > 0 && (
            <span className="mobile-cart-badge">{totalItems}</span>
          )}
        </button>

        {/* 3. FOTO / LOGIN */}
        {clientUser ? (
          <button
            type="button"
            onClick={() => setIsAccountOpen(true)}
            className="mobile-nav-btn"
            title="Mi Cuenta"
            aria-label="Mi Cuenta"
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#18181b',
              border: '1.5px solid #ff5500',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.62rem',
              overflow: 'hidden'
            }}>
              {clientUser.avatar ? (
                <img src={clientUser.avatar} alt={clientUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                clientUser.name.charAt(0).toUpperCase()
              )}
            </div>
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="mobile-nav-btn"
            title="Iniciar Sesión"
            aria-label="Iniciar Sesión"
            style={{ textDecoration: 'none', color: '#ffffff' }}
          >
            <User size={17} />
          </Link>
        )}

        {/* 4. HAMBURGUESA */}
        <button
          type="button"
          onClick={() => setIsCategoriesOpen(true)}
          className="mobile-nav-btn mobile-menu-btn"
          title="Menú y Categorías"
        >
          <Menu size={20} style={{ color: '#ffffff' }} />
        </button>
      </div>



      <style jsx>{`
        .btn-noctis-ai {
          color: #bd4a2c !important;
          font-weight: 900;
          letter-spacing: 0.14em;
        }
        .btn-noctis-ai:hover {
          color: #ff5500 !important;
        }

        .nav-lang-switcher {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 10px;
          border-radius: 4px;
          margin-left: 6px;
        }
        .lang-option {
          background: transparent;
          border: none;
          color: #71717a;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          cursor: pointer;
          padding: 0 2px;
          transition: color 0.2s;
        }
        .lang-option:hover {
          color: #e4e4e7;
        }
        .lang-option.active {
          color: #ffffff;
          font-weight: 900;
        }

        .nav-auth-links {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: 6px;
          background: rgba(189, 74, 44, 0.08);
          border: 1px solid rgba(189, 74, 44, 0.25);
          padding: 4px 12px;
          border-radius: 4px;
        }
        .nav-auth-btn {
          color: #e4e4e7;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }
        .nav-auth-btn:hover {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }

        .nav-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.68rem;
          user-select: none;
        }
      `}</style>
    </header>
  );
}

