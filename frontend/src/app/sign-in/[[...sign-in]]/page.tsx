'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { GoogleIcon } from '@/components/icons';

export default function ClientSignInPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();

  // Mode: 'login' | 'forgot-email' | 'forgot-verify'
  const [view, setView] = useState<'login' | 'forgot-email' | 'forgot-verify'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [timer, setTimer] = useState<number>(120);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cronómetro de reenvío para recuperación
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (view === 'forgot-verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(lang === 'EN' ? 'Please enter your email and password' : 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('noctis_client_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('noctis-user-updated'));
      setSuccess(lang === 'EN' ? 'Welcome back! Redirecting...' : '¡Bienvenido! Redirigiendo a la tienda...');

      setTimeout(() => {
        router.push('/');
      }, 1100);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
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
    setSuccess(lang === 'EN' ? 'Welcome Felipe! Redirecting...' : '¡Bienvenido Felipe Villamil! Ingresando...');
    setTimeout(() => router.push('/'), 800);
  };

  // 2. Submit Solicitud de Código para Recuperar Contraseña
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = forgotEmail.trim();
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
          action: 'forgot-password-otp',
          email: cleanEmail
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar código');
      }

      setForgotOtp('');
      setTimer(120);
      setView('forgot-verify');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Restablecer Nueva Contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!forgotOtp.trim() || forgotOtp.trim().length < 6) {
      setError(lang === 'EN' ? 'Please enter the 6-digit code' : 'Por favor ingresa el código de 6 dígitos');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError(lang === 'EN' ? 'New password must be at least 6 characters' : 'La nueva contraseña debe tener mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(lang === 'EN' ? 'Passwords do not match' : 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset-password',
          email: forgotEmail.trim(),
          code: forgotOtp.trim(),
          password: newPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al restablecer contraseña');
      }

      setSuccess(lang === 'EN' ? 'Password updated! Please sign in.' : '¡Contraseña actualizada exitosamente! Inicia sesión.');
      setEmail(forgotEmail.trim());
      setPassword('');
      setView('login');
    } catch (err: any) {
      setError(err.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
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
        {/* Title Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 8px', textTransform: 'uppercase' }}>
            {view === 'login' && (lang === 'EN' ? 'Sign In' : 'Iniciar Sesión')}
            {view === 'forgot-email' && (lang === 'EN' ? 'Recover Password' : 'Recuperar Contraseña')}
            {view === 'forgot-verify' && (lang === 'EN' ? 'New Password' : 'Nueva Contraseña')}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            {view === 'login' && (lang === 'EN' ? 'Enter your email and password to access your account.' : 'Ingresa tu correo y contraseña para acceder a tu cuenta.')}
            {view === 'forgot-email' && (lang === 'EN' ? 'Enter your registered email to receive a recovery code.' : 'Ingresa tu correo registrado para recibir un código de seguridad.')}
            {view === 'forgot-verify' && (lang === 'EN' ? `Enter the 6-digit code sent to ${forgotEmail} and set a new password.` : `Ingresa el código de 6 dígitos enviado a ${forgotEmail} y crea tu nueva contraseña.`)}
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
            ✓ {success}
          </div>
        )}

        {/* 1. VISTA DE INICIO DE SESIÓN */}
        {view === 'login' && (
          <div>
            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={() => {
                const demoGoogleUser = {
                  id: `usr-g-${Date.now()}`,
                  name: 'Usuario Google',
                  email: 'usuario.google@gmail.com',
                  role: 'CLIENTE',
                  city: 'Bogotá D.C.'
                };
                localStorage.setItem('noctis_client_user', JSON.stringify(demoGoogleUser));
                setSuccess(lang === 'EN' ? 'Welcome back! Redirecting...' : '¡Bienvenido! Redirigiendo...');
                setTimeout(() => router.push('/'), 1000);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '12px 16px',
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
              <span>{lang === 'EN' ? 'Continue with Google' : 'Continuar con Google'}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              <span style={{ fontSize: '0.7rem', color: '#71717a', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>
                {lang === 'EN' ? 'Or with email' : 'O con tu correo'}
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', textTransform: 'uppercase' }}>
                    {lang === 'EN' ? 'Password' : 'Contraseña'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email || '');
                      setError(null);
                      setView('forgot-email');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff7733',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    {lang === 'EN' ? 'Forgot password?' : '¿Olvidaste tu contraseña?'}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                      padding: '4px'
                    }}
                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#ff5500', cursor: 'pointer' }}
                />
                <label htmlFor="remember" style={{ fontSize: '0.78rem', color: '#a1a1aa', cursor: 'pointer' }}>
                  {lang === 'EN' ? 'Keep me signed in' : 'Mantener mi sesión activa'}
                </label>
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
                  {loading ? (lang === 'EN' ? 'SIGNING IN...' : 'VERIFICANDO...') : (lang === 'EN' ? 'INICIAR SESIÓN' : 'INICIAR SESIÓN')}
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
            </form>
          </div>
        )}

        {/* 2. VISTA DE RECUPERACIÓN - PASO 1 (INGRESAR CORREO) */}
        {view === 'forgot-email' && (
          <form onSubmit={handleSendForgotOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Registered Email' : 'Correo Electrónico Registrado'}
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                autoFocus
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
                {loading ? (lang === 'EN' ? 'SENDING CODE...' : 'ENVIANDO CÓDIGO...') : (lang === 'EN' ? 'SEND SECURITY CODE' : 'ENVIAR CÓDIGO DE SEGURIDAD')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setView('login'); setError(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} />
              <span>{lang === 'EN' ? 'Back to Sign In' : 'Volver a Iniciar Sesión'}</span>
            </button>
          </form>
        )}

        {/* 3. VISTA DE RECUPERACIÓN - PASO 2 (INGRESAR CÓDIGO Y NUEVA CONTRASEÑA) */}
        {view === 'forgot-verify' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? '6-Digit Security Code *' : 'Código de Seguridad (6 dígitos) *'}
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
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
                {lang === 'EN' ? 'New Password *' : 'Nueva Contraseña *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={lang === 'EN' ? 'Minimum 6 characters' : 'Mínimo 6 caracteres'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#d4d4d8', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Confirm New Password *' : 'Confirmar Nueva Contraseña *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={lang === 'EN' ? 'Repeat new password' : 'Repite tu nueva contraseña'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    backgroundColor: '#050507',
                    border: confirmNewPassword && confirmNewPassword !== newPassword ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
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
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmNewPassword && confirmNewPassword !== newPassword && (
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
                {loading ? (lang === 'EN' ? 'UPDATING...' : 'ACTUALIZANDO...') : (lang === 'EN' ? 'SET NEW PASSWORD' : 'ESTABLECER NUEVA CONTRASEÑA')}
              </span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.78rem' }}>
              <button
                type="button"
                onClick={() => { setView('login'); setError(null); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a1a1aa',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← {lang === 'EN' ? 'Cancel' : 'Cancelar'}
              </button>

              <button
                type="button"
                onClick={handleSendForgotOtp}
                disabled={loading || timer > 0}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: timer > 0 ? '#71717a' : '#ff7733',
                  cursor: loading || timer > 0 ? 'not-allowed' : 'pointer',
                  padding: 0,
                  textDecoration: timer > 0 ? 'none' : 'underline',
                  fontWeight: timer > 0 ? 500 : 700
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
            {lang === 'EN' ? "Don't have an account yet?" : '¿Aún no tienes una cuenta?'} {' '}
            <Link href="/sign-up" style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'none' }}>
              {lang === 'EN' ? 'Create an Account' : 'Crear una cuenta'}
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
