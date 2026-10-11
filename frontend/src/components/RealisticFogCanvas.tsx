'use client';

import React, { useEffect, useRef } from 'react';

interface RisingMist {
  x: number;
  y: number;
  startY: number;
  radius: number;
  maxRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  scaleSpeed: number;
  rotation: number;
  vRot: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmount: number;
}

interface DriftingCloud {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  vx: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface RoadPath {
  points: { x: number; y: number }[];
}

interface CarStreak {
  roadIndex: number;
  direction: 1 | -1;
  progress: number;
  speed: number;
  trailLength: number;
  lineWidth: number;
  colorType: 'red' | 'white' | 'amber';
  laneOffset: number;
  alpha: number;
}

interface CityLight {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  spriteType: 'gold' | 'amber' | 'white' | 'cyan' | 'beacon';
  isBeacon: boolean;
}

export default function RealisticFogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Roads matching Bogotá night traffic
    const roads: RoadPath[] = [
      {
        points: [
          { x: 0.60, y: 0.505 },
          { x: 0.76, y: 0.498 },
          { x: 0.88, y: 0.492 },
          { x: 0.99, y: 0.485 },
        ],
      },
      {
        points: [
          { x: 0.70, y: 0.672 },
          { x: 0.82, y: 0.655 },
          { x: 0.96, y: 0.632 },
        ],
      },
      {
        points: [
          { x: 0.81, y: 0.510 },
          { x: 0.85, y: 0.575 },
          { x: 0.88, y: 0.640 },
        ],
      },
      {
        points: [
          { x: 0.66, y: 0.585 },
          { x: 0.79, y: 0.570 },
          { x: 0.98, y: 0.548 },
        ],
      },
      {
        points: [
          { x: 0.75, y: 0.435 },
          { x: 0.87, y: 0.430 },
          { x: 0.99, y: 0.425 },
        ],
      },
    ];

    const getRoadPoint = (road: RoadPath | undefined, t: number, laneOffset: number) => {
      if (!road || !road.points || road.points.length === 0) return { x: 0, y: 0 };
      const pts = road.points;
      if (pts.length === 1) return { x: pts[0].x * width, y: pts[0].y * height };

      const numSegments = pts.length - 1;
      const clampedT = Math.max(0, Math.min(0.9999, isNaN(t) ? 0 : t));
      const segIndex = Math.min(Math.max(0, Math.floor(clampedT * numSegments)), numSegments - 1);
      const segT = Math.max(0, Math.min(1, (clampedT * numSegments) - segIndex));

      const p0 = pts[segIndex] || pts[0];
      const p1 = pts[segIndex + 1] || pts[pts.length - 1];

      if (!p0 || !p1) return { x: 0, y: 0 };

      const segX = (p1.x - p0.x);
      const segY = (p1.y - p0.y);
      const segLen = Math.hypot(segX * width, segY * height);

      const normX = (segX * width) / (segLen || 1);
      const normY = (segY * height) / (segLen || 1);

      const perpX = -normY;
      const perpY = normX;

      const px = (p0.x + segX * segT) * width + perpX * laneOffset;
      const py = (p0.y + segY * segT) * height + perpY * laneOffset;

      return { x: px, y: py };
    };

