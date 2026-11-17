"use client";
import { useMediaQuery } from "./useMediaQuery";
function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
export {
  useReducedMotion
};
