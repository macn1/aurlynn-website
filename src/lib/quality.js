"use client";
import { useSyncExternalStore } from "react";
const KEY = "aurlynn-tier";
const listeners = /* @__PURE__ */ new Set();
let current = null;
function detect() {
  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved === "high" || saved === "medium" || saved === "low") return saved;
  } catch {
  }
  const nav = navigator;
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 8;
  if (nav.connection?.saveData || cores <= 2 || mem <= 2) return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (cores <= 4 || mem <= 4 || coarse || window.innerWidth < 768) return "medium";
  return "high";
}
function get() {
  if (current === null) current = detect();
  return current;
}
function getTier() {
  return get();
}
function setTier(next) {
  if (next === current) return;
  current = next;
  try {
    sessionStorage.setItem(KEY, next);
  } catch {
  }
  listeners.forEach((l) => l());
}
function downgradeTier() {
  const t = get();
  setTier(t === "high" ? "medium" : "low");
}
function useTier() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get,
    () => "high"
  );
}
export {
  downgradeTier,
  getTier,
  setTier,
  useTier
};
