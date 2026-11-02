"use client";

import { useEffect, useRef } from "react";
import { AudioLines, Play } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { heroMotion } from "@/lib/animation/heroMotion";
import { HeroArt } from "./HeroArt";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Text sequence + scroll-out transition.
  useEffect(() => {
    let onMove: ((e: PointerEvent) => void) | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero]", { opacity: 1 });
        gsap.set("[data-hero-line]", { yPercent: 0, y: 0 });
        heroMotion.wave = 1;
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
        .fromTo("[data-hero='eyebrow']", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.14 },
          0.4,
        )
        .fromTo("[data-hero='copy']", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, 1.0)
        .fromTo("[data-hero='cta']", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 1.2);

      // Visual sequence: glass object scales in, then the waveform wakes up.
      gsap
        .timeline({ delay: 0.9 })
        .fromTo(
          "[data-hero='art']",
          { opacity: 0, scale: 0.92, transformOrigin: "50% 60%" },
          { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out" },
          0,
        )
        .to(heroMotion, { wave: 1, duration: 1.6, ease: "power2.out" }, 0.9);

      // Scroll out: the same visual world continues into the next section.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          heroMotion.scroll = self.progress;
        },
      });
      gsap.to(stage.current, {
        yPercent: 8,
        scale: 0.9,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Pointer parallax (fine pointers only), eased with inertia.
      if (window.matchMedia("(pointer: fine)").matches) {
        const moveX = gsap.quickTo("[data-hero='art']", "x", { duration: 1.2, ease: "power3.out" });
        const moveY = gsap.quickTo("[data-hero='art']", "y", { duration: 1.2, ease: "power3.out" });
        onMove = (e: PointerEvent) => {
          moveX((e.clientX / window.innerWidth - 0.5) * -10);
          moveY((e.clientY / window.innerHeight - 0.5) * -5);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
      }
    }, root);

    return () => {
      if (onMove) window.removeEventListener("pointermove", onMove);
      ctx.revert();
      heroMotion.wave = 0;
      heroMotion.scroll = 0;
    };
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-heading"
      className="relative isolate h-[var(--hero-h)] overflow-hidden hero-bg [--hero-h:max(100svh,730px)] md:[--hero-h:calc(var(--u)*63)]"
    >
      <div ref={stage} className="absolute inset-0 -z-10">
        <HeroArt />
      </div>
      {/* Dissolve the hero into the page background so there is no seam below it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[calc(var(--u)*5)] bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative z-10 flex flex-col items-center px-5 pt-[calc(var(--nav-h)+var(--u)*2.6)] text-center md:pt-[calc(var(--u)*7.9)]">
        <p data-hero="eyebrow" className="eyebrow">
          The Conversational AI Platform
        </p>
        <h1 id="hero-heading" className="display-hero mt-[calc(var(--u)*1.75)]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-line className="block">
              Calls that get
            </span>
          </span>
          <span className="-mt-[0.1em] block overflow-hidden pb-[0.14em]">
            <span data-hero-line className="block">
              real <em className="text-[#9a6a44]">work</em> done.
            </span>
          </span>
        </h1>
        <p
          data-hero="copy"
          className="-mt-[calc(var(--u)*0.2)] max-w-[calc(var(--u)*42.5)] text-[max(14px,calc(var(--u)*1.47))] leading-[1.37] text-[#5b5652]"
        >
          AI voice agents that talk, understand, and take action across your business — from leads to bookings and
          follow-ups.
        </p>
        <div className="mt-[calc(var(--u)*2.05)] flex flex-wrap items-center justify-center gap-[calc(var(--u)*2.2)]">
          <div data-hero="cta">
            <Button href="/#demo" arrow icon={<AudioLines aria-hidden size={15} />}>
              Try a Live Conversation
            </Button>
          </div>
          <div data-hero="cta">
            <Button
              href="/how-it-works"
              variant="outline"
              className="!px-[calc(var(--u)*1.45)]"
              icon={
                <span className="inline-flex size-[calc(var(--u)*1.75)] min-w-4 items-center justify-center rounded-full border border-foreground/80">
                  <Play aria-hidden size={9} className="ml-px fill-current" />
                </span>
              }
            >
              Watch 2 min
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
