'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WompiCheckoutModal from '@/components/WompiCheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import AccountModal from '@/components/AccountModal';
import AiAssistant from '@/components/AiAssistant';
import CookieBanner from '@/components/CookieBanner';
import CategoriesDrawer from '@/components/CategoriesDrawer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAuthPage) {
    return (
      <div className="auth-fullscreen-wrap">
        {children}
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <div className="admin-fullscreen-wrap">
        {children}
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <WompiCheckoutModal />
      <OrderTrackingModal />
      <AccountModal />
      <ScrollToTopButton />
      <AiAssistant />
      <CookieBanner />
      <CategoriesDrawer />
      <WhatsAppFloatingButton />
    </div>
  );
}
