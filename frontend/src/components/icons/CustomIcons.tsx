import React from 'react';

// Colección de Iconos SVG Vectoriales Escalables para el Frontend de NOCTIS URBANO

export const TargetIcon = ({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const PackageIcon = ({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v8.42a1.78 1.78 0 0 0 2.5 1.55L16.5 10.6" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export const TruckIcon = ({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18.5" r="2.5" />
    <circle cx="7" cy="18.5" r="2.5" />
  </svg>
);

export const EyeIcon = ({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const SparklesIcon = ({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const HelpInfoIcon = ({ size = 15, text }: { size?: number; text: string }) => {
  const [show, setShow] = React.useState(false);

  return (
    <span 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', marginLeft: '6px' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
      title={text}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        color: '#a1a1aa',
        fontSize: '10px',
        fontWeight: 900,
        lineHeight: 1,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        ?
      </span>

      {show && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#18181b',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#ffffff',
          fontSize: '0.74rem',
          fontWeight: 500,
          lineHeight: 1.4,
          whiteSpace: 'normal',
          width: 'max-content',
          maxWidth: '260px',
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          textTransform: 'none',
          letterSpacing: 'normal'
        }}>
          {text}
        </span>
      )}
    </span>
  );
};