    // =========================================================================
    // PRE-RENDERED GPU SPRITES (Zero shadowBlur calculation at runtime)
    // =========================================================================
    const createGlowSprite = (size: number, innerColor: string, midColor: string, outerColor: string) => {
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const oCtx = off.getContext('2d');
      if (!oCtx) return off;

      const c = size / 2;
      const grad = oCtx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, innerColor);
      grad.addColorStop(0.55, midColor);
      grad.addColorStop(1, outerColor);

      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(c, c, c, 0, Math.PI * 2);
      oCtx.fill();
      return off;
    };

    const lightSprites: Record<string, HTMLCanvasElement> = {
      gold: createGlowSprite(32, 'rgba(255, 215, 100, 0.95)', 'rgba(255, 170, 40, 0.4)', 'rgba(255, 140, 0, 0)'),
      amber: createGlowSprite(32, 'rgba(255, 165, 40, 0.95)', 'rgba(255, 120, 20, 0.4)', 'rgba(255, 80, 0, 0)'),
      white: createGlowSprite(32, 'rgba(255, 255, 255, 1)', 'rgba(200, 230, 255, 0.45)', 'rgba(180, 220, 255, 0)'),
      cyan: createGlowSprite(32, 'rgba(120, 230, 255, 0.95)', 'rgba(60, 180, 255, 0.4)', 'rgba(0, 140, 255, 0)'),
      beacon: createGlowSprite(36, 'rgba(255, 30, 40, 1)', 'rgba(255, 0, 20, 0.6)', 'rgba(255, 0, 0, 0)'),
    };

    const mistTexture = (() => {
      const off = document.createElement('canvas');
      off.width = 256;
      off.height = 256;
      const oCtx = off.getContext('2d');
      if (!oCtx) return off;

      const c = 128;
      const grad = oCtx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, 'rgba(240, 248, 255, 1)');
      grad.addColorStop(0.25, 'rgba(225, 238, 255, 0.85)');
      grad.addColorStop(0.5, 'rgba(200, 220, 245, 0.45)');
      grad.addColorStop(0.75, 'rgba(180, 205, 235, 0.15)');
      grad.addColorStop(1, 'rgba(160, 190, 225, 0)');

      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(c, c, c, 0, Math.PI * 2);
      oCtx.fill();
      return off;
    })();

    const cloudTexture = (() => {
      const off = document.createElement('canvas');
      off.width = 256;
      off.height = 256;
      const oCtx = off.getContext('2d');
      if (!oCtx) return off;

      const c = 128;
      const grad = oCtx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, 'rgba(250, 252, 255, 0.95)');
      grad.addColorStop(0.35, 'rgba(220, 235, 250, 0.7)');
      grad.addColorStop(0.65, 'rgba(190, 215, 240, 0.3)');
      grad.addColorStop(0.85, 'rgba(170, 195, 225, 0.08)');
      grad.addColorStop(1, 'rgba(170, 195, 225, 0)');

      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(c, c, c, 0, Math.PI * 2);
      oCtx.fill();
      return off;
    })();

    let mists: RisingMist[] = [];
    let clouds: DriftingCloud[] = [];
    let cars: CarStreak[] = [];
    let cityLights: CityLight[] = [];

    const spawnMistParticle = (initRandomY = false): RisingMist => {
      const spawnX = Math.random() * (width * 0.85);
      const startY = height * 0.45 + Math.random() * (height * 0.5);
      const y = initRandomY ? height * 0.1 + Math.random() * (height * 0.75) : startY;

      return {
        x: spawnX,
        y,
        startY,
        radius: 70 + Math.random() * 80,
        maxRadius: 180 + Math.random() * 120,
        vx: 0.2 + Math.random() * 0.4,
        vy: -(0.55 + Math.random() * 0.85),
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.22,
        scaleSpeed: 0.35 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.005,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmount: 0.4 + Math.random() * 0.5,
      };
    };

    const initMists = () => {
      mists = [];
      const count = Math.min(28, Math.max(18, Math.floor(width / 30)));
      for (let i = 0; i < count; i++) {
        mists.push(spawnMistParticle(true));
      }
    };

    const initClouds = () => {
      clouds = [];
      const cloudCount = 12;
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * (width + 300) - 150,
          y: Math.random() * (height * 0.42),
          radiusX: 140 + Math.random() * 180,
          radiusY: 80 + Math.random() * 100,
          vx: 0.35 + Math.random() * 0.55,
          alpha: 0.28 + Math.random() * 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.006 + Math.random() * 0.01,
        });
      }
    };

    const initCars = () => {
      cars = [];
      roads.forEach((_, roadIdx) => {
        const carCount = roadIdx >= 3 ? 10 : 14;
        for (let i = 0; i < carCount; i++) {
          const isRed = Math.random() > 0.46;
          const direction = isRed ? 1 : -1;
          const laneOffset = isRed ? 1.2 : -1.2;
          const colorType = isRed ? 'red' : Math.random() > 0.35 ? 'white' : 'amber';

          cars.push({
            roadIndex: roadIdx,
            direction,
            progress: Math.random(),
            speed: (0.0006 + Math.random() * 0.0008) * (roadIdx === 2 ? 0.8 : 1.05),
            trailLength: 0.022 + Math.random() * 0.032,
            lineWidth: 1.1 + Math.random() * 1.0,
            colorType,
            laneOffset,
            alpha: 0.85 + Math.random() * 0.15,
          });
        }
      });
    };

    const initCityLights = () => {
      cityLights = [];
      const totalLights = 175;
      for (let i = 0; i < totalLights; i++) {
        const isBeacon = Math.random() < 0.04;
        const rand = Math.random();

        let spriteType: CityLight['spriteType'] = 'gold';
        if (isBeacon) {
          spriteType = 'beacon';
        } else if (rand > 0.75) {
          spriteType = 'white';
        } else if (rand > 0.48) {
          spriteType = 'amber';
        } else if (rand > 0.38) {
          spriteType = 'cyan';
        }

        cityLights.push({
          x: 0.60 + Math.random() * 0.39,
          y: 0.39 + Math.random() * 0.38,
          size: isBeacon ? 14 : 7 + Math.random() * 9,
          baseAlpha: isBeacon ? 0.9 : 0.4 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          speed: isBeacon ? 0.03 : 0.015 + Math.random() * 0.035,
          spriteType,
          isBeacon,
        });
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initMists();
      initClouds();
      initCars();
      initCityLights();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let mouseWind = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      mouseWind.x = (relX - 0.5) * 0.4;
      mouseWind.y = (relY - 0.5) * 0.2;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    handleResize();

    let lastTime = performance.now();

    // Constant colors for instant car line rendering (Zero allocations per frame)
    const carColors = {
      red: '#ff2233',
      white: '#ffffff',
      amber: '#ffdd77',
    };

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || width === 0 || height === 0) return;

      const delta = Math.min((now - lastTime) / 16.666, 2.0);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // 1. LIGHTER BATCH (City lights + City glow + Car trails)
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 1.1 City Lights using instant pre-rendered sprites
      for (let i = 0; i < cityLights.length; i++) {
        const l = cityLights[i];
        l.phase += l.speed * delta;

        let alpha = l.baseAlpha;
        if (l.isBeacon) {
          const pulse = (Math.sin(l.phase) + 1) * 0.5;
          alpha = pulse > 0.7 ? 1 : 0.1;
        } else {
          alpha = l.baseAlpha * (0.65 + 0.35 * Math.sin(l.phase));
        }

        const sprite = lightSprites[l.spriteType] || lightSprites.gold;
        const px = l.x * width - l.size * 0.5;
        const py = l.y * height - l.size * 0.5;

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.drawImage(sprite, px, py, l.size, l.size);
      }

      // 1.2 Car Streaks (Ultra-fast direct stroke, zero gradient allocation)
      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const road = roads[car.roadIndex];

        car.progress += car.speed * delta;
        if (car.progress > 1) {
          car.progress = 0;
          car.speed = (0.0006 + Math.random() * 0.0008) * (car.roadIndex === 2 ? 0.8 : 1.05);
        }

        const headT = car.direction === 1 ? car.progress : 1 - car.progress;
        const tailT = Math.max(0, Math.min(1, headT - car.trailLength * car.direction));

        const head = getRoadPoint(road, headT, car.laneOffset);
        const tail = getRoadPoint(road, tailT, car.laneOffset);

        ctx.strokeStyle = carColors[car.colorType];
        ctx.lineWidth = car.lineWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = car.alpha * 0.9;

        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        // Pinpoint bulb head
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(head.x, head.y, car.lineWidth * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // =========================================================================
      // 2. SCREEN BATCH (Moving clouds + Rising mountain mist)
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 2.1 Moving Clouds
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];

        c.x += (c.vx + mouseWind.x * 0.5) * delta;
        c.pulsePhase += c.pulseSpeed * delta;

        if (c.x - c.radiusX > width) {
          c.x = -c.radiusX;
          c.y = Math.random() * (height * 0.42);
        }

        const dynamicAlpha = c.alpha * (0.85 + 0.15 * Math.sin(c.pulsePhase));

        ctx.globalAlpha = Math.max(0, Math.min(1, dynamicAlpha));
        ctx.drawImage(cloudTexture, c.x - c.radiusX, c.y - c.radiusY, c.radiusX * 2, c.radiusY * 2);
      }

      // 2.2 Rising Mist Plumes
      for (let i = 0; i < mists.length; i++) {
        const m = mists[i];

        m.swayPhase += m.swaySpeed * delta;
        m.x += (m.vx + Math.sin(m.swayPhase) * m.swayAmount + mouseWind.x) * delta;
        m.y += (m.vy + mouseWind.y) * delta;
        m.rotation += m.vRot * delta;

        if (m.radius < m.maxRadius) {
          m.radius += m.scaleSpeed * delta;
        }

        const totalRiseDistance = m.startY - (height * 0.05);
        const currentDistance = m.startY - m.y;
        const progress = Math.max(0, Math.min(1, currentDistance / (totalRiseDistance || 1)));

        let currentAlpha = 0;
        if (progress < 0.25) {
          currentAlpha = (progress / 0.25) * m.maxAlpha;
        } else if (progress < 0.7) {
          currentAlpha = m.maxAlpha;
        } else {
          currentAlpha = ((1 - progress) / 0.3) * m.maxAlpha;
        }

        if (m.y + m.radius < height * 0.05 || m.x - m.radius > width || currentAlpha <= 0 && progress >= 0.95) {
          mists[i] = spawnMistParticle(false);
          continue;
        }

        const diameter = m.radius * 2;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.drawImage(mistTexture, -m.radius, -m.radius, diameter, diameter);
        ctx.restore();
      }

      ctx.restore();

      mouseWind.x *= 0.96;
      mouseWind.y *= 0.96;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="realistic-fog-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
}
