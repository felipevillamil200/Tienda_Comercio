'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryGroups, CategoryGroup } from '@/lib/categoriesStore';
import { 
  X, 
  Shirt, 
  Layers, 
  Shield, 
  Sparkles, 
  Flame, 
  Tag, 
  Compass, 
  Package, 
  ChevronRight, 
  ShoppingBag,
  Grid,
  BookOpen,
  Phone,
  Truck,
  Bot,
  User,
  LogIn,
  Globe
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Shirt,
  Layers,
  Shield,
  Sparkles,
  Flame,
  Tag,
  Compass,
  Package
};

export default function CategoriesDrawer() {
  const router = useRouter();
  const { 
    isCategoriesOpen, 
    setIsCategoriesOpen, 
    categoryFilter, 
    setCategoryFilter,
    setIsTrackingOpen,
    setIsAiOpen,
    setIsAccountOpen
  } = useCart();
  const { lang, setLang, t } = useLanguage();
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [clientUser, setClientUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const loadCategories = () => {
      setGroups(getCategoryGroups());
    };

    const loadUser = () => {
      try {
        const saved = localStorage.getItem('noctis_client_user');
        if (saved) {
          setClientUser(JSON.parse(saved));
        } else {
          setClientUser(null);
        }
      } catch {
        setClientUser(null);
      }
    };

    loadCategories();
    loadUser();

    window.addEventListener('noctis-categories-updated', loadCategories);
    window.addEventListener('noctis-user-updated', loadUser);
    window.addEventListener('storage', loadCategories);

    return () => {
      window.removeEventListener('noctis-categories-updated', loadCategories);
      window.removeEventListener('noctis-user-updated', loadUser);
      window.removeEventListener('storage', loadCategories);
    };
  }, []);

  if (!isCategoriesOpen) return null;

  const isSpanish = lang === 'ES';

  // Navegación fluida a anclas en la página principal o redirección
  const handleNavAnchor = (anchorId: string) => {
    setIsCategoriesOpen(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(`/#${anchorId}`);
      }
    }
  };

  const handleSelectCategory = (filterKey: string) => {
    setCategoryFilter(filterKey);
    setIsCategoriesOpen(false);
    
    // Smooth scroll al catálogo
    const dropSection = document.getElementById('drop') || document.getElementById('collections');
    if (dropSection) {
      dropSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#collections');
    }
  };

  const handleOpenTracking = () => {
    setIsCategoriesOpen(false);
    setIsTrackingOpen(true);
  };

  const handleOpenAi = () => {
    setIsCategoriesOpen(false);
    setIsAiOpen(true);
  };

  const handleOpenAccount = () => {
    setIsCategoriesOpen(false);
    setIsAccountOpen(true);
  };

  // Calcular total de prendas
  const totalItemsCount = groups.reduce((acc, g) => {
    return acc + g.items.reduce((itemAcc, it) => itemAcc + (it.productIds ? it.productIds.length : 0), 0);
  }, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isSpanish ? 'Menú de Navegación NOCTIS' : 'NOCTIS Navigation Menu'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex'
      }}
    >
      {/* Backdrop con Blur */}
      <div
        onClick={() => setIsCategoriesOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.25s ease forwards'
        }}
      />

      {/* Panel Lateral Deslizante */}
      <aside
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: '#0c0c0e',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '24px 0 60px rgba(0, 0, 0, 0.95)',
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          zIndex: 10,
          color: '#ffffff',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)'
        }}
      >
        {/* Cabecera del Menú con Marca y Botón de Cierre */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff5500' }} />
            <span
              style={{
                fontFamily: 'var(--font-display, "Archivo", sans-serif)',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff'
              }}
            >
              NOCTIS URBANO
            </span>
          </div>

          <button
            type="button"
            className="client-close-btn"
            onClick={() => setIsCategoriesOpen(false)}
            aria-label={isSpanish ? 'Cerrar menú' : 'Close menu'}
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px 32px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px'
          }}
        >
          {/* 1. SECCIONES PRINCIPALES DE NAVEGACIÓN */}
          <nav aria-label="Navegación principal móvil" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            
            {/* TIENDA / CATÁLOGO COMPLETO */}
            <button
              type="button"
              onClick={() => handleSelectCategory('ALL')}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '8px',
                border: categoryFilter === 'ALL' ? '1.5px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: categoryFilter === 'ALL' ? 'rgba(255, 85, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Grid size={18} style={{ color: '#ff7733' }} />
                <span>{isSpanish ? 'TIENDA' : 'SHOP'}</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 800 }}>
                {totalItemsCount > 0 ? `${totalItemsCount} prendas` : 'Ver Todo'}
              </span>
            </button>

            {/* COLECCIONES */}
            <button
              type="button"
              onClick={() => handleNavAnchor('collections')}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flame size={18} style={{ color: '#ffffff' }} />
                <span>{isSpanish ? 'COLECCIONES' : 'COLLECTIONS'}</span>
              </span>
              <ChevronRight size={16} style={{ color: '#71717a' }} />
            </button>

            {/* HISTORIA */}
            <button
              type="button"
              onClick={() => handleNavAnchor('about')}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={18} style={{ color: '#ffffff' }} />
                <span>{isSpanish ? 'HISTORIA' : 'OUR STORY'}</span>
              </span>
              <ChevronRight size={16} style={{ color: '#71717a' }} />
            </button>

            {/* CONTACTO */}
            <button
              type="button"
              onClick={() => handleNavAnchor('contacto')}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ color: '#ffffff' }} />
                <span>{isSpanish ? 'CONTACTO' : 'CONTACT'}</span>
              </span>
              <ChevronRight size={16} style={{ color: '#71717a' }} />
            </button>

            {/* SEGUIR PEDIDO */}
            <button
              type="button"
              onClick={handleOpenTracking}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                color: '#22c55e',
                fontSize: '0.92rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '4px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={18} style={{ color: '#22c55e' }} />
                <span>{isSpanish ? 'SEGUIR PEDIDO' : 'TRACK ORDER'}</span>
              </span>
              <span style={{
                fontSize: '0.66rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: '#22c55e',
                color: '#000000',
                fontWeight: 900
              }}>
                GUÍA
              </span>
            </button>

            {/* ASISTENTE NOCTIS AI */}
            <button
              type="button"
              onClick={handleOpenAi}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                backgroundColor: 'rgba(255, 85, 0, 0.08)',
                color: '#ff7733',
                fontSize: '0.86rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bot size={18} style={{ color: '#ff5500' }} />
                <span>{isSpanish ? 'ASISTENTE NOCTIS AI' : 'NOCTIS AI COPILOT'}</span>
              </span>
              <span style={{ fontSize: '0.64rem', color: '#ff5500', fontWeight: 900 }}>
                ✦ EN VIVO
              </span>
            </button>
          </nav>

          {/* 2. EXPLORAR POR CATEGORÍA DE PRENDAS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={15} style={{ color: '#a1a1aa' }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#a1a1aa'
                }}
              >
                {isSpanish ? 'Categorías de Ropa' : 'Clothing Categories'}
              </h3>
            </div>

            {groups.map((group) => {
              const GroupIcon = (group.icon && ICON_MAP[group.icon]) ? ICON_MAP[group.icon] : Tag;
              return (
                <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* Cabecera de Grupo */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      paddingBottom: '4px'
                    }}
                  >
                    {group.image ? (
                      <img
                        src={group.image}
                        alt={group.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/products/tee/noctis_herb_tee.jpg';
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                      />
                    ) : (
                      <GroupIcon size={14} style={{ color: '#ffffff' }} />
                    )}
                    <span>{group.title}</span>
                  </div>

                  {/* Subcategorías */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px' }}>
                    {group.items.map((item) => {
                      const isSelected = categoryFilter === item.name || categoryFilter === item.id;
                      const itemThumb = item.image || group.image;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCategory(item.name)}
                          style={{
                            background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                            border: isSelected ? '1.5px solid #ffffff' : '1px solid transparent',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            textAlign: 'left',
                            color: '#ffffff',
                            fontSize: '0.84rem',
                            fontWeight: isSelected ? 800 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {itemThumb ? (
                              <img
                                src={itemThumb}
                                alt={item.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/assets/products/tee/noctis_herb_tee.jpg';
                                }}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '4px',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                              />
                            ) : (
                              <span style={{ color: isSelected ? '#ff5500' : '#71717a' }}>•</span>
                            )}
                            <span>{item.name}</span>
                          </span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.badge && (
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  letterSpacing: '0.06em',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.25)'
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight size={13} style={{ color: '#71717a' }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. SECCIÓN INFERIOR: IDIOMA Y CUENTA DE CLIENTE */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Selector de Idioma */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#a1a1aa' }}>
                <Globe size={15} style={{ color: '#a1a1aa' }} />
                <span>{isSpanish ? 'Idioma / Language' : 'Language'}</span>
              </span>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', padding: '3px 6px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setLang('ES')}
                  style={{
                    background: lang === 'ES' ? '#ffffff' : 'transparent',
                    color: lang === 'ES' ? '#000000' : '#a1a1aa',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setLang('EN')}
                  style={{
                    background: lang === 'EN' ? '#ffffff' : 'transparent',
                    color: lang === 'EN' ? '#000000' : '#a1a1aa',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Acceso a Cuenta o Login */}
            {clientUser ? (
              <button
                type="button"
                onClick={handleOpenAccount}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 85, 0, 0.3)',
                  backgroundColor: 'rgba(255, 85, 0, 0.08)',
                  color: '#ff7733',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={15} />
                  <span>Mi Cuenta ({clientUser.name.split(' ')[0]})</span>
                </span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link
                  href="/sign-in"
                  onClick={() => setIsCategoriesOpen(false)}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  INGRESAR
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsCategoriesOpen(false)}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    textDecoration: 'none'
                  }}
                >
                  REGISTRARSE
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

