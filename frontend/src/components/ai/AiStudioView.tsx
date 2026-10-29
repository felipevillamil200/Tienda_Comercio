import React from 'react';
import { Product, ProductSize } from '@/types';
import { Message, ChatSession, AiAction } from './types';
import { renderCleanMessageText } from './renderMessageText';
import { ChatProductCard } from './ChatProductCard';
import { AiWelcomeHero } from './AiWelcomeHero';
import { 
  Minimize2, 
  X, 
  Plus, 
  History, 
  Trash2, 
  RotateCcw 
} from 'lucide-react';

interface AiStudioViewProps {
  clientProfile: any;
  clientOrders: any[];
  items: any[];
  sessions: ChatSession[];
  currentSessionId: string;
  activeMemoryTurns: number;
  handleNewChat: () => void;
  handleLoadSession: (ses: ChatSession) => void;
  handleDeleteSession: (e: React.MouseEvent, id: string) => void;
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (val: string) => void;
  handleSendMessage: (text?: string) => void;
  executeAction: (action: AiAction) => void;
  openProductDetail: (product: Product) => void;
  addToCart: (product: Product, size: ProductSize, qty: number, color: string) => void;
  language: 'ES' | 'EN';
  setIsExpanded: (val: boolean) => void;
  setIsAiOpen: (val: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function AiStudioView({
  clientProfile,
  clientOrders,
  items,
  sessions,
  currentSessionId,
  activeMemoryTurns,
  handleNewChat,
  handleLoadSession,
  handleDeleteSession,
  messages,
  loading,
  input,
  setInput,
  handleSendMessage,
  executeAction,
  openProductDetail,
  addToCart,
  language,
  setIsExpanded,
  setIsAiOpen,
  scrollRef
}: AiStudioViewProps) {
  return (
    <div 
      className="noir-ai-chat-window expanded"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        background: '#070709',
        color: '#ffffff'
      }}
    >
      {/* Fullscreen Studio Top Header */}
      <div style={{ 
        padding: '12px 24px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.09)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#0a0a0e',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff5500 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)'
          }}>
            ✦
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.08em', color: '#ffffff' }}>
                NOCTIS AI // STUDIO COPILOT
              </strong>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontWeight: 800
              }}>
                OPENROUTER AI • EN VIVO
              </span>
            </div>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#a1a1aa', letterSpacing: '0.02em' }}>
              Asesoría de estilo callejero de lujo • Bodega Bogotá 2.600m
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {clientProfile?.name ? (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '9px', 
                padding: '4px 14px 4px 6px', 
                background: 'rgba(255, 255, 255, 0.04)', 
                border: '1px solid rgba(255, 255, 255, 0.12)', 
                borderRadius: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a68867 0%, #ff5500 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.74rem',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '0 0 8px rgba(255, 85, 0, 0.3)'
              }}>
                {clientProfile.avatar ? (
                  <img 
                    src={clientProfile.avatar} 
                    alt={clientProfile.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span>{clientProfile.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.76rem', color: '#ffffff', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {clientProfile.name}
                </span>
              </div>
            </div>
          ) : null}

          <button 
            type="button"
            className="client-expand-btn" 
            onClick={() => setIsExpanded(false)}
            aria-label="Reducir a ventana flotante"
            title="Reducir a ventana flotante"
          >
            <Minimize2 size={16} />
          </button>
          <button 
            type="button"
            className="client-close-btn" 
            onClick={() => setIsAiOpen(false)}
            aria-label="Cerrar asistente IA"
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Studio Body: Left Sidebar + Main Canvas */}
      <div className="ai-studio-workspace">
        {/* Left Sidebar */}
        <div className="ai-studio-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNewChat}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '6px'
              }}
            >
              <Plus size={16} />
              <span>NUEVA CONVERSACIÓN</span>
            </button>

            {/* Client Live Context Summary */}
            <div style={{
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.72rem'
            }}>
              <span style={{ fontSize: '0.64rem', color: '#71717a', fontWeight: 800, letterSpacing: '0.08em' }}>
                CONTEXTO DE TIENDA
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
                <span>🛒 En Carrito:</span>
                <strong style={{ color: '#ffffff' }}>{items.length} prendas</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
                <span>📍 Destino:</span>
                <strong style={{ color: '#ffffff' }}>{clientProfile?.city || 'Bogotá D.C.'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4d8' }}>
                <span>📦 Pedidos Activos:</span>
                <strong style={{ color: '#38bdf8' }}>{clientOrders.length}</strong>
              </div>
            </div>

            {/* Sessions History List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 4px' }}>
                <History size={13} style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: '0.66rem', color: '#a1a1aa', fontWeight: 800, letterSpacing: '0.06em' }}>
                  HISTORIAL DE SESIONES
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px', 
                maxHeight: 'calc(100vh - 380px)', 
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {sessions.length === 0 ? (
                  <span style={{ fontSize: '0.72rem', color: '#52525b', padding: '8px' }}>
                    Sin chats previos guardados.
                  </span>
                ) : (
                  sessions.map(ses => (
                    <div
                      key={ses.id}
                      onClick={() => handleLoadSession(ses)}
                      className={`history-session-card ${ses.id === currentSessionId ? 'selected' : ''}`}
                      style={{ padding: '10px 12px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                          {ses.title}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(e, ses.id)}
                          style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '2px' }}
                          title="Eliminar"
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.64rem', color: '#71717a' }}>
                        🕒 {ses.createdAt}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Memory Info */}
          <div style={{
            padding: '10px 12px',
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.7rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeMemoryTurns > 0 ? '#10b981' : '#38bdf8' }} />
              <span style={{ color: activeMemoryTurns > 0 ? '#34d399' : '#38bdf8', fontWeight: 700 }}>
                {activeMemoryTurns === 0 ? 'Memoria Limpia' : `${activeMemoryTurns} mensajes en contexto`}
              </span>
            </div>
            {activeMemoryTurns > 0 && (
              <button
                type="button"
                onClick={handleNewChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff5500',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <RotateCcw size={10} />
                <span>Limpiar Memoria</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ai-studio-main">
          {/* Quick Chips Bar across Top */}
          <div style={{
            background: '#0a0a0f',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '10px 24px'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              maxWidth: '920px',
              margin: '0 auto',
              scrollbarWidth: 'none'
            }}>
              {[
                { label: '👤 Mis Pedidos & Compras', prompt: 'Revisa mis compras y el estado de mis pedidos activos' },
                { label: '❤️ Mis Favoritos', prompt: 'Muéstrame mis prendas guardadas en favoritos' },
                { label: '📦 Rastrear Envío', prompt: 'Rastrear mi pedido y estado de guía' },
                { label: '💬 Mis PQRS / Soporte', prompt: '¿Cuál es el estado de mis radicados PQRS o solicitudes de soporte?' },
                { label: '⚡ Colección Drop 001', prompt: 'Muéstrame la colección Drop 001 Bogotá' },
                { label: '🧥 Frío Andino (2.600m)', prompt: '¿Qué prendas me recomiendas para el frío y lluvia de Bogotá?' },
                { label: '📦 Stock en Bodega', prompt: '¿Cuánto stock hay disponible de las prendas?' },
                { label: '💳 Pagos Wompi', prompt: '¿Qué métodos de pago aceptan por Wompi?' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.prompt)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '6px 14px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#d4d4d8',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#d4d4d8';
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Canvas */}
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '24px 32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {messages.length <= 1 ? (
              <AiWelcomeHero onSendMessage={handleSendMessage} />
            ) : (
              /* Thread of Messages */
              <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: msg.sender === 'user' ? '75%' : '88%' }}>
                    <div style={{
                      padding: '14px 20px',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      borderRadius: '8px',
                      background: msg.sender === 'user' ? 'var(--white)' : '#121217',
                      color: msg.sender === 'user' ? 'var(--black)' : 'var(--white)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
                    }}>
                      {renderCleanMessageText(msg.text, msg.sender === 'user')}
                    </div>

                    {/* Actions */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => executeAction(act)}
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              letterSpacing: '0.03em',
                              background: 'linear-gradient(135deg, rgba(255,85,0,0.2) 0%, rgba(255,85,0,0.08) 100%)',
                              border: '1px solid #ff5500',
                              color: '#ffffff',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(255,85,0,0.25)',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = '#ff5500';
                              e.currentTarget.style.color = '#000000';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = 'rgba(255,85,0,0.15)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.products.map(p => (
                          <ChatProductCard
                            key={p.id}
                            product={p}
                            onOpenDetail={openProductDetail}
                            onAddToCart={(prod, sz, col) => addToCart(prod, sz, 1, col)}
                            language={language}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', width: 'fit-content' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', animation: 'pulse 1s infinite' }} />
                    <p style={{ color: '#38bdf8', fontSize: '0.82rem', margin: 0, fontWeight: 700 }}>
                      NOCTIS AI consultando bodega y preparando asistencia...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Centered Capsule Input Bar */}
          <div style={{
            padding: '16px 32px 24px 32px',
            background: 'linear-gradient(180deg, transparent 0%, #070709 30%)'
          }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="ai-studio-input-capsule"
            >
              <input
                placeholder={language === 'EN' ? 'Ask NOCTIS AI (e.g. "Take me to catalog", "Show 450g heavy hoodie")...' : 'Escribe a NOCTIS AI (ej: "Llévame al catálogo", "Muéstrame el buzo pesado")...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  padding: '8px 10px'
                }}
              />
              <button
                className="btn btn-primary"
                type="submit"
                style={{
                  minHeight: '42px',
                  padding: '0 24px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  borderRadius: '8px'
                }}
              >
                {language === 'EN' ? 'SEND' : 'ENVIAR'}
              </button>
            </form>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '0.64rem', color: '#52525b', marginTop: '8px' }}>
              ✦ Presiona Enter para enviar • Asesoría de compras con OpenRouter AI en vivo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
