"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { EMERALD, EMERALD_INK, inter, mono, shellVariants, sora, useMilestones } from "./shared";

const OUTCOMES = [
  { label: "Appointment confirmed", tag: "Booking" },
  { label: "Pricing information provided", tag: "Pricing" },
  { label: "Order status shared", tag: "Order" },
  { label: "Callback scheduled", tag: "Reschedule" },
];
// four completions, then the closing message
const TIMES = [500, 1100, 1700, 2300, 2900];

function Row({ item, done, index, reduce }) {
  return <motion.li
    initial={reduce ? false : { opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 24, delay: reduce ? 0 : index * 0.08 }}
    className="relative flex items-center gap-3 rounded-2xl border border-[#0A0A0B]/10 bg-white px-3.5 py-3"
  >
      <span className="absolute -left-[27px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 transition-colors duration-300" style={{ borderColor: done ? EMERALD_INK : "#D9D5CA", background: done ? EMERALD_INK : "#FBF9F4" }} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-snug text-[#0A0A0B]">{item.label}</span>
        <span className={`${mono} text-[9.5px] uppercase tracking-[0.14em] text-[#7C7C84]`}>{item.tag}</span>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {done ? <motion.span
    key="done"
    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 420, damping: 22 }}
    className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#064E3B]"
    style={{ background: EMERALD }}
  >
            <Check size={12} strokeWidth={3} aria-hidden /> Completed
          </motion.span> : <motion.span
    key="wait"
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#F1EEE6] px-2.5 py-1 text-[11px] text-[#7C7C84]"
  >
            {reduce ? null : <motion.span className="flex" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><LoaderCircle size={12} aria-hidden /></motion.span>}
            Processing
          </motion.span>}
      </AnimatePresence>
    </motion.li>;
}

function StageResolved({ reduce }) {
  const n = useMilestones(TIMES, reduce);
  return <motion.div variants={shellVariants(reduce)} initial="initial" animate="animate" exit="exit" className={`${inter} absolute inset-0 pl-8`}>
      <ul className="space-y-2">
        {OUTCOMES.map((o, i) => <Row key={o.tag} item={o} index={i} done={n > i} reduce={reduce} />)}
      </ul>
      <div className="absolute bottom-0 left-8 right-0 min-h-[72px]">
        <AnimatePresence>
          {n >= TIMES.length && <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 24 }}>
              <p className={`${sora} text-[17px] font-medium leading-tight text-[#0A0A0B] sm:text-lg`}>Every conversation. Handled intelligently.</p>
              <p className="mt-1.5 text-[12.5px] text-[#55555C]">Your AI voice workforce works around the clock.</p>
            </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>;
}

export { StageResolved };
