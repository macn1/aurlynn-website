"use client";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { STEPS, mono } from "./shared";

const LAST = STEPS.length - 1;

/** Counter + Previous / Next. The user always drives; nothing advances on its own. */
function JourneyNavigation({ step, go }) {
  const btn = "inline-flex h-11 items-center gap-2 rounded-full text-[13px] font-medium transition-colors";
  return <div className="flex items-center gap-3">
      <span className={`${mono} mr-1 text-[12px] tabular-nums text-[#7C7C84]`}>
        <span className="text-[#0A0A0B]">{STEPS[step].n}</span> / {String(STEPS.length).padStart(2, "0")}
      </span>
      <button type="button" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step" className={`${btn} w-11 justify-center border border-[#0A0A0B]/10 bg-white text-[#0A0A0B] hover:border-[#0B7A57] hover:text-[#0B7A57] disabled:pointer-events-none disabled:opacity-35`}>
        <ArrowLeft size={16} aria-hidden />
      </button>
      {step === LAST ? <button type="button" onClick={() => go(0)} className={`${btn} bg-[#0A0A0B] px-5 text-white hover:bg-[#2a2420]`}>
          <RotateCcw size={14} aria-hidden /> Start over
        </button> : <button type="button" onClick={() => go(step + 1)} className={`${btn} bg-[#0A0A0B] px-5 text-white hover:bg-[#2a2420]`}>
          Next <ArrowRight size={14} aria-hidden />
        </button>}
    </div>;
}

export { JourneyNavigation };
