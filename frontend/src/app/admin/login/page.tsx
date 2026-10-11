'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect_url') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMsg, setRecoveryMsg] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  useEffect(() => {
    document.title = 'NOCTIS URBANO | Administración';
  }, []);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || 'Credenciales inválidas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      setError('Error de conexión al intentar ingresar.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleQuickFill = () => {
    setEmail('admin@noctisurbano.com');
    setPassword('admin1234');
    executeLogin('admin@noctisurbano.com', 'admin1234');
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMsg('');
    setRecoveryLoading(true);

    try {
      const res = await fetch('/api/admin/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRecoveryMsg(data.message);
      } else {
        setRecoveryMsg(data.error || 'Error al solicitar recuperación.');
      }
    } catch (err) {
      setRecoveryMsg('Error de conexión.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      <style jsx global>{`
        .login-page-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: radial-gradient(circle at 50% 15%, #1d1519 0%, #0d0c10 50%, #060608 100%);
          font-family: inherit;
          color: #f5f5f7;
          position: relative;
          overflow: hidden;
        }
        .login-page-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(rgba(189, 74, 44, 0.12) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 32px 32px, 16px 16px;
          pointer-events: none;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(20, 18, 24, 0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 36px 32px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(189, 74, 44, 0.15);
          position: relative;
          z-index: 2;
        }
        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .login-kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #bd4a2c;
          margin: 0 0 6px 0;
        }
        .login-title {
          font-family: var(--font-display, Georgia, serif);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin: 0 0 6px 0;
          color: #ffffff;
        }
        .login-subtitle {
          font-size: 13px;
          color: #8e8e93;
          margin: 0;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #cfcfd4;
        }
        .input-field {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: #bd4a2c;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 2px rgba(189, 74, 44, 0.25);
        }
        .password-wrap {
          position: relative;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #8e8e93;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
        }
        .password-toggle:hover {
          color: #ffffff;
        }
        .login-btn-primary {
          margin-top: 6px;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #bd4a2c 0%, #8b1e0f 100%);
          border: none;
          border-radius: 6px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(189, 74, 44, 0.35);
        }
        .login-btn-primary:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }
        .login-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-btn-secondary {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #cfcfd4;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .login-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1.4;
        }
        .login-footer-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
        }
        .login-footer-links a, .login-footer-links button {
          color: #8e8e93;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          transition: color 0.2s ease;
        }
        .login-footer-links a:hover, .login-footer-links button:hover {
          color: #bd4a2c;
        }
        .recovery-box {
          margin-top: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
        }
      `}</style>

      <div className="login-card">
        <header className="login-header">
          <p className="login-kicker">Panel Administrativo</p>
          <h1 className="login-title">NOCTIS URBANO</h1>
          <p className="login-subtitle">Ingreso seguro para gestión de pedidos</p>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">Correo Administrativo</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="admin@noctisurbano.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-primary"
            disabled={loading}
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>

          <button
            type="button"
            className="login-btn-secondary"
            onClick={handleQuickFill}
          >
            ⚡ Acceso Rápido Demo (admin@noctisurbano.com)
          </button>
        </form>

        {showRecovery && (
          <div className="recovery-box">
            <p style={{ fontSize: '12px', color: '#cfcfd4', margin: '0 0 10px 0', fontWeight: 700 }}>
              Recuperación de Contraseña
            </p>
            <form onSubmit={handleRecoverySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="email"
                required
                className="input-field"
                placeholder="Ingresa tu correo registrado"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
              <button
                type="submit"
                className="login-btn-primary"
                style={{ padding: '8px', fontSize: '11px' }}
                disabled={recoveryLoading}
              >
                {recoveryLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
            {recoveryMsg && (
              <p style={{ fontSize: '11px', color: '#4ade80', margin: '8px 0 0 0', lineHeight: 1.3 }}>
                {recoveryMsg}
              </p>
            )}
          </div>
        )}

        <footer className="login-footer-links">
          <Link href="/">← Volver a la Tienda</Link>
          <button type="button" onClick={() => setShowRecovery(!showRecovery)}>
            {showRecovery ? 'Cerrar ayuda' : '¿Olvidaste tu contraseña?'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="login-page-root" style={{ color: '#fff' }}>Cargando portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
