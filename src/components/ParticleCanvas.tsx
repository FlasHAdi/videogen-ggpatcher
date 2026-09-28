import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  mode: 'idle' | 'warp' | 'converge' | 'matrix';
  density?: number;
  speedMultiplier?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  size: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  mode = 'idle',
  density = 100,
  speedMultiplier = 1,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#00e5ff', '#3b82f6', '#60a5fa', '#93c5fd', '#38bdf8', '#ffffff'];
    const particles: Particle[] = [];

    const initParticle = (p?: Partial<Particle>): Particle => {
      const z = Math.random() * width + 1;
      return {
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: z,
        prevX: 0,
        prevY: 0,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        ...p,
      };
    };

    for (let i = 0; i < density; i++) {
      particles.push(initParticle());
    }

    const cx = width / 2;
    const cy = height / 2;

    const render = () => {
      // Clear with slight trail in warp mode for motion blur
      if (mode === 'warp') {
        ctx.fillStyle = 'rgba(6, 10, 20, 0.28)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mode === 'warp') {
          // Hyperdrive warp speed towards camera
          p.z -= 16 * speedMultiplier;
          if (p.z <= 10) {
            p.z = width;
            p.x = (Math.random() - 0.5) * width * 2;
            p.y = (Math.random() - 0.5) * height * 2;
            p.prevX = cx + (p.x / p.z) * 400;
            p.prevY = cy + (p.y / p.z) * 400;
          }

          const k = 400 / p.z;
          const px = cx + p.x * k;
          const py = cy + p.y * k;

          if (p.prevX !== 0 && px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.min(3.5, (1 - p.z / width) * 3 + 0.8);
            ctx.globalAlpha = Math.min(1, (1 - p.z / width) * 1.2);
            ctx.moveTo(p.prevX, p.prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
          }

          p.prevX = px;
          p.prevY = py;
        } else if (mode === 'converge') {
          // Particles spiral into the center logo
          const dx = cx - (p.x + cx);
          const dy = cy - (p.y + cy);
          const dist = Math.sqrt(dx * dy + dy * dy) || 1;
          const angle = Math.atan2(dy, dx) + 0.05;
          const speed = 4 * speedMultiplier;

          p.x += Math.cos(angle) * speed + dx * 0.02;
          p.y += Math.sin(angle) * speed + dy * 0.02;

          ctx.beginPath();
          ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          if (Math.abs(p.x) < 20 && Math.abs(p.y) < 20) {
            p.x = (Math.random() - 0.5) * width;
            p.y = (Math.random() - 0.5) * height;
          }
        } else {
          // Idle floating tech particles
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          if (p.x < -cx) p.x = cx;
          if (p.x > cx) p.x = -cx;
          if (p.y < -cy) p.y = cy;
          if (p.y > cy) p.y = -cy;

          const screenX = cx + p.x;
          const screenY = cy + p.y;

          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.6;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, density, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};
