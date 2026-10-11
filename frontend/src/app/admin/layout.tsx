import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NOCTIS URBANO | Administración',
  description: 'Panel de control y administración de NOCTIS URBANO Bogotá.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
