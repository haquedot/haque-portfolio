'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

type CatProps = {
  size?: number;
  interactive?: boolean;
  glow?: boolean;
  idleAnimation?: boolean;
  className?: string;
};

type Point = {
  x: number;
  y: number;
};

type Particle = {
  id: number;
  angle: number;
  distance: number;
  delay: number;
};

type Eye = {
  x: number;
  y: number;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
}

function useMousePosition() {
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    let latest = { x: 0, y: 0 };

    const onMove = (event: MouseEvent) => {
      latest = { x: event.clientX, y: event.clientY };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPosition(latest));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return position;
}

function useIdleState(ms = 3000) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reset = () => {
      setIsIdle(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setIsIdle(true), ms);
    };

    const events = ['mousemove', 'pointermove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    reset();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [ms]);

  return isIdle;
}

function useCatSvgMarkup() {
  const [svgMarkup, setSvgMarkup] = useState('');

  useEffect(() => {
    let alive = true;

    fetch('/cat.svg')
      .then((res) => res.text())
      .then((svg) => {
        if (!alive) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const root = doc.documentElement;

        // ── helpers ──────────────────────────────────────────────────────────
        const normColor = (v: string | null) =>
          (v || '').trim().toLowerCase().replace(/\s+/g, '');

        const colorFromStyle = (style: string | null) => {
          const m = (style || '').match(/(?:^|;)\s*(\w+)\s*:\s*([^;]+)/gi) || [];
          const map: Record<string, string> = {};
          for (const decl of m) {
            const [k, ...rest] = decl.replace(/^;/, '').trim().split(':');
            map[k.trim().toLowerCase()] = rest.join(':').trim().toLowerCase();
          }
          return map;
        };

        const resolvedFill = (el: Element): string => {
          const attr = normColor(el.getAttribute('fill'));
          if (attr && attr !== 'none' && attr !== '') return attr;
          const styleMap = colorFromStyle(el.getAttribute('style'));
          return normColor(styleMap['fill'] || '');
        };

        const DARK_FILLS = new Set([
          '#000', '#000000', '0', 'black', 'rgb(0,0,0)',
          '#0e0e0e', 'rgb(14,14,14)',
          '#111', '#111111', '#1a1a1a', '#0d0d0d',
        ]);

        const isDark = (fill: string) => {
          if (DARK_FILLS.has(fill)) return true;
          // catch short hex: #xyz where all channels < 0x33
          const hex3 = fill.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
          if (hex3) return [1, 2, 3].every((i) => parseInt(hex3[i], 16) < 4);
          const hex6 = fill.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
          if (hex6) return [1, 2, 3].every((i) => parseInt(hex6[i], 16) < 40);
          return false;
        };

        const vbSize = () => {
          const vb = root.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
          return vb?.length === 4
            ? { w: vb[2], h: vb[3] }
            : { w: 1254, h: 1254 };
        };

        const { w: VW, h: VH } = vbSize();
        const AREA_THRESHOLD = VW * VH * 0.6; // covers >60% → background

        const elementArea = (el: Element): number => {
          const tag = el.tagName.toLowerCase();
          if (tag === 'rect') {
            const ew = parseFloat(el.getAttribute('width') || '0');
            const eh = parseFloat(el.getAttribute('height') || '0');
            return ew * eh;
          }
          if (tag === 'circle') {
            const r = parseFloat(el.getAttribute('r') || '0');
            return Math.PI * r * r;
          }
          if (tag === 'ellipse') {
            const rx2 = parseFloat(el.getAttribute('rx') || '0');
            const ry2 = parseFloat(el.getAttribute('ry') || '0');
            return Math.PI * rx2 * ry2;
          }
          if (tag === 'path') {
            // large paths that contain 1254/viewbox size coords are likely backgrounds
            const d = el.getAttribute('d') || '';
            const nums = d.match(/-?[\d.]+/g)?.map(Number) || [];
            if (!nums.length) return 0;
            const maxX = Math.max(...nums.filter((_, i) => i % 2 === 0));
            const maxY = Math.max(...nums.filter((_, i) => i % 2 === 1));
            return maxX * maxY;
          }
          return 0;
        };

        // ── remove background / shadow elements ──────────────────────────────
        const allDrawable = Array.from(
          root.querySelectorAll('rect, circle, ellipse, path, polygon, polyline')
        );

        for (const el of allDrawable) {
          const fill = resolvedFill(el);
          const area = elementArea(el);
          const tag = el.tagName.toLowerCase();

          // 1. Dark fills that are large (background rectangles / paths)
          if (isDark(fill) && area > AREA_THRESHOLD) {
            el.remove();
            continue;
          }

          // 2. Any element with filter referencing "shadow" / "drop-shadow"
          const filterAttr = el.getAttribute('filter') || '';
          const styleMap = colorFromStyle(el.getAttribute('style'));
          const filterStyle = styleMap['filter'] || '';
          if (/shadow|blur|drop/i.test(filterAttr + filterStyle)) {
            el.removeAttribute('filter');
            if (el.getAttribute('style')) {
              el.setAttribute(
                'style',
                el.getAttribute('style')!.replace(/filter\s*:[^;]+;?/gi, '').trim()
              );
            }
          }

          // 3. Standalone <filter> definitions that describe shadows/blurs
          // (handled below via defs cleanup)
        }

        // ── strip shadow/blur filters from <defs> ────────────────────────────
        const filters = Array.from(root.querySelectorAll('filter'));
        for (const f of filters) {
          const hasShadow = f.querySelector(
            'feDropShadow, feBlend, feComposite, feFlood, feOffset, feGaussianBlur'
          );
          // only remove if the filter's sole purpose is a shadow (has feOffset or feDropShadow)
          if (f.querySelector('feDropShadow') || f.querySelector('feOffset')) {
            f.remove();
          }
        }

        // ── strip box-shadow / drop-shadow inline styles on any element ──────
        const allEls = Array.from(root.querySelectorAll('*'));
        for (const el of allEls) {
          const style = el.getAttribute('style');
          if (!style) continue;
          const cleaned = style
            .replace(/filter\s*:\s*drop-shadow\([^)]*\)\s*;?/gi, '')
            .replace(/box-shadow\s*:[^;]+;?/gi, '')
            .replace(/filter\s*:\s*url\(#[^)]*shadow[^)]*\)\s*;?/gi, '')
            .trim();
          if (cleaned !== style) el.setAttribute('style', cleaned);
        }

        // ── fix root SVG attrs ───────────────────────────────────────────────
        root.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        root.setAttribute('style', 'width:100%;height:100%;display:block;');
        root.setAttribute('width', '100%');
        root.setAttribute('height', '100%');
        root.removeAttribute('style'); // let parent control sizing
        root.setAttribute('style', 'width:100%;height:100%;display:block;overflow:visible;');

        // ── also clear any background color on the root SVG itself ───────────
        const rootFill = normColor(root.getAttribute('fill') || '');
        if (isDark(rootFill)) root.removeAttribute('fill');
        const rootStyle = colorFromStyle(root.getAttribute('style') || '');
        if (isDark(rootStyle['background'] || '') || isDark(rootStyle['background-color'] || '')) {
          root.setAttribute(
            'style',
            (root.getAttribute('style') || '').replace(/background(?:-color)?\s*:[^;]+;?/gi, '').trim()
          );
        }

        const serialized = new XMLSerializer().serializeToString(root);
        const inner = serialized
          .replace(/^[\s\S]*?<svg[^>]*>/, '')
          .replace(/<\/svg>\s*$/, '');

        setSvgMarkup(inner);
      })
      .catch(() => {
        if (!alive) return;
        setSvgMarkup('');
      });

    return () => {
      alive = false;
    };
  }, []);

  return svgMarkup;
}

const EYES: Record<'left' | 'right', Eye> = {
  left: { x: 402, y: 872 },
  right: { x: 855, y: 871 },
};

function useEyeTracking(wrapperRef: React.RefObject<HTMLDivElement | null>, interactive: boolean) {
  const mouse = useMousePosition();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 18, stiffness: 160, mass: 0.7 });
  const springY = useSpring(y, { damping: 18, stiffness: 160, mass: 0.7 });

  const rotateX = useTransform(springY, [-1, 1], [6, -6]);
  const rotateY = useTransform(springX, [-1, 1], [-6, 6]);
  const bobX = useTransform(springX, [-1, 1], [-2, 2]);
  const bobY = useTransform(springY, [-1, 1], [2, -2]);

  useEffect(() => {
    if (!interactive || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (mouse.x - cx) / Math.max(rect.width, 1);
    const ny = (mouse.y - cy) / Math.max(rect.height, 1);

    x.set(Math.max(-1, Math.min(1, nx * 2.3)));
    y.set(Math.max(-1, Math.min(1, ny * 2.3)));
  }, [interactive, mouse.x, mouse.y, wrapperRef, x, y]);

  return { rotateX, rotateY, bobX, bobY, springX, springY };
}

