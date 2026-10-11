'use client';

import React, { useState } from 'react';
import { Plus, Tag, Trash2, CheckCircle2, MessageSquare, Phone, Mail, Instagram, Music, Settings, Truck, ShieldCheck, Lock, Power, Gift, Image as ImageIcon, Upload, FolderOpen, ChevronLeft, Edit3, X, Database, Sparkles, ExternalLink } from 'lucide-react';
import { Coupon } from '@/types';
import { TargetIcon, PackageIcon, TruckIcon as SvgTruck, EyeIcon, SparklesIcon, HelpInfoIcon } from '@/components/icons';

export interface SettingsState {
  announcementText: string;
  announcementActive: boolean;
  freeShippingActive?: boolean;
  freeShippingThreshold: number;
  standardShippingCost: number;
  freeGiftActive?: boolean;
  freeGiftThreshold?: number;
  freeGiftName?: string;
  freeGiftDescription?: string;
  freeGiftImage?: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappTooltip: string;
  contactHeading: string;
  contactSubtitle: string;
  contactPhoneDisplay: string;
  contactEmail: string;
  contactInstagram: string;
  contactTiktok: string;
}

interface SettingsTabProps {
  coupons: Coupon[];
  setEditingCoupon: (c: Partial<Coupon> | null) => void;
  setIsCouponModalOpen: (val: boolean) => void;
  handleDeleteCoupon: (id: string) => void;
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  handleSaveSettings: (e: React.FormEvent) => void;
  actionLoading: boolean;
}

