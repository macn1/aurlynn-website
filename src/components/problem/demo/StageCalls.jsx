"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, PhoneMissed } from "lucide-react";
import { ALERT, inter, mono, shellVariants, useMilestones } from "./shared";

const CALLS = [
  { text: "Customer wants to book an appointment", tag: "Booking" },
  { text: "Customer asks about service pricing", tag: "Pricing" },
  { text: "Customer wants to check an order", tag: "Order" },
  { text: "Customer needs to reschedule", tag: "Reschedule" },
];
// four calls arrive, then they all tip over to "missed"
const TIMES = [300, 900, 1500, 2100, 3000];

function CallCard({ call, missed, reduce }) {
  return <motion.li
    initial={reduce ? false : { opacity: 0, x: -16, scale: 0.97 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 280, damping: 24 }}
    className="relative flex items-center gap-3 rounded-2xl border border-[#0A0A0B]/10 bg-white px-3.5 py-3"
  >
      <span className="absolute -left-[27px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 bg-[#FBF9F4]" style={{ borderColor: ALERT }} />
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${ALERT}1A`, color: ALERT }}>
        {missed ? <PhoneMissed size={15} aria-hidden /> : <Phone size={15} aria-hidden />}
        {!missed && !reduce && <motion.span
    className="absolute inset-0 rounded-full border"
    style={{ borderColor: ALERT }}
    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
    transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
  />}
      </span>
      <span className="min-w-0 flex-1 text-[13px] leading-snug text-[#0A0A0B]">{call.text}</span>
      <span className={`${mono} shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider`} style={{ background: missed ? `${ALERT}1A` : "#F1EEE6", color: missed ? ALERT : "#7C7C84" }}>
        {missed ? "Missed" : "Ringing"}
      </span>
    </motion.li>;
}

function StageCalls({ reduce }) {
  const n = useMilestones(TIMES, reduce);
  const shown = Math.min(n, CALLS.length);
  const allMissed = n >= TIMES.length;
  return <motion.div variants={shellVariants(reduce)} initial="initial" animate="animate" exit="exit" className={`${inter} absolute inset-0 pl-8`}>
      <div className="h-7">
        <AnimatePresence>
          {shown >= 2 && <motion.div
    initial={reduce ? false : { opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium"
    style={{ background: `${ALERT}14`, color: ALERT }}
  >
              <span className="relative flex size-2">
                {!reduce && <motion.span className="absolute inset-0 rounded-full" style={{ background: ALERT }} animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />}
                <span className="relative size-2 rounded-full" style={{ background: ALERT }} />
              </span>
              {shown} calls waiting
            </motion.div>}
        </AnimatePresence>
      </div>

      <ul className="mt-2 space-y-2">
        {CALLS.slice(0, shown).map((c, i) => <CallCard key={c.tag} call={c} reduce={reduce} missed={allMissed || shown > i + 1} />)}
      </ul>

      <div className="absolute bottom-0 left-8 right-0">
        <AnimatePresence>
          {shown >= 2 && <motion.div
    initial={reduce ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-medium"
    style={{ borderColor: `${ALERT}33`, background: `${ALERT}0D`, color: ALERT }}
  >
              <span className="size-1.5 rounded-full" style={{ background: ALERT }} />
              Your team is unavailable
            </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>;
}

export { StageCalls };
