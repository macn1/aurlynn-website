"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Car, Home, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTier } from "@/lib/quality";
import { useReveal } from "@/components/animations/useReveal";
import { industries, type IndustryId } from "./industries";

const IndustryScene = dynamic(() => import("./IndustryScene"), { ssr: false });

const ICONS: Record<IndustryId, typeof Car> = {
  automotive: Car,
  "real-estate": Home,
  healthcare: Plus,
  education: BookOpen,
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function IndustryShowcase() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0); // lags `index` so the canvas can fade between scenes
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [fading, setFading] = useState(false);
  const tier = useTier();
  const lite = useMediaQuery("(max-width: 1023px)") || tier !== "high";
  const reduced = useReducedMotion();
  useReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(hasWebGL());
  }, []);

  // Crossfade: fade the canvas out, swap the scene, fade back in.
  useEffect(() => {
    if (index === sceneIndex) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFading(true);
    const t = setTimeout(() => {
      setSceneIndex(index);
      setFading(false);
    }, 450);
    return () => clearTimeout(t);
  }, [index, sceneIndex]);

  const go = useCallback((n: number) => setIndex((n + industries.length) % industries.length), []);
  const current = industries[index];
  const scene = industries[sceneIndex];

  return (
    <section ref={root} id="industries" aria-labelledby="industries-heading" className="section-x bg-background py-[clamp(2.5rem,5vw,5rem)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p data-reveal className="eyebrow-sm">Industry solutions</p>
          <h2 id="industries-heading" data-reveal className="display-section mt-[calc(var(--u)*1)] text-[max(1.7rem,calc(var(--u)*3.05))]">
            Built for real business conversations.
          </h2>
        </div>
        <div data-reveal className="flex gap-2.5">
          {[
            { label: "Previous industry", icon: ArrowLeft, to: index - 1 },
            { label: "Next industry", icon: ArrowRight, to: index + 1 },
          ].map(({ label, icon: Icon, to }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => go(to)}
              className="inline-flex size-[max(34px,calc(var(--u)*2.75))] items-center justify-center rounded-full border border-border bg-white/40 transition-colors duration-200 hover:border-accent/60 hover:bg-white"
            >
              <Icon size={15} aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[calc(var(--u)*2.2)] grid gap-6 md:grid-cols-[minmax(0,22.5fr)_minmax(0,77.5fr)] md:gap-0">
        {/* selector */}
        <div role="tablist" aria-label="Industries" aria-orientation="vertical" data-reveal className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:border-r md:border-border md:pr-[calc(var(--u)*3.1)]">
          {industries.map((ind, i) => {
            const Icon = ICONS[ind.id];
            const on = i === index;
            return (
              <button
                key={ind.id}
                type="button"
                role="tab"
                aria-selected={on}
                id={`tab-${ind.id}`}
                aria-controls="industry-panel"
                onClick={() => setIndex(i)}
                className={`relative flex h-[max(40px,calc(var(--u)*3.4))] shrink-0 items-center gap-[calc(var(--u)*1.4)] rounded-full px-[calc(var(--u)*1.6)] text-left text-[max(0.8125rem,calc(var(--u)*1.2))] transition-colors duration-300 ${
                  on ? "text-foreground" : "text-[#4a4643] hover:text-foreground"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="industry-pill"
                    className="absolute inset-0 rounded-full bg-[#f1e5d6]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <Icon size={16} strokeWidth={1.5} aria-hidden className="relative" />
                <span className="relative">{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div id="industry-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="relative min-h-[calc(var(--u)*19)] max-md:min-h-[360px] md:pl-[calc(var(--u)*3.2)]">
          <div className="relative z-10 max-w-[calc(var(--u)*40)] md:pt-[calc(var(--u)*0.2)]">
            <p className="eyebrow-sm text-[max(0.58rem,calc(var(--u)*0.7))] text-secondary">{current.label}</p>
            <AnimatePresence mode="wait">
              <motion.h3
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                className="font-display mt-[calc(var(--u)*0.8)] text-[max(1.35rem,calc(var(--u)*2.2))] font-normal leading-[1.14] tracking-[-0.01em]"
              >
                {current.headline[0]}
                <br className="hidden sm:block" /> {current.headline[1]}
              </motion.h3>
            </AnimatePresence>
            <Link
              href={current.href}
              className="group mt-[calc(var(--u)*2.3)] inline-flex items-center gap-1.5 border-b border-foreground/60 pb-0.5 text-[max(0.75rem,calc(var(--u)*1.1))] transition-colors hover:border-accent hover:text-accent"
            >
              Explore {current.label}
              <ArrowRight size={13} aria-hidden className="transition-transform duration-250 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* scene: sits behind and beside the copy, fades into the page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[calc(var(--u)*-1.5)] right-[calc(var(--u)*-4)] left-[calc(var(--u)*17)] [mask-image:linear-gradient(to_right,transparent,black_28%,black_85%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in] max-md:left-0 max-md:right-0 max-md:top-[150px] max-md:bottom-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_60%,rgba(236,220,205,0.55),transparent_75%)]" />
            <div className={`absolute inset-0 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
              {near && webgl && tier !== "low" ? (
                <IndustryScene industry={scene.id} lite={lite} animate={!reduced} active={visible && !fading} />
              ) : (
                <div className="flex size-full items-center justify-center opacity-40">
                  {(() => {
                    const Icon = ICONS[scene.id];
                    return <Icon size={64} strokeWidth={0.8} />;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
