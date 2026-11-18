"use client";
import { lazyClient } from "@/lib/lazy";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { heroMotion } from "@/lib/animation/heroMotion";
import { useTier } from "@/lib/quality";
const CX = 0.5;
const CY = 0.459;
const RADIUS = 0.113;
const BARS = 13;
const HeroModelScene = lazyClient(() => import("./HeroModelScene"));
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
const WAVES = [
  { wavelength: 5.8, amp: 0.36, speed: 0.22, phase: 0, width: 1, core: "255,252,244", halo: "255,190,120" },
  { wavelength: 4.6, amp: 0.24, speed: -0.17, phase: 1.9, width: 0.75, core: "255,244,226", halo: "240,170,104" },
  { wavelength: 7.4, amp: 0.2, speed: 0.13, phase: 3.6, width: 0.55, core: "255,255,255", halo: "255,222,180" }
];
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  // deterministic scatter along and around the wave band
  x: -0.46 + i * 0.6180339 % 1 * 0.92,
  y: (i * 0.7548776 % 1 - 0.5) * 0.55,
  size: 0.07 + i * 0.3819 % 1 * 0.1,
  speed: 0.5 + i * 0.137 % 1 * 1.2,
  phase: i * 1.7
}));
function makeGlow(rgb, size = 96) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.45)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
function HeroArt() {
  const canvas = useRef(null);
  const wrap = useRef(null);
  const tier = useTier();
  const tierRef = useRef(tier);
  const [mount3d, setMount3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const lite = useMediaQuery("(max-width: 1023px)");
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    tierRef.current = tier;
  }, [tier]);
  const want3d = import.meta.env.VITE_HERO_3D === "1";
  useEffect(() => {
    if (!want3d || tier === "low" || !hasWebGL()) return;
    const w = window;
    if (w.requestIdleCallback) {
      const id2 = w.requestIdleCallback(() => setMount3d(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id2);
    }
    const id = setTimeout(() => setMount3d(true), 300);
    return () => clearTimeout(id);
  }, [tier, want3d]);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => setActive(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glowCool = makeGlow("255,200,140");
    const glowWhite = makeGlow("255,246,230");
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let voice = 0;
    const draw = (t) => {
      const tr = tierRef.current;
      ctx.clearRect(0, 0, w, h);
      const r = RADIUS * w;
      const cx = CX * w;
      const cy = CY * h;
      const intro = heroMotion.wave;
      const energy = 1 + voice * 0.9;
      const reach = w * 0.5 * (0.15 + 0.85 * intro);
      const steps = tr === "high" ? 80 : 48;
      for (const wv of WAVES) {
        const pts = [];
        for (let i = 0; i <= steps; i++) {
          const x = cx - reach + i / steps * reach * 2;
          const u = (x - (cx - w * 0.5)) / w;
          const taper = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 1.3);
          const k = 2 * Math.PI / (wv.wavelength * r);
          pts.push([x, cy - Math.cos((x - cx) * k + wv.phase + t * wv.speed * 2) * wv.amp * r * taper * energy * intro]);
        }
        const fade = (rgb, a) => {
          const g = ctx.createLinearGradient(cx - reach, 0, cx + reach, 0);
          g.addColorStop(0, `rgba(${rgb},0)`);
          g.addColorStop(0.2, `rgba(${rgb},${a})`);
          g.addColorStop(0.8, `rgba(${rgb},${a})`);
          g.addColorStop(1, `rgba(${rgb},0)`);
          return g;
        };
        const path = () => {
          ctx.beginPath();
          pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        };
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = fade(wv.halo, 0.22);
        ctx.lineWidth = r * 0.16 * wv.width;
        path();
        ctx.stroke();
        if (tr !== "low") {
          ctx.strokeStyle = fade(wv.halo, 0.4);
          ctx.lineWidth = r * 0.05 * wv.width;
          path();
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = fade(wv.core, 0.98);
        ctx.lineWidth = Math.max(1.2, r * 0.016 * wv.width);
        path();
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "lighter";
      const pulse = 0.85 + 0.15 * Math.sin(t * 1.4) + voice * 0.4;
      ctx.globalAlpha = 0.28 * pulse * intro;
      ctx.drawImage(glowCool, cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
      ctx.globalAlpha = 0.14 * pulse * intro;
      ctx.drawImage(glowWhite, cx - r * 0.95, cy - r * 0.8, r * 1.9, r * 1.6);
      const barW = r * 0.03;
      const amp = (0.75 + voice * 1.1) * intro;
      const bars = [];
      for (let i = 0; i < BARS; i++) {
        const u = i / (BARS - 1) - 0.5;
        const env = Math.exp(-(u * u) / 0.055);
        const wob = 0.7 + 0.3 * Math.sin(t * 2.1 + i * 0.9) * Math.sin(t * 1.3 - i * 0.5 + voice * 4);
        const bh = (0.05 + env * wob * 0.92 * amp) * r;
        bars.push({ x: cx + u * 1.35 * r - barW / 2, y: cy - bh / 2, bh });
      }
      ctx.globalAlpha = 0.4;
      for (const b of bars) {
        const gw = barW * 6.5;
        const gh = b.bh + barW * 6;
        ctx.drawImage(glowCool, b.x + barW / 2 - gw / 2, cy - gh / 2, gw, gh);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#fffaf0";
      for (const b of bars) {
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, barW, Math.max(b.bh, barW), barW / 2);
        ctx.fill();
      }
      if (tr !== "low") {
        ctx.globalCompositeOperation = "lighter";
        const n = tr === "high" ? SPARKS.length : 8;
        for (let i = 0; i < n; i++) {
          const s = SPARKS[i];
          const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
          const px = cx + (s.x + Math.sin(t * 0.15 + s.phase) * 0.02) * w;
          const py = cy + s.y * r * 2.2 + Math.sin(t * 0.3 + s.phase) * r * 0.1;
          const sz = s.size * r * 1.6;
          ctx.globalAlpha = tw * 0.9 * intro;
          ctx.drawImage(glowWhite, px - sz, py - sz, sz * 2, sz * 2);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(cv);
    if (reduced) {
      heroMotion.wave = 1;
      resize();
      draw(0);
      return () => ro.disconnect();
    }
    let raf = 0;
    let running = false;
    let last = 0;
    let lastDraw = 0;
    const loop = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const minGap = tierRef.current === "high" ? 0 : tierRef.current === "medium" ? 1e3 / 40 : 1e3 / 30;
      if (now - lastDraw < minGap) return;
      const dt = Math.min((now - last) / 1e3 || 0.016, 0.05);
      last = now;
      lastDraw = now;
      voice += (heroMotion.voice - voice) * Math.min(1, dt * 8);
      draw(now / 1e3);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    let onScreen = true;
    const sync = () => onScreen && !document.hidden ? start() : stop();
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(cv);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  const show3d = want3d && mount3d && tier !== "low";
  const live = show3d && ready;
  return <div
    ref={wrap}
    data-hero="art"
    className="absolute left-[calc(50%-var(--art-w)*0.495)] top-[372px] aspect-[2172/724] w-[var(--art-w)] [--art-w:315vw] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_20%,black_88%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in] md:top-[calc(var(--u)*30.85)] md:[--art-w:calc(var(--u)*91.2)]"
  >
      <div data-hero-float className="absolute inset-0 motion-safe:animate-[hero-float_9s_ease-in-out_infinite]">
        <img
    src="/hero/hero-art-v6.jpg"
    alt="A translucent glass sphere flanked by layered glass acoustic discs on a softly lit reflective floor"
    fetchPriority="high"
    decoding="async"
    className={`absolute inset-0 size-full select-none object-cover transition-opacity duration-1000 ${live ? "opacity-0" : "opacity-100"}`}
    draggable={false}
  />
        {show3d && <div className={`absolute inset-0 transition-opacity duration-1000 [mask-image:radial-gradient(ellipse_52%_62%_at_50%_50%,black_55%,transparent_100%)] ${ready ? "opacity-100" : "opacity-0"}`}>
            <HeroModelScene tier={tier} lite={lite} animate={!reducedMotion} active={active} onReady={() => setReady(true)} />
          </div>}
        {
    /* luminous haze: opacity-only animation, so it costs nothing on the main thread */
  }
        <div
    aria-hidden
    className="pointer-events-none absolute inset-x-[22%] -top-[6%] bottom-[2%] mix-blend-screen motion-safe:animate-[bloom_5.5s_ease-in-out_infinite] bg-[radial-gradient(ellipse_50%_52%_at_50%_46%,rgba(255,240,214,0.8),rgba(255,214,170,0.28)_46%,transparent_72%)]"
  />
        <div
    aria-hidden
    className="pointer-events-none absolute inset-x-[3%] top-[44.6%] h-[2.4%] mix-blend-screen blur-[5px] motion-safe:animate-[bloom_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white to-transparent"
  />
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      </div>
    </div>;
}
export {
  HeroArt
};
