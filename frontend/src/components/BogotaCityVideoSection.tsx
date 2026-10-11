'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function BogotaCityVideoSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if custom video is saved in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('noctis_custom_city_video');
      if (saved) setCustomVideoUrl(saved);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 1200);
    let height = (canvas.height = canvas.offsetHeight || 700);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // TRAFFIC STREAMS (LUCES DE VEHÍCULOS SÉPTIMA)
    // ==========================================
    interface VehicleStreak {
      x: number;
      y: number;
      speed: number;
      length: number;
      color: string;
      glowColor: string;
      width: number;
      direction: 1 | -1;
      laneYOffset: number;
    }

    const streaks: VehicleStreak[] = [];
    const numStreaks = 45;

    for (let i = 0; i < numStreaks; i++) {
      const isRed = Math.random() > 0.45;
      streaks.push({
        x: Math.random() * width,
        y: height * 0.82 + (Math.random() - 0.5) * 45,
        speed: (isRed ? -1 : 1) * (1.8 + Math.random() * 3.2),
        length: 25 + Math.random() * 65,
        color: isRed ? '#ff2a2a' : '#ffffff',
        glowColor: isRed ? 'rgba(255, 40, 40, 0.7)' : 'rgba(255, 230, 160, 0.8)',
        width: 1.5 + Math.random() * 2.2,
        direction: isRed ? -1 : 1,
        laneYOffset: (Math.random() - 0.5) * 35
      });
    }

    // ==========================================
    // TORRE COLPATRIA LED LIGHTING EFFECTS
    // ==========================================
    let time = 0;

    // ==========================================
    // NIEBLA ANDINA FLOTANTE (COLD MIST PARTICLES)
    // ==========================================
    interface MistParticle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      opacity: number;
      phase: number;
    }

    const mistParticles: MistParticle[] = [];
    for (let i = 0; i < 22; i++) {
      mistParticles.push({
        x: Math.random() * width,
        y: height * 0.35 + Math.random() * height * 0.55,
        radius: 60 + Math.random() * 120,
        speedX: 0.2 + Math.random() * 0.4,
        opacity: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2
      });
    }

    // ==========================================
    // RENDER LOOP A 60 FPS
    // ==========================================
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. ILUMINACIÓN DINÁMICA DE LA TORRE COLPATRIA (Centro)
      const towerCenterX = width * 0.42;
      const towerTopY = height * 0.15;
      const towerBottomY = height * 0.75;
      const towerWidth = width * 0.085;

      // Colores de la bandera de Colombia / luces LED en la fachada
      const ledStripeCount = 18;
      for (let s = 0; s < ledStripeCount; s++) {
        const stripeY = towerTopY + (s / ledStripeCount) * (towerBottomY - towerTopY);
        const wave = Math.sin(time * 2 + s * 0.4);
        const intensity = 0.35 + 0.35 * wave;

        // Alternancia de colores LED (Amarillo, Azul, Rojo, Blanco)
        let ledColor = 'rgba(255, 255, 255, ';
        if (s < 6) ledColor = 'rgba(255, 215, 0, '; // Amarillo
        else if (s < 12) ledColor = 'rgba(0, 140, 255, '; // Azul
        else ledColor = 'rgba(255, 30, 50, '; // Rojo

        ctx.fillStyle = ledColor + intensity + ')';
        ctx.fillRect(towerCenterX - towerWidth * 0.45, stripeY, towerWidth * 0.9, 4);

        // Resplandor sutil
        ctx.shadowColor = ledColor + '0.8)';
        ctx.shadowBlur = 10;
        ctx.fillRect(towerCenterX - towerWidth * 0.4, stripeY, towerWidth * 0.8, 2);
        ctx.shadowBlur = 0;
      }

      // Luz estroboscópica roja en la punta de la Torre Colpatria
      const beaconAlpha = (Math.sin(time * 4) + 1) * 0.5 > 0.6 ? 1 : 0.15;
      ctx.fillStyle = `rgba(255, 30, 30, ${beaconAlpha})`;
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(towerCenterX, towerTopY - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. VENTANAS TITILANTES DE RASCACIELOS (CCI, Colseguros)
      const rascacielosX = width * 0.72;
      for (let wy = 0; wy < 12; wy++) {
        for (let wx = 0; wx < 4; wx++) {
          const blink = (Math.sin(time * 0.8 + wx * 1.5 + wy * 0.7) + 1) * 0.5;
          if (blink > 0.3) {
            ctx.fillStyle = `rgba(255, 235, 180, ${0.15 + blink * 0.4})`;
            ctx.fillRect(rascacielosX + wx * 12, height * 0.22 + wy * 18, 5, 8);
          }
        }
      }

      // 3. VEHÍCULOS Y TRÁFICO FLUIDO EN LA AVENIDA
      streaks.forEach((st) => {
        st.x += st.speed;
        if (st.direction === 1 && st.x > width + st.length) {
          st.x = -st.length;
        } else if (st.direction === -1 && st.x < -st.length) {
          st.x = width + st.length;
        }

        const baseY = height * 0.84 + st.laneYOffset;

        ctx.strokeStyle = st.color;
        ctx.lineWidth = st.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = st.glowColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(st.x, baseY);
        ctx.lineTo(st.x - st.length * st.direction, baseY);
        ctx.stroke();

        // Bombillo frontal/trasero brillante
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(st.x, baseY, st.width * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // 4. NIEBLA ANDINA (MIST)
      mistParticles.forEach((p) => {
        p.x += p.speedX;
        if (p.x > width + p.radius) p.x = -p.radius;

        const currentOpacity = p.opacity * (0.8 + 0.2 * Math.sin(time + p.phase));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(220, 230, 245, ${currentOpacity})`);
        grad.addColorStop(1, 'rgba(220, 230, 245, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* Video Real si está configurado o cargado */}
      {customVideoUrl && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          src={customVideoUrl}
          onLoadedData={() => setVideoLoaded(true)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            filter: 'contrast(1.18) brightness(0.72) saturate(1.1)',
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease'
          }}
        />
      )}

      {/* Canvas GPU Cinematográfico de Tráfico y Torre Colpatria en Vivo */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen',
          opacity: 0.92
        }}
      />
    </div>
  );
}
