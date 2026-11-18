"use client";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Check } from "lucide-react";

export const sora = "font-[family-name:var(--font-sora)] tracking-tight";
export const inter = "font-[family-name:var(--font-inter)]";
export const mono = "font-[family-name:var(--font-jetbrains)]";

export const EMERALD = "#7CF0C6";
export const EMERALD_INK = "#0B7A57";
export const IVORY = "#F6F3EC";
export const INK = "#0A0A0B";
export const MUTED = "#55555C";

export const STEPS = [
  {
    n: "01",
    name: "Define",
    title: "Give your AI agent a purpose.",
    text: "Define what your AI agent should accomplish, how it should respond, and when it should involve your team.",
  },
  {
    n: "02",
    name: "Connect",
    title: "Connect your business systems.",
    text: "Connect your phone number, booking platform, CRM, and other business tools.",
  },
  {
    n: "03",
    name: "Converse",
    title: "Every call gets a natural response.",
    text: "Aurlynn answers incoming calls and communicates naturally with your customers.",
  },
  {
    n: "04",
    name: "Understand",
    title: "Understand what customers really need.",
    text: "Aurlynn interprets customer intent, extracts relevant details, and uses business context to determine the next step.",
  },
  {
    n: "05",
    name: "Act",
    title: "Turn conversations into completed tasks.",
    text: "Aurlynn doesn’t just answer questions. It can perform configured actions in connected business systems.",
  },
  {
    n: "06",
    name: "Escalate",
    title: "Bring in a human when it matters.",
    text: "When a caller needs specialist assistance or a request falls outside configured rules, Aurlynn transfers the conversation with its context.",
  },
  {
    n: "07",
    name: "Improve",
    title: "See what’s working. Improve what comes next.",
    text: "Understand how your voice agents perform and identify opportunities to improve customer conversations.",
  },
];

/** True once `ms` have passed (immediately when motion is reduced). Timer is cleaned up on unmount. */
export function useAfter(ms, reduce) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (reduce) return undefined;
    const id = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(id);
  }, [ms, reduce]);
  return reduce || done;
}

/** How many of `times` (ms offsets from mount) have elapsed. Everything is done at once with reduced motion. */
export function useMilestones(times, reduce) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const ids = times.map((t, i) => setTimeout(() => setCount(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, [times, reduce]);
  return reduce ? times.length : count;
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-[22px] border border-[#0A0A0B]/10 bg-white shadow-[0_1px_0_rgba(10,10,11,.04),0_18px_40px_-22px_rgba(10,10,11,.22)] ${className}`}>{children}</div>;
}

export function Label({ children, className = "" }) {
  return <p className={`${mono} text-[9.5px] uppercase tracking-[0.14em] text-[#7C7C84] ${className}`}>{children}</p>;
}

/** Small emerald confirmation tick that pops in. */
export function Tick({ delay = 0, reduce }) {
  return <motion.span
    initial={reduce ? false : { scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 420, damping: 20, delay }}
    className="flex size-[18px] shrink-0 items-center justify-center rounded-full"
    style={{ background: EMERALD }}
  >
      <Check size={11} strokeWidth={3} color="#064E3B" aria-hidden />
    </motion.span>;
}

/** Words fade in one after another, to feel like speech. */
export function Words({ text, delay = 0, step = 0.07, reduce }) {
  return <>
      {text.split(" ").map((w, i) => <motion.span
    key={i}
    initial={reduce ? false : { opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: delay + i * step, duration: 0.2 }}
  >
          {w}{" "}
        </motion.span>)}
    </>;
}

/** Number that counts up. `format` turns the running value into text. */
export function Counter({ to, format = (v) => Math.round(v).toLocaleString("en-US"), delay = 0, duration = 1.4, reduce }) {
  const mv = useMotionValue(reduce ? to : 0);
  const text = useTransform(mv, format);
  useEffect(() => {
    if (reduce) {
      mv.set(to);
      return undefined;
    }
    const controls = animate(mv, to, { duration, delay, ease: "easeOut" });
    return () => controls.stop();
  }, [to, reduce, delay, duration, mv]);
  return <motion.span>{text}</motion.span>;
}