export default function Cat({
  size = 280,
  interactive = true,
  glow = true,
  idleAnimation = true,
  className = '',
}: CatProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgMarkup = useCatSvgMarkup();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isIdle = useIdleState(3200);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [blinkPhase, setBlinkPhase] = useState(0);
  const [clickPulse, setClickPulse] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [whiskerPulse, setWhiskerPulse] = useState(0);

  const { rotateX, rotateY, bobX, bobY, springX, springY } = useEyeTracking(
    wrapperRef,
    interactive
  );

  const idleSway = useMotionValue(0);
  useEffect(() => {
    if (prefersReducedMotion || !idleAnimation) return;

    const controls = animate(idleSway, isIdle ? [0, 1, 0] : [0, 0.2, 0], {
      duration: isIdle ? 6 : 4,
      repeat: Infinity,
      ease: 'easeInOut',
    });

    return () => controls.stop();
  }, [idleAnimation, idleSway, isIdle, prefersReducedMotion]);

  const driftX = useTransform(idleSway, [0, 1], [-2, 2]);
  const driftY = useTransform(idleSway, [0, 1], [0.8, -0.8]);

  const eyeLeftX = useTransform(springX, [-1, 1], [-10, 10]);
  const eyeLeftY = useTransform(springY, [-1, 1], [-10, 10]);
  const eyeRightX = useTransform(springX, [-1, 1], [-10, 10]);
  const eyeRightY = useTransform(springY, [-1, 1], [-10, 10]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const fastBlink = isHovered ? 2600 : 4300;
    const interval = window.setInterval(() => {
      if (!idleAnimation) return;
      setBlinkPhase(1);
      window.setTimeout(() => setBlinkPhase(0), isIdle ? 170 : 120);
    }, fastBlink);

    return () => window.clearInterval(interval);
  }, [idleAnimation, isHovered, isIdle, prefersReducedMotion]);

  useEffect(() => {
    if (!interactive || prefersReducedMotion) return;
    const id = window.setInterval(() => setWhiskerPulse((v) => v + 1), 1200);
    return () => window.clearInterval(id);
  }, [interactive, prefersReducedMotion]);

  const spawnParticles = useCallback(() => {
    if (prefersReducedMotion) return;

    setClickPulse((v) => v + 1);
    setParticles(
      Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (Math.PI * 2 * i) / 8 + Math.random() * 0.24,
        distance: 54 + Math.random() * 36,
        delay: i * 0.02,
      }))
    );

    window.setTimeout(() => setParticles([]), 850);
  }, [prefersReducedMotion]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      spawnParticles();
    }
  }, [spawnParticles]);

  const eyeScale = isHovered || isFocused ? 1.12 : 1;
  const glowOpacity = isHovered || isFocused ? 0.95 : 0.45;
  const shadowScale = isHovered ? 1.12 : 1;
  const shadowOpacity = isHovered ? 0.18 : 0.1;

  return (
    <motion.div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      aria-label="Interactive cat mascot"
      onKeyDown={handleKeyDown}
      onClick={spawnParticles}
      onMouseDown={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(event) => setIsFocused(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocused(false)}
      className={`relative isolate mx-auto flex items-center justify-center outline-none ${className}`}
      style={{ width: size, height: size, perspective: 1400 }}
    >
      {glow && (
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 1254 1254"
          className="pointer-events-none absolute inset-0 h-full w-full blur-3xl"
          style={{ opacity: glowOpacity }}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <defs>
            <radialGradient id="cat-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.7)" />
              <stop offset="60%" stopColor="rgba(16,185,129,0.16)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </radialGradient>
          </defs>
          <circle cx="627" cy="627" r="430" fill="url(#cat-glow)" />
        </motion.svg>
      )}

      <motion.div
        className="relative z-10 h-full w-full"
        style={{
          x: prefersReducedMotion ? 0 : interactive ? springX : 0,
          y: prefersReducedMotion ? 0 : interactive ? springY : 0,
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          scale: prefersReducedMotion ? 1 : 1,
        }}
        animate={{
          x: prefersReducedMotion ? 0 : [0, 0.5, 0],
          y: prefersReducedMotion ? 0 : [0, -5, 0],
        }}
        transition={{
          duration: isIdle ? 6 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.svg
          viewBox="0 0 1254 1254"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          style={{
            x: prefersReducedMotion ? 0 : driftX,
            y: prefersReducedMotion ? 0 : driftY,
          }}
          animate={{ scale: prefersReducedMotion ? 1 : [1, 1.01, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <defs>
            <radialGradient id="eye-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            <filter id="soft-glow">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {svgMarkup ? (
            <g dangerouslySetInnerHTML={{ __html: svgMarkup }} />
          ) : (
            <g />
          )}

          {/* SVG-only interaction layers */}
          <motion.g
            animate={{
              y: blinkPhase ? 18 : 0,
              scaleY: blinkPhase ? 0.18 : eyeScale,
            }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{ filter: 'url(#soft-glow)' }}
          >
            <motion.ellipse
              cx={EYES.left.x}
              cy={EYES.left.y}
              rx="64"
              ry="84"
              fill="url(#eye-glow)"
              opacity={isHovered || isFocused ? 0.36 : 0.15}
              style={{ x: eyeLeftX, y: eyeLeftY }}
              animate={{ scale: eyeScale }}
            />
            <motion.ellipse
              cx={EYES.right.x}
              cy={EYES.right.y}
              rx="64"
              ry="84"
              fill="url(#eye-glow)"
              opacity={isHovered || isFocused ? 0.36 : 0.15}
              style={{ x: eyeRightX, y: eyeRightY }}
              animate={{ scale: eyeScale }}
            />
          </motion.g>

          {/* Whisker sway overlay kept subtle to preserve the original artwork */}
          <motion.g
            opacity={0.16}
            animate={{ rotate: isHovered ? 1.2 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.path
              d="M 60 105 Q 40 100 25 105"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? -2 : 2 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 60 115 Q 40 115 25 120"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? -2 : 2 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
            />
            <motion.path
              d="M 60 125 Q 40 130 25 132"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? -2 : 2 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
            />
            <motion.path
              d="M 140 105 Q 160 100 175 105"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? 2 : -2 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 140 115 Q 160 115 175 120"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? 2 : -2 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.05 }}
            />
            <motion.path
              d="M 140 125 Q 160 130 175 132"
              stroke="#d4ccc2"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              animate={{ x: whiskerPulse % 2 ? 2 : -2 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
            />
          </motion.g>

          {/* Hover/click sparks stay inside SVG */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.circle
                key={`${clickPulse}-${particle.id}`}
                cx={627}
                cy={625}
                r="9"
                fill="#86efac"
                stroke="#dcfce7"
                strokeWidth="2"
                opacity="0.9"
                initial={{ opacity: 0.9, scale: 0.9 }}
                animate={{
                  opacity: 0,
                  scale: 0.08,
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.72, delay: particle.delay, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </motion.svg>
      </motion.div>

      {/* Keyboard focus ring - SVG only, no image content change */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 1254 1254"
        className="pointer-events-none absolute inset-0 h-full w-full"
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <rect
          x="34"
          y="34"
          width="1186"
          height="1186"
          rx="140"
          ry="140"
          fill="none"
          stroke="rgba(16,185,129,0.45)"
          strokeWidth="10"
          strokeDasharray="24 16"
        />
      </motion.svg>
    </motion.div>
  );
}
