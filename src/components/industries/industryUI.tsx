"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { CanvasTexture, Group, SRGBColorSpace } from "three";
import type { IndustryId } from "./industries";

/**
 * Aurlynn's live-call interface, drawn onto in-scene displays.
 * One loop (≈14 s) shows the whole story: listen → understand → respond → action completed.
 * It is time-driven (not scroll-driven) so it keeps "working" while the visitor reads.
 */

const GREEN = "#12a37a";
const LOOP = 14;

export type LiveUi = {
  heading: string;
  caller: string;
  channel: string;
  ask: string;
  reply: string;
  fields: [string, string][];
  done: string;
  tag: string;
  accent: string;
  card: string;
};

export const LIVE_UI: Record<IndustryId, LiveUi> = {
  automotive: {
    heading: "Test drive enquiry",
    caller: "R. Mehta · +1 (415) 555-0142",
    channel: "Phone",
    ask: "“I’m interested in the GT Coupe. Can I book a test drive this weekend?”",
    reply: "“Of course. I have Saturday at 11:00 available. Shall I confirm it?”",
    fields: [
      ["Interest", "GT Coupe · Hybrid"],
      ["Budget", "$85k – $95k"],
      ["Lead", "High intent"],
      ["Test drive", "Sat · 11:00 AM"],
    ],
    done: "Test drive booked · Sat 11:00",
    tag: "Test drive booked · Sat 11:00",
    accent: "#c9772f",
    card: "TEST DRIVE LEAD",
  },
  "real-estate": {
    heading: "Viewing request",
    caller: "A. Rossi · +1 (310) 555-0188",
    channel: "Phone",
    ask: "“Is the four-bedroom villa still available? I’d like to see it.”",
    reply: "“Yes, it is. I can offer a private viewing on Saturday at 4 PM.”",
    fields: [
      ["Property", "Villa · 4 bedrooms"],
      ["Budget", "$1.2M – $1.4M"],
      ["Lead", "Pre-approved"],
      ["Viewing", "Sat · 4:00 PM"],
    ],
    done: "Viewing confirmed · Sat 4 PM",
    tag: "Viewing confirmed · Sat 4 PM",
    accent: "#2f8a86",
    card: "VIEWING LEAD",
  },
  healthcare: {
    heading: "Appointment request",
    caller: "S. Patel · +1 (212) 555-0119",
    channel: "Phone",
    ask: "“I need a check-up with Dr. Lee next week, mornings if possible.”",
    reply: "“Dr. Lee has Tuesday at 9:30. Shall I book that for you?”",
    fields: [
      ["Service", "General check-up"],
      ["Clinician", "Dr. Lee"],
      ["Insurance", "Verified"],
      ["Slot", "Tue · 9:30 AM"],
    ],
    done: "Booked · reminder scheduled",
    tag: "Booked · reminder set",
    accent: "#12a37a",
    card: "PATIENT BOOKING",
  },
  education: {
    heading: "Admissions enquiry",
    caller: "M. Chen · +44 20 5550 0147",
    channel: "Phone",
    ask: "“What are the entry requirements for the MSc in Data Science?”",
    reply: "“I’ll share the requirements and book you a counselling call.”",
    fields: [
      ["Programme", "MSc Data Science"],
      ["Intake", "September"],
      ["Status", "Application started"],
      ["Counselling", "Thu · 3:00 PM"],
    ],
    done: "Counselling booked · Thu 3 PM",
    tag: "Counselling booked · Thu 3 PM",
    accent: "#3f6fa8",
    card: "APPLICANT PROFILE",
  },
};

type Fonts = { sans: string; mono: string };
let fontCache: Fonts | null = null;
export function fonts(): Fonts {
  if (!fontCache) {
    const cs = getComputedStyle(document.documentElement);
    const pick = (name: string, fb: string) => {
      const v = cs.getPropertyValue(name).trim();
      return v ? `${v}, ${fb}` : fb;
    };
    fontCache = { sans: pick("--font-inter", "system-ui, sans-serif"), mono: pick("--font-jetbrains", "ui-monospace, monospace") };
  }
  return fontCache;
}

