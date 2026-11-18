"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Card, EMERALD, EMERALD_INK, Label, mono, useAfter } from "../shared";

const FIELDS = [
  ["Intent", "Appointment booking"],
  ["Customer", "John"],
  ["Service", "Vehicle maintenance"],
  ["Preferred date", "Tomorrow"],
  ["Preferred time", "10 AM"],
];
const START = 0.8;
const STEP = 0.7;
const at = (i) => START + i * STEP;

function Mark({ index, children, reduce }) {
  return <motion.mark
    initial={reduce ? false : { backgroundColor: "rgba(124,240,198,0)" }}
    animate={{ backgroundColor: "rgba(124,240,198,0.4)" }}
    transition={{ delay: at(index), duration: 0.4 }}
    className="rounded px-1 py-0.5 text-inherit"
    style={{ boxShadow: `inset 0 -2px 0 ${EMERALD_INK}` }}
  >
      {children}
      <sup className={`${mono} ml-0.5 text-[8px] font-medium`} style={{ color: EMERALD_INK }}>{index + 1}</sup>
    </motion.mark>;
}

function UnderstandStage() {
  const reduce = useReducedMotion();
  const done = useAfter(at(FIELDS.length) + 200, reduce);
  return <div className="w-full max-w-[520px] space-y-3">
      <Card className="p-4 sm:p-5">
        <Label>Caller said</Label>
        <p className="mt-2 text-[15px] leading-[1.9] text-[#0A0A0B] sm:text-base">
          “Hi, this is <Mark index={1} reduce={reduce}>John</Mark>. I’d like to <Mark index={0} reduce={reduce}>book</Mark> a <Mark index={2} reduce={reduce}>vehicle maintenance</Mark> appointment for <Mark index={3} reduce={reduce}>tomorrow</Mark> at <Mark index={4} reduce={reduce}>10 AM</Mark>.”
        </p>
      </Card>

      <div className="rounded-[22px] bg-[#0A0A0B] p-4 shadow-[0_18px_40px_-22px_rgba(10,10,11,.5)] sm:p-5">
        <div className={`${mono} flex items-center justify-between text-[9.5px] uppercase tracking-[0.16em] text-white/55`}>
          <span>Structured data</span>
          <span className="transition-colors duration-500" style={{ color: done ? EMERALD : undefined }}>{done ? "Complete" : "Extracting…"}</span>
        </div>
        <ul className="mt-3 space-y-2">
          {FIELDS.map(([k, v], i) => <li key={k} className={`${mono} flex items-center gap-3 text-[12px]`}>
              <span className="w-[7.5rem] shrink-0 text-white/45 sm:w-32">
                <span className="mr-1.5" style={{ color: EMERALD }}>{i + 1}</span>
                {k}
              </span>
              <span className="relative min-w-0 flex-1">
                <motion.span
    initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
    animate={{ clipPath: "inset(0 0% 0 0)" }}
    transition={{ delay: at(i), duration: 0.45, ease: "easeOut" }}
    className="block truncate"
    style={{ color: EMERALD }}
  >
                  {v}
                </motion.span>
                {!reduce && <motion.span
    className="absolute inset-y-0 w-px"
    style={{ background: EMERALD }}
    initial={{ left: "0%", opacity: 0 }}
    animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
    transition={{ delay: at(i), duration: 0.45, ease: "easeOut" }}
  />}
              </span>
            </li>)}
        </ul>
      </div>
    </div>;
}

export { UnderstandStage };
