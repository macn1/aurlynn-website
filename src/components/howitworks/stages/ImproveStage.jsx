"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Card, Counter, EMERALD, EMERALD_INK, Label, mono, sora } from "../shared";

const SERIES = [38, 52, 47, 66, 61, 78, 90];
const W = 300;
const H = 80;
const pts = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * W, H - (v / 100) * (H - 8) - 4]);
const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const area = `${line} L${W} ${H} L0 ${H} Z`;
const mmss = (v) => `${Math.floor(v / 60)}:${String(Math.round(v % 60)).padStart(2, "0")}`;

function Tile({ label, children, delay, reduce }) {
  return <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 24, delay }}>
      <Card className="h-full p-3">
        <Label>{label}</Label>
        {children}
      </Card>
    </motion.div>;
}

function ImproveStage() {
  const reduce = useReducedMotion();
  const R = 15;
  const C = 2 * Math.PI * R;
  return <div className="w-full max-w-[560px] space-y-2.5">
      <Card className="overflow-hidden p-4">
        <div className="flex items-end justify-between">
          <div>
            <Label>Calls handled</Label>
            <p className={`${sora} mt-1 text-[28px] font-medium leading-none text-[#0A0A0B] sm:text-[32px]`}>
              <Counter to={1284} reduce={reduce} />
            </p>
          </div>
          <span className={`${mono} rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider`} style={{ background: `${EMERALD}66`, color: EMERALD_INK }}>Last 7 days</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-[84px] w-full" preserveAspectRatio="none" aria-hidden>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(10,10,11,.06)" vectorEffect="non-scaling-stroke" />)}
          <motion.path d={area} fill={EMERALD} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 0.22 }} transition={{ delay: 1, duration: 0.6 }} />
          <motion.path d={line} fill="none" stroke={EMERALD_INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }} />
        </svg>
      </Card>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Tile label="Resolution" delay={0.3} reduce={reduce}>
          <div className="mt-1.5 flex items-center gap-2">
            <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r={R} fill="none" stroke="#ECE7DB" strokeWidth="4" />
              <motion.circle cx="18" cy="18" r={R} fill="none" stroke={EMERALD_INK} strokeWidth="4" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: reduce ? C * 0.13 : C }} animate={{ strokeDashoffset: C * 0.13 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }} />
            </svg>
            <span className={`${sora} text-lg font-medium text-[#0A0A0B]`}><Counter to={87} delay={0.5} reduce={reduce} />%</span>
          </div>
        </Tile>
        <Tile label="Bookings" delay={0.4} reduce={reduce}>
          <p className={`${sora} mt-1.5 text-xl font-medium text-[#0A0A0B]`}><Counter to={412} delay={0.6} reduce={reduce} /></p>
          <div className="mt-1.5 flex h-4 items-end gap-[3px]" aria-hidden>
            {[40, 65, 50, 80, 100].map((h, i) => <motion.span key={i} className="w-full origin-bottom rounded-sm" style={{ height: `${h}%`, background: EMERALD }} initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.8 + i * 0.07 }} />)}
          </div>
        </Tile>
        <Tile label="Escalations" delay={0.5} reduce={reduce}>
          <p className={`${sora} mt-1.5 text-xl font-medium text-[#0A0A0B]`}><Counter to={64} delay={0.7} reduce={reduce} /></p>
          <p className={`${mono} mt-1 text-[9.5px] uppercase tracking-wider text-[#7C7C84]`}>With context</p>
        </Tile>
        <Tile label="Avg. call" delay={0.6} reduce={reduce}>
          <p className={`${sora} mt-1.5 text-xl font-medium tabular-nums text-[#0A0A0B]`}><Counter to={161} format={mmss} delay={0.8} reduce={reduce} /></p>
          <p className={`${mono} mt-1 text-[9.5px] uppercase tracking-wider text-[#7C7C84]`}>min : sec</p>
        </Tile>
      </div>
      <p className={`${mono} text-center text-[9.5px] uppercase tracking-[0.14em] text-[#7C7C84]`}>Sample data for illustration</p>
    </div>;
}

export { ImproveStage };
