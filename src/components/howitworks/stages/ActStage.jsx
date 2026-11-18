"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { Card, EMERALD, EMERALD_INK, Label, mono, sora, useMilestones } from "../shared";

const OPS = [
  "Checking available slots",
  "Selecting an appointment",
  "Creating booking",
  "Updating CRM",
  "Sending confirmation",
];
// each operation starts in turn; the last milestone completes the final one
const TIMES = [400, 1250, 2100, 2950, 3800, 4650];

function Op({ label, state, reduce, last }) {
  const done = state === "done";
  const running = state === "running";
  return <li className="relative flex items-center gap-3 pb-3.5 last:pb-0">
      {!last && <span className="absolute left-[11px] top-6 h-[calc(100%-18px)] w-px bg-[#0A0A0B]/10">
          <motion.span className="absolute inset-0 origin-top" style={{ background: EMERALD_INK }} initial={false} animate={{ scaleY: done ? 1 : 0 }} transition={{ duration: 0.35 }} />
        </span>}
      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300" style={{ borderColor: done ? EMERALD : running ? EMERALD_INK : "#D9D5CA", background: done ? EMERALD : "#FBF9F4" }}>
        {done ? <Check size={12} strokeWidth={3} color="#064E3B" aria-hidden /> : running ? reduce ? <span className="size-1.5 rounded-full" style={{ background: EMERALD_INK }} /> : <motion.span className="flex" animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}><LoaderCircle size={13} color={EMERALD_INK} aria-hidden /></motion.span> : null}
      </span>
      <span className={`text-[13px] leading-tight transition-colors duration-300 ${done || running ? "text-[#0A0A0B]" : "text-[#7C7C84]"} ${running ? "font-medium" : ""}`}>{label}</span>
    </li>;
}

function ActStage() {
  const reduce = useReducedMotion();
  const n = useMilestones(TIMES, reduce);
  const finished = n >= TIMES.length;
  const stateOf = (i) => (n > i + 1 ? "done" : n === i + 1 ? "running" : "idle");
  return <div className="grid w-full max-w-[560px] items-center gap-5 sm:grid-cols-[1fr_1fr] sm:gap-6">
      <div>
        <Label className="mb-3.5">Booking workflow</Label>
        <ul>
          {OPS.map((o, i) => <Op key={o} label={o} state={stateOf(i)} reduce={reduce} last={i === OPS.length - 1} />)}
        </ul>
      </div>

      <div className="relative min-h-[150px]">
        <div className="absolute inset-0 flex items-center justify-center rounded-[22px] border border-dashed border-[#0A0A0B]/15">
          <span className={`${mono} text-[10px] uppercase tracking-wider text-[#7C7C84]`}>Awaiting booking</span>
        </div>
        <AnimatePresence>
          {finished && <motion.div
    initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 240, damping: 20 }}
    className="relative"
  >
              <Card className="overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: EMERALD }}>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#0A0A0B]">
                    <Check size={13} strokeWidth={3} color={EMERALD} aria-hidden />
                  </span>
                  <span className="text-[13px] font-semibold text-[#064E3B]">Booking confirmed</span>
                </div>
                <div className="space-y-2 border-b border-dashed border-[#0A0A0B]/15 px-4 py-3.5">
                  <p className={`${sora} text-[15px] font-medium text-[#0A0A0B]`}>Vehicle maintenance</p>
                  <p className="text-[12.5px] text-[#55555C]">John · Tomorrow, 10:00 AM</p>
                </div>
                <p className={`${mono} px-4 py-2.5 text-[9.5px] uppercase tracking-wider`} style={{ color: EMERALD_INK }}>CRM updated · Confirmation sent</p>
              </Card>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}

export { ActStage };
