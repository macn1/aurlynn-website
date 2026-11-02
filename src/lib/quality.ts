"use client";

import { useSyncExternalStore } from "react";

/**
 * Device quality tier.
 *  high   – full 3D (refraction + live floor reflection)
 *  medium – 3D at reduced cost (no reflection, 1x pixels, half-res refraction)
 *  low    – no WebGL: pre-rendered hero image + a cheap 2D glow layer
 *
 * The starting tier comes from hardware hints; a runtime frame-rate watchdog can
 * only move it down, and the result is remembered for the session.
 */
export type Tier = "high" | "medium" | "low";

const KEY = "aurlynn-tier";
const listeners = new Set<() => void>();
let current: Tier | null = null;

function detect(): Tier {
  try {
    const saved = sessionStorage.getItem(KEY) as Tier | null;
    if (saved === "high" || saved === "medium" || saved === "low") return saved;
  } catch {
    /* storage blocked */
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 8;
  if (nav.connection?.saveData || cores <= 2 || mem <= 2) return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (cores <= 4 || mem <= 4 || coarse || window.innerWidth < 768) return "medium";
  return "high";
}

function get(): Tier {
  if (current === null) current = detect();
  return current;
}

export function setTier(next: Tier) {
  if (next === current) return;
  current = next;
  try {
    sessionStorage.setItem(KEY, next);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

export function downgradeTier() {
  const t = get();
  setTier(t === "high" ? "medium" : "low");
}

export function useTier(): Tier {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get,
    () => "high",
  );
}
