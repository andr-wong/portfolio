'use client';

import { useRef, useEffect } from 'react';

interface AmbientFieldProps {
  mode: 'light' | 'dark';
}

export default function AmbientField({ mode }: AmbientFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0,
      H = 0,
      dpr = 1;
    const STEP = 32;
    const LEVELS = [-0.72, -0.45, -0.18, 0.09, 0.36, 0.63];
    let cols = 0,
      rows = 0,
      vals: Float32Array | null = null;

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / STEP) + 2;
      rows = Math.ceil(H / STEP) + 2;
      vals = new Float32Array(cols * rows);
    };
    resize();
    window.addEventListener('resize', resize);

    // Animated topographic contour field via marching squares over sinusoidal waves.
    // Cursor position creates a gaussian bulge that drifts the isolines toward it.
    const field = (
      x: number,
      y: number,
      ys: number,
      t: number,
      px: number,
      py: number,
      pw: number
    ) => {
      const yw = y + ys;
      let v =
        Math.sin(x * 0.009 + t * 0.18) +
        Math.sin(yw * 0.011 - t * 0.15) +
        Math.sin((x + yw) * 0.0072 + t * 0.11) +
        Math.sin((x - yw) * 0.0061 - t * 0.09) +
        Math.sin(Math.hypot(x - W * 0.5, yw - H * 0.62) * 0.0085 - t * 0.13);
      if (pw > 0.001) {
        const dx = x - px,
          dy = y - py;
        v += pw * 2.4 * Math.exp(-(dx * dx + dy * dy) / (2 * 240 * 240));
      }
      return v / 5;
    };

    let pmx = -9999,
      pmy = -9999,
      tmx = -9999,
      tmy = -9999,
      pw = 0,
      tpw = 0;
    let scrollY = 0,
      parallax = 0;

    const onMove = (e: PointerEvent) => {
      tmx = e.clientX;
      tmy = e.clientY;
      tpw = 1;
    };
    const onLeave = () => {
      tpw = 0;
    };
    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset || 0;
    };
    onScroll();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerout', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    const seg = (p: Path2D, ax: number, ay: number, bx: number, by: number) => {
      p.moveTo(ax, ay);
      p.lineTo(bx, by);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (let j = 0; j < rows; j++) {
        const y = j * STEP;
        for (let i = 0; i < cols; i++) {
          vals![j * cols + i] = field(i * STEP, y, parallax, t, pmx, pmy, pw);
        }
      }
      const path = new Path2D();
      for (const lv of LEVELS) {
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const x = i * STEP,
              y = j * STEP;
            const v0 = vals![j * cols + i],
              v1 = vals![j * cols + i + 1];
            const v2 = vals![(j + 1) * cols + i + 1],
              v3 = vals![(j + 1) * cols + i];
            const idx =
              (v0 > lv ? 8 : 0) |
              (v1 > lv ? 4 : 0) |
              (v2 > lv ? 2 : 0) |
              (v3 > lv ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const Tx = x + STEP * ((lv - v0) / (v1 - v0)),
              Ty = y;
            const Rx = x + STEP,
              Ry = y + STEP * ((lv - v1) / (v2 - v1));
            const Bx = x + STEP * ((lv - v3) / (v2 - v3)),
              By = y + STEP;
            const Lx = x,
              Ly = y + STEP * ((lv - v0) / (v3 - v0));
            switch (idx) {
              case 1:  seg(path, Lx, Ly, Bx, By); break;
              case 2:  seg(path, Bx, By, Rx, Ry); break;
              case 3:  seg(path, Lx, Ly, Rx, Ry); break;
              case 4:  seg(path, Tx, Ty, Rx, Ry); break;
              case 5:  seg(path, Tx, Ty, Lx, Ly); seg(path, Bx, By, Rx, Ry); break;
              case 6:  seg(path, Tx, Ty, Bx, By); break;
              case 7:  seg(path, Tx, Ty, Lx, Ly); break;
              case 8:  seg(path, Tx, Ty, Lx, Ly); break;
              case 9:  seg(path, Tx, Ty, Bx, By); break;
              case 10: seg(path, Tx, Ty, Rx, Ry); seg(path, Bx, By, Lx, Ly); break;
              case 11: seg(path, Tx, Ty, Rx, Ry); break;
              case 12: seg(path, Lx, Ly, Rx, Ry); break;
              case 13: seg(path, Bx, By, Rx, Ry); break;
              case 14: seg(path, Lx, Ly, Bx, By); break;
            }
          }
        }
      }
      const dark = modeRef.current === 'dark';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      if (dark) {
        ctx.shadowColor = 'rgba(224,85,74,0.45)';
        ctx.shadowBlur = 5;
        ctx.strokeStyle = 'rgba(224,85,74,0.14)';
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(36,31,24,0.09)';
      }
      ctx.stroke(path);
      ctx.shadowBlur = 0;
    };

    let raf: number,
      last = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      if (tmx > -9999) {
        pmx += (tmx - (pmx < -9000 ? tmx : pmx)) * 0.06;
        pmy += (tmy - (pmy < -9000 ? tmy : pmy)) * 0.06;
      }
      pw += (tpw - pw) * 0.05;
      parallax += (scrollY * 0.16 - parallax) * 0.08;
      draw((now - t0) * 0.001);
    };

    if (reduce) {
      pmx = W * 0.5;
      pmy = H * 0.5;
      pw = 0;
      parallax = 0;
      draw(8.0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas className="bento-ambient" ref={canvasRef} aria-hidden="true" />;
}
