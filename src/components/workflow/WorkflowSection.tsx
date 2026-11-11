"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { HowItWorksVisual } from "./HowItWorksVisual";

const STEPS = [
  {
    title: "Customer calls by phone, web or app",
    text: "Aurlynn picks up instantly, any hour, through your phone line, website or mobile app.",
    label: "Client channels",
  },
  {
    title: "Speech streams live to the agent",
    text: "Voice travels over a low-latency network, so conversations flow with no awkward pauses.",
    label: "Global edge network",
  },
  {
    title: "Agent understands and takes action",
    text: "It identifies intent, then books, updates records or follows up across your business systems.",
    label: "Agent backend",
  },
  {
    title: "Agent responds, or hands off to a human",
    text: "A natural voice reply goes back to the caller, or a teammate joins with full context.",
    label: "Agent voice",
  },
];

export function WorkflowSection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const progress = useRef(0.125); // 0..1 scroll progress through the pinned section, read by the 3D scene

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    // Desktop: the section pins and scroll position chooses the active step.
    mm.add("(min-width: 768px)", () => {
      if (reduced) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 6%",
        end: "+=140%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.current = self.progress;
          setActive(Math.min(3, Math.floor(self.progress * 4)));
        },
      });
      const onClick = (e: Event) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>("[data-jump]");
        if (!t) return;
        const i = Number(t.dataset.jump);
        window.scrollTo({ top: st.start + ((i + 0.5) / 4) * (st.end - st.start), behavior: "smooth" });
      };
      el.addEventListener("click", onClick);
      return () => el.removeEventListener("click", onClick);
    });

    // Mobile: no pinning, steps advance by themselves while on screen.
    mm.add("(max-width: 767px)", () => {
      if (reduced) return;
      let i = 0;
      let timer: ReturnType<typeof setInterval> | undefined;
      const io = new IntersectionObserver(([e]) => {
        clearInterval(timer);
        if (e.isIntersecting) {
          timer = setInterval(() => {
            i = (i + 1) % 4;
            progress.current = (i + 0.5) / 4;
            setActive(i);
          }, 2600);
        }
      });
      io.observe(el);
      return () => {
        io.disconnect();
        clearInterval(timer);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="how-it-works"
      aria-labelledby="how-heading"
      className="section-x relative bg-background py-[clamp(2rem,4vw,4rem)]"
    >
      <div className="relative grid h-auto overflow-hidden rounded-[20px] border border-[#0a0a0b]/10 bg-[#fbf9f5] shadow-[0_1px_0_rgba(10,10,11,.04),0_24px_60px_-28px_rgba(10,10,11,.18)] md:h-[min(78vh,640px)] md:min-h-[520px] md:grid-cols-[minmax(320px,0.9fr)_1.1fr]">
        {/* Left: heading + steps */}
        <div className="relative flex flex-col p-6 sm:p-9 md:p-10">
          <h2
            id="how-heading"
            className="font-[family-name:var(--font-sora)] text-[28px] font-medium leading-[1.1] tracking-tight text-[#0a0a0b] sm:text-4xl"
          >
            <span className="text-[#9a6a44]">How</span> it works
          </h2>

          <ol className="relative mt-8 max-w-[420px] font-[family-name:var(--font-inter)]">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className="relative pb-5 pl-9 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[10px] top-6 h-[calc(100%-18px)] w-px bg-[#0a0a0b]/15"
                    >
                      <span
                        className="block w-full origin-top bg-[#9a6a44] transition-transform duration-700"
                        style={{ height: "100%", transform: `scaleY(${i < active ? 1 : 0})` }}
                      />
                    </span>
                  )}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0.5 flex size-5 items-center justify-center rounded-full border font-[family-name:var(--font-jetbrains)] text-[10px] transition-colors duration-500 ${
                      on
                        ? "border-[#9a6a44] bg-[#9a6a44] text-white"
                        : i < active
                          ? "border-[#9a6a44] text-[#9a6a44]"
                          : "border-[#0a0a0b]/25 text-[#7c7c84]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <button
                    type="button"
                    data-jump={i}
                    aria-current={on ? "step" : undefined}
                    onClick={() => {
                      progress.current = (i + 0.5) / 4;
                      setActive(i);
                    }}
                    className="block text-left"
                  >
                    <span
                      className={`block text-[15px] leading-snug transition-colors duration-500 ${
                        on ? "font-semibold text-[#0a0a0b]" : "font-normal text-[#55555c]"
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="overflow-hidden pt-1.5 text-[13px] leading-relaxed text-[#55555c]">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-wrap gap-2 font-[family-name:var(--font-inter)] md:absolute md:bottom-8 md:left-10 md:mt-0">
            {[
              { href: "/how-it-works", label: "See the full flow" },
              { href: "/request-demo", label: "Request a demo" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#0a0a0b]/12 bg-white/70 px-3 py-1.5 text-[12px] text-[#0a0a0b] transition-colors hover:bg-white"
              >
                {l.label}
                <ArrowUpRight aria-hidden size={12} />
              </a>
            ))}
          </div>
        </div>

        {/* Right: live pipeline stage */}
        <div className="relative min-h-[480px] overflow-hidden border-t border-[#0a0a0b]/8 md:min-h-0 md:border-l md:border-t-0">
          <HowItWorksVisual active={active} progress={progress} />
        </div>
      </div>
    </section>
  );
}
