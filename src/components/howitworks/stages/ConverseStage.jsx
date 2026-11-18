"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { Card, EMERALD, EMERALD_INK, Label, Words, mono } from "../shared";

const SEQ = [
  { phase: "ringing", ms: 1100 },
  { phase: "customer", ms: 2600 },
  { phase: "agent", ms: 3600 },
  { phase: "hold", ms: 1500 },
];
const BARS = 38;
const STATE_LABEL = { ringing: "Waiting", customer: "Listening", agent: "Speaking", hold: "Listening" };

function Waveform({ phase, reduce }) {
  const speaking = phase === "agent";
  const live = speaking || phase === "customer";
  return <div className="flex h-12 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }, (_, i) => {
    const peak = 10 + ((i * 7) % 6) * 5;
    return <motion.span
      key={i}
      className={`w-[3px] rounded-full ${i >= 26 ? "max-sm:hidden" : ""}`}
      style={{ background: speaking ? EMERALD : "rgba(255,255,255,.55)" }}
      animate={reduce || !live ? { height: reduce ? 6 + (i % 6) * 4 : 4 } : { height: [5, peak, 7, peak * 0.65 + 4, 5] }}
      transition={live ? { duration: 1 + (i % 4) * 0.14, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 } : { duration: 0.3 }}
    />;
  })}
    </div>;
}

function Bubble({ who, ai, children }) {
  return <div className={`rounded-2xl border px-3.5 py-2.5 ${ai ? "border-[#0B7A57]/25 bg-[#7CF0C6]/15" : "border-[#0A0A0B]/10 bg-white"}`}>
      <Label className={`flex items-center gap-1.5 ${ai ? "!text-[#0B7A57]" : ""}`}>
        {who}
        {ai && <span className="rounded bg-[#0A0A0B] px-1 py-px text-[8.5px] tracking-wider" style={{ color: EMERALD }}>AI</span>}
      </Label>
      <p className="mt-0.5 text-[13px] leading-snug text-[#0A0A0B]">{children}</p>
    </div>;
}

function ConverseStage() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState("ringing");
  const [secs, setSecs] = useState(0);

  // phase loop; every timer is cleared on unmount
  useEffect(() => {
    if (reduce) return undefined;
    let i = 0;
    let id;
    const next = () => {
      id = setTimeout(() => {
        i = (i + 1) % SEQ.length;
        setPhase(SEQ[i].phase);
        if (i === 0) setSecs(0);
        next();
      }, SEQ[i].ms);
    };
    next();
    return () => clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  const p = reduce ? "agent" : phase;
  const connected = p !== "ringing";
  const t = reduce ? 14 : secs;
  const clock = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return <Card className="w-full max-w-[520px] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-full" style={{ background: connected ? `${EMERALD}66` : "#ECE7DB", color: connected ? EMERALD_INK : "#0A0A0B" }}>
            <Phone size={14} aria-hidden />
            {!connected && !reduce && <motion.span className="absolute inset-0 rounded-full border border-[#0A0A0B]" animate={{ scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
          </span>
          <span>
            <span className="block text-[13px] font-medium text-[#0A0A0B]">{connected ? "Call connected" : "Incoming call"}</span>
            <Label>{connected ? "Answered by Aurlynn" : "Customer"}</Label>
          </span>
        </span>
        <span className={`${mono} text-[12px] tabular-nums text-[#55555C]`}>{connected ? clock : "00:00"}</span>
      </div>

      <div className="mt-3.5 rounded-2xl bg-[#0A0A0B] px-4 pb-3 pt-3">
        <div className={`${mono} flex items-center justify-between text-[9.5px] uppercase tracking-[0.16em] text-white/55`}>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ background: p === "agent" ? EMERALD : "rgba(255,255,255,.4)" }} /> AI voice agent
          </span>
          <span style={{ color: p === "agent" ? EMERALD : undefined }}>{STATE_LABEL[p]}</span>
        </div>
        <Waveform phase={p} reduce={reduce} />
      </div>

      <div className="mt-3 min-h-[142px] space-y-2">
        {connected && <motion.div key="c" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Bubble who="Customer"><Words text="“Hi, I’d like to book an appointment for tomorrow.”" delay={0.15} reduce={reduce} /></Bubble>
          </motion.div>}
        {(p === "agent" || p === "hold") && <motion.div key="a" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Bubble who="Aurlynn" ai><Words text="“Of course. What time would work best for you?”" delay={0.15} reduce={reduce} /></Bubble>
          </motion.div>}
      </div>
    </Card>;
}

export { ConverseStage };
