'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleIcon } from '@/components/icons';

export default function ClientSignUpPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState<number>(120);

  // Contador regresivo de 2 minutos para reenviar correo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Paso 1: Enviar correo y código
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(lang === 'EN' ? 'Please enter a valid email address' : 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          email: cleanEmail
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar código');
      }

      setOtpCode('');
      setTimer(120); // Iniciar cronómetro de 2 minutos
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código y completar registro con contraseña
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError(lang === 'EN' ? 'Please enter the 6-digit verification code' : 'Por favor ingresa el código de verificación de 6 dígitos');
      return;
    }

    if (!password || password.length < 6) {
      setError(lang === 'EN' ? 'Password must be at least 6 characters long' : 'La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === 'EN' ? 'Passwords do not match' : 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim();
      const userName = name.trim() || cleanEmail.split('@')[0].toUpperCase();

      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: cleanEmail,
          name: userName,
          password: password.trim(),
          code: otpCode.trim(),
          city: 'Bogotá D.C.',
          phone: ''
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Código incorrecto');
      }

      const userSession = data.user || {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        name: userName,
        role: 'CLIENTE',
        city: 'Bogotá D.C.'
      };

      localStorage.setItem('noctis_client_user', JSON.stringify(userSession));
      setSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  // Google 1-Click
  const handleGoogleAuth = () => {
    const googleUser = {
      id: `usr-g-${Date.now()}`,
      name: 'Felipe Villamil',
      email: 'felipe.google@gmail.com',
      role: 'CLIENTE',
      city: 'Bogotá D.C.'
    };
    localStorage.setItem('noctis_client_user', JSON.stringify(googleUser));
    window.dispatchEvent(new Event('noctis-user-updated'));
    setSuccess(true);
    setTimeout(() => router.push('/'), 1000);
  };

  const handleQuickDemoLogin = () => {
    const demoClientUser = {
      id: 'usr-felipe-demo',
      email: 'felipe@prueba.com',
      name: 'Felipe Villamil',
      role: 'CLIENTE',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      phone: '313 585 9810'
    };
    localStorage.setItem('noctis_client_user', JSON.stringify(demoClientUser));
    window.dispatchEvent(new Event('noctis-user-updated'));
    setSuccess(true);
    setTimeout(() => router.push('/'), 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(255, 85, 0, 0.08), transparent 70%), linear-gradient(180deg, #050505 0%, #0c0c0e 100%)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 16px',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)'
    }}>
      {/* Top Brand Bar */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 900, letterSpacing: '0.18em', fontSize: '0.95rem' }}>
          NOCTIS URBANO
        </Link>
        <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          ← {lang === 'EN' ? 'Back to Store' : 'Volver a la Tienda'}
        </Link>
      </div>

      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#0f0f12',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 8px', textTransform: 'uppercase' }}>
            {step === 'email' 
              ? (lang === 'EN' ? 'Create Account' : 'Crear Cuenta')
              : (lang === 'EN' ? 'Check Your Inbox' : 'Revisa tu Correo')}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            {step === 'email' ? (
              lang === 'EN'
                ? 'Access limited streetwear drops, order tracking, and private notifications.'
                : 'Accede a drops exclusivos, seguimiento de pedidos y beneficios de la marca.'
            ) : (
              lang === 'EN' ? (
                <>
                  We sent a security code to <strong style={{ color: '#ffffff' }}>{email}</strong>. Enter it to activate your account. If you don&apos;t see it, please check your <strong>Spam or Junk</strong> folder.
                </>
              ) : (
                <>
                  Enviamos un código de seguridad a <strong style={{ color: '#ffffff' }}>{email}</strong>. Ingrésalo para activar tu cuenta (si no lo ves, revisa tu carpeta de <strong>Spam o No deseados</strong>).
                </>
              )
            )}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            marginBottom: '20px'
          }}>
            ✕ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#4ade80',
            padding: '10px 14px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ✓ {lang === 'EN' ? 'Account verified! Redirecting to store...' : '¡Cuenta verificada! Redirigiendo a la tienda...'}
          </div>
        )}

        {step === 'email' ? (
          /* PASO 1: Google + Correo Simple */
          <div>
            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '13px 16px',
                borderRadius: '4px',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
                marginBottom: '20px'
              }}
            >
              <GoogleIcon size={18} />
              <span>{lang === 'EN' ? 'Sign up with Google' : 'Registrarse con Google'}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              <span style={{ fontSize: '0.7rem', color: '#71717a', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>
                {lang === 'EN' ? 'Or with email' : 'O con tu correo'}
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            </div>

            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {lang === 'EN' ? 'Email Address' : 'Correo Electrónico'}
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    backgroundColor: '#050507',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  minHeight: '52px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                <span>
                  {loading ? (lang === 'EN' ? 'SENDING CODE...' : 'ENVIANDO CÓDIGO...') : (lang === 'EN' ? 'CONTINUE WITH EMAIL' : 'CONTINUAR CON CORREO')}
                </span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(189, 74, 44, 0.1)',
                  border: '1px dashed rgba(189, 74, 44, 0.6)',
                  color: '#ff6b4a',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>⚡ Acceso Rápido Demo (felipe@prueba.com)</span>
              </button>

              {/* Legal disclaimer */}
              <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#71717a', lineHeight: 1.5, textAlign: 'center' }}>
                {lang === 'EN' ? (
                  <>
                    By continuing, you agree to NOCTIS URBANO&apos;s{' '}
                    <Link href="/terminos" target="_blank" style={{ color: '#d4d4d8', textDecoration: 'underline' }}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacidad" target="_blank" style={{ color: '#d4d4d8', textDecoration: 'underline' }}>
                      Privacy Policy
                    </Link>.
                  </>
                ) : (
                  <>
                    Si continúas, aceptas los{' '}
                    <Link href="/terminos" target="_blank" style={{ color: '#d4d4d8', textDecoration: 'underline' }}>
                      términos del servicio
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacidad" target="_blank" style={{ color: '#d4d4d8', textDecoration: 'underline' }}>
                      política de privacidad
                    </Link>{' '}
                    de NOCTIS URBANO.
                  </>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* PASO 2: Ingresar Código y Completar */
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? '6-Digit Security Code *' : 'Código de Seguridad (6 dígitos) *'}
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  backgroundColor: '#050507',
                  border: '1px solid rgba(255, 85, 0, 0.4)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.25em',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Your Name (Optional)' : 'Tu Nombre (Opcional)'}
              </label>
              <input
                type="text"
                placeholder="Ej: Camilo Martínez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#050507',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Create Password *' : 'Crear Contraseña *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={lang === 'EN' ? 'Minimum 6 characters' : 'Mínimo 6 caracteres'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    backgroundColor: '#050507',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                  title={showPassword ? (lang === 'EN' ? 'Hide password' : 'Ocultar contraseña') : (lang === 'EN' ? 'Show password' : 'Mostrar contraseña')}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Repeat Password *' : 'Repetir Contraseña *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={lang === 'EN' ? 'Confirm your password' : 'Confirma tu contraseña'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    backgroundColor: '#050507',
                    border: confirmPassword && confirmPassword !== password ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                  title={showPassword ? (lang === 'EN' ? 'Hide password' : 'Ocultar contraseña') : (lang === 'EN' ? 'Show password' : 'Mostrar contraseña')}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <span style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '4px', display: 'block' }}>
                  {lang === 'EN' ? 'Passwords do not match' : 'Las contraseñas no coinciden'}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '8px',
                minHeight: '52px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span>
                {loading ? (lang === 'EN' ? 'VERIFYING...' : 'VERIFICANDO...') : (lang === 'EN' ? 'VERIFY & ENTER' : 'VERIFICAR Y ENTRAR')}
              </span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.78rem' }}>
              <button
                type="button"
                onClick={() => { setStep('email'); setError(null); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← {lang === 'EN' ? 'Change email' : 'Cambiar correo'}
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={loading || timer > 0}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: timer > 0 ? '#71717a' : '#ff7733',
                  cursor: loading || timer > 0 ? 'not-allowed' : 'pointer',
                  padding: 0,
                  textDecoration: timer > 0 ? 'none' : 'underline',
                  fontWeight: timer > 0 ? 500 : 700,
                  fontSize: '0.78rem'
                }}
              >
                {timer > 0
                  ? (lang === 'EN' ? `Resend in ${formatTimer(timer)}` : `Reenviar en ${formatTimer(timer)}`)
                  : (lang === 'EN' ? 'Resend code' : 'Reenviar código')}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#71717a', margin: 0 }}>
            {lang === 'EN' ? 'Already have an account?' : '¿Ya tienes una cuenta?'} {' '}
            <Link href="/sign-in" style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'none' }}>
              {lang === 'EN' ? 'Sign In' : 'Iniciar Sesión'}
            </Link>
          </p>
        </div>
      </div>

      {/* Footer link to admin login */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', color: '#52525b', margin: 0 }}>
          {lang === 'EN' ? 'Store Administrator?' : '¿Eres administrador de la tienda?'} {' '}
          <Link href="/admin/login" style={{ color: '#a1a1aa', textDecoration: 'underline' }}>
            {lang === 'EN' ? 'Admin Control Login' : 'Acceso Administrativo'}
          </Link>
        </p>
      </div>

    </div>
  );
}
