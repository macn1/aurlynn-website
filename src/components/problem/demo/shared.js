import { useEffect, useState } from "react";

export const sora = "font-[family-name:var(--font-sora)] tracking-tight";
export const inter = "font-[family-name:var(--font-inter)]";
export const mono = "font-[family-name:var(--font-jetbrains)]";

export const EMERALD = "#7CF0C6";
export const EMERALD_INK = "#0B7A57";
export const ALERT = "#C2542D";

/** Story stages. `ms` is how long each one stays on screen. */
export const STAGES = [
  { id: "problem", label: "Problem", title: "Inbound calls", ms: 4000 },
  { id: "agent", label: "AI Agent", title: "Aurlynn · Live call", ms: 5000 },
  { id: "resolved", label: "Resolved", title: "Outcomes", ms: 4000 },
];

/**
 * Returns how many of the `times` (ms offsets from mount) have elapsed.
 * Timers are cleared on unmount. With reduced motion everything is already done.
 */
export function useMilestones(times, reduce) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const ids = times.map((t, i) => setTimeout(() => setCount(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, [times, reduce]);
  return reduce ? times.length : count;
}

/** Shared enter/exit motion for a whole stage so the three read as one scene. */
export function shellVariants(reduce) {
  if (reduce) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1, transition: { duration: 0 } },
      exit: { opacity: 0, transition: { duration: 0 } },
    };
  }
  return {
    initial: { opacity: 0, y: 14, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 26, staggerChildren: 0.06 },
    },
    exit: { opacity: 0, scale: 0.97, filter: "blur(3px)", transition: { duration: 0.3 } },
  };
}

export function itemVariants(reduce) {
  if (reduce) return { initial: { opacity: 1 }, animate: { opacity: 1 } };
  return {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
  };
}
