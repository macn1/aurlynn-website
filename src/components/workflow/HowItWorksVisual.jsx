"use client";
import { lazyClient } from "@/lib/lazy";
import { useSyncExternalStore } from "react";
import { getTier, useTier } from "@/lib/quality";
import { HowItWorksStage, Readout } from "./HowItWorksStage";
const HowItWorks3D = lazyClient(() => import("./HowItWorks3D"));
let decided = null;
function decide() {
  if (decided === null) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    decided = reduced || getTier() === "low" ? "2d" : "3d";
  }
  return decided;
}
const noop = () => () => {
};
function HowItWorksVisual({ active, progress }) {
  const tier = useTier();
  const mode = useSyncExternalStore(noop, decide, () => "3d");
  if (mode === "2d") {
    return <div className="flex h-full w-full items-center justify-center p-4 md:p-6">
        <HowItWorksStage active={active} />
      </div>;
  }
  return <div className="absolute inset-0">
      <div
    aria-hidden
    className="absolute inset-0"
    style={{ background: "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(224,165,110,.22), transparent 70%)" }}
  />
      <HowItWorks3D progress={progress} active={active} dpr={tier === "high" ? 2 : tier === "medium" ? 1.25 : 1} />
      <Readout
    step={active}
    motion
    className="bottom-3 left-3 w-[min(86%,300px)] md:bottom-4 md:left-4"
  />
    </div>;
}
export {
  HowItWorksVisual
};
