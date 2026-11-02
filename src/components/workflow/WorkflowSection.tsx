"use client";

import { useEffect, useRef } from "react";
import { Layers, Users, Zap } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/components/animations/useReveal";
import { GlassDisc } from "./GlassDisc";

const STAGES = [
  { title: "Listen", text: "Capture the customer’s request." },
  { title: "Understand", text: "Identify intent and next steps." },
  { title: "Act", text: "Book, update or follow up." },
  { title: "Handoff", text: "Bring in a human when needed." },
];

// Horizontal centre of each disc (% of the art), used to run the glowing line between them.
const DISC_CENTER = [21.5, 44, 65, 82.5];
// Dot x-offsets follow the arc in the design; text indents follow the dots.
const DOT_X = [10, 34, 40, 27];
const TEXT_INDENT = [45, 67, 75, 88];

function WaveIcon() {
  const h = [10, 18, 30, 46, 30, 20, 12];
  return (
    <svg viewBox="0 0 60 56" fill="none" aria-hidden className="!h-[26%]">
      {h.map((v, i) => (
        <rect
          key={i}
          className="wf-bar"
          style={{ animationDelay: `${i * -0.11}s` }}
          x={4 + i * 8}
          y={28 - v / 2}
          width="2.4"
          height={v}
          rx="1.2"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function WorkflowSection() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    let shown = -2;

    const setActive = (n: number) => {
      if (n === shown) return;
      shown = n;
      el.querySelectorAll<HTMLElement>("[data-disc]").forEach((d, i) => {
        d.dataset.state = n < 0 ? "done" : i < n ? "done" : i === n ? "active" : "future";
      });
      el.querySelectorAll<HTMLElement>("[data-stage]").forEach((s, i) => {
        s.dataset.state = n < 0 ? "done" : i < n ? "done" : i === n ? "active" : "future";
      });
      const link = el.querySelector<HTMLElement>("[data-link]");
      const arc = el.querySelector<SVGPathElement>("[data-arc-progress]");
      const label = el.querySelector<HTMLElement>("[data-step-label]");
      const bar = el.querySelector<HTMLElement>("[data-step-bar]");
      const at = n < 0 ? 3 : n;
      if (link) link.style.width = `${DISC_CENTER[at] - DISC_CENTER[0]}%`;
      if (arc) arc.style.strokeDashoffset = String(1 - (at + 1) / 4);
      if (label) label.textContent = n < 0 ? "Call to completed action" : `Step ${n + 1} of 4 · ${STAGES[n].title}`;
      if (bar) bar.style.transform = `scaleX(${(at + 1) / 4})`;
    };

    // Desktop: the section pins and the scroll position chooses the active step.
    mm.add("(min-width: 768px)", () => {
      if (reduced) {
        setActive(-1);
        return;
      }
      setActive(0);
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 12%",
        end: "+=110%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
      });
      // clicking a stage jumps the page to it
      const jump = (i: number) => {
        const y = st.start + ((i + 0.5) / 4) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: "smooth" });
      };
      const onClick = (e: Event) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>("[data-jump]");
        if (t) jump(Number(t.dataset.jump));
      };
      el.addEventListener("click", onClick);
      return () => el.removeEventListener("click", onClick);
    });

    // Mobile: no pinning — the steps play automatically while the section is on screen.
    mm.add("(max-width: 767px)", () => {
      if (reduced) {
        setActive(-1);
        return;
      }
      let i = 0;
      let timer: ReturnType<typeof setInterval> | undefined;
      setActive(0);
      const io = new IntersectionObserver(([e]) => {
        clearInterval(timer);
        if (e.isIntersecting) {
          timer = setInterval(() => {
            i = (i + 1) % 4;
            setActive(i);
          }, 2200);
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
    <section ref={root} id="how-it-works" aria-labelledby="how-heading" className="section-x relative bg-background py-[clamp(3rem,6vw,6rem)]">
      <div className="grid items-center gap-10 md:grid-cols-[34fr_34fr_32fr] md:gap-4">
        <div>
          <p data-reveal className="eyebrow-sm">How it works</p>
          <h2 id="how-heading" data-reveal className="display-section mt-[calc(var(--u)*1.1)]">
            From a customer call
            <br />
            to a completed action.
          </h2>
          <p data-reveal className="body-sm mt-[calc(var(--u)*1.4)] max-w-[28ch]">
            A simple flow that turns conversations into business outcomes.
          </p>
          <div data-reveal className="mt-[calc(var(--u)*1.9)]">
            <Button href="/how-it-works" variant="outline" arrow className="!h-[max(36px,calc(var(--u)*3.05))] !px-[calc(var(--u)*1.7)]">
              See how it works
            </Button>
          </div>
        </div>

        {/* Four acoustic glass discs */}
        <div data-reveal>
          <div className="relative mx-auto h-[calc(var(--u)*27)] min-h-[260px] w-full max-w-[460px]">
            {/* glowing line that travels from disc to disc */}
            <div aria-hidden className="pointer-events-none absolute top-[52%] z-10 h-px" style={{ left: `${DISC_CENTER[0]}%`, right: 0 }}>
              <div
                data-link
                className="relative h-full bg-gradient-to-r from-[#e6b07a] via-[#ffd9a8] to-[#fff4e2] shadow-[0_0_14px_3px_rgba(255,190,120,0.7)] transition-[width] duration-[900ms] ease-[var(--ease-out-expo)]"
                style={{ width: 0 }}
              >
                <span className="absolute -right-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_5px_rgba(255,180,100,0.9)]" />
              </div>
            </div>
            <GlassDisc index={0} kind="wave" icon={<WaveIcon />} className="left-[2%] top-[4%] h-[92%] w-[39%] -rotate-[6deg] cursor-pointer" />
            <GlassDisc index={1} kind="layers" icon={<Layers strokeWidth={1.3} />} className="left-[27%] top-[11%] h-[80%] w-[34%] -rotate-[6deg] cursor-pointer" />
            <GlassDisc index={2} kind="zap" icon={<Zap strokeWidth={1.3} />} className="left-[51%] top-[19%] h-[66%] w-[28%] -rotate-[6deg] cursor-pointer" />
            <GlassDisc index={3} kind="people" icon={<Users strokeWidth={1.3} />} className="left-[71%] top-[26%] h-[52%] w-[23%] -rotate-[6deg] cursor-pointer" />
            <div aria-hidden className="pointer-events-none absolute inset-x-[4%] bottom-[-2%] h-[10%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(214,170,120,0.35),transparent_70%)] blur-md" />
          </div>
          {/* where you are in the flow */}
          <div className="mx-auto mt-5 max-w-[320px]" aria-live="polite">
            <p data-step-label className="text-center text-[max(0.75rem,calc(var(--u)*1.05))] font-medium tracking-[0.04em] text-foreground">
              Step 1 of 4 · Listen
            </p>
            <div className="mt-2 h-px w-full bg-border">
              <div data-step-bar className="h-full origin-left bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: "scaleX(0.25)" }} />
            </div>
          </div>
        </div>

        {/* Stage list on an arc */}
        <ol className="relative md:pl-0">
          <svg aria-hidden viewBox="0 0 60 190" className="pointer-events-none absolute left-0 top-0 hidden h-[190px] w-[60px] overflow-visible md:block" fill="none">
            <path d="M10 10 C 22 30, 30 48, 34 67 S 42 105, 40 124 S 32 162, 27 181" stroke="var(--border)" strokeWidth="1" pathLength={1} />
            <path
              data-arc-progress
              d="M10 10 C 22 30, 30 48, 34 67 S 42 105, 40 124 S 32 162, 27 181"
              stroke="var(--accent)"
              strokeWidth="1.4"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={0.75}
              style={{ transition: "stroke-dashoffset 0.9s var(--ease-out-expo)" }}
            />
          </svg>
          {STAGES.map((s, i) => (
            <li key={s.title} data-stage data-state="future" data-reveal className="stage relative h-[57px]">
              <span data-dot aria-hidden className="stage-dot absolute top-[4px] hidden size-[9px] rounded-full border md:block" style={{ left: DOT_X[i] }} />
              <button type="button" data-jump={i} className="text-left md:absolute md:top-0" style={{ left: TEXT_INDENT[i] }}>
                <span className="stage-title font-display block text-[max(1.05rem,calc(var(--u)*1.55))] leading-tight">{s.title}</span>
                <span className="mt-0.5 block whitespace-nowrap text-[max(0.6875rem,calc(var(--u)*0.98))] text-secondary">{s.text}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
