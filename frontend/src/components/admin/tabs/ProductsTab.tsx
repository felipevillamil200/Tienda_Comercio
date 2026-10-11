'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  RefreshCw, 
  Plus, 
  ShoppingBag, 
  Edit3, 
  Trash2, 
  Link2, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import { Product, ProductSize, ProductGuideConfig } from '@/types';
import { renderGuideSvg } from '@/components/admin/modals/ProductGuideModal';

const FEATURED_LOOKBOOK_IMAGES: Record<string, string> = {
  'Negro': '/assets/products/tee/candelaria_yerba_tee_negro.png',
  'Blanco': '/assets/products/tee/candelaria_yerba_tee_blanco.png',
  'Gris': '/assets/products/tee/candelaria_yerba_tee_gris.png',
  'Rojo': '/assets/products/tee/candelaria_yerba_tee_rojo.png',
  'Verde': '/assets/products/tee/candelaria_yerba_tee_verde.png',
};

// Componente de Vitrina Destacada "PIEZA PRINCIPAL" (Exacto al sitio web del cliente)
export function AdminFeaturedShowcase({
  product,
  onEdit,
  onDelete
}: {
  product?: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string, name: string) => void;
}) {
  const [selectedColor, setSelectedColor] = useState('Negro');
  const [selectedSize, setSelectedSize] = useState<ProductSize>('S');

  const activeColorObj = product?.availableColors?.find(c => c.name === selectedColor);
  const currentImage = FEATURED_LOOKBOOK_IMAGES[selectedColor] || activeColorObj?.image || product?.image || '/assets/products/tee/candelaria_yerba_tee_negro.png';

  const colorVariants = product?.availableColors && product.availableColors.length > 0
    ? product.availableColors
    : [
        { name: 'Negro', hex: '#0d0d0d' },
        { name: 'Blanco', hex: '#f0ede6' },
        { name: 'Gris', hex: '#5f6368' },
        { name: 'Rojo', hex: '#991b1b' },
        { name: 'Verde', hex: '#264633' }
      ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(20, 19, 24, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '28px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '0',
        minHeight: '440px'
      }}>
        {/* Imagen Gigante de Lookbook / Bogotá en la Noche */}
        <div style={{
          position: 'relative',
          background: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: '380px',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <img
            src={currentImage}
            alt={`Muestra ${product?.name || 'SHADOW HERB TEE'} - ${selectedColor}`}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '520px',
              objectFit: 'contain',
              padding: '16px',
              transition: 'opacity 0.25s ease, transform 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: '#ff5500',
            textTransform: 'uppercase'
          }}>
            PIEZA PRINCIPAL • VITRINA HOMEPAGE
          </div>
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#a1a1aa'
          }}>
            {product?.stock ?? 0} un. en stock
          </div>
        </div>

        {/* Detalles y Selectores Interactivos */}
        <div style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '18px'
        }}>
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#8e8e93',
              textTransform: 'uppercase',
              margin: '0 0 6px 0'
            }}>
              PIEZA PRINCIPAL
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {product?.name || 'SHADOW HERB TEE'}
            </h2>
          </div>

          <p style={{
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#a1a1aa',
            margin: 0,
            maxWidth: '520px'
          }}>
            {product?.description || 'Una camiseta de algodón pesado para la noche fría capitalina. Logo pequeño al frente, figura de yerba oscura en espalda. Casi invisible. Totalmente intencional.'}
          </p>

          {/* Características / Bullets */}
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {(product?.features || [
              'Fit oversized estructurado',
              'Algodón premium 240g de alto gramaje',
              'Hecha para el frío andino',
              'Corte boxy con hombros caídos'
            ]).map((f, i) => (
              <li key={i} style={{ fontSize: '12px', color: '#e5e5ea', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ff5500', fontWeight: 800 }}>—</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Selector de Color (Píldoras idénticas a la vitrina web cliente) */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8e8e93', margin: '0 0 8px 0', letterSpacing: '1px' }}>
              COLOR: <span style={{ color: '#ff5500', fontWeight: 900 }}>{selectedColor}</span>
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colorVariants.map(col => {
                const isSelected = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'rgba(255, 85, 0, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.12)',
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(255, 85, 0, 0.4)' : 'none'
                    }}
                  >
                    <span
                      style={{
                        width: '11px',
                        height: '11px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        display: 'inline-block'
                      }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de Tallas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                style={{
                  minWidth: '40px',
                  height: '36px',
                  backgroundColor: selectedSize === size ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedSize === size ? '#000000' : '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Barra de Acciones Administrativas (Idéntica a las tarjetas del catálogo) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              ${(product?.price || 150000).toLocaleString('es-CO')} <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>COP</span>
            </span>

            {product && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', width: '220px' }}>
                <button 
                  className="btn-card-action edit"
                  onClick={() => onEdit(product)}
                  style={{ height: '36px' }}
                >
                  <Edit3 size={14} />
                  <span>Editar</span>
                </button>

                <button 
                  className="btn-card-action delete"
                  onClick={() => onDelete(product.id, product.name)}
                  title="Eliminar del Catálogo"
                  style={{ width: '36px', height: '36px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Tarjeta de Producto para el Catálogo Administrativo con Selector de Colores e Imágenes
export function AdminProductCard({
  product,
  onEdit,
  onDelete
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0]?.name || 'Negro'
  );

  const activeColorObj = product.availableColors?.find(c => c.name === selectedColor);
  const currentImage = activeColorObj?.image || product.image;

  return (
    <div className="product-admin-card">
      <div className="product-admin-img-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={currentImage} 
          alt={`${product.name} - ${selectedColor}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
        />
        {product.badge && <span className="product-admin-badge">{product.badge}</span>}
        <div className={`stock-tag ${product.stock <= 5 ? 'critical' : ''}`}>
          {product.stock} un. en stock
        </div>
      </div>

      <div className="product-admin-body">
        {/* Selector de Colores e Imágenes Interactivo (Exactamente como en el sitio web del cliente) */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {product.availableColors.map(col => (
              <button
                key={col.name}
                type="button"
                onClick={() => setSelectedColor(col.name)}
                title={`Color: ${col.name} (Clic para previsualizar foto)`}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: col.hex,
                  border: selectedColor === col.name ? '2px solid #ff5500' : '1px solid rgba(255,255,255,0.3)',
                  boxShadow: selectedColor === col.name ? '0 0 10px rgba(255, 85, 0, 0.6)' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none',
                  transform: selectedColor === col.name ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform 180ms ease, border-color 180ms ease',
                  flexShrink: 0
                }}
              />
            ))}
            <span style={{ fontSize: '0.72rem', color: '#ff7733', fontWeight: 800, marginLeft: '4px', textTransform: 'uppercase' }}>
              {selectedColor}
            </span>
          </div>
        )}

        <div className="product-admin-category">{product.category}</div>
        <h3 className="product-admin-title">{product.name}</h3>
        <p className="product-admin-subtitle">{product.subtitle}</p>
        
        <div className="product-admin-price">
          ${product.price.toLocaleString('es-CO')} <span className="currency">COP</span>
        </div>

        {/* URL Pública Permanente (Generada Automáticamente) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          padding: '6px 10px',
          marginTop: '8px',
          marginBottom: '8px',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <Link2 size={13} color="#ff7733" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              /producto/{product.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.clipboard) {
                  const fullUrl = `${window.location.origin}/producto/${product.id}`;
                  navigator.clipboard.writeText(fullUrl);
                  alert(`¡Enlace copiado al portapapeles!\n${fullUrl}`);
                }
              }}
              title="Copiar Link de la Prenda"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Copy size={13} />
            </button>

            <a
              href={`/producto/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir página en nueva pestaña"
              style={{
                color: '#ff7733',
                display: 'flex',
                alignItems: 'center',
                padding: '3px'
              }}
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="product-admin-variants">
          <div className="variant-pill">Tallas: {product.availableSizes?.join(', ') || 'N/A'}</div>
          <div className="variant-pill">Colores: {product.availableColors?.length || 1}</div>
        </div>

        <div className="product-admin-actions">
          <button 
            className="btn-card-action edit"
            onClick={onEdit}
          >
            <Edit3 size={14} />
            <span>Editar</span>
          </button>

          <button 
            className="btn-card-action delete"
            onClick={onDelete}
            title="Eliminar del Catálogo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductsTabProps {
  products: Product[];
  filteredProducts: Product[];
  productSearch: string;
  setProductSearch: (val: string) => void;
  productCategoryFilter: string;
  setProductCategoryFilter: (val: string) => void;
  categories: string[];
  setIsCategoriesManagerOpen: (val: boolean) => void;
  setIsProductGuideModalOpen?: (val: boolean) => void;
  productGuide?: ProductGuideConfig;
  setIsResetFactoryModalOpen: (val: boolean) => void;
  setIsNewProductModalOpen: (val: boolean) => void;
  setEditingProduct: (p: Product | null) => void;
  handleDeleteProduct: (id: string, name: string) => void;
  actionLoading: boolean;
}

export default function ProductsTab({
  products,
  filteredProducts,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  categories,
  setIsCategoriesManagerOpen,
  setIsProductGuideModalOpen,
  productGuide,
  setIsResetFactoryModalOpen,
  setIsNewProductModalOpen,
  setEditingProduct,
  handleDeleteProduct,
  actionLoading
}: ProductsTabProps) {
  return (
    <section className="tab-pane">
      <div className="pane-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Buscar prenda o producto..." 
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <button 
            type="button"
            className="btn-action-ghost" 
            onClick={() => setIsCategoriesManagerOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)'
            }}
            title="Configurar y organizar Tienda & Categorías con fotos, checks y zoom"
          >
            <Menu size={16} style={{ color: '#ffffff' }} />
            <span>Tienda (Categorías)</span>
          </button>

          {setIsProductGuideModalOpen && (
            <button 
              type="button"
              className="btn-action-ghost" 
              onClick={() => setIsProductGuideModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 85, 0, 0.12)',
                border: '1.5px solid rgba(255, 85, 0, 0.45)',
                color: '#ff7733',
                fontWeight: 900,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(255, 85, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.22)';
                e.currentTarget.style.borderColor = '#ff5500';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 85, 0, 0.45)';
              }}
              title="Editar Guía del Producto (Guía de tallas, ficha técnica, dimensiones según industria)"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {renderGuideSvg(productGuide?.buttonIcon || productGuide?.preset, 15, '#ff7733')}
              </span>
              <span>{productGuide?.buttonLabel || 'Guía del Producto'}</span>
            </button>
          )}

          <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)}>
            <option value="featured">Destacados</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
          </select>

          <button 
            type="button"
            onClick={() => setIsResetFactoryModalOpen(true)}
            disabled={actionLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              border: '1.5px solid rgba(234, 179, 8, 0.35)',
              color: '#facc15',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.03em',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 10px rgba(234, 179, 8, 0.05)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.16)';
              e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.35)';
            }}
            title="Restaura todos los productos y existencias oficiales de fábrica"
          >
            <RefreshCw size={14} className={actionLoading ? 'spin' : ''} style={{ color: '#facc15' }} />
            <span>Restablecer Catálogo de Fábrica</span>
          </button>

          <button className="btn-primary" onClick={() => { setEditingProduct(null); setIsNewProductModalOpen(true); }}>
            <Plus size={16} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={40} className="empty-icon" />
          <h3>No hay productos en el catálogo</h3>
          <p>El catálogo está vacío o no coincide con los filtros de búsqueda.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => setIsResetFactoryModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(234, 179, 8, 0.4)', color: '#facc15' }}
            >
              <RefreshCw size={15} />
              <span>Restablecer Productos de Fábrica</span>
            </button>
            <button className="btn-primary" onClick={() => { setEditingProduct(null); setIsNewProductModalOpen(true); }}>
              <Plus size={15} />
              <span>Crear Nuevo Producto</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Vitrina Destacada de la Pieza Principal (Home / Storefront Showcase) */}
          {!productSearch && (productCategoryFilter === 'featured' || !productCategoryFilter) && (
            <AdminFeaturedShowcase
              product={products.find(p => p.id === 'prod-shadow-palm-tee' || p.name.toUpperCase().includes('SHADOW')) || products[0]}
              onEdit={(p) => { setEditingProduct(p); setIsNewProductModalOpen(true); }}
              onDelete={(id, name) => handleDeleteProduct(id, name)}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Colección Completa de Prendas ({filteredProducts.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#8e8e93', margin: '4px 0 0 0' }}>
                Haz clic en los colores de cada tarjeta para previsualizar sus fotos en tiempo real.
              </p>
            </div>
          </div>

          <div className="products-grid-admin">
            {filteredProducts.map(product => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={() => { setEditingProduct(product); setIsNewProductModalOpen(true); }}
                onDelete={() => handleDeleteProduct(product.id, product.name)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
