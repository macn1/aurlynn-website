"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, FileText, Phone, UserRound } from "lucide-react";
import { Card, EMERALD, EMERALD_INK, Label, mono, useMilestones } from "../shared";

const STEPS = [
  "Caller requests a specialist",
  "Escalation requirement identified",
  "Conversation context prepared",
  "Employee receives the handoff",
  "Summary attached",
];
const TIMES = [300, 1100, 1900, 2700, 3500];

function Node({ icon: Icon, label, sub, active, dark }) {
  return <div className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 text-center sm:w-24">
      <span
    className="flex size-12 items-center justify-center rounded-2xl border transition-all duration-500"
    style={{
      background: dark ? "#0A0A0B" : "white",
      color: dark ? EMERALD : "#0A0A0B",
      borderColor: active ? EMERALD_INK : "rgba(10,10,11,.1)",
      boxShadow: active ? `0 0 0 5px ${EMERALD}55` : "none",
    }}
  >
        <Icon size={19} aria-hidden />
      </span>
      <span className="text-[12px] font-medium leading-tight text-[#0A0A0B]">{label}</span>
      <Label>{sub}</Label>
    </div>;
}

function Link({ fill, reduce, travel }) {
  return <span className="relative -mt-9 h-px flex-1 bg-[#0A0A0B]/15" aria-hidden>
      <motion.span className="absolute inset-0 origin-left" style={{ background: EMERALD_INK }} initial={false} animate={{ scaleX: fill ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }} />
      {travel && !reduce && <motion.span
    className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full"
    style={{ background: EMERALD, boxShadow: `0 0 0 4px ${EMERALD}55` }}
    initial={{ left: "0%" }}
    animate={{ left: "calc(100% - 10px)" }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  />}
    </span>;
}

function EscalateStage() {
  const reduce = useReducedMotion();
  const n = useMilestones(TIMES, reduce);
  return <div className="w-full max-w-[540px] space-y-5">
      <div className="flex items-start px-1 sm:px-4">
        <Node icon={Phone} label="Caller" sub="On the line" active={n >= 1 && n < 4} />
        <Link fill={n >= 1} reduce={reduce} />
        <Node icon={Check} label="Aurlynn" sub="AI agent" dark active={n >= 2 && n < 4} />
        <Link fill={n >= 4} travel={n === 4} reduce={reduce} />
        <Node icon={UserRound} label="Specialist" sub="Team member" active={n >= 4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr] sm:gap-5">
        <ul className="space-y-2">
          {STEPS.map((s, i) => {
    const on = n >= i + 1;
    return <li key={s} className={`flex items-center gap-2.5 text-[12.5px] transition-colors duration-300 ${on ? "text-[#0A0A0B]" : "text-[#A09B95]"}`}>
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-300" style={{ borderColor: on ? EMERALD : "#D9D5CA", background: on ? EMERALD : "transparent" }}>
                  {on && <Check size={11} strokeWidth={3} color="#064E3B" aria-hidden />}
                </span>
                {s}
              </li>;
  })}
        </ul>

        <div className="min-h-[132px]">
          <AnimatePresence>
            {n >= 4 && <motion.div initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>
                <Card className="p-3.5">
                  <div className="flex items-center justify-between">
                    <Label className="!text-[#0B7A57]">Incoming handoff</Label>
                    <span className="size-1.5 rounded-full" style={{ background: EMERALD_INK }} />
                  </div>
                  <p className="mt-1.5 text-[12.5px] font-medium leading-snug text-[#0A0A0B]">Caller needs a specialist</p>
                  <AnimatePresence>
                    {n >= 5 && <motion.div initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                        <div className="mt-2.5 rounded-xl bg-[#F6F3EC] p-2.5">
                          <p className={`${mono} flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider`} style={{ color: EMERALD_INK }}>
                            <FileText size={11} aria-hidden /> Summary attached
                          </p>
                          <p className="mt-1 text-[11.5px] leading-snug text-[#55555C]">John · vehicle maintenance · tomorrow, 10 AM. Wants specialist advice.</p>
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </Card>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>;
}

export { EscalateStage };
