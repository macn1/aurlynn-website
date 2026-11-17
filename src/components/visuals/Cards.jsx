import { motion, useReducedMotion } from "framer-motion";
import { Check, Database, User, UserRound, Calendar, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

/** CRM-style record that fills in field by field. fields: [[label, value]], filled: how many are shown. */
export function RecordCard({ title = "Lead record", subtitle = "Updated from the call", fields, filled = fields.length, dark = false, status, className = "" }) {
  const reduce = useReducedMotion();
  const surface = dark ? "border-white/10 bg-white/[0.04]" : "border-border bg-white shadow-[0_24px_60px_-30px_rgba(10,10,11,.2)]";
  return (
    <div className={`rounded-2xl border ${surface} ${className}`} role="group" aria-label={title}>
      <div className={`flex items-center justify-between border-b px-4 py-3 ${dark ? "border-white/10" : "border-border"}`}>
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-accent-light text-dark">
            <Database size={13} aria-hidden />
          </span>
          <div>
            <p className="text-[13px] font-medium leading-none">{title}</p>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-secondary">{subtitle}</p>
          </div>
        </div>
        {status && <span className="mono rounded-full bg-[#7CF0C6]/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]">{status}</span>}
      </div>
      <dl className="divide-y divide-border/60 px-4 py-1">
        {fields.map(([k, v], i) => (
          <div key={k} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 py-2.5 text-[13px]">
            <dt className="mono text-[10.5px] uppercase tracking-[0.12em] text-secondary">{k}</dt>
            <dd className="min-h-[1.25rem] font-medium">
              <motion.span initial={false} animate={{ opacity: i < filled ? 1 : 0, y: i < filled ? 0 : 6 }} transition={reduce ? { duration: 0 } : { duration: 0.45, ease }} className="inline-flex items-center gap-1.5">
                {v}
                {i === filled - 1 && i < fields.length && <span className="size-1.5 rounded-full bg-accent" aria-hidden />}
              </motion.span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Appointment confirmation with an animated check. */
export function BookingCard({ title = "Appointment confirmed", when, who, where, className = "", dark = false }) {
  const reduce = useReducedMotion();
  const surface = dark ? "border-white/10 bg-white/[0.04]" : "border-border bg-white shadow-[0_24px_60px_-30px_rgba(10,10,11,.2)]";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease }}
      className={`rounded-2xl border p-5 ${surface} ${className}`}
    >
      <div className="flex items-center gap-3">
        <motion.span
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.25 }}
          className="grid size-9 place-items-center rounded-full bg-[#7CF0C6] text-dark"
        >
          <Check size={17} aria-hidden strokeWidth={3} />
        </motion.span>
        <p className="font-[family-name:var(--font-sora)] text-base font-medium">{title}</p>
      </div>
      <ul className="mt-4 space-y-2 text-[13.5px]">
        {[[Calendar, when], [User, who], [UserRound, where]].filter((r) => r[1]).map(([Icon, text]) => (
          <li key={text} className="flex items-center gap-2.5">
            <Icon size={14} aria-hidden className="text-accent" />
            {text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Agent → human handoff with the context that travels with the call. */
export function HandoffVisual({ reason = "Caller asked for a specialist", context = ["Name and contact verified", "Requirement captured", "Summary of the conversation"], dark = false, className = "" }) {
  const reduce = useReducedMotion();
  const surface = dark ? "border-white/10 bg-white/[0.04]" : "border-border bg-white";
  const a = (d) => (reduce ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.6, delay: d, ease } });
  return (
    <div className={`grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] ${className}`}>
      <motion.div {...a(0)} className={`rounded-2xl border p-5 ${surface}`}>
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-secondary">Aurlynn agent</p>
        <p className="mt-2 font-[family-name:var(--font-sora)] text-base font-medium">Handles the conversation</p>
        <p className="mt-3 border-l-2 border-accent pl-3 text-[13px] leading-snug text-secondary">Rule triggered: {reason}</p>
      </motion.div>
      <motion.div {...a(0.15)} className="flex items-center justify-center text-accent" aria-hidden>
        <ArrowRight className="rotate-90 sm:rotate-0" size={22} />
      </motion.div>
      <motion.div {...a(0.3)} className={`rounded-2xl border p-5 ${surface}`}>
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-secondary">Your team</p>
        <p className="mt-2 font-[family-name:var(--font-sora)] text-base font-medium">Takes over with context</p>
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {context.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <Check size={13} aria-hidden className="text-accent" />
              {c}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
