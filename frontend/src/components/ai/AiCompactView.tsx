import React from 'react';
import { Product, ProductSize } from '@/types';
import { Message, ChatSession, AiAction } from './types';
import { renderCleanMessageText } from './renderMessageText';
import { ChatProductCard } from './ChatProductCard';
import { 
  Maximize2, 
  X, 
  Plus, 
  History, 
  Trash2, 
  RotateCcw,
  Clock,
  MessageSquare
} from 'lucide-react';

interface AiCompactViewProps {
  handleNewChat: () => void;
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExpanded: (val: boolean) => void;
  setIsAiOpen: (val: boolean) => void;
  activeMemoryTurns: number;
  language: 'ES' | 'EN';
  sessions: ChatSession[];
  currentSessionId: string;
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
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isCartOpen?: boolean;
}

export function AiCompactView({
  handleNewChat,
  showHistory,
  setShowHistory,
  setIsExpanded,
  setIsAiOpen,
  activeMemoryTurns,
  language,
  sessions,
  currentSessionId,
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
  scrollRef,
  isCartOpen
}: AiCompactViewProps) {
  return (
    <div 
      className={`noir-ai-chat-window ${isCartOpen ? 'with-cart-open' : ''}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: '14px 18px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#09090b',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #ff5500 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            fontWeight: 900
          }}>
            ✦
          </div>
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', letterSpacing: '0.08em', color: '#ffffff' }}>
              NOCTIS AI // WEB MCP
            </strong>
            <span style={{ display: 'block', fontSize: '0.62rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
              ✦ COPILOTO EN VIVO • OPENROUTER + LIVE INVENTORY
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            type="button"
            className="client-expand-btn" 
            onClick={handleNewChat}
            aria-label={language === 'EN' ? "New chat & reset memory" : "Iniciar nueva conversación y limpiar memoria"}
            title={language === 'EN' ? "New Chat (Clean Memory)" : "Nueva conversación (Limpiar memoria)"}
          >
            <Plus size={16} />
          </button>
          <button 
            type="button"
            className={`client-history-btn ${showHistory ? 'active' : ''}`} 
            onClick={() => setShowHistory(prev => !prev)}
            aria-label={language === 'EN' ? "View chat history" : "Ver historial de conversaciones"}
            title={language === 'EN' ? "Chat History" : "Historial de conversaciones"}
          >
            <History size={16} />
          </button>
          <button 
            type="button"
            className="client-expand-btn ai-desktop-only-btn" 
            onClick={() => setIsExpanded(true)}
            aria-label="Expandir a pantalla completa"
            title="Expandir a pantalla completa"
          >
            <Maximize2 size={16} />
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

      {/* Real-time Multi-turn Memory Status Bar */}
      <div style={{
        padding: '6px 14px',
        background: '#0d0d12',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.68rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: activeMemoryTurns > 0 ? '#10b981' : '#38bdf8',
            boxShadow: activeMemoryTurns > 0 ? '0 0 8px #10b981' : '0 0 8px #38bdf8',
            display: 'inline-block'
          }} />
          <span style={{ color: activeMemoryTurns > 0 ? '#34d399' : '#a1a1aa', fontWeight: 600 }}>
            {activeMemoryTurns === 0 
              ? (language === 'EN' ? '🧠 Memory Ready • 0 turns in context' : '🧠 Memoria Lista • 0 turnos en contexto')
              : (language === 'EN' 
                  ? `🧠 Multi-Turn Memory Active • ${activeMemoryTurns} ${activeMemoryTurns === 1 ? 'message' : 'messages'} remembered` 
                  : `🧠 Memoria Multi-Turn Activa • ${activeMemoryTurns} ${activeMemoryTurns === 1 ? 'mensaje' : 'mensajes'} recordados`)}
          </span>
        </div>

        {activeMemoryTurns > 0 && !showHistory && (
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
              padding: '2px 6px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Borrar memoria actual y empezar desde cero"
          >
            <RotateCcw size={10} />
            <span>{language === 'EN' ? 'Reset Memory' : 'Limpiar Memoria'}</span>
          </button>
        )}
      </div>

      {showHistory ? (
        /* History Sessions Drawer / Tab */
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0a0a0d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
                {language === 'EN' ? 'SAVED CONVERSATIONS' : 'HISTORIAL DE CONVERSACIONES'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNewChat}
              style={{
                padding: '4px 10px',
                fontSize: '0.68rem',
                fontWeight: 800,
                background: '#38bdf8',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} />
              <span>{language === 'EN' ? 'New Chat' : 'Nueva Charla'}</span>
            </button>
          </div>

          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
              <p style={{ fontSize: '0.8rem', margin: 0 }}>
                {language === 'EN' ? 'No saved chats yet. Start chatting!' : 'No hay conversaciones guardadas aún. ¡Escribe tu primera consulta!'}
              </p>
            </div>
          ) : (
            sessions.map((ses) => (
              <div 
                key={ses.id}
                onClick={() => handleLoadSession(ses)}
                className={`history-session-card ${ses.id === currentSessionId ? 'selected' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <strong style={{ fontSize: '0.78rem', color: '#ffffff', lineHeight: 1.3, flex: 1 }}>
                    {ses.title}
                  </strong>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(e, ses.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#71717a',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '3px'
                    }}
                    title={language === 'EN' ? 'Delete this session' : 'Eliminar esta conversación'}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: '#a1a1aa' }}>
                  <span>🕒 {ses.createdAt}</span>
                  <span>{ses.messages.filter(m => m.sender === 'user').length} mensajes</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Quick Prompt Chips Bar */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            padding: '8px 12px',
            background: '#111116',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            scrollbarWidth: 'none'
          }}>
            {[
              { label: '👤 Mis Pedidos & Compras', prompt: 'Revisa mis compras y el estado de mis pedidos activos' },
              { label: '❤️ Mis Favoritos', prompt: 'Muéstrame mis prendas guardadas en favoritos' },
              { label: '📦 Rastrear Envío', prompt: 'Rastrear mi pedido y estado de guía' },
              { label: '💬 Mis PQRS / Soporte', prompt: '¿Cuál es el estado de mis radicados PQRS o solicitudes de soporte?' },
              { label: '⚡ Colección Bogotá', prompt: 'Muéstrame la colección Drop 001 Bogotá' },
              { label: '🧥 Frío Andino', prompt: '¿Qué prendas me recomiendas para el frío y lluvia de Bogotá?' },
              { label: '📦 Stock en Bodega', prompt: '¿Cuánto stock hay disponible de las prendas?' },
              { label: '💳 Pagos Wompi', prompt: '¿Qué métodos de pago aceptan por Wompi?' }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#d4d4d8',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 85, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#ff5500';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = '#d4d4d8';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Window */}
          <div ref={scrollRef} style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
                <div style={{
                  padding: '12px 16px',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  borderRadius: '8px',
                  background: msg.sender === 'user' ? 'var(--white)' : '#18181f',
                  color: msg.sender === 'user' ? 'var(--black)' : 'var(--white)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}>
                  {renderCleanMessageText(msg.text, msg.sender === 'user')}
                </div>

                {/* Action Pills Buttons (Web MCP Tools) */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {msg.actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        type="button"
                        onClick={() => executeAction(act)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          letterSpacing: '0.03em',
                          background: 'linear-gradient(135deg, rgba(255,85,0,0.2) 0%, rgba(255,85,0,0.08) 100%)',
                          border: '1px solid #ff5500',
                          color: '#ffffff',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 8px rgba(255,85,0,0.25)',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ff5500';
                          e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,85,0,0.15)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Interactive Product Cards Grid */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', animation: 'pulse 1s infinite' }} />
                <p style={{ color: '#38bdf8', fontSize: '0.75rem', margin: 0, fontWeight: 700 }}>
                  NOCTIS AI consultando bodega y preparando asistencia...
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ 
              padding: '12px 14px', 
              borderTop: '1px solid rgba(255,255,255,0.1)', 
              display: 'flex', 
              gap: '8px', 
              background: '#09090b' 
            }}
          >
            <input
              placeholder={language === 'EN' ? 'Ask NOCTIS AI (e.g. "Take me to catalog", "Show hoodie")...' : 'Escribe a NOCTIS AI (ej: "Llévame al catálogo", "Muéstrame el buzo")...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '10px 14px', 
                background: '#18181b', 
                border: '1px solid rgba(255,255,255,0.18)', 
                color: '#ffffff', 
                fontSize: '0.8rem',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            <button 
              className="btn btn-primary" 
              type="submit" 
              style={{ 
                minHeight: '38px', 
                padding: '0 16px', 
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.06em'
              }}
            >
              {language === 'EN' ? 'SEND' : 'ENVIAR'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
