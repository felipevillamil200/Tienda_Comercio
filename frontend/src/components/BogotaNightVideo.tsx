'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Video, Upload, Camera, Sparkles } from 'lucide-react';

export default function BogotaNightVideo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showCameraHud, setShowCameraHud] = useState<boolean>(false);
  const [timecode, setTimecode] = useState<string>('00:01:24:18');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('noctis_bg_video_url');
      if (saved) setVideoSrc(saved);
    }
  }, []);

  // Timecode generator for authentic camera viewfinder
  useEffect(() => {
    let frame = 18;
    let sec = 24;
    let min = 1;
    const timer = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecode(`00:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(timer);
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoSrc(url);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && dataUrl.length < 20000000) {
        try {
          localStorage.setItem('noctis_bg_video_url', dataUrl);
        } catch {
          // ignore
        }
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = container.clientWidth || 1200);
    let height = (canvas.height = container.clientHeight || 700);

    const bgImage = new Image();
    bgImage.src = '/assets/brand/torre_colpatria_noche.jpg';
    let imageLoaded = false;
    bgImage.onload = () => {
      imageLoaded = true;
    };

    // ========================================================
    // PERFORMANCE: PRE-RENDERED SPRITES (Zero per-frame allocations)
    // ========================================================
    // 1. High Sky Cloud Sprite
    const skyCloudCanvas = document.createElement('canvas');
    skyCloudCanvas.width = 192;
    skyCloudCanvas.height = 96;
    const sctx = skyCloudCanvas.getContext('2d');
    if (sctx) {
      const sGrad = sctx.createRadialGradient(96, 48, 0, 96, 48, 96);
      sGrad.addColorStop(0, 'rgba(18, 24, 38, 0.45)');
      sGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.22)');
      sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      sctx.fillStyle = sGrad;
      sctx.beginPath();
      sctx.ellipse(96, 48, 92, 44, 0, 0, Math.PI * 2);
      sctx.fill();
    }

    // 2. Mountain Ridge Mist Sprite
    const ridgeMistCanvas = document.createElement('canvas');
    ridgeMistCanvas.width = 160;
    ridgeMistCanvas.height = 80;
    const rctx = ridgeMistCanvas.getContext('2d');
    if (rctx) {
      const rGrad = rctx.createRadialGradient(80, 40, 0, 80, 40, 80);
      rGrad.addColorStop(0, 'rgba(71, 85, 105, 0.35)');
      rGrad.addColorStop(0.5, 'rgba(100, 116, 139, 0.18)');
      rGrad.addColorStop(1, 'rgba(100, 116, 139, 0)');
      rctx.fillStyle = rGrad;
      rctx.beginPath();
      rctx.ellipse(80, 40, 76, 36, 0, 0, Math.PI * 2);
      rctx.fill();
    }

    // 3. Low Valley Street Mist Sprite
    const streetMistCanvas = document.createElement('canvas');
    streetMistCanvas.width = 160;
    streetMistCanvas.height = 80;
    const mctx = streetMistCanvas.getContext('2d');
    if (mctx) {
      const mGrad = mctx.createRadialGradient(80, 40, 0, 80, 40, 80);
      mGrad.addColorStop(0, 'rgba(148, 163, 184, 0.28)');
      mGrad.addColorStop(0.6, 'rgba(148, 163, 184, 0.1)');
      mGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
      mctx.fillStyle = mGrad;
      mctx.beginPath();
      mctx.ellipse(80, 40, 76, 36, 0, 0, Math.PI * 2);
      mctx.fill();
    }

    // 4. Soft Optical Flare Sprite
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 128;
    flareCanvas.height = 128;
    const fctx = flareCanvas.getContext('2d');
    if (fctx) {
      const fGrad = fctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      fGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      fGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.12)');
      fGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      fctx.fillStyle = fGrad;
      fctx.beginPath();
      fctx.arc(64, 64, 60, 0, Math.PI * 2);
      fctx.fill();
    }

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // PERFORMANCE: IntersectionObserver (Pauses RAF when scrolled away)
    // ========================================================
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ========================================================
    // OPTIMIZED SIMULATION DATA
    // ========================================================
    let t = 0;

    // Traffic light streaks (Optimized batch of 28 cars)
    interface TrafficCar {
      x: number;
      lane: number;
      speed: number;
      len: number;
      isTaillight: boolean;
      w: number;
    }
    const traffic: TrafficCar[] = [];
    for (let i = 0; i < 28; i++) {
      const isTail = Math.random() > 0.48;
      traffic.push({
        x: Math.random() * width,
        lane: (Math.random() - 0.5) * 44,
        speed: (isTail ? -1 : 1) * (3.2 + Math.random() * 4.5),
        len: 40 + Math.random() * 85,
        isTaillight: isTail,
        w: 1.6 + Math.random() * 2.2
      });
    }

    // Cloud system (Optimized 16 cloud sprites)
    interface CloudSprite {
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      type: 'sky' | 'ridge' | 'street';
      alpha: number;
      phase: number;
    }
    const clouds: CloudSprite[] = [];
    // High sky
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * (width + 300) - 150,
        y: height * 0.05 + Math.random() * (height * 0.22),
        w: 240 + Math.random() * 200,
        h: 90 + Math.random() * 70,
        vx: 0.35 + Math.random() * 0.45,
        type: 'sky',
        alpha: 0.6 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    // Mountain Ridge
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * (width + 300) - 150,
        y: height * 0.26 + Math.random() * (height * 0.24),
        w: 200 + Math.random() * 160,
        h: 70 + Math.random() * 50,
        vx: 0.25 + Math.random() * 0.35,
        type: 'ridge',
        alpha: 0.5 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }
    // Street vapor
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * (width + 300) - 150,
        y: height * 0.52 + Math.random() * (height * 0.36),
        w: 180 + Math.random() * 140,
        h: 60 + Math.random() * 45,
        vx: 0.2 + Math.random() * 0.3,
        type: 'street',
        alpha: 0.4 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }

    // ========================================================
    // MAIN HIGH-EFFICIENCY RENDER LOOP (Solid 60 FPS)
    // ========================================================
    const render = () => {
      if (!isVisible) return;
      t += 0.016;

      // 1. Clear background
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // 2. Camera Steadycam Sway
      const camZoom = 1.05 + 0.03 * Math.sin(t * 0.32);
      const camPanX = Math.sin(t * 0.28) * 20;
      const camPanY = Math.cos(t * 0.22) * 10;

      ctx.save();
      ctx.translate(width / 2 + camPanX, height / 2 + camPanY);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-width / 2, -height / 2);

      // 3. Draw Background Photo
      if (imageLoaded) {
        ctx.drawImage(bgImage, -20, -15, width + 40, height + 30);
      }

      // 4. Draw Mountain Clouds & Mist Timelapse (Pre-rendered Sprites)
      clouds.forEach((cl) => {
        cl.x += cl.vx;
        if (cl.x > width + cl.w / 2) cl.x = -cl.w / 2;

        const dynAlpha = cl.alpha * (0.8 + 0.2 * Math.sin(t * 1.2 + cl.phase));
        ctx.globalAlpha = dynAlpha;

        let sprite = skyCloudCanvas;
        if (cl.type === 'ridge') sprite = ridgeMistCanvas;
        else if (cl.type === 'street') sprite = streetMistCanvas;

        ctx.drawImage(sprite, cl.x - cl.w / 2, cl.y - cl.h / 2, cl.w, cl.h);
      });
      ctx.globalAlpha = 1.0;

      // 5. Torre Colpatria LED Pilasters (Precise bounds, high efficiency)
      const towerX = width * 0.423;
      const towerTopY = height * 0.22;
      const towerBottomY = height * 0.66;
      const towerH = towerBottomY - towerTopY;
      const towerW = width * 0.035;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const numColumns = 5;
      const colSpacing = (towerW * 0.85) / (numColumns - 1);
      const startX = towerX - (towerW * 0.85) / 2;
      const colorCycle = Math.floor((t * 0.15) % 3);

      for (let c = 0; c < numColumns; c++) {
        const colX = startX + c * colSpacing;
        const segments = 12;
        for (let s = 0; s < segments; s++) {
          const segY = towerTopY + (s / segments) * towerH;
          const segH = (towerH / segments) * 0.7;
          const wave = Math.sin(t * 3.0 + s * 0.4 + c * 0.5);
          const intensity = Math.max(0.15, 0.4 + 0.4 * wave);

          let rgb = '255, 255, 255';
          if (colorCycle === 0) {
            if (s < 4) rgb = '255, 215, 0';
            else if (s < 8) rgb = '0, 140, 255';
            else rgb = '255, 30, 45';
          } else if (colorCycle === 1) {
            rgb = '192, 132, 252';
          } else {
            rgb = c % 2 === 0 ? '255, 255, 255' : '56, 189, 248';
          }

          ctx.fillStyle = `rgba(${rgb}, ${intensity * 0.65})`;
          ctx.fillRect(colX - 1, segY, 2, segH);
        }
      }
      ctx.restore();

      // Spire Strobe Beacon
      const strobe = Math.sin(t * 7.0) > 0.6 ? 1 : 0.1;
      ctx.fillStyle = `rgba(255, 30, 30, ${strobe})`;
      ctx.beginPath();
      ctx.arc(width * 0.423, height * 0.175, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 6. Fast Vehicle Traffic Light Trails (High-speed batch stroke)
      const roadY = height * 0.835;
      traffic.forEach((car) => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > width + car.len + 30) car.x = -car.len - 20;
        else if (car.speed < 0 && car.x < -car.len - 30) car.x = width + car.len + 20;

        const currentY = roadY + car.lane;
        const col = car.isTaillight ? 'rgba(255, 35, 55, ' : 'rgba(255, 245, 180, ';

        // Outer glow pass
        ctx.strokeStyle = `${col}0.35)`;
        ctx.lineWidth = car.w + 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(car.x, currentY);
        ctx.lineTo(car.x - car.len * (car.speed > 0 ? 1 : -1), currentY);
        ctx.stroke();

        // Core bright line
        ctx.strokeStyle = car.isTaillight ? '#ff2a3a' : '#ffffff';
        ctx.lineWidth = car.w;
        ctx.beginPath();
        ctx.moveTo(car.x, currentY);
        ctx.lineTo(car.x - car.len * (car.speed > 0 ? 1 : -1), currentY);
        ctx.stroke();
      });

      // 7. Soft Optical Flare (Pre-rendered sprite)
      const flareAlpha = 0.25 + 0.15 * Math.sin(t * 1.8);
      ctx.globalAlpha = flareAlpha;
      ctx.drawImage(flareCanvas, width * 0.42 - 40, height * 0.28 - 40, 80, 80);
      ctx.globalAlpha = 1.0;

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        backgroundColor: '#040406'
      }}
    >
      {/* Video subido por el usuario si existe */}
      {videoSrc ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          src={videoSrc}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            filter: 'contrast(1.15) brightness(0.78) saturate(1.1)',
            zIndex: 1
          }}
        />
      ) : (
        /* Motor Cinematográfico de Alto Rendimiento (60 FPS, Sprites pre-renderizados e IntersectionObserver) */
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      )}

      {/* Capa de Viñeta Cinematográfica y Gradiente de Contraste */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(4, 4, 6, 0.45) 0%, rgba(4, 4, 6, 0.2) 40%, rgba(4, 4, 6, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleVideoUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}

