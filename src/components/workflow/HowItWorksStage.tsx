"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, Cpu, Globe, Phone, Radio, Smartphone } from "lucide-react";

/**
 * Right-hand stage of "How it works".
 * One persistent pipeline (Caller → Edge network → Agent) that stays on screen the whole time,
 * so the viewer always sees *where* in the system they are. A floating "live readout" card
 * explains what is actually happening at the current step, with real example data.
 */

const W = 600;
const H = 520;
const NODES = [
  { id: "caller", x: 120, y: 372, label: "Caller", Icon: Phone },
  { id: "edge", x: 300, y: 262, label: "Edge network", Icon: Radio },
  { id: "agent", x: 480, y: 152, label: "Aurlynn agent", Icon: Cpu },
] as const;

// Which node is "lit" at each step, and what the agent reports about itself.
const LIT = [0, 1, 2, 2];
const AGENT_STATE = ["Idle", "Listening", "Thinking", "Speaking"];

const FWD = `M${NODES[0].x} ${NODES[0].y} C 190 340, 230 292, ${NODES[1].x} ${NODES[1].y} S 410 184, ${NODES[2].x} ${NODES[2].y}`;
const BACK = `M${NODES[2].x} ${NODES[2].y} C 410 184, 370 232, ${NODES[1].x} ${NODES[1].y} S 190 340, ${NODES[0].x} ${NODES[0].y}`;

const mono = "font-[family-name:var(--font-jetbrains)]";

const RM = "(prefers-reduced-motion: reduce)";
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(RM);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

