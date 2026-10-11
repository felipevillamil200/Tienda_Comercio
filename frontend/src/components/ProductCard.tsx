'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedProduct, translateColor } from '@/lib/i18n';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const translated = getTranslatedProduct(product, language);

  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0]?.name || 'Negro'
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('noctis_wishlist');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsWishlisted(list.includes(product.id));
      }
    } catch {
      // ignore
    }

    const handleSync = () => {
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

    window.addEventListener('noctis-wishlist-updated', handleSync);
    return () => window.removeEventListener('noctis-wishlist-updated', handleSync);
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const activeColorObj = product.availableColors?.find(c => c.name === selectedColor);
  const currentImage = activeColorObj?.image || product.image;
  const isOutOfStock = product.stock === 0;

  const productUrl = `/producto/${product.id}`;

  const handleCardClick = () => {
    router.push(productUrl);
  };

  return (
    <article className="product-card" style={{ position: 'relative' }}>
      {/* Botón de Favoritos / Wishlist */}
      <button
        type="button"
        onClick={toggleWishlist}
        title={isWishlisted ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
        className="product-wishlist-btn"
        style={{
          background: isWishlisted ? 'rgba(255, 85, 0, 0.92)' : 'rgba(0, 0, 0, 0.65)',
          border: isWishlisted ? '1px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.25)',
          color: isWishlisted ? '#ffffff' : '#e4e4e7',
        }}
      >
        <Heart size={16} fill={isWishlisted ? '#ffffff' : 'none'} />
      </button>

      <Link
        href={productUrl}
        className="product-image"
        aria-label={`Ver detalles de ${translated.name}`}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <img 
          src={currentImage} 
          alt={`${translated.name} - ${selectedColor}`} 
        />
        <span className="product-glyph">NOCTIS</span>
        {isOutOfStock ? (
          <span className="product-badge" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
            SOLD OUT
          </span>
        ) : (
          <span className="product-badge">{translated.badge || 'LIMITADA'}</span>
        )}
      </Link>

      {/* Selector de colores en la tarjeta */}
      {product.availableColors && product.availableColors.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px 0', alignItems: 'center' }}>
          {product.availableColors.map(col => (
            <button
              key={col.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(col.name);
              }}
              title={`Color: ${translateColor(col.name, language)}`}
              className={`product-color-swatch ${selectedColor === col.name ? 'active' : ''}`}
              style={{
                backgroundColor: col.hex,
                border: selectedColor === col.name ? '2px solid #ff5500' : '1px solid rgba(255,255,255,0.3)',
              }}
            />
          ))}
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: '4px', textTransform: 'uppercase' }}>
            {translateColor(selectedColor, language)}
          </span>
        </div>
      )}

      <Link 
        href={productUrl}
        className="product-info" 
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
      >
        <div>
          <h3>{translated.name}</h3>
          <span>{translated.subtitle}</span>
        </div>
        <p>${product.price.toLocaleString('es-CO')} COP</p>
      </Link>
    </article>
  );
}


