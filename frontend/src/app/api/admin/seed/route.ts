import { NextResponse } from 'next/server';
import { saveOrder } from '@/lib/wompi';
import { NOCTIS_PRODUCTS } from '@/data/products';
import { resetProductsToFactory } from '@/lib/productsStore';
import { Order } from '@/types';

export async function POST() {
  try {
    // Sincronizar y restaurar catálogo completo de prendas con colores e imágenes
    resetProductsToFactory();
    const demoOrders: Order[] = [
      {
        id: 'ord-demo-1',
        orderNumber: 'ORD-989338',
        reference: 'NOCTIS-M8A2-89338',
        accessToken: 'tok_demo_1',
        customerName: 'Mateo Julian Silva',
        customerEmail: 'mateo.silva@gmail.com',
        customerPhone: '3124567890',
        shippingAddress: 'Carrera 7 # 71-21 Torre B Apt 402',
        city: 'Bogotá D.C.',
        department: 'Cundinamarca',
        items: [
          {
            product: NOCTIS_PRODUCTS[0],
            size: 'L',
            color: 'Negro',
            quantity: 1
          },
          {
            product: NOCTIS_PRODUCTS[1] || NOCTIS_PRODUCTS[0],
            size: 'XL',
            color: 'Negro',
            quantity: 1
          }
        ],
        total: 360000,
        status: 'APPROVED',
        deliveryStatus: 'DESPACHADO',
        trackingNumber: 'SERVI-BOG-98214',
        transactionId: 'WOMPI-TRX-1092834',
        paymentMethod: 'CARD',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord-demo-2',
        orderNumber: 'ORD-442190',
        reference: 'NOCTIS-M9K3-44219',
        accessToken: 'tok_demo_2',
        customerName: 'Valeria Gómez Restrepo',
        customerEmail: 'valeria.gomez@hotmail.com',
        customerPhone: '3009876543',
        shippingAddress: 'Calle 10 # 43E-12 El Poblado',
        city: 'Medellín',
        department: 'Antioquia',
        items: [
          {
            product: NOCTIS_PRODUCTS[1] || NOCTIS_PRODUCTS[0],
            size: 'M',
            color: 'Gris',
            quantity: 1
          }
        ],
        total: 210000,
        status: 'APPROVED',
        deliveryStatus: 'EN_PREPARACION',
        transactionId: 'WOMPI-TRX-8827311',
        paymentMethod: 'NEQUI',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord-demo-3',
        orderNumber: 'ORD-119284',
        reference: 'NOCTIS-M9Z1-11928',
        accessToken: 'tok_demo_3',
        customerName: 'Carlos Andres Caicedo',
        customerEmail: 'caicedo.carlos@outlook.com',
        customerPhone: '3156781234',
        shippingAddress: 'Avenida 6N # 28N-04 Granada',
        city: 'Cali',
        department: 'Valle del Cauca',
        items: [
          {
            product: NOCTIS_PRODUCTS[0],
            size: 'S',
            color: 'Blanco',
            quantity: 2
          }
        ],
        total: 300000,
        status: 'PENDING',
        deliveryStatus: 'CREADO',
        paymentMethod: 'PSE',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord-demo-4',
        orderNumber: 'ORD-771239',
        reference: 'NOCTIS-M7X9-77123',
        accessToken: 'tok_demo_4',
        customerName: 'Laura Sofia Mendoza',
        customerEmail: 'laura.mendoza@empresa.co',
        customerPhone: '3187654321',
        shippingAddress: 'Carrera 51B # 84-10 Altamira',
        city: 'Barranquilla',
        department: 'Atlántico',
        items: [
          {
            product: NOCTIS_PRODUCTS[0],
            size: 'M',
            color: 'Rojo',
            quantity: 1
          }
        ],
        total: 150000,
        status: 'APPROVED',
        deliveryStatus: 'ENTREGADO',
        trackingNumber: 'ENVIA-BAQ-44910',
        transactionId: 'WOMPI-TRX-9988221',
        paymentMethod: 'CARD',
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    demoOrders.forEach(o => saveOrder(o));

    return NextResponse.json({ success: true, count: demoOrders.length });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al sembrar pedidos demo' }, { status: 500 });
  }
}
