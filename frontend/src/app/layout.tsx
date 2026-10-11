import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'NOCTIS URBANO | Noches de Bogotá',
  description: 'NOCTIS URBANO es streetwear premium nacido en Bogotá. 2.600 metros de altura. Frío andino. Sombra urbana. Pagos con Wompi y Asesor de Estilo con IA.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#020202',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            <ClientShell>{children}</ClientShell>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
