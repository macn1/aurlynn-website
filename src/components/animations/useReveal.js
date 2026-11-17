"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root, start: "top 78%", once: true }
        }
      );
    }, root);
    return () => ctx.revert();
  }, [ref]);
}
export {
  ScrollTrigger,
  useReveal
};
