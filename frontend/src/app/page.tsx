'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import DropSignal from '@/components/DropSignal';
import IdentitySection from '@/components/IdentitySection';
import ProductGrid from '@/components/ProductGrid';
import BogotaNightVideo from '@/components/BogotaNightVideo';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { NOCTIS_PRODUCTS } from '@/data/products';
import { Product, ProductSize } from '@/types';

const FEATURED_LOOKBOOK_IMAGES: Record<string, string> = {
  'Negro': '/assets/products/tee/candelaria_yerba_tee_negro.png',
  'Blanco': '/assets/products/tee/candelaria_yerba_tee_blanco.png',
  'Gris': '/assets/products/tee/candelaria_yerba_tee_gris.png',
  'Rojo': '/assets/products/tee/candelaria_yerba_tee_rojo.png',
  'Verde': '/assets/products/tee/candelaria_yerba_tee_verde.png',
};

export default function HomePage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [featuredSize, setFeaturedSize] = useState<ProductSize>('S');
  const [featuredColor, setFeaturedColor] = useState<string>('Negro');
  const [shadowPalm, setShadowPalm] = useState<Product>(NOCTIS_PRODUCTS[0]);
  const [contactData, setContactData] = useState<{
    heading: string;
    subtitle: string;
    phoneDisplay: string;
    whatsappNumber: string;
    email: string;
    instagram: string;
    tiktok: string;
  }>({
    heading: '',
    subtitle: '',
    phoneDisplay: '',
    whatsappNumber: '',
    email: '',
    instagram: '',
    tiktok: ''
  });

  useEffect(() => {
    const loadSettings = () => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings) {
            setContactData({
              heading: data.settings.contactHeading || '',
              subtitle: data.settings.contactSubtitle || '',
              phoneDisplay: data.settings.contactPhoneDisplay || '',
              whatsappNumber: (data.settings.whatsappNumber || '').replace(/\D/g, ''),
              email: data.settings.contactEmail || '',
              instagram: data.settings.contactInstagram || '',
              tiktok: data.settings.contactTiktok || ''
            });
          }
        })
        .catch(() => {});
    };

    loadSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'noctis_settings_sync') {
        loadSettings();
      }
    };

    window.addEventListener('focus', loadSettings);
    window.addEventListener('noctis-settings-updated', loadSettings);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', loadSettings);
      window.removeEventListener('noctis-settings-updated', loadSettings);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const loadFeatured = () => {
      fetch('/api/admin/products')
        .then(res => res.json())
        .then(data => {
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            const found = data.products.find((p: Product) => p.id === 'prod-shadow-palm-tee' || p.name.toUpperCase().includes('SHADOW'));
            if (found) setShadowPalm(found);
          }
        })
        .catch(() => {});
    };

    loadFeatured();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'noctis_catalog_sync') {
        loadFeatured();
      }
    };

    window.addEventListener('focus', loadFeatured);
    window.addEventListener('noctis-catalog-updated', loadFeatured);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', loadFeatured);
      window.removeEventListener('noctis-catalog-updated', loadFeatured);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAddFeatured = () => {
    addToCart(shadowPalm, featuredSize, 1, featuredColor);
  };

  const featuredImage = FEATURED_LOOKBOOK_IMAGES[featuredColor] || '/assets/products/tee/candelaria_yerba_tee_negro.png';

  return (
    <main id="top">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Drop Signal */}
      <DropSignal />

      {/* 3. Identidad de Marca */}
      <IdentitySection />

      {/* 4. Manifiesto */}
      <section className="manifesto section-dark">
        <div className="manifesto-grid">
          <p>{t('manifesto.p1')}</p>
          <p>{t('manifesto.p2')}</p>
          <p>{t('manifesto.p3')}</p>
        </div>
      </section>

      {/* 5. Catálogo de Productos */}
      <ProductGrid />

      {/* 6. Pieza Principal Destacada */}
      <section className="featured split-section">
        <figure className="featured-image">
          <img src={featuredImage} alt={`Muestra SHADOW HERB TEE ${featuredColor} en La Candelaria Bogotá`} />
        </figure>
        <div className="featured-copy">
          <p className="kicker">{t('featured.kicker')}</p>
          <h2>SHADOW HERB TEE</h2>
          <p className="feature-note">
            {t('featured.note')}
          </p>
          <ul>
            <li>{t('featured.f1')}</li>
            <li>{t('featured.f2')}</li>
            <li>{t('featured.f3')}</li>
            <li>{t('featured.f4')}</li>
          </ul>

          {/* Selector de color de la pieza principal */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--white)', marginBottom: '8px' }}>
              Color: <span style={{ color: '#ff5500' }}>{featuredColor}</span>
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {shadowPalm.availableColors?.map(col => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setFeaturedColor(col.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: featuredColor === col.name ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.05)',
                    border: featuredColor === col.name ? '1px solid #ff5500' : '1px solid var(--line)',
                    cursor: 'pointer',
                    color: 'var(--white)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: col.hex,
                      border: '1px solid rgba(255,255,255,0.4)',
                      display: 'inline-block'
                    }}
                  />
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          <div className="size-row" aria-label="Seleccionar talla">
            {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => setFeaturedSize(size)}
                className={`size-option ${featuredSize === size ? 'is-selected' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
          <button 
            className="btn btn-secondary" 
            type="button"
            onClick={handleAddFeatured}
          >
            AGREGAR AL CARRITO (${shadowPalm.price.toLocaleString('es-CO')} COP)
          </button>
        </div>
      </section>

      {/* 7. Construcción & Calidad */}
      <section className="craft section-dark" aria-label="Detalles de construcción">
        <div className="craft-item">
          <span>01</span>
          <h3>Peso premium</h3>
          <p>Algodón 240g denso y térmico. Presencia sobria que abriga en la noche capitalina.</p>
        </div>
        <div className="craft-item">
          <span>02</span>
          <h3>Marca sutil</h3>
          <p>Logos pequeños, prints oscuros, identidad para quien mira dos veces.</p>
        </div>
        <div className="craft-item">
          <span>03</span>
          <h3>Corte urbano</h3>
          <p>Hombro caído, volumen controlado, silueta boxy ideal para layering en Bogotá.</p>
        </div>
      </section>

      {/* 8. Ciudad Bogotá con Video */}
      <section className="city section-dark" aria-label="Identidad Bogotá">
        <div className="city-bg" aria-hidden="true">
          <BogotaNightVideo />
        </div>

        <div className="city-copy">
          <p>
            Frío andino.<br />
            Sombra urbana.
          </p>
          <h2>
            Esto no es streetwear global.<br />
            Esto es Bogotá D.C.
          </h2>
        </div>

        {/* Badge Sello Atmosférico Bogotá */}
        <div className="city-badge-sello">
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', boxShadow: '0 0 8px #ef4444' }}></span>
          <span>BOGOTÁ NOCTURNA • 2.600 M.S.N.M.</span>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="final-cta section-dark">
        <div className="final-cta-bg" aria-hidden="true" style={{ backgroundImage: "url('/assets/brand/noctis_stone_background.jpg')" }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p className="kicker">Acceso limitado</p>
          <h2>No es para todos.</h2>
          <a className="btn btn-primary" href="#drop"><span>COMPRAR AHORA</span></a>
        </div>
      </section>

      {/* 10. Contacto */}
      <section className="contact section-dark" id="contacto">
        <div className="contact-copy">
          <p className="kicker">Contacto directo</p>
          <h2>{contactData.heading}</h2>
          <p>
            {contactData.subtitle}
          </p>
        </div>
        <div className="contact-actions">
          <a className="contact-link" href={`https://wa.me/${contactData.whatsappNumber}`} target="_blank" rel="noreferrer">
            <span>WhatsApp Bogotá</span>
            <strong>{contactData.phoneDisplay}</strong>
          </a>
          <a className="contact-link" href={`mailto:${contactData.email}`}>
            <span>Correo</span>
            <strong>{contactData.email}</strong>
          </a>
          <a 
            className="contact-link" 
            href={`https://www.instagram.com/${contactData.instagram.replace('@', '')}/`} 
            target="_blank" 
            rel="noreferrer"
          >
            <span>Instagram</span>
            <strong>{contactData.instagram}</strong>
          </a>
          <a 
            className="contact-link" 
            href={`https://www.tiktok.com/@${contactData.tiktok.replace('@', '')}`} 
            target="_blank" 
            rel="noreferrer"
          >
            <span>TikTok</span>
            <strong>{contactData.tiktok}</strong>
          </a>
        </div>
      </section>
    </main>
  );
}
