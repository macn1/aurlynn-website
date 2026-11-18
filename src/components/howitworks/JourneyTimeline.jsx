import { Fragment, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { EMERALD, EMERALD_INK, INK, STEPS, mono } from "./shared";

/** Horizontal seven-step timeline. On narrow screens it scrolls sideways inside its own box. */
function JourneyTimeline({ step, onPick, reduce }) {
  const scroller = useRef(null);
  const buttons = useRef([]);

  // keep the active step in view inside the scroller (never scrolls the page)
  useEffect(() => {
    const box = scroller.current;
    const btn = buttons.current[step];
    if (!box || !btn) return;
    box.scrollTo({ left: btn.offsetLeft - (box.clientWidth - btn.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [step, reduce]);

  return <nav aria-label="How it works steps" ref={scroller} className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ol className="flex min-w-[640px] items-start md:min-w-0">
        {STEPS.map((s, i) => {
    const active = i === step;
    const reached = i <= step;
    return <Fragment key={s.n}>
              <li className="shrink-0">
                <button
      type="button"
      ref={(el) => {
        buttons.current[i] = el;
      }}
      onClick={() => onPick(i)}
      aria-current={active ? "step" : undefined}
      aria-label={`Step ${s.n}: ${s.name}`}
      className="group flex w-[72px] flex-col items-center gap-2 outline-offset-4"
    >
                  <span
      className={`${mono} flex size-9 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-300`}
      style={{
        borderColor: reached ? EMERALD_INK : "rgba(10,10,11,.12)",
        background: active ? EMERALD : "white",
        color: reached ? INK : "#7C7C84",
        boxShadow: active ? `0 0 0 5px ${EMERALD}55` : "none",
      }}
    >
                    {s.n}
                  </span>
                  <span className={`${mono} text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 ${active ? "text-[#0A0A0B]" : "text-[#7C7C84] group-hover:text-[#0A0A0B]"}`}>{s.name}</span>
                </button>
              </li>
              {i < STEPS.length - 1 && <li aria-hidden className="relative mt-[18px] h-px min-w-4 flex-1 overflow-hidden bg-[#0A0A0B]/10">
                  <motion.span className="absolute inset-0 origin-left" style={{ background: EMERALD_INK }} initial={false} animate={{ scaleX: i < step ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }} />
                </li>}
            </Fragment>;
  })}
      </ol>
    </nav>;
}

export { JourneyTimeline };
