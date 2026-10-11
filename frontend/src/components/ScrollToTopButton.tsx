'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ScrollToTopButton() {
  const { isCartOpen, isAiOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 260) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible || isAiOpen) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="scroll-to-top-btn"
      aria-label="Volver arriba / Ir al encabezado"
      title="Volver al encabezado"
      style={{
        position: 'fixed',
        bottom: '136px',
        right: isCartOpen ? 'calc(min(100vw, 450px) + 20px)' : '20px',
        zIndex: 50,
        width: '42px',
        height: '42px',
        borderRadius: '8px',
        backgroundColor: '#0c0c0e',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(8px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#ff5500';
        e.currentTarget.style.borderColor = '#ff5500';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(255, 85, 0, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#0c0c0e';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
      }}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}
