"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useTier } from "@/lib/quality";
function SmoothScroll() {
  const tier = useTier();
  useEffect(() => {
    if (tier === "low" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1e3);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [tier]);
  return null;
}
export {
  SmoothScroll
};