export default function SettingsTab({
  coupons,
  setEditingCoupon,
  setIsCouponModalOpen,
  handleDeleteCoupon,
  settings,
  setSettings,
  handleSaveSettings,
  actionLoading
}: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState<'contact' | 'promotions' | 'shipping'>('contact');
  const [mobileSubView, setMobileSubView] = useState<'menu' | 'detail'>('menu');
  const [contactEditSection, setContactEditSection] = useState<'none' | 'contact' | 'whatsapp'>('none');

  const handleToggleShipping = async (newVal: boolean) => {
    const updated = { ...settings, freeShippingActive: newVal };
    setSettings(updated);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings: updated })
      });
      localStorage.setItem('noctis_settings_sync', Date.now().toString());
      window.dispatchEvent(new Event('noctis-settings-updated'));
    } catch {}
  };

  const handleToggleGift = async (newVal: boolean) => {
    const updated = { ...settings, freeGiftActive: newVal };
    setSettings(updated);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_settings', settings: updated })
      });
      localStorage.setItem('noctis_settings_sync', Date.now().toString());
      window.dispatchEvent(new Event('noctis-settings-updated'));
    } catch {}
  };

  const handleGiftImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSettings(s => ({ ...s, freeGiftImage: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="tab-pane">
      {/* Cabecera Principal */}
      <div 
        className={`settings-main-header ${mobileSubView === 'detail' ? 'mobile-hidden' : ''}`}
        style={{
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#ffffff' }}>
          Configuración Tienda & Operaciones
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '4px 0 0' }}>
          Administra la información de contacto directo de la marca, cupones y la meta de envío gratis.
        </p>
      </div>

      {/* Disposición Adaptable: Menú a la izquierda en Desktop / Apilado en Móvil */}
      <div className="admin-settings-layout">
        {/* COLUMNA IZQUIERDA: Menú de Sub-secciones */}
        <div className={`admin-settings-subnav ${mobileSubView === 'menu' ? 'mobile-visible' : 'mobile-hidden'}`}>
          {/* Botón 1: Ajustes Contacto */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('contact');
              setMobileSubView('detail');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '8px',
              border: activeSection === 'contact' ? '1px solid #ff5500' : '1px solid transparent',
              backgroundColor: activeSection === 'contact' ? '#1f1a18' : 'transparent',
              color: activeSection === 'contact' ? '#ffffff' : '#a1a1aa',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: activeSection === 'contact' ? '#ff5500' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: activeSection === 'contact' ? '#ffffff' : '#d4d4d8' }}>
                  Ajustes Contacto
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                  Datos visibles, WhatsApp y redes
                </span>
              </div>
            </div>
          </button>

          {/* Botón 2: Promociones */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('promotions');
              setMobileSubView('detail');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '8px',
              border: activeSection === 'promotions' ? '1px solid #ff5500' : '1px solid transparent',
              backgroundColor: activeSection === 'promotions' ? '#1f1a18' : 'transparent',
              color: activeSection === 'promotions' ? '#ffffff' : '#a1a1aa',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: activeSection === 'promotions' ? '#ff5500' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Tag size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: activeSection === 'promotions' ? '#ffffff' : '#d4d4d8' }}>
                  Promociones
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                  Cupones de descuento
                </span>
              </div>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: activeSection === 'promotions' ? '#ff5500' : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }}>
              {coupons.length}
            </span>
          </button>

          {/* Botón 3: Ajustar Carrito de Selección */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('shipping');
              setMobileSubView('detail');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '8px',
              border: activeSection === 'shipping' ? '1px solid #ff5500' : '1px solid transparent',
              backgroundColor: activeSection === 'shipping' ? '#1f1a18' : 'transparent',
              color: activeSection === 'shipping' ? '#ffffff' : '#a1a1aa',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: activeSection === 'shipping' ? '#ff5500' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Truck size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: activeSection === 'shipping' ? '#ffffff' : '#d4d4d8' }}>
                  Ajustar Carrito de Selección
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                  Envío gratis, regalos e incentivos
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: settings.freeShippingActive !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: settings.freeShippingActive !== false ? '#22c55e' : '#eab308',
                border: settings.freeShippingActive !== false ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)'
              }}>
                ENVÍO: {settings.freeShippingActive !== false ? 'ON' : 'OFF'}
              </span>
              {settings.freeGiftActive && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  REGALO: ON
                </span>
              )}
            </div>
          </button>
        </div>

        {/* COLUMNA DERECHA: Panel de Edición */}
        <div className={`admin-settings-panel ${mobileSubView === 'detail' ? 'mobile-visible' : 'mobile-hidden'}`} style={{ width: '100%' }}>
          {/* Botón de retorno al submenú de Configuración en Móvil */}
          <div className="admin-settings-mobile-sub-back">
            <button
              type="button"
              className="admin-settings-back-btn"
              onClick={() => setMobileSubView('menu')}
            >
              <ChevronLeft size={16} />
              <span>Configuración</span>
            </button>
            <span className="admin-settings-sub-title">
              {activeSection === 'contact' && 'Ajustes Contacto'}
              {activeSection === 'promotions' && 'Promociones'}
              {activeSection === 'shipping' && 'Ajustar Carrito'}
            </span>
          </div>
          {/* SECCIÓN 1: CONTACTO DIRECTO & BOTÓN WHATSAPP */}
          {activeSection === 'contact' && (
            <div className="settings-section" style={{ margin: 0, backgroundColor: 'transparent', border: 'none', padding: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Encabezado General de la Sección */}
              <div className="section-header" style={{
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Ajustes de Contacto & WhatsApp
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      <Database size={10} />
                      PostgreSQL :5435 Sincronizado
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: 0 }}>
                    Administra la información pública de atención al cliente y la configuración del botón de chat en vivo.
                  </p>
                </div>
              </div>

              {/* ============================================================ */}
              {/* TARJETA 1: INFORMACIÓN PÚBLICA DE CONTACTO & REDES SOCIALES */}
              {/* ============================================================ */}
              <div style={{
                backgroundColor: '#0c0c0e',
                border: contactEditSection === 'contact' ? '1px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                transition: 'border-color 0.2s ease'
              }}>
                {/* Cabecera de la Tarjeta 1 con su propio botón de edición */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: contactEditSection === 'contact' ? '#ff5500' : '#22c55e' }} />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: contactEditSection === 'contact' ? '#ff5500' : '#ffffff' }}>
                      {contactEditSection === 'contact' ? 'EDITANDO: CANALES DE CONTACTO & REDES' : 'CANALES DE CONTACTO & REDES SOCIALES (TIENDA)'}
                    </span>
                  </div>

                  {contactEditSection !== 'contact' ? (
                    <button
                      type="button"
                      onClick={() => setContactEditSection('contact')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#ff5500',
                        border: '1px solid #ff7733',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255, 85, 0, 0.35)'
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Editar Contacto & Redes</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setContactEditSection('none')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <X size={13} />
                      <span>Cancelar Edición</span>
                    </button>
                  )}
                </div>

                {/* Contenido Tarjeta 1: Vista Previa vs Formulario de Contacto */}
                {contactEditSection !== 'contact' ? (
                  <div className="admin-settings-preview-grid">
                    {/* Columna Izquierda: Habla con la marca & Banner */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#ff5500',
                          marginBottom: '6px'
                        }}>
                          CONTACTO DIRECTO
                        </span>
                        <h4 style={{
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          letterSpacing: '-0.02em',
                          margin: '0 0 10px 0',
                          color: '#ffffff'
                        }}>
                          {settings.contactHeading || 'Habla con la marca.'}
                        </h4>
                        <p style={{
                          fontSize: '0.86rem',
                          color: '#a1a1aa',
                          lineHeight: 1.5,
                          margin: 0
                        }}>
                          {settings.contactSubtitle || 'Envíos locales en Bogotá el mismo día y despachos nacionales. Respondemos por WhatsApp e Instagram.'}
                        </p>
                      </div>

                      {/* Banner de Cabecera Preview */}
                      <div style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px dashed rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Sparkles size={16} color="#ff5500" style={{ flexShrink: 0 }} />
                        <div>
                          <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase' }}>
                            Banner Superior de Anuncios (Cabecera)
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 700 }}>
                            {settings.announcementText || 'ENVIOS A TODA COLOMBIA — STREETWEAR PREMIUM HECHO EN BOGOTA'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: 4 Tarjetas de Contacto */}
                    <div className="admin-settings-cards-2col">
                      {/* WhatsApp Visible */}
                      <div style={{
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#a1a1aa' }}>
                            WhatsApp Bogotá
                          </span>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#25D366' }} />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1.05rem', color: '#ffffff', fontWeight: 900 }}>
                            {settings.contactPhoneDisplay || '313 585 9810'}
                          </strong>
                          <span style={{ fontSize: '0.68rem', color: '#71717a' }}>Número visible al público</span>
                        </div>
                      </div>

                      {/* Correo */}
                      <div style={{
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#a1a1aa' }}>
                            Correo
                          </span>
                          <Mail size={13} color="#a1a1aa" />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: '#ffffff', fontWeight: 800, wordBreak: 'break-all' }}>
                            {settings.contactEmail || 'noirurbano1@gmail.com'}
                          </strong>
                          <span style={{ fontSize: '0.68rem', color: '#71717a' }}>Enlace mailto directo</span>
                        </div>
                      </div>

                      {/* Instagram */}
                      <div style={{
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#a1a1aa' }}>
                            Instagram
                          </span>
                          <Instagram size={13} color="#a1a1aa" />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>
                            {settings.contactInstagram || '@noir_urbano'}
                          </strong>
                          <span style={{ fontSize: '0.68rem', color: '#71717a' }}>instagram.com/{settings.contactInstagram?.replace('@', '') || 'noir_urbano'}</span>
                        </div>
                      </div>

                      {/* TikTok */}
                      <div style={{
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#a1a1aa' }}>
                            TikTok
                          </span>
                          <Music size={13} color="#a1a1aa" />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>
                            {settings.contactTiktok || '@noir.urbano'}
                          </strong>
                          <span style={{ fontSize: '0.68rem', color: '#71717a' }}>tiktok.com/@{settings.contactTiktok?.replace('@', '') || 'noir.urbano'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Formulario específico de Contacto & Redes */
                  <form 
                    onSubmit={async (e) => {
                      await handleSaveSettings(e);
                      setContactEditSection('none');
                    }} 
                    className="settings-form" 
                    style={{ width: '100%' }}
                  >
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Título Principal de la Sección
                      </label>
                      <input 
                        type="text" 
                        value={settings.contactHeading || ''}
                        onChange={e => setSettings(s => ({ ...s, contactHeading: e.target.value }))}
                        placeholder="Habla con la marca."
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Descripción / Subtítulo
                      </label>
                      <textarea 
                        rows={2}
                        value={settings.contactSubtitle || ''}
                        onChange={e => setSettings(s => ({ ...s, contactSubtitle: e.target.value }))}
                        placeholder="Envíos locales en Bogotá el mismo día y despachos nacionales. Respondemos por WhatsApp e Instagram."
                        required
                        style={{
                          width: '100%',
                          backgroundColor: '#141418',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          Teléfono Visible en Tarjeta
                        </label>
                        <input 
                          type="text" 
                          value={settings.contactPhoneDisplay || ''}
                          onChange={e => setSettings(s => ({ ...s, contactPhoneDisplay: e.target.value }))}
                          placeholder="313 585 9810"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          Correo Electrónico de Soporte
                        </label>
                        <input 
                          type="email" 
                          value={settings.contactEmail || ''}
                          onChange={e => setSettings(s => ({ ...s, contactEmail: e.target.value, supportEmail: e.target.value }))}
                          placeholder="noirurbano1@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          Usuario Instagram (con @)
                        </label>
                        <input 
                          type="text" 
                          value={settings.contactInstagram || ''}
                          onChange={e => setSettings(s => ({ ...s, contactInstagram: e.target.value }))}
                          placeholder="@noir_urbano"
                          required
                        />
                      </div>

                      <div className="form-group" style={{ flex: 1, margin: 0 }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          Usuario TikTok (con @)
                        </label>
                        <input 
                          type="text" 
                          value={settings.contactTiktok || ''}
                          onChange={e => setSettings(s => ({ ...s, contactTiktok: e.target.value }))}
                          placeholder="@noir.urbano"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Texto del Banner Superior de Anuncios
                      </label>
                      <input 
                        type="text" 
                        value={settings.announcementText || ''}
                        onChange={e => setSettings(s => ({ ...s, announcementText: e.target.value }))}
                        placeholder="ENVIOS A TODA COLOMBIA — STREETWEAR PREMIUM HECHO EN BOGOTA"
                      />
                    </div>

                    {/* Botones de acción Tarjeta 1 */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={actionLoading} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          fontSize: '0.85rem',
                          fontWeight: 800
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>{actionLoading ? 'Guardando...' : 'GUARDAR CONTACTO EN POSTGRESQL'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactEditSection('none')}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ============================================================ */}
              {/* TARJETA 2: BOTÓN FLOTANTE DE WHATSAPP (TIENDA & CHAT DIRECTO) */}
              {/* ============================================================ */}
              <div style={{
                backgroundColor: '#0c0c0e',
                border: contactEditSection === 'whatsapp' ? '1px solid #25D366' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                transition: 'border-color 0.2s ease'
              }}>
                {/* Cabecera de la Tarjeta 2 con su propio botón de edición */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#25D366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 10px rgba(37, 211, 102, 0.4)'
                    }}>
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.88rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {contactEditSection === 'whatsapp' ? 'EDITANDO: BOTÓN FLOTANTE DE WHATSAPP' : 'BOTÓN FLOTANTE DE WHATSAPP (CHAT CLIENTE)'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                        Abre el chat oficial de WhatsApp de NOCTIS al hacer clic en la esquina de la tienda
                      </span>
                    </div>
                  </div>

                  {contactEditSection !== 'whatsapp' ? (
                    <button
                      type="button"
                      onClick={() => setContactEditSection('whatsapp')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#25D366',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Configurar Botón WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setContactEditSection('none')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <X size={13} />
                      <span>Cancelar Edición</span>
                    </button>
                  )}
                </div>

                {/* Contenido Tarjeta 2: Vista Previa vs Formulario de WhatsApp */}
                {contactEditSection !== 'whatsapp' ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '14px'
                  }}>
                    {/* Tarjeta Número API */}
                    <div style={{
                      backgroundColor: '#141418',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '14px'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#25D366', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Número de Destino API (WhatsApp)
                      </span>
                      <strong style={{ fontSize: '1rem', color: '#ffffff', fontFamily: 'monospace' }}>
                        +{settings.whatsappNumber || '573135859810'}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: '#71717a', marginTop: '2px' }}>
                        Enlace generado: https://wa.me/{settings.whatsappNumber || '573135859810'}
                      </span>
                    </div>

                    {/* Tarjeta Tooltip */}
                    <div style={{
                      backgroundColor: '#141418',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '14px'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Burbuja Tooltip Flotante
                      </span>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
                        "{settings.whatsappTooltip || '¿Dudas con tu talla o envío? Chatea con nosotros.'}"
                      </p>
                    </div>

                    {/* Tarjeta Mensaje Inicial */}
                    <div style={{
                      backgroundColor: '#141418',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '14px',
                      gridColumn: '1 / -1'
                    }}>
                      <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Mensaje Inicial Predeterminado
                      </span>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#d4d4d8', fontStyle: 'italic' }}>
                        "{settings.whatsappMessage || 'Hola NOCTIS URBANO, quiero información sobre las prendas y envíos.'}"
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Formulario específico de WhatsApp Flotante */
                  <form 
                    onSubmit={async (e) => {
                      await handleSaveSettings(e);
                      setContactEditSection('none');
                    }} 
                    className="settings-form" 
                    style={{ width: '100%' }}
                  >
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Número API WhatsApp (con código de país ej: 573135859810)
                      </label>
                      <input 
                        type="text" 
                        value={settings.whatsappNumber || ''}
                        onChange={e => setSettings(s => ({ ...s, whatsappNumber: e.target.value.replace(/\D/g, '') }))}
                        placeholder="573135859810"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Mensaje Inicial Predeterminado (Texto que aparece al abrir WhatsApp)
                      </label>
                      <textarea 
                        rows={2}
                        value={settings.whatsappMessage || ''}
                        onChange={e => setSettings(s => ({ ...s, whatsappMessage: e.target.value }))}
                        placeholder="Hola NOCTIS URBANO, quiero información sobre las prendas y envíos."
                        required
                        style={{
                          width: '100%',
                          backgroundColor: '#141418',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          padding: '10px 12px',
                          fontSize: '0.85rem',
                          lineHeight: 1.4,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        Texto del Tooltip Flotante (Burbuja invitadora de chat)
                      </label>
                      <input 
                        type="text" 
                        value={settings.whatsappTooltip || ''}
                        onChange={e => setSettings(s => ({ ...s, whatsappTooltip: e.target.value }))}
                        placeholder="¿Dudas con tu talla o envío? Chatea con nosotros."
                        required
                      />
                    </div>

                    {/* Botones de acción Tarjeta 2 */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        type="submit" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          backgroundColor: '#25D366',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#ffffff',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
                        }}
                        disabled={actionLoading}
                      >
                        <CheckCircle2 size={16} />
                        <span>{actionLoading ? 'Guardando...' : 'GUARDAR WHATSAPP EN POSTGRESQL'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactEditSection('none')}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: AJUSTAR CARRITO DE SELECCIÓN & INCENTIVOS */}
          {activeSection === 'shipping' && (
            <div className="settings-section" style={{ margin: 0, backgroundColor: 'transparent', border: 'none', padding: 0 }}>
              <div className="section-header" style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Ajustar Carrito de Selección & Incentivos</h3>
                  <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '4px 0 0' }}>
                    Configura las metas dinámicas en pesos para activar la barra de envío gratis y los obsequios automáticos por monto de compra.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                {/* ============================================================ */}
                {/* TARJETA 1: META DE ENVÍO GRATIS & POLÍTICAS DE FLETE        */}
                {/* ============================================================ */}
                <div style={{
                  backgroundColor: settings.freeShippingActive !== false ? '#141418' : '#0f0f12',
                  border: settings.freeShippingActive !== false ? '1px solid rgba(255, 85, 0, 0.35)' : '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '22px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Encabezado Tarjeta 1 con Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: settings.freeShippingActive !== false ? 'rgba(255, 85, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: settings.freeShippingActive !== false ? '#ff5500' : '#71717a'
                      }}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: settings.freeShippingActive !== false ? '#ffffff' : '#a1a1aa', display: 'block' }}>
                          1. Meta de Compra para Desbloquear Envío Gratis
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
                          {settings.freeShippingActive !== false 
                            ? 'Calcula en vivo cuánto le falta al cliente para flete $0 COP.' 
                            : 'Métrica en pausa. Enciende el botón para reactivar en tienda.'}
                        </span>
                      </div>
                    </div>

                    {/* Switch Envío Gratis */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={settings.freeShippingActive !== false}
                        onClick={() => handleToggleShipping(settings.freeShippingActive === false)}
                        title={settings.freeShippingActive !== false ? 'Clic para apagar y bloquear envío gratis' : 'Clic para encender envío gratis'}
                        style={{
                          width: '124px',
                          height: '34px',
                          borderRadius: '20px',
                          backgroundColor: settings.freeShippingActive !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.12)',
                          border: settings.freeShippingActive !== false ? '1.5px solid #22c55e' : '1.5px solid #eab308',
                          padding: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: settings.freeShippingActive !== false ? '0 0 16px rgba(34, 197, 94, 0.35)' : '0 0 16px rgba(234, 179, 8, 0.2)'
                        }}
                      >
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: 900,
                          letterSpacing: '0.05em',
                          paddingLeft: settings.freeShippingActive !== false ? '8px' : '38px',
                          color: settings.freeShippingActive !== false ? '#22c55e' : '#eab308',
                          userSelect: 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          {settings.freeShippingActive !== false ? 'ENCENDIDO' : 'APAGADO'}
                        </span>

                        <div style={{
                          position: 'absolute',
                          right: settings.freeShippingActive !== false ? '3px' : 'calc(100% - 31px)',
                          width: '28px',
                          height: '26px',
                          borderRadius: '16px',
                          backgroundColor: settings.freeShippingActive !== false ? '#22c55e' : '#eab308',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000000',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          {settings.freeShippingActive !== false ? (
                            <CheckCircle2 size={15} strokeWidth={3} />
                          ) : (
                            <Lock size={14} strokeWidth={2.5} />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* AVISO INFORMATIVO SI ENVÍO GRATIS ESTÁ APAGADO */}
                  {settings.freeShippingActive === false && (
                    <div style={{
                      backgroundColor: 'rgba(234, 179, 8, 0.1)',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <Lock size={16} color="#eab308" />
                      <span style={{ fontSize: '0.74rem', color: '#e4e4e7', flex: 1 }}>
                        <strong style={{ color: '#eab308' }}>Envío gratis apagado:</strong> El campo está bloqueado y no se muestra barra en el carrito. Todos los pedidos pagarán el flete estándar.
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleShipping(true)}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: '#eab308',
                          color: '#000000',
                          fontWeight: 900,
                          fontSize: '0.68rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ENCENDER
                      </button>
                    </div>
                  )}

                  <div className="form-row" style={{ marginBottom: '16px' }}>
                    {/* CAMPO: META DE ENVÍO GRATIS */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <TargetIcon size={14} color={settings.freeShippingActive !== false ? '#ff7733' : '#71717a'} />
                        <label style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: settings.freeShippingActive !== false ? '#ff7733' : '#71717a',
                          textTransform: 'uppercase',
                          margin: 0
                        }}>
                          Meta de Envío Gratis (COP) {settings.freeShippingActive === false && '(Bloqueado)'}
                        </label>
                        <HelpInfoIcon text="Monto mínimo en compras que el cliente debe acumular en su carrito para que el despacho sea $0 COP." />
                      </div>
                      <input 
                        type="number" 
                        step="1000"
                        disabled={settings.freeShippingActive === false}
                        value={settings.freeShippingThreshold || 200000}
                        onChange={e => setSettings(s => ({ ...s, freeShippingThreshold: Number(e.target.value) }))}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          backgroundColor: settings.freeShippingActive !== false ? '#0c0c0e' : '#141418',
                          border: settings.freeShippingActive !== false ? '1px solid rgba(255, 85, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          color: settings.freeShippingActive !== false ? '#ffffff' : '#71717a',
                          padding: '10px 14px',
                          cursor: settings.freeShippingActive !== false ? 'text' : 'not-allowed',
                          opacity: settings.freeShippingActive !== false ? 1 : 0.6
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: settings.freeShippingActive !== false ? '#a1a1aa' : '#71717a', marginTop: '4px', display: 'block' }}>
                        {settings.freeShippingActive !== false ? (
                          <>Valor configurado: <strong>${(settings.freeShippingThreshold || 200000).toLocaleString('es-CO')} COP</strong></>
                        ) : (
                          <span style={{ color: '#eab308' }}>Campo bloqueado mientras esté apagado.</span>
                        )}
                      </span>
                    </div>

                    {/* CAMPO: COSTO ENVÍO ESTÁNDAR */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <PackageIcon size={14} color="#d4d4d8" />
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d4d4d8', textTransform: 'uppercase', margin: 0 }}>
                          Costo Envío Estándar (COP)
                        </label>
                        <HelpInfoIcon text="Valor fijo en pesos que se cobrará por flete de mensajería si el pedido no alcanza la meta de envío gratis." />
                      </div>
                      <input 
                        type="number" 
                        step="500"
                        value={settings.standardShippingCost || 15000}
                        onChange={e => setSettings(s => ({ ...s, standardShippingCost: Number(e.target.value) }))}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          backgroundColor: '#0c0c0e',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          padding: '10px 14px'
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px', display: 'block' }}>
                        Flete cobrado por despacho: <strong>${(settings.standardShippingCost || 15000).toLocaleString('es-CO')} COP</strong>
                      </span>
                    </div>
                  </div>

                  {/* Vista Previa Envío Gratis */}
                  <div style={{
                    backgroundColor: '#0a0a0c',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    opacity: settings.freeShippingActive !== false ? 1 : 0.45
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <EyeIcon size={13} color="#a1a1aa" />
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', textTransform: 'uppercase' }}>
                          Vista Previa Carrito: Barra de Envío Gratis
                        </span>
                      </div>
                      {settings.freeShippingActive === false && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#eab308' }}>🔒 EN PAUSA</span>
                      )}
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 85, 0, 0.08)',
                      border: '1px solid rgba(255, 85, 0, 0.2)',
                      borderRadius: '6px',
                      marginBottom: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 800, color: '#ff7733', marginBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <SvgTruck size={13} color="#ff7733" />
                          <span>Si compra $95.000 COP: Te faltan ${(Math.max(0, (settings.freeShippingThreshold || 200000) - 95000)).toLocaleString('es-CO')} COP para ENVÍO GRATIS</span>
                        </span>
                        <span>{Math.min(100, Math.round((95000 / (settings.freeShippingThreshold || 200000)) * 100))}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}>
                        <div style={{ width: `${Math.min(100, Math.round((95000 / (settings.freeShippingThreshold || 200000)) * 100))}%`, height: '100%', backgroundColor: '#ff5500', borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.08)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 800, color: '#22c55e', marginBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <SparklesIcon size={13} color="#22c55e" />
                          <span>Si supera ${(settings.freeShippingThreshold || 200000).toLocaleString('es-CO')} COP: ¡Tus prendas tienen ENVÍO GRATIS!</span>
                        </span>
                        <span>100%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#22c55e', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* TARJETA 2: OBSEQUIO / REGALO AUTOMÁTICO POR COMPRA (GWP)     */}
                {/* ============================================================ */}
                <div style={{
                  backgroundColor: settings.freeGiftActive ? '#141418' : '#0f0f12',
                  border: settings.freeGiftActive ? '1px solid rgba(255, 85, 0, 0.45)' : '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '22px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Encabezado Tarjeta 2 con Switch de Regalo */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: settings.freeGiftActive ? 'rgba(255, 85, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: settings.freeGiftActive ? '#ff5500' : '#71717a'
                      }}>
                        <Gift size={18} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: settings.freeGiftActive ? '#ffffff' : '#a1a1aa', display: 'block' }}>
                          2. Obsequio / Regalo Automático por Compra (GWP)
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: '#71717a' }}>
                          {settings.freeGiftActive 
                            ? 'Premia a los clientes con un regalo exclusivo al superar la meta de compra configurada.' 
                            : 'Promoción de obsequio en pausa. Enciende el botón para activarla en la tienda.'}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox: Regalo */}
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: settings.freeGiftActive ? 'rgba(255, 85, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: settings.freeGiftActive ? '1.5px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      boxShadow: settings.freeGiftActive ? '0 0 16px rgba(255, 85, 0, 0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(settings.freeGiftActive)}
                        onChange={e => handleToggleGift(e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#ff5500'
                        }}
                      />
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        color: settings.freeGiftActive ? '#ffffff' : '#a1a1aa',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        Obsequio / Regalo
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: settings.freeGiftActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: settings.freeGiftActive ? '#22c55e' : '#71717a'
                      }}>
                        {settings.freeGiftActive ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </label>
                  </div>

                  {/* FORMULARIO DEL REGALO */}
                  <div className="form-row" style={{ marginBottom: '16px' }}>
                    {/* META DE COMPRA PARA REGALO */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <TargetIcon size={14} color={settings.freeGiftActive ? '#ff7733' : '#71717a'} />
                        <label style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: settings.freeGiftActive ? '#ff7733' : '#71717a',
                          textTransform: 'uppercase',
                          margin: 0
                        }}>
                          Meta de Compra para Recibir Regalo (COP) {!settings.freeGiftActive && '(Bloqueado)'}
                        </label>
                        <HelpInfoIcon text="Monto mínimo acumulado en compras para que el cliente desbloquee automáticamente el obsequio en su carrito." />
                      </div>
                      <input 
                        type="number" 
                        step="1000"
                        disabled={!settings.freeGiftActive}
                        value={settings.freeGiftThreshold || 250000}
                        onChange={e => setSettings(s => ({ ...s, freeGiftThreshold: Number(e.target.value) }))}
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          backgroundColor: settings.freeGiftActive ? '#0c0c0e' : '#141418',
                          border: settings.freeGiftActive ? '1px solid rgba(255, 85, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          color: settings.freeGiftActive ? '#ffffff' : '#71717a',
                          padding: '10px 14px',
                          cursor: settings.freeGiftActive ? 'text' : 'not-allowed',
                          opacity: settings.freeGiftActive ? 1 : 0.6
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: settings.freeGiftActive ? '#a1a1aa' : '#71717a', marginTop: '4px', display: 'block' }}>
                        {settings.freeGiftActive ? (
                          <>Compras superiores a: <strong>${(settings.freeGiftThreshold || 250000).toLocaleString('es-CO')} COP</strong> reciben regalo.</>
                        ) : (
                          <span style={{ color: '#eab308' }}>🔒 Campo bloqueado mientras esté apagado.</span>
                        )}
                      </span>
                    </div>

                    {/* NOMBRE DEL OBSEQUIO */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Gift size={14} color={settings.freeGiftActive ? '#ffffff' : '#71717a'} />
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: settings.freeGiftActive ? '#ffffff' : '#71717a', textTransform: 'uppercase', margin: 0 }}>
                          Nombre del Obsequio / Producto
                        </label>
                        <HelpInfoIcon text="Nombre del producto promocional que aparecerá en el carrito como obsequio (ej: Llavero Táctico & Sticker Pack NOCTIS)." />
                      </div>
                      <input 
                        type="text" 
                        disabled={!settings.freeGiftActive}
                        placeholder="Ej: Llavero Táctico & Sticker Pack NOCTIS"
                        value={settings.freeGiftName || ''}
                        onChange={e => setSettings(s => ({ ...s, freeGiftName: e.target.value }))}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          backgroundColor: settings.freeGiftActive ? '#0c0c0e' : '#141418',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '6px',
                          color: settings.freeGiftActive ? '#ffffff' : '#71717a',
                          padding: '10px 14px',
                          cursor: settings.freeGiftActive ? 'text' : 'not-allowed',
                          opacity: settings.freeGiftActive ? 1 : 0.6
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px', display: 'block' }}>
                        Visible en la tarjeta de regalo del carrito
                      </span>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN Y FOTO DEL OBSEQUIO */}
                  <div className="form-row" style={{ marginBottom: '16px' }}>
                    {/* DESCRIPCIÓN */}
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: settings.freeGiftActive ? '#d4d4d8' : '#71717a', textTransform: 'uppercase', margin: 0 }}>
                          Descripción o Beneficio del Obsequio
                        </label>
                      </div>
                      <input 
                        type="text" 
                        disabled={!settings.freeGiftActive}
                        placeholder="Ej: Edición limitada incluida automáticamente en tu paquete por compras superiores a $250.000."
                        value={settings.freeGiftDescription || ''}
                        onChange={e => setSettings(s => ({ ...s, freeGiftDescription: e.target.value }))}
                        style={{
                          fontSize: '0.88rem',
                          backgroundColor: settings.freeGiftActive ? '#0c0c0e' : '#141418',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '6px',
                          color: settings.freeGiftActive ? '#ffffff' : '#71717a',
                          padding: '10px 14px',
                          cursor: settings.freeGiftActive ? 'text' : 'not-allowed',
                          opacity: settings.freeGiftActive ? 1 : 0.6
                        }}
                      />
                    </div>

                    {/* CARGAR FOTO DEL OBSEQUIO (DIRECTO DESDE ARCHIVO) */}
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Upload size={14} color={settings.freeGiftActive ? '#ff7733' : '#71717a'} />
                        <label style={{ fontSize: '0.78rem', fontWeight: 800, color: settings.freeGiftActive ? '#d4d4d8' : '#71717a', textTransform: 'uppercase', margin: 0 }}>
                          Foto del Obsequio {!settings.freeGiftActive && '(Bloqueado)'}
                        </label>
                        <HelpInfoIcon text="Carga la imagen o foto del regalo directamente desde tus archivos locales (JPG, PNG o WEBP)." />
                      </div>

                      {/* Input File Oculto */}
                      <input 
                        id="gift-file-upload"
                        type="file" 
                        accept="image/*"
                        disabled={!settings.freeGiftActive}
                        onChange={handleGiftImageUpload}
                        style={{ display: 'none' }}
                      />

                      {settings.freeGiftImage ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: settings.freeGiftActive ? '#0c0c0e' : '#141418',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          opacity: settings.freeGiftActive ? 1 : 0.6
                        }}>
                          {/* Miniatura de la Foto Cargada */}
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '6px',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            backgroundColor: '#050505',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img 
                              src={settings.freeGiftImage} 
                              alt="Foto Obsequio" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '0.76rem', color: '#22c55e', fontWeight: 800, display: 'block' }}>
                              ✓ Foto cargada correctamente
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#71717a' }}>
                              Visible en el carrito del cliente
                            </span>
                          </div>

                          {/* Botón Cambiar Foto */}
                          <label
                            htmlFor="gift-file-upload"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: settings.freeGiftActive ? 'rgba(255, 85, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              border: settings.freeGiftActive ? '1px solid #ff5500' : '1px solid rgba(255, 255, 255, 0.15)',
                              color: settings.freeGiftActive ? '#ffffff' : '#71717a',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: settings.freeGiftActive ? 'pointer' : 'not-allowed',
                              transition: 'all 0.2s ease',
                              flexShrink: 0
                            }}
                          >
                            <FolderOpen size={13} />
                            <span>Cambiar Foto</span>
                          </label>

                          {/* Botón Quitar Foto */}
                          {settings.freeGiftActive && (
                            <button
                              type="button"
                              onClick={() => setSettings(s => ({ ...s, freeGiftImage: '' }))}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                padding: '6px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Quitar foto"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor="gift-file-upload"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            backgroundColor: settings.freeGiftActive ? '#0c0c0e' : '#141418',
                            border: settings.freeGiftActive ? '1px dashed rgba(255, 85, 0, 0.5)' : '1px dashed rgba(255, 255, 255, 0.12)',
                            borderRadius: '6px',
                            padding: '12px 14px',
                            cursor: settings.freeGiftActive ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                            opacity: settings.freeGiftActive ? 1 : 0.6
                          }}
                        >
                          <Upload size={16} color={settings.freeGiftActive ? '#ff5500' : '#71717a'} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: settings.freeGiftActive ? '#ffffff' : '#71717a' }}>
                            {settings.freeGiftActive ? 'Elegir y Cargar Foto del Obsequio (PNG, JPG, WEBP)' : 'Habilita el check para cargar la foto'}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Vista Previa Interactiva del Obsequio en Carrito */}
                  <div style={{
                    backgroundColor: '#0a0a0c',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '14px',
                    opacity: settings.freeGiftActive ? 1 : 0.45
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <EyeIcon size={13} color="#a1a1aa" />
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: '#a1a1aa', textTransform: 'uppercase' }}>
                          Vista Previa Carrito: Cómo ve el cliente el Obsequio
                        </span>
                      </div>
                      {!settings.freeGiftActive && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#eab308' }}>🔒 EN PAUSA</span>
                      )}
                    </div>

                    {/* Caso 1: Aún le falta para el regalo - Tarjeta Visual de Incentivo */}
                    <div style={{
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 85, 0, 0.05)',
                      border: '1px dashed rgba(255, 85, 0, 0.4)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: '#111115',
                        border: '1px solid rgba(255, 85, 0, 0.35)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {settings.freeGiftImage ? (
                          <img 
                            src={settings.freeGiftImage} 
                            alt="Obsequio" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Gift size={22} color="#ff7733" />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>
                            {settings.freeGiftName || 'Llavero Táctico & Sticker Pack NOCTIS'}
                          </strong>
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 85, 0, 0.15)',
                            color: '#ff7733',
                            border: '1px solid rgba(255, 85, 0, 0.3)',
                            textTransform: 'uppercase'
                          }}>
                            🎁 POR COMPRAS &gt; ${(settings.freeGiftThreshold || 250000).toLocaleString('es-CO')} COP
                          </span>
                        </div>
                        <p style={{ fontSize: '0.74rem', color: '#ff7733', margin: '2px 0 0', fontWeight: 600 }}>
                          Si compras $95.000 COP: Te faltan ${(Math.max(0, (settings.freeGiftThreshold || 250000) - 95000)).toLocaleString('es-CO')} COP para recibir este obsequio GRATIS
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: '#71717a', textDecoration: 'line-through', display: 'block' }}>
                          $45.000 COP
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#ff7733', fontWeight: 800 }}>
                          ¡GRATIS!
                        </span>
                      </div>
                    </div>

                    {/* Caso 2: Meta alcanzada - Prenda de Obsequio Desbloqueada */}
                    <div style={{
                      padding: '12px 14px',
                      backgroundColor: 'rgba(34, 197, 94, 0.08)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: '#111115',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {settings.freeGiftImage ? (
                          <img 
                            src={settings.freeGiftImage} 
                            alt="Obsequio" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Gift size={22} color="#22c55e" />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>
                            {settings.freeGiftName || 'Llavero Táctico & Sticker Pack NOCTIS'}
                          </strong>
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            textTransform: 'uppercase'
                          }}>
                            🎁 ¡OBSEQUIO INCLUIDO!
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                          {settings.freeGiftDescription || 'Obsequio exclusivo por compra superior a la meta'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#71717a', textDecoration: 'line-through', display: 'block' }}>
                          $45.000 COP
                        </span>
                        <strong style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 900 }}>
                          $0 COP
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÓN GUARDAR AJUSTES DEL CARRITO */}
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={actionLoading} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    width: '100%',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 20px rgba(255, 85, 0, 0.3)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{actionLoading ? 'Guardando...' : 'GUARDAR AJUSTES DEL CARRITO EN BASE DE DATOS'}</span>
                </button>
              </form>
            </div>
          )}

          {/* SECCIÓN 3: PROMOCIONES */}
          {activeSection === 'promotions' && (
            <div className="settings-section" style={{ margin: 0 }}>
              <div className="section-header">
                <div>
                  <h3>Cupones de Descuento & Promociones</h3>
                  <p>Crea y administra códigos promocionales para incentivar conversiones en checkout.</p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => { setEditingCoupon({}); setIsCouponModalOpen(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Nuevo Cupón</span>
                </button>
              </div>

              <div className="coupons-list">
                {coupons.length === 0 ? (
                  <p style={{ color: '#71717a', fontSize: '0.82rem', textAlign: 'center', padding: '36px 0' }}>
                    No hay cupones activos. Haz clic en <strong>+ Nuevo Cupón</strong> para crear uno.
                  </p>
                ) : (
                  coupons.map(coupon => (
                    <div key={coupon.id} className="coupon-item">
                      <div className="coupon-left">
                        <Tag size={16} className="coupon-icon" />
                        <div>
                          <strong className="coupon-code">{coupon.code}</strong>
                          <div className="coupon-desc">
                            {coupon.discountType === 'percentage' ? `${coupon.value}% de descuento` : `$${coupon.value.toLocaleString('es-CO')} COP off`}
                            {coupon.minPurchase > 0 && ` (Min: $${coupon.minPurchase.toLocaleString('es-CO')})`}
                          </div>
                        </div>
                      </div>
                      <div className="coupon-right">
                        <span className={`status-pill ${coupon.active ? 'active' : 'inactive'}`}>
                          {coupon.active ? 'Activo' : 'Inactivo'}
                        </span>
                        <button className="btn-icon-danger" onClick={() => handleDeleteCoupon(coupon.id)} title="Eliminar Cupón">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