type Ctx = CanvasRenderingContext2D;
export function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
export function txt(c: Ctx, s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = "left") {
  c.font = font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "alphabetic";
  c.fillText(s, x, y);
}
export function refresh(tex: CanvasTexture) {
  tex.needsUpdate = true;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Where in the 14 s loop are we? */
export function phaseOf(time: number) {
  return time % LOOP;
}

function wrapText(c: Ctx, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (c.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function drawLive(c: Ctx, ui: LiveUi, time: number) {
  const F = fonts();
  const W = 960;
  const H = 540;
  const ph = phaseOf(time);
  const stage = ph < 3.6 ? 0 : ph < 5.6 ? 1 : ph < 10 ? 2 : 3;
  const talking = stage === 0;
  const speaking = stage === 2;
  const A = ui.accent;
  const INK = "#1f1a16";
  const MUTED = "#7a6e63";
  const LINE = "#e6dccd";

  c.clearRect(0, 0, W, H);
  rr(c, 0, 0, W, H, 26);
  c.fillStyle = "#fcf9f4";
  c.fill();
  // accent band along the top, ties the screen to the scene's colour
  c.save();
  rr(c, 0, 0, W, H, 26);
  c.clip();
  c.fillStyle = A;
  c.fillRect(0, 0, W, 8);
  c.restore();

  // header
  c.save();
  c.translate(34, 26);
  c.scale(1.1, 1.1);
  c.fillStyle = INK;
  c.fill(new Path2D("M16 2 28 24H4L16 2Z"));
  c.strokeStyle = "#fcf9f4";
  c.lineWidth = 1.6;
  c.stroke(new Path2D("M4 24 16 14l12 10"));
  c.restore();
  c.letterSpacing = "5px";
  txt(c, "AURLYNN", 78, 58, `600 22px ${F.sans}`, INK);
  c.letterSpacing = "0px";
  const blink = Math.floor(time * 1.6) % 2 === 0;
  c.beginPath();
  c.arc(W - 232, 51, 7, 0, Math.PI * 2);
  c.fillStyle = blink ? "#e5483a" : "#f0b4ac";
  c.fill();
  const secs = Math.floor(ph * 3.2) + 8;
  txt(c, `LIVE CALL  00:${String(secs).padStart(2, "0")}`, W - 214, 58, `600 20px ${F.mono}`, "#4a4037");
  c.strokeStyle = LINE;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(34, 84);
  c.lineTo(W - 34, 84);
  c.stroke();

  // caller + status chips
  txt(c, ui.heading, 40, 128, `700 32px ${F.sans}`, INK);
  txt(c, `${ui.caller}  ·  ${ui.channel}`, 40, 158, `500 19px ${F.sans}`, MUTED);
  const chips = ["LISTENING", "UNDERSTANDING", "RESPONDING", "COMPLETED"];
  let cx = 40;
  chips.forEach((n, i) => {
    c.font = `600 15px ${F.mono}`;
    const w = c.measureText(n).width + 30;
    const col = i === 3 ? GREEN : A;
    rr(c, cx, 182, w, 34, 17);
    if (i === stage) {
      c.globalAlpha = 0.16;
      c.fillStyle = col;
      c.fill();
      c.globalAlpha = 1;
      c.strokeStyle = col;
      c.lineWidth = 2;
      c.stroke();
    } else {
      c.strokeStyle = LINE;
      c.lineWidth = 2;
      c.stroke();
    }
    txt(c, n, cx + 15, 205, `600 15px ${F.mono}`, i === stage ? col : "#a99d90");
    cx += w + 10;
  });

  // conversation
  c.font = `500 25px ${F.sans}`;
  const askN = Math.floor(ui.ask.length * seg(ph, 0.3, 3.3));
  const askLines = wrapText(c, ui.ask.slice(0, askN), 520);
  txt(c, "CUSTOMER", 40, 262, `600 15px ${F.mono}`, MUTED);
  c.font = `500 25px ${F.sans}`;
  askLines.forEach((l, i) => txt(c, l, 40, 296 + i * 34, `500 25px ${F.sans}`, INK));
  if (talking && blink) txt(c, "▍", 40 + (askLines.length ? c.measureText(askLines[askLines.length - 1]).width : 0) + 4, 296 + Math.max(0, askLines.length - 1) * 34, `500 25px ${F.sans}`, A);

  const replyN = Math.floor(ui.reply.length * seg(ph, 5.8, 9.4));
  if (replyN > 0) {
    c.font = `500 25px ${F.sans}`;
    txt(c, "AURLYNN", 40, 382, `600 15px ${F.mono}`, GREEN);
    wrapText(c, ui.reply.slice(0, replyN), 520).forEach((l, i) => txt(c, l, 40, 416 + i * 34, `500 25px ${F.sans}`, "#0a6b4f"));
  }

  // waveform
  const bars = 44;
  const amp = talking ? 1 : speaking ? 1 : stage === 1 ? 0.2 : 0.08;
  for (let i = 0; i < bars; i++) {
    const x = 40 + i * 12.4;
    const env = 0.4 + 0.6 * Math.sin((i / bars) * Math.PI);
    const h = 4 + amp * 22 * env * Math.abs(Math.sin(time * 6.5 + i * 0.75));
    rr(c, x, 496 - h / 2, 6, h, 3);
    c.fillStyle = speaking ? GREEN : stage === 3 ? "#d8cdbf" : A;
    c.fill();
  }

  // lead / appointment card
  rr(c, 610, 112, 316, 300, 22);
  c.fillStyle = "#f4ece0";
  c.fill();
  c.strokeStyle = LINE;
  c.lineWidth = 2;
  c.stroke();
  txt(c, ui.card, 632, 148, `600 16px ${F.mono}`, MUTED);
  ui.fields.forEach(([k, v], i) => {
    const a = seg(ph, 3.8 + i * 0.5, 4.3 + i * 0.5);
    if (a <= 0) return;
    const y = 192 + i * 56;
    c.globalAlpha = a;
    txt(c, k.toUpperCase(), 632, y, `600 14px ${F.mono}`, "#8f8478");
    const last = i === ui.fields.length - 1;
    txt(c, v, 632, y + 26, `700 21px ${F.sans}`, last && stage === 3 ? "#0a8a65" : INK);
    c.globalAlpha = 1;
  });

  // completed action
  const d = seg(ph, 10, 10.6);
  if (d > 0) {
    c.globalAlpha = d;
    rr(c, 610, 432, 316, 64, 20);
    c.fillStyle = "#e1f4ec";
    c.fill();
    c.strokeStyle = GREEN;
    c.lineWidth = 2;
    c.stroke();
    c.beginPath();
    c.arc(642, 464, 14, 0, Math.PI * 2);
    c.fillStyle = GREEN;
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(635, 464);
    c.lineTo(640, 470);
    c.lineTo(650, 458);
    c.stroke();
    txt(c, ui.done, 668, 471, `700 17px ${F.sans}`, "#0a6b4f");
    c.globalAlpha = 1;
  }
}

/** Texture + redraw loop for one display (≈10 fps). */
export function useLiveTexture(industry: IndustryId, animate: boolean) {
  const screen = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext("2d")!;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return { ctx, tex };
  }, []);
  const last = useRef(-1);
  useEffect(() => {
    // static fallback frame (reduced motion): show the completed state
    if (!animate) {
      drawLive(screen.ctx, LIVE_UI[industry], 11);
      refresh(screen.tex);
    }
  }, [animate, industry, screen]);
  useEffect(() => () => screen.tex.dispose(), [screen]);
  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime;
    if (t - last.current < 0.1) return;
    last.current = t;
    drawLive(screen.ctx, LIVE_UI[industry], t);
    refresh(screen.tex);
  });
  return screen.tex;
}

