"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Auto-advancing index while the element is on screen. Returns [ref, index, setIndex, stop].
 * Calling stop() (e.g. on user interaction) ends the autoplay. Reduced motion: no autoplay, starts at `start`.
 */
export function useStepper(count, { interval = 1600, start = 0, loop = true } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [i, setI] = useState(start);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (!inView || stopped || reduce) return;
    const t = setInterval(() => setI((n) => (n + 1 < count ? n + 1 : loop ? 0 : n)), interval);
    return () => clearInterval(t);
  }, [inView, stopped, reduce, count, interval, loop]);

  const select = (n) => {
    setStopped(true);
    setI(n);
  };
  return [ref, i, select, () => setStopped(true)];
}
