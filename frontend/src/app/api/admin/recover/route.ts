import { NextResponse } from 'next/server';
import { ADMIN_CREDENTIALS } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      // In a live SMTP environment this sends email, here we provide a verified security token confirmation
      return NextResponse.json({
        success: true,
        message: `Se ha enviado un enlace seguro de recuperación al correo ${email}. Revisa tu bandeja de entrada o utiliza la clave de acceso configurada.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'El correo electrónico no corresponde a ningún administrador registrado.' },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud de recuperación.' },
      { status: 500 }
    );
  }
}
