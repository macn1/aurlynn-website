"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { EMERALD, EMERALD_INK, inter, mono, shellVariants, useMilestones } from "./shared";

const STEPS = [
  "Incoming call connected",
  "Listening to customer",
  "Understanding customer intent",
  "Retrieving relevant information",
  "Processing customer request",
];
// steps 1-5 switch on one by one; step 5 completes at the last milestone
const TIMES = [200, 900, 1700, 2500, 3300, 4100];
const BARS = 30;

function Waveform({ reduce }) {
  return <div className="flex h-9 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }, (_, i) => {
    const peak = 10 + ((i * 7) % 6) * 4;
    return <motion.span
      key={i}
      className={`w-[3px] rounded-full ${i >= 20 ? "max-sm:hidden" : ""}`}
      style={{ background: EMERALD, height: reduce ? 6 + (i % 5) * 4 : 6 }}
      animate={reduce ? undefined : { height: [6, peak, 8, peak * 0.7 + 4, 6] }}
      transition={{ duration: 1.2 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
    />;
  })}
    </div>;
}

function Bubble({ who, ai, children, reduce }) {
  return <motion.div
    initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 24 }}
    className={`rounded-2xl border px-3 py-2 ${ai ? "border-[#0B7A57]/20 bg-[#7CF0C6]/15" : "border-[#0A0A0B]/10 bg-white"}`}
  >
      <p className={`${mono} mb-0.5 flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] ${ai ? "text-[#0B7A57]" : "text-[#7C7C84]"}`}>
        {who}
        {ai && <span className="rounded bg-[#0A0A0B] px-1 py-px text-[8.5px] tracking-wider text-[#7CF0C6]">AI</span>}
      </p>
      <p className="text-[12.5px] leading-snug text-[#0A0A0B]">{children}</p>
    </motion.div>;
}

function Step({ label, state, reduce }) {
  const done = state === "done";
  const active = state === "active";
  return <li className="relative flex items-center gap-2.5 text-[12px]">
      <span className="absolute -left-[27px] top-1/2 flex size-2.5 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-[#FBF9F4] transition-colors duration-300" style={{ borderColor: done || active ? EMERALD_INK : "#D9D5CA", background: done ? EMERALD_INK : "#FBF9F4" }} />
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full" style={{ background: done ? EMERALD : "transparent", border: done ? "none" : `1.5px solid ${active ? EMERALD_INK : "#D9D5CA"}` }}>
        {done ? <Check size={10} strokeWidth={3} color="#064E3B" aria-hidden /> : active && !reduce ? <motion.span className="size-1.5 rounded-full" style={{ background: EMERALD_INK }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }} /> : null}
      </span>
      <span className={`transition-colors duration-300 ${done ? "text-[#0A0A0B]" : active ? "font-medium text-[#0A0A0B]" : "text-[#7C7C84]"}`}>{label}</span>
    </li>;
}

function StageAgent({ reduce }) {
  const n = useMilestones(TIMES, reduce);
  const stateOf = (i) => (n > i + 1 ? "done" : n === i + 1 ? "active" : "idle");
  return <motion.div variants={shellVariants(reduce)} initial="initial" animate="animate" exit="exit" className={`${inter} absolute inset-0 pl-8`}>
      <div className="rounded-2xl bg-[#0A0A0B] px-4 pb-2.5 pt-3">
        <div className={`${mono} mb-1 flex items-center justify-between text-[9.5px] uppercase tracking-[0.16em] text-white/55`}>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ background: EMERALD }} /> AI voice agent
          </span>
          <span>Live call</span>
        </div>
        <Waveform reduce={reduce} />
      </div>

      <div className="mt-2.5 space-y-2">
        <AnimatePresence>
          {n >= 2 && <Bubble key="c" who="Customer" reduce={reduce}>“Hi, I’d like to book an appointment for tomorrow.”</Bubble>}
          {n >= 4 && <Bubble key="a" who="Aurlynn" ai reduce={reduce}>“Absolutely! Let me check the available slots for you.”</Bubble>}
        </AnimatePresence>
      </div>

      <ul className="absolute bottom-0 left-8 right-0 space-y-1.5">
        {STEPS.map((s, i) => <Step key={s} label={s} state={stateOf(i)} reduce={reduce} />)}
      </ul>
    </motion.div>;
}

export { StageAgent };
