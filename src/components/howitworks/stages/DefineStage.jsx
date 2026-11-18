"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Card, EMERALD, EMERALD_INK, Label, Tick, mono, sora, useAfter } from "../shared";

const ROWS = [
  ["Primary objective", "Book appointments"],
  ["Business hours", "Mon–Fri · 09:00–18:00"],
  ["Conversation guidelines", "Friendly, concise, confirms details"],
  ["Escalation rules", "Complaints and specialist requests go to a person"],
  ["Success criteria", "Appointment confirmed in the calendar"],
];

function DefineStage() {
  const reduce = useReducedMotion();
  const ready = useAfter(250 + ROWS.length * 350 + 400, reduce);
  return <Card className="w-full max-w-[520px] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 border-b border-[#0A0A0B]/10 pb-3.5">
        <div>
          <Label>Agent configuration</Label>
          <p className={`${sora} mt-1 text-[17px] font-medium text-[#0A0A0B]`}>Aurlynn Booking Assistant</p>
        </div>
        <span className={`${mono} rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors duration-500`} style={{ background: ready ? `${EMERALD}66` : "#ECE7DB", color: ready ? EMERALD_INK : "#7C7C84" }}>
          {ready ? "Ready" : "Draft"}
        </span>
      </div>
      <ul className="mt-1 divide-y divide-[#0A0A0B]/[0.06]">
        {ROWS.map(([k, v], i) => <motion.li
    key={k}
    initial={reduce ? false : { opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 240, damping: 24, delay: 0.25 + i * 0.35 }}
    className="flex items-center gap-3 py-2.5"
  >
            <span className="min-w-0 flex-1">
              <Label>{k}</Label>
              <span className="mt-0.5 block text-[13px] leading-snug text-[#0A0A0B]">{v}</span>
            </span>
            <Tick delay={0.5 + i * 0.35} reduce={reduce} />
          </motion.li>)}
      </ul>
    </Card>;
}

export { DefineStage };
