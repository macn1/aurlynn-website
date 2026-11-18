import { AnimatePresence, motion } from "framer-motion";
import { EMERALD_INK, STEPS, mono, sora } from "./shared";

/** Compact heading + description for the selected step. */
function JourneyContent({ step, reduce }) {
  const s = STEPS[step];
  return <div aria-live="polite" className="min-h-[112px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <p className={`${mono} text-[11px] uppercase tracking-[0.16em]`} style={{ color: EMERALD_INK }}>Step {s.n} — {s.name}</p>
          <h3 className={`${sora} mt-2 text-xl font-medium leading-tight text-[#0A0A0B] sm:text-2xl`}>{s.title}</h3>
          <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-[#55555C] sm:text-[15px]">{s.text}</p>
        </motion.div>
      </AnimatePresence>
    </div>;
}

export { JourneyContent };
