'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '@/types';
import { NOCTIS_PRODUCTS } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { getCategoryGroups, CategoryGroup } from '@/lib/categoriesStore';
import ProductCard from './ProductCard';
import { Search, LayoutGrid, X, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGrid() {
  const [productsList, setProductsList] = useState<Product[]>(NOCTIS_PRODUCTS);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const { lang, t } = useLanguage();
  const { categoryFilter, setCategoryFilter, setIsCategoriesOpen } = useCart();
  const pillsScrollRef = useRef<HTMLDivElement>(null);

  const isSpanish = lang === 'ES';

  const scrollPills = (direction: 'left' | 'right') => {
    if (pillsScrollRef.current) {
      const amount = direction === 'left' ? -180 : 180;
      pillsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadData = () => {
      // Cargar productos
      fetch('/api/admin/products')
        .then(res => res.json())
        .then(data => {
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductsList(data.products);
          }
        })
        .catch(() => {});

      // Cargar grupos y categorías configurados
      setCategoryGroups(getCategoryGroups());
    };

    loadData();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'noctis_catalog_sync' || e.key === 'noctis_category_groups') {
        loadData();
      }
    };

    window.addEventListener('focus', loadData);
    window.addEventListener('noctis-catalog-updated', loadData);
    window.addEventListener('noctis-categories-updated', loadData);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('noctis-catalog-updated', loadData);
      window.removeEventListener('noctis-categories-updated', loadData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Generar lista dinámica de pastillas de categorías a partir de categoryGroups
  const dynamicPills = useMemo(() => {
    const pills: { key: string; label: string; count: number; badge?: string; image?: string }[] = [];

    // Pastilla "Todos"
    pills.push({
      key: 'ALL',
      label: isSpanish ? 'Todos los Productos' : 'All Products',
      count: productsList.length
    });

    // Añadir cada subcategoría real del gestor de tienda
    categoryGroups.forEach(group => {
      (group.items || []).forEach(item => {
        const count = (item.productIds || []).length;
        pills.push({
          key: item.name,
          label: item.name,
          count,
          badge: item.badge,
          image: item.image || group.image
        });
      });
    });

    return pills;
  }, [categoryGroups, productsList, isSpanish]);

  // Filtrado y Ordenamiento Sincronizado
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Filtro por categoría sincronizado con categoriesStore
    if (categoryFilter !== 'ALL') {
      const allGroups = categoryGroups.length > 0 ? categoryGroups : getCategoryGroups();
      let matchedProductIds: string[] = [];
      let foundInStore = false;

      for (const grp of allGroups) {
        if (grp.title === categoryFilter || grp.id === categoryFilter) {
          foundInStore = true;
          (grp.items || []).forEach(it => {
            if (it.productIds && Array.isArray(it.productIds)) {
              matchedProductIds.push(...it.productIds);
            }
          });
        }
        for (const it of grp.items || []) {
          if (it.name === categoryFilter || it.id === categoryFilter) {
            foundInStore = true;
            if (it.productIds && Array.isArray(it.productIds)) {
              matchedProductIds.push(...it.productIds);
            }
          }
        }
      }

      if (foundInStore) {
        if (matchedProductIds.length > 0) {
          result = result.filter(p => matchedProductIds.includes(p.id));
        } else {
          result = []; // Categoría vacía sin prendas asociadas
        }
      } else {
        result = result.filter(p => 
          p.category === categoryFilter || 
          p.tags?.some(t => t.toLowerCase() === categoryFilter.toLowerCase()) ||
          p.name.toLowerCase().includes(categoryFilter.toLowerCase())
        );
      }
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [productsList, categoryFilter, categoryGroups, searchQuery, sortBy]);

  // Si hay filtro activo o búsqueda, mostramos todos los que coincidan
  const isFiltering = categoryFilter !== 'ALL' || searchQuery.trim().length > 0;
  const visibleProducts = (isFiltering || showAll) ? filteredProducts : filteredProducts.slice(0, 4);

  return (
    <section className="drop section-dark" id="drop">
      <div className="section-heading">
        <p className="kicker">{t('nav.collections')}</p>
        <h2>{lang === 'EN' ? 'DROP 001 — BOGOTA NIGHTS' : 'DROP 001 — NOCHES DE BOGOTÁ'}</h2>
        <p>{lang === 'EN' ? 'Heavyweight boxy-fit silhouettes and essential tactical gear engineered for the mountain night.' : 'Piezas pesadas en corte boxy oversized y equipo técnico esencial para la noche capitalina.'}</p>
      </div>

      {/* Barra de Filtros & Categorías Dinámicas Coincidentes con el Menú */}
      <div className="catalog-controls-container">
        {/* Fila Superior: Buscador + Menú Categorías + Ordenar */}
        <div className="catalog-top-controls">
          {/* Buscador en Vivo */}
          <div className="catalog-search-wrapper">
            <Search size={14} className="catalog-search-icon" />
            <input
              type="text"
              placeholder={isSpanish ? 'Buscar prenda, corte, material...' : 'Search gear, fit, materials...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="catalog-search-clear-btn"
                aria-label="Limpiar búsqueda"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Botón Abrir Categorías Completo */}
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(true)}
            className="catalog-categories-btn"
            title={isSpanish ? 'Menú completo de categorías' : 'All Categories Menu'}
          >
            <LayoutGrid size={14} style={{ color: '#ffffff' }} />
            <span className="catalog-categories-label">{isSpanish ? 'Categorías' : 'Categories'}</span>
          </button>

          {/* Selector de Ordenamiento */}
          <div className="catalog-sort-wrapper">
            <ArrowUpDown size={13} className="catalog-sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="catalog-sort-select"
              aria-label="Ordenar catálogo"
            >
              <option value="featured">
                {isSpanish ? 'Destacados' : 'Featured'}
              </option>
              <option value="price-asc">
                {isSpanish ? 'Precio: Menor a Mayor' : 'Price: Low to High'}
              </option>
              <option value="price-desc">
                {isSpanish ? 'Precio: Mayor a Menor' : 'Price: High to Low'}
              </option>
            </select>
          </div>
        </div>

        {/* Fila Inferior: Carrusel con Flechas Izquierda y Derecha */}
        <div className="catalog-pills-carousel-wrapper">
          {/* Flecha Deslizar Izquierda */}
          <button
            type="button"
            onClick={() => scrollPills('left')}
            className="catalog-pills-arrow-btn left"
            aria-label="Desplazar categorías hacia la izquierda"
            title="Ver categorías anteriores"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Pastillas Dinámicas de Categorías */}
          <div ref={pillsScrollRef} className="catalog-pills-scroll">
            {dynamicPills.map((cat) => {
              const isActive = categoryFilter === cat.key;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategoryFilter(cat.key)}
                  className={`catalog-pill-btn ${isActive ? 'active' : ''}`}
                >
                  {/* Miniatura si existe */}
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/products/tee/noctis_herb_tee.jpg';
                      }}
                      className="catalog-pill-img"
                    />
                  )}

                  <span>{cat.label}</span>

                  {/* Badge opcional */}
                  {cat.badge && (
                    <span className="catalog-pill-badge">
                      {cat.badge}
                    </span>
                  )}

                  {/* Contador */}
                  <span className="catalog-pill-count">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Flecha Deslizar Derecha */}
          <button
            type="button"
            onClick={() => scrollPills('right')}
            className="catalog-pills-arrow-btn right"
            aria-label="Desplazar categorías hacia la derecha"
            title="Ver siguientes categorías"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Indicador de Filtro Activo con botón Limpiar */}
        {categoryFilter !== 'ALL' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '8px 14px',
              marginTop: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#ffffff' }}>
              <Filter size={14} style={{ color: '#ffffff' }} />
              <span>Filtrando por: <strong>{categoryFilter}</strong> ({filteredProducts.length} {filteredProducts.length === 1 ? 'prenda' : 'prendas'})</span>
            </div>

            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <X size={12} />
              <span>Ver Todo</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid de Productos */}
      {visibleProducts.length > 0 ? (
        <div className="product-grid" id="collections">
          {visibleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            maxWidth: '500px',
            margin: '40px auto',
            textAlign: 'center',
            padding: '40px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px'
          }}
        >
          <p style={{ color: '#ffffff', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
            {isSpanish 
              ? 'No se encontraron prendas con los filtros seleccionados.' 
              : 'No items match your selected filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('ALL');
              setSearchQuery('');
            }}
            style={{
              background: '#ffffff',
              border: 'none',
              color: '#000000',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isSpanish ? 'Limpiar Filtros' : 'Clear Filters'}
          </button>
        </div>
      )}

      {!isFiltering && (
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => setShowAll(prev => !prev)}
            className="btn btn-secondary"
            style={{
              minWidth: '290px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.18em',
              fontSize: '0.78rem',
              padding: '16px 36px',
              transition: 'all 300ms ease'
            }}
          >
            {showAll ? 'VER MENOS COLECCIÓN ↑' : 'VER MÁS // ACCESORIOS BOGOTÁ (+4) ↓'}
          </button>
        </div>
      )}
    </section>
  );
}
