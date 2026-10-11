'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NOCTIS_PRODUCTS } from '@/data/products';
import { Product, ProductSize, ProductGuideConfig } from '@/types';
import { DEFAULT_PRODUCT_GUIDES } from '@/lib/settingsStore';
import { renderGuideSvg } from '@/components/admin/modals/ProductGuideModal';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedProduct, translateColor } from '@/lib/i18n';
import ProductCard from '@/components/ProductCard';
import ProductReviewsSection from '@/components/ProductReviewsSection';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Check, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Star, 
  Package, 
  Ruler, 
  RefreshCw,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';

export default function DedicatedProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen, setIsCheckoutOpen } = useCart();
  const { language, lang, t } = useLanguage();

  const idParam = (params?.id as string) || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(NOCTIS_PRODUCTS);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Negro');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [productGuide, setProductGuide] = useState<ProductGuideConfig>(DEFAULT_PRODUCT_GUIDES.sizes);

  // Cargar configuraciones de la tienda (Guía del producto dinámica)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings?.productGuide) {
          setProductGuide(data.settings.productGuide);
        }
      } catch {
        // use fallback DEFAULT_PRODUCT_GUIDES.sizes
      }
    };

    fetchSettings();
    const handleSync = () => fetchSettings();
    window.addEventListener('noctis-settings-updated', handleSync);
    return () => window.removeEventListener('noctis-settings-updated', handleSync);
  }, []);

  // Cargar catálogo y encontrar el producto por ID o slug
  useEffect(() => {
    const loadProductData = async () => {
      let catalog = NOCTIS_PRODUCTS;
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          catalog = data.products;
          setAllProducts(data.products);
        }
      } catch {
        // usar NOCTIS_PRODUCTS de fallback
      }

      // Buscar por ID exacto, por slug o coincidencia de nombre
      const cleanParam = decodeURIComponent(idParam).toLowerCase().trim();
      const found = catalog.find(p => {
        const pId = (p.id || '').toLowerCase();
        const pSlug = (p.name || '').toLowerCase().replace(/\s+/g, '-');
        return pId === cleanParam || pSlug === cleanParam || pId.includes(cleanParam);
      }) || catalog[0];

      if (found) {
        setProduct(found);
        if (found.availableSizes && found.availableSizes.length > 0) {
          setSelectedSize(found.availableSizes[0]);
        }
        if (found.availableColors && found.availableColors.length > 0) {
          setSelectedColor(found.availableColors[0].name);
        }
        // Actualizar título de la página
        document.title = `${found.name} — Streetwear Bogotá | NOCTIS URBANO`;

        // Registrar vista del producto para métricas del administrador
        try {
          const rawViews = localStorage.getItem('noctis_product_views');
          const viewsMap: Record<string, number> = rawViews ? JSON.parse(rawViews) : {};
          const pId = found.id || cleanParam;
          viewsMap[pId] = (viewsMap[pId] || 0) + 1;
          localStorage.setItem('noctis_product_views', JSON.stringify(viewsMap));
          window.dispatchEvent(new CustomEvent('noctis-views-updated', { detail: { productId: pId, views: viewsMap[pId] } }));
        } catch {
          // ignore storage error
        }
      }
    };

    loadProductData();
  }, [idParam]);

  // Sincronizar estado de Wishlist y cuenta de usuario
  useEffect(() => {
    if (!product) return;
    const syncWish = () => {
      try {
        const saved = localStorage.getItem('noctis_wishlist');
        if (saved) {
          const list: string[] = JSON.parse(saved);
          setIsWishlisted(list.includes(product.id));
        } else {
          setIsWishlisted(false);
        }
      } catch {
        // ignore
      }
    };

    syncWish();
    window.addEventListener('noctis-wishlist-updated', syncWish);
    return () => window.removeEventListener('noctis-wishlist-updated', syncWish);
  }, [product]);

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050507', color: '#ffffff' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Package size={48} color="#ff5500" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Cargando prenda...</h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Buscando en el catálogo oficial de NOCTIS URBANO</p>
        </div>
      </div>
    );
  }

  const translated = getTranslatedProduct(product, language);
  const activeColorObj = product.availableColors?.find(c => c.name === selectedColor);
  const currentMainImage = activeColorObj?.image || product.image;

  const toggleWishlist = () => {
    try {
      const saved = localStorage.getItem('noctis_wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(product.id)) {
        list = list.filter(id => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('noctis_wishlist', JSON.stringify(list));
      window.dispatchEvent(new Event('noctis-wishlist-updated'));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity, selectedColor);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Productos relacionados de la misma categoría o drop
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ backgroundColor: '#050507', color: '#ffffff', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      
      {/* Toast de agregado al carrito */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          backgroundColor: '#18181b',
          border: '1px solid #22c55e',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '8px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(34, 197, 94, 0.2)',
          animation: 'slideInRight 0.25s ease'
        }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={16} />
          </div>
          <div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>¡Prenda agregada a tu bolsa!</strong>
            <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>{product.name} (Talla {selectedSize} • {selectedColor})</span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Breadcrumbs y Navegación de Regreso */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#71717a', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}>
              Inicio
            </Link>
            <ChevronRight size={13} />
            <Link href="/#collections" style={{ color: '#a1a1aa', textDecoration: 'none', transition: 'color 0.2s' }}>
              Menú Categoría
            </Link>
            <ChevronRight size={13} />
            <span style={{ color: '#ffffff', fontWeight: 700 }}>
              {product.name}
            </span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={handleShare}
              title="Copiar enlace de producto"
              className="btn-curtain-subtle"
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Share2 size={14} color="#ff7733" />
              <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir Prenda'}</span>
            </button>

            {/* Botón de cierre '✕' con animación de giro 90° que regresa a la sección del catálogo */}
            <Link
              href="/#collections"
              className="client-close-btn"
              title="Cerrar y volver al catálogo"
              aria-label="Cerrar y volver al catálogo"
              style={{
                textDecoration: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700
              }}
            >
              ✕
            </Link>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL: GALERÍA + FICHA DE COMPRA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(24px, 4vw, 48px)', alignItems: 'start', marginBottom: '60px' }}>
          
          {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              backgroundColor: '#0c0c0f',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
            }}>
              {/* Badge de Prenda */}
              {product.badge && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 85, 0, 0.5)',
                  color: '#ff7733',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  zIndex: 2
                }}>
                  {product.badge}
                </div>
              )}

              {/* Botón Favoritos flotante */}
              <button
                type="button"
                onClick={toggleWishlist}
                title={isWishlisted ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: isWishlisted ? '#ff5500' : 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: isWishlisted ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: isWishlisted ? '#ffffff' : '#e4e4e7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
              >
                <Heart size={19} fill={isWishlisted ? '#ffffff' : 'none'} color="#ffffff" />
              </button>

              {/* Imagen Principal */}
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={currentMainImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
              </div>
            </div>

            {/* Selector de Vistas / Colores en Miniatura */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                {product.availableColors.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '8px',
                      backgroundColor: '#18181b',
                      border: selectedColor === col.name ? '2px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '3px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: selectedColor === col.name ? '0 0 12px rgba(255, 85, 0, 0.35)' : 'none'
                    }}
                  >
                    <img
                      src={col.image || product.image}
                      alt={col.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN, SELECTORES Y COMPRA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Encabezado de Producto */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#ff7733', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {product.category || 'STREETWEAR OFICIAL BOGOTÁ'}
                </span>
                <span style={{ color: '#71717a' }}>•</span>
                <button
                  type="button"
                  onClick={() => document.getElementById('opiniones')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#facc15',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Ver opiniones y reseñas"
                >
                  <Star size={13} fill="#facc15" color="#facc15" />
                  <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Ver reseñas y fotos</span>
                </button>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display, "Archivo", sans-serif)',
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 8px 0',
                letterSpacing: '0.02em',
                lineHeight: 1.1
              }}>
                {translated.name}
              </h1>

              {translated.subtitle && (
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.92rem' }}>
                  {translated.subtitle}
                </p>
              )}
            </div>

            {/* Precio Oficial */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: '#0f0e13',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff' }}>
                ${Number(product.price).toLocaleString('es-CO')}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#ff7733', fontWeight: 800 }}>COP</span>
              <span style={{ fontSize: '0.76rem', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.12)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, marginLeft: 'auto' }}>
                ✓ Envío Gratis a toda Colombia
              </span>
            </div>

            {/* Descripción */}
            <p style={{ fontSize: '0.88rem', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
              {translated.description}
            </p>

            {/* Selector de Color */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Color Seleccionado:
                  </label>
                  <strong style={{ fontSize: '0.78rem', color: '#ff7733', textTransform: 'uppercase' }}>
                    {translateColor(selectedColor, language)}
                  </strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.availableColors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: selectedColor === color.name ? '#1f1a18' : '#141418',
                        border: selectedColor === color.name ? '2px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.12)',
                        color: selectedColor === color.name ? '#ff7733' : '#d4d4d8',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transform: selectedColor === color.name ? 'scale(1.02)' : 'scale(1)',
                        transition: 'transform var(--duration-micro) var(--ease-spring), background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color.hex, border: '1px solid rgba(255,255,255,0.3)' }} />
                      <span>{translateColor(color.name, language)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Talla */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Talla:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{
                      background: 'rgba(255, 85, 0, 0.1)',
                      border: '1px solid rgba(255, 85, 0, 0.3)',
                      color: '#ff7733',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      transition: 'transform var(--duration-micro) var(--ease-spring), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff5500';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.1)';
                      e.currentTarget.style.color = '#ff7733';
                    }}
                    title="Ver guía del producto y tabla de medidas"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {renderGuideSvg(productGuide?.buttonIcon || productGuide?.preset, 14, '#ff7733')}
                    </span>
                    <span>{productGuide?.buttonLabel || 'Guía del Producto'}</span>
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                  ● {product.stock || 15} disponibles
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(product.availableSizes || ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '14px',
                      backgroundColor: selectedSize === size ? '#ffffff' : '#141418',
                      color: selectedSize === size ? '#000000' : '#ffffff',
                      border: selectedSize === size ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transform: selectedSize === size ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: selectedSize === size ? '0 4px 16px rgba(255, 255, 255, 0.15)' : 'none',
                      transition: 'transform var(--duration-micro) var(--ease-spring), background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Cantidad y Botones de Compra */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Control Cantidad */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#141418',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ width: '38px', textAlign: 'center', fontWeight: 900, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Botón de Favorito / Wishlist sincronizado con Perfil */}
                <button
                  type="button"
                  onClick={toggleWishlist}
                  title={isWishlisted ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                  className="btn-curtain-white"
                  style={{
                    flex: 1,
                    borderRadius: '6px',
                    padding: '14px 20px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={18} fill={isWishlisted ? '#ff5500' : 'none'} color={isWishlisted ? '#ff5500' : '#ffffff'} />
                  <span>{isWishlisted ? 'EN TUS FAVORITOS' : 'GUARDAR EN FAVORITOS'}</span>
                </button>
              </div>

              {/* Botón AÑADIR AL CARRITO */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-curtain-orange"
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  padding: '16px 20px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <ShoppingCart size={18} />
                <span>
                  {language === 'EN' ? 'ADD TO CART' : 'AÑADIR AL CARRITO'} • ${(product.price * quantity).toLocaleString('es-CO')} COP
                </span>
              </button>
            </div>

            {/* Garantías y Beneficios */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={18} color="#22c55e" />
                <span style={{ fontSize: '0.76rem', color: '#d4d4d8' }}>Despacho en 24h a toda Colombia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="#ff7733" />
                <span style={{ fontSize: '0.76rem', color: '#d4d4d8' }}>Pago 100% Seguro PSE & Wompi</span>
              </div>
            </div>

            {/* Ficha Técnica de la Prenda */}
            <div style={{
              backgroundColor: '#0c0c0e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '18px 20px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff' }}>
                ESPECIFICACIONES TÉCNICAS
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.6 }}>
                {(product.features || [
                  'Algodón pesado de alto gramaje para retener el frío de la noche',
                  'Corte boxy fit con caída estructurada',
                  'Estampado y bordado de alta durabilidad',
                  'Hecho en Bogotá D.C., Colombia'
                ]).map((feat, fIdx) => (
                  <li key={fIdx} style={{ marginBottom: '4px' }}>{feat}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* SECCIÓN DE OPINIONES Y RESEÑAS CON FOTOS/VIDEOS POR PRODUCTO */}
        <ProductReviewsSection productId={product.id} productName={product.name} />

        {/* SECCIÓN DE PRENDAS RECOMENDADAS / COMPLETA EL LOOK */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '70px', paddingTop: '40px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#ff5500', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  COMPLETA TU LOOK
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900 }}>
                  Otras prendas del Drop Oficial
                </h3>
              </div>
              <Link href="/#collections" style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' }}>
                Ver toda la colección →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: '14px' }}>
              {relatedProducts.map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Guía del Producto Dinámico */}
        {isSizeGuideOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#121216',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '28px',
                maxWidth: '560px',
                width: '100%',
                color: '#ffffff',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: '#ffffff' }}>
                  {productGuide.modalTitle || '📐 Guía del Producto & Medidas'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#a1a1aa',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(90deg) scale(1.08)';
                    e.currentTarget.style.backgroundColor = '#ff5500';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 85, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#a1a1aa';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Cerrar guía"
                >
                  <X size={16} />
                </button>
              </div>

              {productGuide.description && (
                <p style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '16px', lineHeight: 1.4 }}>
                  {productGuide.description}
                </p>
              )}

              {/* Tabla de Medidas / Especificaciones Dinámica */}
              {productGuide.tableHeaders && productGuide.tableHeaders.length > 0 && (
                <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: '#ff7733', textAlign: 'left' }}>
                        {productGuide.tableHeaders.map((header, idx) => (
                          <th key={idx} style={{ padding: '8px 6px', textTransform: 'uppercase' }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {productGuide.tableRows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          {productGuide.tableHeaders.map((_, cIdx) => (
                            <td key={cIdx} style={{ padding: '10px 6px', fontWeight: cIdx === 0 ? 800 : 400 }}>
                              {row[`c${cIdx}`] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {productGuide.footerNote && (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.75rem', color: '#d4d4d8' }}>
                  {productGuide.footerNote}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
