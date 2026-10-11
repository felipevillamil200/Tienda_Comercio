import React from 'react';

interface AiWelcomeHeroProps {
  onSendMessage: (prompt: string) => void;
}

export function AiWelcomeHero({ onSendMessage }: AiWelcomeHeroProps) {
  const cards = [
    {
      title: '🧥 Frío Capitalino (2.600m)',
      desc: 'Prendas térmicas de 450 GSM y siluetas boxy para la noche andina.',
      prompt: '¿Qué buzos pesados y prendas me recomiendas para el frío de Bogotá?'
    },
    {
      title: '⚡ Colección Drop 001',
      desc: 'Explorar buzos, puffers, camisetas y pantalones exclusivos de Bogotá.',
      prompt: 'Muéstrame las piezas principales de la colección Drop 001 Bogotá'
    },
    {
      title: '📦 Rastrear mi Pedido',
      desc: 'Consulta en tiempo real el estado de despacho y guía de transporte.',
      prompt: 'Revisar el estado de mis pedidos activos y número de guía'
    },
    {
      title: '💬 PQRS & Garantías',
      desc: 'Soporte oficial según Ley 1480 y estado de solicitudes de cambio.',
      prompt: '¿Cómo funciona la garantía legal o cómo radicar una PQRS?'
    }
  ];

  return (
    <div style={{ maxWidth: '860px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', padding: '20px 0' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.72rem',
          fontWeight: 900,
          letterSpacing: '0.12em',
          color: '#38bdf8',
          textTransform: 'uppercase'
        }}>
          ✦ SISTEMA DE ASESORÍA Y COMPRAS CON GOOGLE GEMINI 2.5
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.2rem',
          letterSpacing: '0.04em',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.15
        }}>
          NOCTIS AI STUDIO // WEB MCP
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: '#a1a1aa',
          maxWidth: '580px',
          margin: 0,
          lineHeight: 1.6
        }}>
          Tu estilista personal de streetwear de alto gramaje para Bogotá. Conectado a tu perfil, carrito e inventario real en bodega.
        </p>
      </div>

      {/* 4 Featured Starter Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px'
      }}>
        {cards.map((card, cIdx) => (
          <div
            key={cIdx}
            className="ai-welcome-card"
            onClick={() => onSendMessage(card.prompt)}
          >
            <strong style={{ fontSize: '0.88rem', color: '#ffffff', letterSpacing: '0.02em' }}>
              {card.title}
            </strong>
            <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: 0, lineHeight: 1.45 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
