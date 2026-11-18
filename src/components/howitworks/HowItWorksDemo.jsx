import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { JourneyTimeline } from "./JourneyTimeline";
import { JourneyContent } from "./JourneyContent";
import { JourneyNavigation } from "./JourneyNavigation";
import { ActStage } from "./stages/ActStage";
import { ConnectStage } from "./stages/ConnectStage";
import { ConverseStage } from "./stages/ConverseStage";
import { DefineStage } from "./stages/DefineStage";
import { EscalateStage } from "./stages/EscalateStage";
import { ImproveStage } from "./stages/ImproveStage";
import { UnderstandStage } from "./stages/UnderstandStage";
import { EMERALD_INK, STEPS, mono } from "./shared";

const STAGES = [DefineStage, ConnectStage, ConverseStage, UnderstandStage, ActStage, EscalateStage, ImproveStage];
const LAST = STEPS.length - 1;

function HowItWorksDemo() {
  const reduce = !!useReducedMotion();
  const [[step, dir], setState] = useState([0, 1]);
  const go = (to) => setState(([cur]) => {
    const next = Math.max(0, Math.min(LAST, to));
    return [next, next >= cur ? 1 : -1];
  });
  const Stage = STAGES[step];

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") go(step + 1);
    else if (e.key === "ArrowLeft") go(step - 1);
  };

  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: (d) => ({ opacity: 0, x: d * 48, scale: 0.98 }),
        animate: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 240, damping: 28 } },
        exit: (d) => ({ opacity: 0, x: d * -48, scale: 0.98, filter: "blur(3px)", transition: { duration: 0.22 } }),
      };

  return <div onKeyDown={onKeyDown}>
      <JourneyTimeline step={step} onPick={go} reduce={reduce} />

      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#0A0A0B]/10 bg-[#F6F3EC] shadow-[0_1px_0_rgba(10,10,11,.04),0_28px_70px_-30px_rgba(10,10,11,.22)]">
        <div className="grid items-end gap-5 bg-white/70 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:gap-10">
          <JourneyContent step={step} reduce={reduce} />
          <JourneyNavigation step={step} go={go} />
        </div>

        <div className="relative h-[3px] bg-[#0A0A0B]/[0.06]" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Walkthrough progress">
          <motion.span className="absolute inset-y-0 left-0" style={{ background: EMERALD_INK }} initial={false} animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 24 }} />
        </div>

        <div className="relative flex h-[440px] items-center justify-center overflow-hidden bg-[radial-gradient(rgba(10,10,11,.07)_1px,transparent_1px)] [background-size:20px_20px] p-4 sm:h-[460px] sm:p-8">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={step} custom={dir} {...slide} className="flex size-full items-center justify-center">
              <Stage />
            </motion.div>
          </AnimatePresence>
          <span className={`${mono} absolute bottom-3 right-4 text-[9.5px] uppercase tracking-[0.14em] text-[#7C7C84]`}>Illustrative</span>
        </div>
      </div>
      <span className="sr-only">Use the left and right arrow keys to move between steps.</span>
    </div>;
}

export { HowItWorksDemo };
