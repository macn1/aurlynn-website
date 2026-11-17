import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { PhoneCall, RotateCcw } from "lucide-react";
import { Waveform } from "./Waveform";

/**
 * Product-style call window. Turns appear one after another once it scrolls into view.
 * turns: [["agent" | "caller", "text"], ...]. Illustrative content only.
 */
export function ConversationCard({ turns, title = "Live call", status = "Illustrative example", direction = "Inbound", dark = false, className = "", actionLabel, actionDetail }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? turns.length : 0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    setShown(0);
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= turns.length + 1) clearInterval(t);
    }, 1100);
    return () => clearInterval(t);
  }, [inView, run, reduce, turns]);

  const speaking = shown > 0 && shown <= turns.length ? turns[shown - 1][0] : null;
  const surface = dark ? "border-white/10 bg-white/[0.04] text-white" : "border-border bg-white text-foreground shadow-[0_1px_0_rgba(10,10,11,.04),0_24px_60px_-28px_rgba(10,10,11,.2)]";
  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl border ${surface} ${className}`} role="group" aria-label={`${title}: ${status}`}>
      <div className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${dark ? "border-white/10" : "border-border"}`}>
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-full bg-dark text-white">
            <PhoneCall size={13} aria-hidden />
          </span>
          <div>
            <p className="text-[13px] font-medium leading-none">{title}</p>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-secondary">{direction} · {status}</p>
          </div>
        </div>
        <Waveform bars={14} height={22} color="var(--accent)" active={!!speaking} className="w-16" />
      </div>
      <ol className="min-h-[15rem] space-y-2.5 p-4" aria-live="off">
        <AnimatePresence initial={false}>
          {turns.slice(0, shown).map(([who, text], i) => (
            <motion.li
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${who === "agent" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13.5px] leading-snug ${who === "agent" ? (dark ? "bg-white/10" : "bg-background-secondary") : "bg-dark text-white"}`}>
                <span className="mono mb-1 block text-[9.5px] uppercase tracking-[0.14em] opacity-60">{who === "agent" ? "Aurlynn agent" : "Caller"}</span>
                {text}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {actionLabel && shown > turns.length && (
          <motion.li initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[12.5px]">
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-accent">Action</span>
            <span className="font-medium">{actionLabel}</span>
            {actionDetail && <span className="text-secondary">{actionDetail}</span>}
          </motion.li>
        )}
      </ol>
      {!reduce && (
        <div className={`flex justify-end border-t px-3 py-2 ${dark ? "border-white/10" : "border-border"}`}>
          <button type="button" onClick={() => setRun((r) => r + 1)} className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-secondary hover:text-accent">
            <RotateCcw size={11} aria-hidden /> Replay
          </button>
        </div>
      )}
    </div>
  );
}
