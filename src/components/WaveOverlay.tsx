import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

export interface WaveHandle {
  ripple: (x: number, y: number, color?: string) => void;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  color: string;
}

export const WaveOverlay = forwardRef<WaveHandle, { enabled: boolean }>(function WaveOverlay(
  { enabled },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const next: Ripple[] = [];
    for (const rip of ripplesRef.current) {
      rip.r += 14;
      rip.alpha *= 0.93;
      if (rip.r < rip.maxR && rip.alpha > 0.02) {
        next.push(rip);
        ctx.save();
        ctx.globalAlpha = rip.alpha;
        ctx.strokeStyle = rip.color;
        ctx.lineWidth = 3 * dpr;
        ctx.beginPath();
        ctx.arc(rip.x * dpr, rip.y * dpr, rip.r * dpr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    ripplesRef.current = next;
    if (next.length > 0) {
      rafRef.current = requestAnimationFrame(drawFrame);
    } else {
      rafRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    ripple(x: number, y: number, color = '#8b7bff') {
      if (!enabled) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      ripplesRef.current.push({ x, y, r: 8, maxR: 220, alpha: 0.45, color });
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
    />
  );
});