/** In-scene display: slim bezel + live Aurlynn interface. Units are metres; `w` is the width. */
export function LiveScreen({
  industry,
  animate,
  w = 3.2,
  position,
  rotation,
  bezel = "#2a2420",
  children,
}: {
  industry: IndustryId;
  animate: boolean;
  w?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  bezel?: string;
  children?: React.ReactNode;
}) {
  const tex = useLiveTexture(industry, animate);
  const h = (w * 540) / 960;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.08]} />
        <meshStandardMaterial color={bezel} roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent alphaTest={0.5} />
      </mesh>
      {children}
    </group>
  );
}

function drawTag(ctx: Ctx, industry: IndustryId) {
  const F = fonts();
  ctx.clearRect(0, 0, 640, 112);
  rr(ctx, 4, 8, 632, 96, 48);
  ctx.fillStyle = "rgba(255,255,255,.94)";
  ctx.fill();
  ctx.strokeStyle = "rgba(18,163,122,.55)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(52, 56, 20, 0, Math.PI * 2);
  ctx.fillStyle = GREEN;
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(43, 56);
  ctx.lineTo(50, 63);
  ctx.lineTo(62, 48);
  ctx.stroke();
  txt(ctx, LIVE_UI[industry].tag, 90, 68, `600 29px ${F.sans}`, "#14110f");
}

/** A small floating confirmation that pops in when the action completes. */
export function Tag({ industry, position }: { industry: IndustryId; position: [number, number, number] }) {
  const { ctx, tex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 112;
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return { ctx: canvas.getContext("2d")!, tex: t };
  }, []);
  const g = useRef<Group>(null);
  useEffect(() => {
    drawTag(ctx, industry);
    refresh(tex);
    return () => tex.dispose();
  }, [ctx, tex, industry]);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const ph = phaseOf(clock.elapsedTime);
    const on = seg(ph, 10, 10.7) * (1 - seg(ph, 13.4, 14));
    g.current.scale.setScalar(Math.max(0.0001, on));
  });
  return (
    <Billboard position={position}>
      <group ref={g} scale={0.0001}>
        <mesh renderOrder={10}>
          <planeGeometry args={[2.1, 0.37]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} depthTest={false} />
        </mesh>
      </group>
    </Billboard>
  );
}