function Counter({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return <>{String(run ? v : to).padStart(3, "0")}</>;
}

function Wave({ n = 14, live = true, className = "" }: { n?: number; live?: boolean; className?: string }) {
  return (
    <div className={`flex h-8 items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] origin-center rounded-full bg-[#9a6a44]"
          style={{
            height: 8 + ((i * 37) % 22),
            animation: live ? `wf-pulse ${0.8 + ((i * 13) % 6) / 10}s ease-in-out ${i * 0.06}s infinite` : undefined,
            opacity: 0.45 + ((i * 17) % 55) / 100,
          }}
        />
      ))}
    </div>
  );
}

function Row({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  return (
    <div className="hw-in" style={{ animationDelay: `${d}ms` }}>
      {children}
    </div>
  );
}

export function Readout({ step, motion, className = "bottom-[3%] right-[2%] w-[62%] max-w-[330px]" }: { step: number; motion: boolean; className?: string }) {
  const tag = ["INCOMING CALL", "LIVE STREAM", "AGENT REASONING", "AGENT RESPONSE"][step];
  return (
    <div
      key={step}
      className={`hw-card absolute ${className} rounded-2xl border border-[#0a0a0b]/10 bg-white/75 p-4 shadow-[0_24px_60px_-24px_rgba(10,10,11,.35)] backdrop-blur-md sm:p-5`}
    >
      <div className={`${mono} flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#7c7c84]`}>
        <span className="flex items-center gap-2 text-[#0a0a0b]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9a6a44] opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#9a6a44]" />
          </span>
          {tag}
        </span>
        <span>0{step + 1} / 04</span>
      </div>

      <div className="mt-3 font-[family-name:var(--font-inter)] text-[#0a0a0b]">
        {step === 0 && (
          <div className="space-y-3">
            <Row>
              <p className="font-[family-name:var(--font-sora)] text-[17px] font-medium tracking-tight">+1 (415) 555-0142</p>
              <p className="mt-0.5 text-[12px] text-[#55555c]">Calling your business line</p>
            </Row>
            <Row d={120}>
              <div className="flex gap-1.5">
                {[
                  { I: Phone, t: "Phone", on: true },
                  { I: Globe, t: "Web", on: false },
                  { I: Smartphone, t: "App", on: false },
                ].map(({ I, t, on }) => (
                  <span
                    key={t}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] ${
                      on ? "border-[#9a6a44]/60 bg-[#9a6a44]/10 text-[#0a0a0b]" : "border-[#0a0a0b]/12 text-[#7c7c84]"
                    }`}
                  >
                    <I aria-hidden size={11} />
                    {t}
                  </span>
                ))}
              </div>
            </Row>
            <Row d={240}>
              <Wave n={22} live={motion} />
              <p className={`${mono} mt-1 text-[10px] uppercase tracking-[0.14em] text-[#12a37a]`}>Answered in 0.8 s</p>
            </Row>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Row>
              <p className={`${mono} text-[34px] font-medium leading-none tracking-tight`}>
                <Counter to={87} run={motion} />
                <span className="ml-1 text-[13px] text-[#7c7c84]">ms</span>
              </p>
              <p className="mt-1 text-[12px] text-[#55555c]">End-to-end voice latency</p>
            </Row>
            <Row d={120}>
              <div className={`${mono} flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#55555c]`}>
                <span>Caller</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#9a6a44] to-[#9a6a44]/10" />
                <span>Edge</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#9a6a44] to-[#9a6a44]/10" />
                <span>Agent</span>
              </div>
            </Row>
            <Row d={240}>
              <p className="text-[12px] text-[#55555c]">Encrypted audio streams in real time. No pauses, no dead air.</p>
            </Row>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Row>
              <p className="rounded-xl bg-[#0a0a0b]/[0.04] px-3 py-2 text-[13px] leading-snug">
                “Can I book a table for Friday at 7?”
              </p>
            </Row>
            <Row d={150}>
              <span className={`${mono} inline-block rounded-full bg-[#9a6a44] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white`}>
                Intent · Book reservation
              </span>
            </Row>
            <ul className="space-y-1.5 text-[12px]">
              {["Check availability", "Create booking", "Send confirmation"].map((t, i) => (
                <li key={t} className="hw-in flex items-center gap-2" style={{ animationDelay: `${350 + i * 380}ms` }}>
                  <span className="hw-tick flex size-4 items-center justify-center rounded-full bg-[#12a37a] text-white" style={{ animationDelay: `${550 + i * 380}ms` }}>
                    <Check aria-hidden size={10} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <Row>
              <p className="rounded-xl rounded-bl-sm bg-[#9a6a44]/10 px-3 py-2 text-[13px] leading-snug">
                “You’re all set for Friday at 7 PM. A confirmation text is on its way.”
              </p>
            </Row>
            <Row d={150}>
              <Wave n={22} live={motion} />
            </Row>
            <Row d={300}>
              <div className="flex items-center justify-between rounded-xl border border-[#0a0a0b]/10 px-3 py-2 text-[12px]">
                <span className="text-[#55555c]">Human handoff</span>
                <span className={`${mono} flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em]`}>
                  <span className="size-1.5 rounded-full bg-[#12a37a]" />
                  On standby
                </span>
              </div>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}

export function HowItWorksStage({ active }: { active: number }) {
  const motion = !useReducedMotion();
  const lit = LIT[active];
  const reverse = active === 3;
  const progress = [0.04, 0.5, 1, 1][active];

  return (
    <div className="relative mx-auto aspect-[600/520] w-full max-w-[640px] select-none">
      {/* Perspective floor grid */}
      <div aria-hidden className="absolute inset-x-[-10%] bottom-0 h-[62%] [perspective:520px]">
        <div
          className="h-full w-full origin-bottom [transform:rotateX(58deg)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,10,11,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(10,10,11,.09) 1px,transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage: "radial-gradient(ellipse 60% 75% at 50% 70%, black 25%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 75% at 50% 70%, black 25%, transparent 78%)",
          }}
        />
      </div>
      <div
        aria-hidden
        className="absolute left-[18%] top-[22%] h-[56%] w-[64%] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(214,160,110,.28), transparent 70%)" }}
      />

      {/* Pipeline path */}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden>
        <defs>
          <linearGradient id="hw-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#c98f5b" />
            <stop offset="1" stopColor="#9a6a44" />
          </linearGradient>
          <filter id="hw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path d={FWD} stroke="#0a0a0b" strokeOpacity=".14" strokeWidth="1.2" strokeDasharray="3 6" />
        <path
          d={FWD}
          stroke="url(#hw-line)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: 1 - progress, transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <path
          d={FWD}
          stroke="#e0a56e"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          filter="url(#hw-glow)"
          opacity=".55"
          style={{ strokeDashoffset: 1 - progress, transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
        {/* Voice packets: caller → agent while streaming / thinking, agent → caller while replying */}
        {motion &&
          (active === 1 || active === 2 || active === 3) &&
          [0, 1, 2, 3, 4].map((i) => (
            <circle key={`${reverse}-${i}`} r="3.2" fill="#9a6a44">
              <animateMotion
                dur="2.2s"
                begin={`${i * 0.44}s`}
                repeatCount="indefinite"
                path={reverse ? BACK : FWD}
                keyPoints={active === 2 ? "0;0.55" : "0;1"}
                keyTimes="0;1"
                calcMode="linear"
              />
              <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" begin={`${i * 0.44}s`} repeatCount="indefinite" />
            </circle>
          ))}
      </svg>

      {/* Nodes */}
      {NODES.map((n, i) => {
        const on = i === lit;
        const passed = i < lit;
        const sub =
          i === 0 ? "Phone · Web · App" : i === 1 ? "Under 100 ms" : AGENT_STATE[active];
        return (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
          >
            <div className={motion ? "hw-float" : ""} style={{ animationDelay: `${i * -1.3}s` }}>
              {on && motion && (
                <>
                  <span aria-hidden className="hw-ring absolute inset-0 rounded-2xl border border-[#9a6a44]/50" />
                  <span aria-hidden className="hw-ring absolute inset-0 rounded-2xl border border-[#9a6a44]/40" style={{ animationDelay: "0.9s" }} />
                </>
              )}
              <div
                className={`relative w-[clamp(84px,21vw,128px)] rounded-2xl border p-2.5 text-center backdrop-blur-md transition-all duration-700 sm:p-3 ${
                  on
                    ? "border-[#9a6a44]/70 bg-white shadow-[0_0_0_4px_rgba(154,106,68,.10),0_22px_50px_-18px_rgba(154,106,68,.55)]"
                    : passed
                      ? "border-[#9a6a44]/35 bg-white/80 shadow-[0_14px_30px_-18px_rgba(10,10,11,.3)]"
                      : "border-[#0a0a0b]/12 bg-white/55 shadow-[0_14px_30px_-18px_rgba(10,10,11,.25)]"
                }`}
              >
                <span
                  className={`mx-auto flex size-8 items-center justify-center rounded-xl transition-colors duration-700 sm:size-10 ${
                    on ? "bg-[#9a6a44] text-white" : "bg-[#0a0a0b]/[0.05] text-[#0a0a0b]"
                  }`}
                >
                  <n.Icon aria-hidden size={18} strokeWidth={1.5} />
                </span>
                <p className="mt-2 font-[family-name:var(--font-sora)] text-[11px] font-medium leading-tight tracking-tight text-[#0a0a0b] sm:text-[12.5px]">
                  {n.label}
                </p>
                <p className={`${mono} mt-1 text-[8.5px] uppercase tracking-[0.12em] text-[#7c7c84] sm:text-[9.5px]`}>{sub}</p>
              </div>
            </div>
          </div>
        );
      })}

      <Readout step={active} motion={motion} />
    </div>
  );
}
