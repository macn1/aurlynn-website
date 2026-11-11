"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { CalendarDays, ClipboardCheck, CreditCard, HeartPulse, Landmark, Pause, Play, Zap } from "lucide-react";
import { useReveal } from "@/components/animations/useReveal";
import manifest from "./manifest.json";

type Id = keyof typeof manifest;

const CARDS: {
  id: Id;
  title: string;
  body: string;
  tag: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
}[] = [
  { id: "ivr", title: "IVR replacement", body: "Answer inbound calls without a phone tree, from order status to fraud disputes.", tag: "Banking · Account question", icon: Landmark },
  { id: "appointment", title: "Appointment scheduling", body: "Book, confirm, and reschedule appointments, including the ones a patient can’t afford to miss.", tag: "Healthcare · Appointment reminder", icon: CalendarDays },
  { id: "afterhours", title: "After-hours & overflow coverage", body: "Cover nights, weekends, and surges, when the most urgent calls tend to come in.", tag: "Utilities · Storm outage", icon: Zap },
  { id: "verification", title: "Verification & data collection", body: "Collect and verify details on the call, from identity checks to insurance claims.", tag: "Government · Income verification", icon: ClipboardCheck },
  { id: "payments", title: "Payments, billing, & collections", body: "Take payments over the phone and work every past-due account.", tag: "Healthcare · Billing", icon: CreditCard },
  { id: "patientcare", title: "Patient care coordination", body: "Arrange rides to treatment, follow up after discharge, and answer questions about care.", tag: "Healthcare · Post-op check-in", icon: HeartPulse },
];

const BARS = 38;
/** Deterministic, speech-like bar heights (no randomness → no hydration mismatch). */
function bars(seed: number) {
  return Array.from({ length: BARS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.9 + seed) * Math.cos(i * 0.37 + seed * 2.1));
    const env = 0.45 + 0.55 * Math.sin((i / (BARS - 1)) * Math.PI);
    return Math.round(18 + 82 * v * env);
  });
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VoiceUseCases() {
  const root = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [active, setActive] = useState<Id | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  useReveal(root);

  const shapes = useMemo(() => CARDS.map((_, i) => bars(i * 1.7 + 0.6)), []);

  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    audio.current = a;
    const onTime = () => setTime(a.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setTime(0);
      setActive(null);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    return () => {
      a.pause();
      a.removeAttribute("src");
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
    };
  }, []);

  const toggle = useCallback(
    (id: Id) => {
      const a = audio.current;
      if (!a) return;
      if (active === id) {
        if (a.paused) void a.play().catch(() => undefined);
        else a.pause();
        return;
      }
      a.pause();
      a.src = `/audio/${id}.wav`;
      a.currentTime = 0;
      setActive(id);
      setTime(0);
      void a.play().catch(() => {
        setPlaying(false);
        setActive(null);
      });
    },
    [active],
  );

  const seek = (id: Id, ratio: number) => {
    const a = audio.current;
    if (!a) return;
    if (active !== id) {
      a.pause();
      a.src = `/audio/${id}.wav`;
      setActive(id);
    }
    a.currentTime = ratio * manifest[id].duration;
    setTime(a.currentTime);
    void a.play().catch(() => undefined);
  };

  return (
    <section ref={root} id="voice" aria-labelledby="voice-heading" className="section-x bg-background py-[clamp(1.25rem,2.6vw,2.25rem)]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p data-reveal className="eyebrow-sm">Hear it live</p>
          <h2 id="voice-heading" data-reveal className="display-section mt-[calc(var(--u)*1)] text-[max(1.4rem,calc(var(--u)*2.4))]">
            One platform for every call.
          </h2>
        </div>
      </div>

      <ul className="mt-[calc(var(--u)*1.4)] grid gap-[max(8px,calc(var(--u)*0.8))] sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, n) => {
          const m = manifest[c.id];
          const on = active === c.id;
          const progress = on ? Math.min(1, time / m.duration) : 0;
          const cue = on ? [...m.cues].reverse().find((q) => time >= q.start - 0.05) : undefined;
          const Icon = c.icon;
          return (
            <li key={c.id} data-reveal className="flex flex-col border border-border bg-surface p-[max(12px,calc(var(--u)*1.1))] transition-shadow duration-300 hover:shadow-[0_14px_40px_-20px_rgba(120,80,40,0.28)]">
              <h3 className="font-display text-[max(0.9rem,calc(var(--u)*1.15))] font-medium leading-tight tracking-[-0.015em]">{c.title}</h3>
              <p className="mt-1 text-[max(0.7rem,calc(var(--u)*0.88))] leading-snug text-secondary">{c.body}</p>

              <div className="mt-[calc(var(--u)*1)] flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-label={`${on && playing ? "Pause" : "Play"} sample call: ${c.title}`}
                  aria-pressed={on && playing}
                  className={`inline-flex size-8 shrink-0 items-center justify-center border transition-colors duration-200 ${
                    on ? "border-foreground bg-foreground text-white" : "border-foreground/70 text-foreground hover:bg-foreground hover:text-white"
                  }`}
                >
                  {on && playing ? <Pause size={12} fill="currentColor" aria-hidden /> : <Play size={15} fill="currentColor" aria-hidden className="translate-x-px" />}
                </button>
                <div
                  className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-[2px]"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    seek(c.id, Math.min(0.98, Math.max(0, (e.clientX - r.left) / r.width)));
                  }}
                  aria-hidden
                >
                  {shapes[n].map((h, i) => {
                    const done = i / BARS < progress;
                    return <span key={i} style={{ height: `${h}%` }} className={`min-w-0 flex-1 rounded-full transition-colors duration-150 ${done ? "bg-accent" : "bg-[#d9d2c9]"}`} />;
                  })}
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-secondary">{on ? fmt(time) : fmt(m.duration)}</span>
              </div>

              {/* live caption: who is speaking, and what they say */}
              <div className="mt-1.5 min-h-[2.5em] text-[max(0.68rem,calc(var(--u)*0.82))] leading-snug" aria-live="polite">
                {cue && (
                  <p key={cue.start}>
                    <span className={`mr-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${cue.who === "a" ? "text-accent" : "text-muted"}`}>{cue.who === "a" ? "Aurlynn" : "Caller"}</span>
                    <span className="text-foreground/85">{cue.text}</span>
                  </p>
                )}
              </div>

              <p className="mt-auto flex items-center gap-2 border-t border-border/70 pt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-secondary">
                <span className="inline-flex size-5 items-center justify-center bg-accent-light/45 text-accent">
                  <Icon size={11} strokeWidth={1.7} aria-hidden />
                </span>
                {c.tag}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
