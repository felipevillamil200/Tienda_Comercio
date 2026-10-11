import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductSize } from '@/types';
import { translateColor } from '@/lib/i18n';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface ChatProductCardProps {
  product: Product;
  onOpenDetail?: (p: Product) => void;
  onAddToCart: (p: Product, size: ProductSize, color: string) => void;
  language: 'ES' | 'EN';
}

/**
 * Interactive Product Card rendered inside the chat window
 */
export function ChatProductCard({ 
  product, 
  onOpenDetail, 
  onAddToCart,
  language
}: ChatProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>(product.availableColors?.[0]?.name || 'Negro');
  const [selectedSize, setSelectedSize] = useState<ProductSize>((product.availableSizes?.[0] as ProductSize) || 'M');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeColorObj = product.availableColors?.find(c => c.name === selectedColor);
  const displayImage = activeColorObj?.image || product.image;
  const stockQty = product.stock ?? 0;
  const isSoldOut = stockQty <= 0;
  const productUrl = `/producto/${product.id}`;

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  return (
    <div style={{
      background: '#0d0d10',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link 
          href={productUrl}
          style={{ 
            width: '68px', 
            height: '68px', 
            borderRadius: '6px', 
            overflow: 'hidden', 
            background: '#18181b', 
            flexShrink: 0,
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'block'
          }}
          title="Ver ficha técnica completa"
        >
          <img 
            src={displayImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Link 
              href={productUrl}
              style={{ 
                margin: 0, 
                fontSize: '0.82rem', 
                color: '#ffffff', 
                fontWeight: 800, 
                letterSpacing: '0.04em',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              {product.name}
            </Link>
          </div>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.68rem', color: '#a1a1aa' }}>
            {product.subtitle}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <strong style={{ fontSize: '0.82rem', color: '#ff5500', fontWeight: 900 }}>
              ${product.price.toLocaleString('es-CO')} COP
            </strong>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              background: isSoldOut ? 'rgba(239, 68, 68, 0.2)' : stockQty <= 5 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: isSoldOut ? '#ef4444' : stockQty <= 5 ? '#eab308' : '#4ade80',
              border: `1px solid ${isSoldOut ? 'rgba(239, 68, 68, 0.4)' : stockQty <= 5 ? 'rgba(234, 179, 8, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`
            }}>
              {isSoldOut ? 'AGOTADO' : stockQty <= 5 ? `Últimas ${stockQty} un.` : `Stock: ${stockQty} un.`}
            </span>
          </div>
        </div>
      </div>

      {/* Selectores de Color y Talla */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Colores */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {product.availableColors.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: selectedColor === c.name ? '2px solid #ff5500' : '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transform: selectedColor === c.name ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
                title={`Color ${translateColor(c.name, language)}`}
              />
            ))}
          </div>
        )}

        {/* Tallas */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {product.availableSizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '2px 6px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  borderRadius: '3px',
                  backgroundColor: selectedSize === size ? '#ffffff' : 'rgba(255,255,255,0.06)',
                  color: selectedSize === size ? '#000000' : '#ffffff',
                  border: selectedSize === size ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <Link
          href={productUrl}
          style={{
            flex: 1,
            padding: '7px 10px',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            textDecoration: 'none'
          }}
        >
          <Eye size={12} />
          {language === 'EN' ? 'VIEW FULL' : 'VER EN DETALLE'}
        </Link>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isSoldOut}
          style={{
            flex: 1,
            padding: '7px 10px',
            fontSize: '0.68rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            background: addedFeedback ? '#22c55e' : '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            cursor: isSoldOut ? 'not-allowed' : 'pointer',
            opacity: isSoldOut ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all 0.2s ease'
          }}
        >
          {addedFeedback ? (
            <>
              <Check size={12} />
              {language === 'EN' ? 'ADDED!' : '¡AGREGADO!'}
            </>
          ) : (
            <>
              <ShoppingBag size={12} />
              {language === 'EN' ? '+ ADD TO BAG' : '+ AGREGAR'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
