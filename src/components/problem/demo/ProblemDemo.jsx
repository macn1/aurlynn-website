import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { StageCalls } from "./StageCalls";
import { StageAgent } from "./StageAgent";
import { StageResolved } from "./StageResolved";
import { ALERT, EMERALD, EMERALD_INK, STAGES, mono } from "./shared";

const SCENES = [StageCalls, StageAgent, StageResolved];
const ALT = "Animated demo: customer calls go unanswered, an Aurlynn AI voice agent answers and understands each request, and every request ends up resolved.";

function StageNav({ stage, reduce, onPick }) {
  return <nav aria-label="Demo stage" className="flex items-center">
      {STAGES.map((s, i) => {
    const active = i === stage;
    const reached = i <= stage;
    const color = i === 0 ? ALERT : EMERALD_INK;
    return <Fragment key={s.id}>
            <button
      type="button"
      onClick={() => onPick(i)}
      aria-current={active ? "step" : undefined}
      className="group flex shrink-0 items-center gap-2 rounded-full py-1 outline-offset-4"
    >
              <span
      className="size-2.5 rounded-full border-2 transition-all duration-300"
      style={{
        borderColor: reached ? color : "#D9D5CA",
        background: active ? (i === 0 ? ALERT : EMERALD) : reached ? color : "transparent",
        boxShadow: active ? `0 0 0 4px ${i === 0 ? `${ALERT}22` : `${EMERALD}55`}` : "none",
      }}
    />
              <span className={`${mono} text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${active ? "text-[#0A0A0B]" : "text-[#7C7C84] group-hover:text-[#0A0A0B]"}`}>{s.label}</span>
            </button>
            {i < STAGES.length - 1 && <span className="relative mx-2 h-px flex-1 overflow-hidden bg-[#0A0A0B]/10 sm:mx-3">
                <motion.span
      key={`${stage}-${i}`}
      className="absolute inset-0 origin-left"
      style={{ background: EMERALD_INK }}
      initial={{ scaleX: i < stage ? 1 : 0 }}
      animate={{ scaleX: i <= stage ? 1 : 0 }}
      transition={{ duration: reduce || i !== stage ? 0 : s.ms / 1000, ease: "linear" }}
    />
              </span>}
          </Fragment>;
  })}
    </nav>;
}

/** The continuous "story rail": one line that changes colour and carries a pulse from problem to outcome. */
function Rail({ stage, reduce }) {
  return <div className="pointer-events-none absolute bottom-1 left-[9px] top-1 w-[2px] overflow-hidden rounded-full" aria-hidden>
      <motion.div className="absolute inset-0" animate={{ backgroundColor: stage === 0 ? `${ALERT}55` : `${EMERALD_INK}66` }} transition={{ duration: 0.6 }} />
      {!reduce && <motion.span
    key={stage}
    className="absolute left-0 h-10 w-full rounded-full"
    style={{ background: `linear-gradient(to bottom, transparent, ${stage === 0 ? ALERT : EMERALD_INK})` }}
    initial={{ top: "-15%" }}
    animate={{ top: "100%" }}
    transition={{ duration: STAGES[stage].ms / 1000, ease: "easeInOut" }}
  />}
    </div>;
}

function ProblemDemo() {
  const reduce = !!useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [stage, setStage] = useState(reduce ? 2 : 0);

  // auto-advance + loop; paused offscreen and with reduced motion; timer cleared on unmount
  useEffect(() => {
    if (reduce || !inView) return undefined;
    const id = setTimeout(() => setStage((s) => (s + 1) % STAGES.length), STAGES[stage].ms);
    return () => clearTimeout(id);
  }, [stage, inView, reduce]);

  const Scene = SCENES[stage];
  return <div ref={ref} className="rounded-[28px] border border-[#0A0A0B]/10 bg-[#FBF9F4] p-4 shadow-[0_1px_0_rgba(10,10,11,.04),0_24px_60px_-24px_rgba(10,10,11,.2)] sm:p-6">
      <div className={`${mono} mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#7C7C84]`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={stage} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {STAGES[stage].title}
          </motion.span>
        </AnimatePresence>
        <span>Illustrative</span>
      </div>

      <div role="img" aria-label={ALT} className="relative h-[372px] sm:h-[384px]">
        <Rail stage={stage} reduce={reduce} />
        <AnimatePresence mode="wait">
          <Scene key={stage} reduce={reduce} />
        </AnimatePresence>
      </div>

      <div className="mt-5 border-t border-[#0A0A0B]/10 pt-4">
        <StageNav stage={stage} reduce={reduce} onPick={setStage} />
      </div>
    </div>;
}

export { ProblemDemo };
