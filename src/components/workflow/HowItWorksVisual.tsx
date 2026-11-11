"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, type MutableRefObject } from "react";
import { getTier, useTier } from "@/lib/quality";
import { HowItWorksStage, Readout } from "./HowItWorksStage";

const HowItWorks3D = dynamic(() => import("./HowItWorks3D"), { ssr: false });

/**
 * 3D cartoon scene (caller, edge network, agent) driven by scroll progress, with the
 * explanatory readout card floating over it. Low-power devices and reduced-motion
 * users get the lightweight 2D diagram instead.
 */
/**
 * The 3D-or-2D decision is made once per page load. Re-deciding later (e.g. the hero's frame-rate
 * watchdog lowering the tier) would unmount a live WebGL canvas mid-render; a slow device instead
 * just gets a lower pixel ratio on the same canvas.
 */
let decided: "3d" | "2d" | null = null;
function decide(): "3d" | "2d" {
  if (decided === null) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    decided = reduced || getTier() === "low" ? "2d" : "3d";
  }
  return decided;
}
const noop = () => () => {};

export function HowItWorksVisual({ active, progress }: { active: number; progress: MutableRefObject<number> }) {
  const tier = useTier();
  const mode = useSyncExternalStore(noop, decide, () => "3d" as const);

  if (mode === "2d") {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 md:p-6">
        <HowItWorksStage active={active} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
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
    </div>
  );
}
