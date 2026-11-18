"use client";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Database, Phone, Users } from "lucide-react";
import { EMERALD, EMERALD_INK, mono } from "../shared";

const NODES = [
  { label: "Phone system", icon: Phone, x: 20, y: 20 },
  { label: "CRM", icon: Users, x: 80, y: 20 },
  { label: "Booking system", icon: CalendarCheck, x: 20, y: 80 },
  { label: "Business database", icon: Database, x: 80, y: 80 },
];

function ConnectStage() {
  const reduce = useReducedMotion();
  return <div className="relative h-[310px] w-full max-w-[540px]">
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {NODES.map((n, i) => <motion.line
    key={n.label}
    x1="50"
    y1="50"
    x2={n.x}
    y2={n.y}
    stroke={EMERALD_INK}
    strokeWidth="1.5"
    strokeLinecap="round"
    vectorEffect="non-scaling-stroke"
    initial={reduce ? false : { pathLength: 0, opacity: 0.3 }}
    animate={{ pathLength: 1, opacity: 0.6 }}
    transition={{ duration: 0.6, delay: 0.4 + i * 0.35, ease: "easeOut" }}
  />)}
      </svg>

      {!reduce && NODES.map((n, i) => <motion.span
    key={n.label}
    className="absolute size-2 rounded-full"
    style={{ marginLeft: -4, marginTop: -4, background: EMERALD, boxShadow: `0 0 0 3px ${EMERALD}55` }}
    initial={{ left: "50%", top: "50%", opacity: 0 }}
    animate={{ left: ["50%", `${n.x}%`], top: ["50%", `${n.y}%`], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 1.6, delay: 1.2 + i * 0.35, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
  />)}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
    initial={reduce ? false : { scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="relative rounded-[20px] bg-[#0A0A0B] px-4 py-3 text-center"
  >
          {!reduce && <motion.span className="absolute inset-0 rounded-[20px] border border-[#0A0A0B]" animate={{ scale: [1, 1.25], opacity: [0.35, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />}
          <p className={`${mono} text-[10px] uppercase tracking-[0.18em]`} style={{ color: EMERALD }}>Aurlynn</p>
          <p className="mt-0.5 text-[11px] text-white/60">AI voice agent</p>
        </motion.div>
      </div>

      {NODES.map((n, i) => {
    const Icon = n.icon;
    const at = 0.4 + i * 0.35;
    return <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <motion.div
      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: at + 0.3 }}
      className="w-[132px] rounded-[18px] border border-[#0A0A0B]/10 bg-white p-2.5 shadow-[0_14px_30px_-18px_rgba(10,10,11,.3)] sm:w-[152px]"
    >
              <span className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#F6F3EC] text-[#0A0A0B]">
                  <Icon size={14} aria-hidden />
                </span>
                <span className="text-[12px] font-medium leading-tight text-[#0A0A0B]">{n.label}</span>
              </span>
              <motion.span
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: at + 0.8 }}
      className={`${mono} mt-2 flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider`}
      style={{ color: EMERALD_INK }}
    >
                <span className="size-1.5 rounded-full" style={{ background: EMERALD_INK }} /> Connected
              </motion.span>
            </motion.div>
          </div>;
  })}
    </div>;
}

export { ConnectStage };
