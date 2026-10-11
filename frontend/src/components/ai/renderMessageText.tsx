import React from 'react';

/**
 * Parses bold text (**term**) and converts it to clean JSX with a stylish underline.
 */
export function renderCleanMessageText(text: string, isUser: boolean) {
  const paragraphs = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {paragraphs.map((paragraph, pIdx) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
        const cleanContent = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

        // Split by **text**
        const parts = cleanContent.split(/(\*\*[^*]+?\*\*)/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const innerText = part.slice(2, -2);
            return (
              <strong
                key={partIdx}
                style={{
                  fontWeight: 800,
                  color: isUser ? '#000000' : '#ffffff',
                  borderBottom: isUser 
                    ? '1.5px solid rgba(0, 0, 0, 0.7)' 
                    : '1.5px solid rgba(255, 255, 255, 0.85)',
                  paddingBottom: '1px',
                  display: 'inline',
                  letterSpacing: '0.02em'
                }}
              >
                {innerText}
              </strong>
            );
          }
          return <span key={partIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={pIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '4px' }}>
              <span style={{ color: isUser ? '#000000' : '#ff5500', fontWeight: 900, lineHeight: 1.4 }}>•</span>
              <div style={{ flex: 1 }}>{renderedLine}</div>
            </div>
          );
        }

        return (
          <p key={pIdx} style={{ margin: 0, lineHeight: 1.55 }}>
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}
