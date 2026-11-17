"use client";
import { useEffect, useRef } from "react";
import { CalendarDays, AudioLines } from "lucide-react";
import { gsap } from "@/lib/animation/gsap";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/components/animations/useReveal";
function Ribbons() {
  const g = useRef(null);
  useEffect(() => {
    if (!g.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-ribbon]", {
        y: (i) => i % 2 ? 6 : -6,
        x: (i) => i % 2 ? -8 : 8,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.8, from: "start" }
      });
      gsap.to("[data-glow]", { opacity: 0.55, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, g);
    return () => ctx.revert();
  }, []);
  return <svg viewBox="0 0 520 220" aria-hidden className="absolute inset-y-0 left-0 h-full w-[56%] min-w-[300px]" preserveAspectRatio="xMinYMid slice">
      <defs>
        <linearGradient id="rb1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#f0d6b8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#e7c6a4" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rb2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#d9ac7e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rg" cx="0.35" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#ffc890" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffc890" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g ref={g}>
        <ellipse data-glow cx="150" cy="170" rx="190" ry="90" fill="url(#rg)" opacity="0.35" />
        <path data-ribbon d="M-10 215 C 40 120, 110 40, 190 70 C 250 92, 230 175, 330 150 C 400 132, 430 60, 520 40 L 520 80 C 440 95, 410 175, 320 195 C 220 215, 240 130, 185 112 C 120 92, 70 160, 30 225 Z" fill="url(#rb1)" />
        <path data-ribbon d="M10 225 C 70 140, 120 70, 200 95 C 270 118, 250 190, 340 172 C 410 158, 450 100, 520 88" stroke="url(#rb2)" strokeWidth="1.6" fill="none" />
        <path data-ribbon d="M-20 200 C 50 150, 100 100, 170 120 C 230 138, 270 168, 350 140" stroke="#fff" strokeOpacity="0.8" strokeWidth="1" fill="none" />
      </g>
    </svg>;
}
function FinalCTA() {
  const root = useRef(null);
  useReveal(root);
  return <section ref={root} aria-labelledby="cta-heading" className="px-[clamp(0.75rem,2.2vw,3rem)] pb-[clamp(1rem,2vw,2rem)] pt-[clamp(1.5rem,3vw,3rem)]">
      <div
    data-reveal
    className="relative isolate overflow-hidden rounded-[clamp(1.25rem,2.8vw,2.25rem)] border border-white/70 bg-[linear-gradient(100deg,#f0e4da_0%,#f6eee7_45%,#f8f2ec_100%)] shadow-[0_24px_60px_-34px_rgba(120,80,50,0.4)]"
  >
        <Ribbons />
        <div className="relative z-10 flex min-h-[calc(var(--u)*11.2)] flex-col justify-center gap-[calc(var(--u)*1)] py-[calc(var(--u)*3)] pl-[clamp(1.25rem,5vw,4rem)] pr-[clamp(1.25rem,5vw,4rem)] md:ml-[48%] md:pl-0">
          <h2 id="cta-heading" className="font-display text-[max(1.6rem,calc(var(--u)*2.45))] font-normal leading-[1.1] tracking-[-0.015em]">
            Ready to put your conversations to work?
          </h2>
          <p className="body-sm max-w-[36ch]">
            See how Aurlynn can handle your business conversations and drive real outcomes.
          </p>
          <div className="mt-[calc(var(--u)*0.6)] flex flex-wrap gap-[calc(var(--u)*1.2)]">
            <Button href="/#demo" arrow icon={<AudioLines aria-hidden size={14} />} className="!h-[max(38px,calc(var(--u)*3.1))] !px-[calc(var(--u)*1.9)]">
              See a Live Demo
            </Button>
            <Button href="/contact" variant="outline" icon={<CalendarDays aria-hidden size={14} />} className="!h-[max(38px,calc(var(--u)*3.1))] !px-[calc(var(--u)*1.7)]">
              Talk to Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>;
}
export {
  FinalCTA
};
