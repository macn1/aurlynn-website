import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Animated process diagram. Highlights steps in sequence while in view; hover/click selects one and pauses.
 * `active` / `onChange` make it controllable.
 */
export function FlowDiagram({ steps, dark = false, className = "", active: controlled, onChange, auto = true, vertical = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [inner, setInner] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = controlled ?? inner;
  const set = (i) => (onChange ? onChange(i) : setInner(i));

  useEffect(() => {
    if (!auto || reduce || paused || !inView || controlled != null) return;
    const t = setInterval(() => setInner((a) => (a + 1) % steps.length), 1700);
    return () => clearInterval(t);
  }, [auto, reduce, paused, inView, controlled, steps.length]);

  const pct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 100;
  const line = dark ? "bg-white/15" : "bg-border";
  return (
    <div ref={ref} className={className}>
      <ol className={`relative grid gap-3 ${vertical ? "" : "md:gap-0"}`} style={vertical ? undefined : { gridTemplateColumns: undefined }}>
        <div className={`pointer-events-none absolute ${vertical ? "bottom-4 left-[15px] top-4 w-px" : "left-[6%] right-[6%] top-[15px] hidden h-px md:block"} ${line}`} aria-hidden>
          <motion.div
            className={`absolute left-0 top-0 bg-accent ${vertical ? "w-px origin-top" : "h-px origin-left"}`}
            style={vertical ? { height: "100%" } : { width: "100%" }}
            animate={vertical ? { scaleY: pct / 100 } : { scaleX: pct / 100 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className={vertical ? "contents" : "grid gap-4 md:grid-flow-col md:auto-cols-fr md:gap-2"}>
          {steps.map((s, i) => {
            const label = typeof s === "string" ? s : s.label;
            const sub = typeof s === "string" ? null : s.sub;
            const on = i === active;
            const done = i < active;
            return (
              <li key={label} className={`relative flex ${vertical ? "gap-4" : "gap-3 md:flex-col md:items-center md:gap-3 md:text-center"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setPaused(true);
                    set(i);
                  }}
                  onMouseEnter={() => (controlled == null ? (setPaused(true), set(i)) : null)}
                  onMouseLeave={() => setPaused(false)}
                  aria-current={on ? "step" : undefined}
                  className={`relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-500 ${
                    on ? "scale-110 border-accent bg-accent text-white shadow-[0_0_0_5px_rgba(183,122,72,0.18)]" : done ? "border-accent bg-accent-light text-dark" : dark ? "border-white/25 bg-dark text-white/60" : "border-[#b8a89a] bg-background text-secondary"
                  }`}
                >
                  {i + 1}
                </button>
                <div className={`transition-opacity duration-500 ${on ? "opacity-100" : done ? "opacity-80" : "opacity-50"}`}>
                  <p className="text-[0.95rem] font-medium leading-tight">{label}</p>
                  {sub && <p className={`mt-1 text-[12.5px] leading-snug ${dark ? "text-white/55" : "text-secondary"}`}>{sub}</p>}
                </div>
              </li>
            );
          })}
        </div>
      </ol>
    </div>
  );
}
