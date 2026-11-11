"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, Lightformer, Line } from "@react-three/drei";
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * "How it works" 3D stage: a precise, architectural diorama of the call path.
 *
 *   CUSTOMER (phone)  →  EDGE NETWORK (routing topology)  →  AURLYNN AGENT (listen · understand · act · respond)
 *                                  response returns to the customer along its own lane
 *
 * Everything is driven by one smoothed scroll coordinate `v` (0..4, one unit per step),
 * so every light, packet and screen state is a pure function of scroll position.
 */

/* ───────────────────────── tokens & helpers ───────────────────────── */

const AMBER = "#e0a56e";
const BROWN = "#9a6a44";
const TITANIUM = "#3b3631";
const GREEN = "#12a37a";
const INK = "#0a0a0b";

const sm = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const bump = (a: number, b: number, e: number, x: number) => sm(a - e, a, x) * (1 - sm(b, b + e, x));

type V3 = [number, number, number];
type SRef = MutableRefObject<number>; // smoothed step coordinate, 0..4

const cache = new Map<string, BufferGeometry>();
function geo(key: string, make: () => BufferGeometry) {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
}
const cyl = (r: number, h: number) => geo(`y${r}_${h}`, () => new CylinderGeometry(r, r, h, 64));
const rbox = (w: number, h: number, d: number, r: number) =>
  geo(`b${w}_${h}_${d}_${r}`, () => new RoundedBoxGeometry(w, h, d, 5, r));
const torus = (r: number, t: number) => geo(`t${r}_${t}`, () => new TorusGeometry(r, t, 8, 96));

/* ───────────────────────── polyline routing ───────────────────────── */

class PolyPath {
  pts: Vector3[];
  cum: number[] = [0];
  len: number;
  constructor(p: V3[]) {
    this.pts = p.map((q) => new Vector3(...q));
    for (let i = 1; i < this.pts.length; i++) this.cum.push(this.cum[i - 1] + this.pts[i].distanceTo(this.pts[i - 1]));
    this.len = this.cum[this.cum.length - 1];
  }
  /** Writes the point at fraction u into `out`; returns the heading (rotation.y) of that segment. */
  at(u: number, out: Vector3) {
    const d = MathUtils.clamp(u, 0, 1) * this.len;
    let i = 1;
    while (i < this.cum.length - 1 && this.cum[i] < d) i++;
    const a = this.pts[i - 1];
    const b = this.pts[i];
    const seg = this.cum[i] - this.cum[i - 1] || 1;
    out.lerpVectors(a, b, (d - this.cum[i - 1]) / seg);
    return Math.atan2(-(b.z - a.z), b.x - a.x);
  }
  ratio(index: number) {
    return this.cum[index] / this.len;
  }
  /** Even resample that keeps every corner, for fat-line rendering. */
  dense(step = 0.12) {
    const out: Vector3[] = [this.pts[0].clone()];
    for (let i = 1; i < this.pts.length; i++) {
      const a = this.pts[i - 1];
      const b = this.pts[i];
      const n = Math.max(1, Math.round(a.distanceTo(b) / step));
      for (let k = 1; k <= n; k++) out.push(new Vector3().lerpVectors(a, b, k / n));
    }
    return out;
  }
}

// Module anchors on the deck.
const CALLER_AT: V3 = [-5.6, 0, 1.3];
const AGENT_AT: V3 = [5.6, 0, -1.3];
const Y0 = 0.025; // trace height on the deck
const Y1 = 0.215; // trace height on the edge platform

// Forward route: caller → edge (through its topology) → agent.
const FWD = new PolyPath([
  [-4.3, Y0, 1.0],
  [-3.3, Y0, 1.0],
  [-3.3, Y0, 0],
  [-2.55, Y0, 0],
  [-2.4, Y1, 0], // 4: edge entry
  [-1.75, Y1, 0],
  [-0.9, Y1, 0],
  [0, Y1, 0],
  [0.9, Y1, 0],
  [1.75, Y1, 0],
  [2.4, Y1, 0], // 10: edge exit
  [2.55, Y0, 0],
  [3.3, Y0, 0],
  [3.3, Y0, -1.3],
  [4.2, Y0, -1.3],
]);
const A_END = FWD.ratio(4);
const E_EXIT = FWD.ratio(10);

// Return route: agent → caller, on its own lane behind the edge.
const BACK = new PolyPath([
  [5.6, Y0, -2.75],
  [5.6, Y0, -3.3],
  [-5.6, Y0, -3.3],
  [-5.6, Y0, -0.15],
]);

/** How far along the forward route the signal has travelled at scroll position v. */
function flowMax(v: number) {
  if (v < 1) return MathUtils.lerp(0.02, A_END, sm(0.05, 0.95, v));
  if (v < 2) return MathUtils.lerp(A_END, E_EXIT, sm(1, 1.9, v));
  return MathUtils.lerp(E_EXIT, 1, sm(2, 2.35, v));
}

/* ───────────────────────── canvas-drawn screens ───────────────────────── */

type Fonts = { sans: string; mono: string };
let fontCache: Fonts | null = null;
function fonts(): Fonts {
  if (!fontCache) {
    const cs = getComputedStyle(document.documentElement);
    const pick = (name: string, fb: string) => {
      const v = cs.getPropertyValue(name).trim();
      return v ? `${v}, ${fb}` : fb;
    };
    fontCache = {
      sans: pick("--font-inter", "system-ui, sans-serif"),
      mono: pick("--font-jetbrains", "ui-monospace, monospace"),
    };
  }
  return fontCache;
}

type Ctx = CanvasRenderingContext2D;
function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}
function txt(c: Ctx, s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = "left") {
  c.font = font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "alphabetic";
  c.fillText(s, x, y);
}

function refresh(tex: CanvasTexture) {
  tex.needsUpdate = true;
}

/** One redraw callback per screen; the texture refreshes ~12×/s from the scroll coordinate. */
function useScreen(w: number, h: number, draw: (c: Ctx, v: number, t: number) => void, s: SRef, fps = 12) {
  const screen = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return { ctx, tex };
  }, [w, h]);
  const last = useRef(-1);
  useEffect(() => () => screen.tex.dispose(), [screen]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (t - last.current < 1 / fps) return;
    last.current = t;
    draw(screen.ctx, s.current, t);
    refresh(screen.tex);
  });
  return screen.tex;
}

/* Phone: live call interface ------------------------------------------------ */
function drawPhone(c: Ctx, v: number, t: number) {
  const F = fonts();
  const W = 520;
  const H = 1060;
  const ringing = 1 - sm(0.45, 0.9, v);
  const talk = sm(0.05, 0.35, v) * (1 - sm(2.2, 2.6, v));
  const reply = sm(3.0, 3.3, v);
  c.clearRect(0, 0, W, H);
  rr(c, 0, 0, W, H, 56);
  c.fillStyle = "#0e0c0a";
  c.fill();

  txt(c, "AURLYNN · INBOUND", 40, 74, `500 21px ${F.mono}`, "#8c8279");
  txt(c, "SRTP", W - 40, 74, `500 21px ${F.mono}`, reply > 0.5 ? GREEN : AMBER, "right");

  // avatar with a ripple while ringing
  const cx = W / 2;
  const cy = 262;
  if (ringing > 0.05) {
    const k = (t * 0.9) % 1;
    c.strokeStyle = `rgba(224,165,110,${(1 - k) * 0.5 * ringing})`;
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cy, 78 + k * 44, 0, Math.PI * 2);
    c.stroke();
  }
  c.beginPath();
  c.arc(cx, cy, 76, 0, Math.PI * 2);
  c.fillStyle = "#1c1814";
  c.fill();
  c.strokeStyle = reply > 0.5 ? GREEN : AMBER;
  c.lineWidth = 3;
  c.stroke();
  txt(c, "C", cx, cy + 20, `600 58px ${F.sans}`, "#f4efe7", "center");

  txt(c, "Customer", cx, 408, `600 44px ${F.sans}`, "#f4efe7", "center");
  txt(c, "+1 (415) 555-0142", cx, 452, `400 27px ${F.sans}`, "#8c8279", "center");

  // call state + duration
  if (ringing > 0.5) {
    const a = 0.55 + 0.45 * Math.abs(Math.sin(t * 4));
    txt(c, "Incoming call…", cx, 510, `500 28px ${F.sans}`, `rgba(224,165,110,${a})`, "center");
  } else {
    const dur = Math.round(sm(0.3, 3.7, v) * 47);
    const mm = String(Math.floor(dur / 60)).padStart(2, "0");
    const ss = String(dur % 60).padStart(2, "0");
    c.beginPath();
    c.arc(cx - 96, 502, 7, 0, Math.PI * 2);
    c.fillStyle = GREEN;
    c.fill();
    txt(c, "Connected", cx - 78, 512, `500 28px ${F.sans}`, "#f4efe7", "left");
    txt(c, `${mm}:${ss}`, cx + 150, 512, `500 30px ${F.mono}`, "#cfc6ba", "right");
  }

  // live waveform
  txt(c, reply > 0.5 ? "AURLYNN AI" : "CUSTOMER", 40, 584, `500 19px ${F.mono}`, "#8c8279");
  const bars = 30;
  const amp = ringing * 5 + talk * 46 + reply * 46;
  for (let i = 0; i < bars; i++) {
    const x = 40 + (i / (bars - 1)) * (W - 80);
    const env = 0.35 + 0.65 * Math.sin((i / (bars - 1)) * Math.PI);
    const h = 6 + amp * env * (0.35 + 0.65 * Math.abs(Math.sin(t * 7 + i * 0.9)));
    rr(c, x - 4, 660 - h, 8, h * 2, 4);
    c.fillStyle = reply > 0.5 ? GREEN : AMBER;
    c.fill();
  }

  // transmission indicator
  rr(c, 36, 746, W - 72, 76, 20);
  c.fillStyle = "#171310";
  c.fill();
  txt(c, "VOICE · ENCRYPTED", 62, 792, `500 20px ${F.mono}`, "#cfc6ba");
  const dir = reply > 0.5 ? -1 : 1;
  for (let k = 0; k < 3; k++) {
    const ph = (((t * 1.4 - k * 0.25) % 1) + 1) % 1;
    c.fillStyle = `rgba(${reply > 0.5 ? "18,163,122" : "224,165,110"},${0.25 + 0.75 * (1 - ph)})`;
    const x = W - 118 + (dir === 1 ? k : 2 - k) * 22;
    c.beginPath();
    if (dir === 1) {
      c.moveTo(x, 770);
      c.lineTo(x + 14, 780);
      c.lineTo(x, 790);
    } else {
      c.moveTo(x + 14, 770);
      c.lineTo(x, 780);
      c.lineTo(x + 14, 790);
    }
    c.closePath();
    c.fill();
  }

  // channels
  ["Phone", "Web", "App"].forEach((n, i) => {
    const w = 140;
    const x = 36 + i * (w + 14);
    rr(c, x, 852, w, 56, 28);
    if (i === 0) {
      c.fillStyle = "rgba(224,165,110,.16)";
      c.fill();
      c.strokeStyle = AMBER;
      c.lineWidth = 2;
      c.stroke();
    } else {
      c.strokeStyle = "#3a342e";
      c.lineWidth = 2;
      c.stroke();
    }
    txt(c, n, x + w / 2, 888, `500 23px ${F.sans}`, i === 0 ? "#f4efe7" : "#8c8279", "center");
  });

  // call controls
  [150, 260, 370].forEach((x, i) => {
    c.beginPath();
    c.arc(x, 968, 36, 0, Math.PI * 2);
    c.fillStyle = i === 2 ? "#c2392b" : "#1c1814";
    c.fill();
    c.fillStyle = "#f4efe7";
    if (i === 0) {
      rr(c, x - 6, 950, 12, 26, 6);
      c.fill();
    }
    if (i === 1) {
      for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) c.fillRect(x - 15 + q * 12, 953 + r * 12, 7, 7);
    }
    if (i === 2) {
      rr(c, x - 16, 962, 32, 9, 4);
      c.fill();
    }
  });
}

/* Edge: router readout ------------------------------------------------------ */
function drawEdge(c: Ctx, v: number, t: number) {
  const F = fonts();
  const W = 640;
  const H = 200;
  const lat = Math.round(87 * sm(0.9, 1.7, v));
  const hot = bump(0.9, 2.1, 0.4, v);
  c.clearRect(0, 0, W, H);
  rr(c, 0, 0, W, H, 22);
  c.fillStyle = "#14110f";
  c.fill();
  c.strokeStyle = hot > 0.2 ? AMBER : "#3a342e";
  c.lineWidth = 2;
  c.stroke();
  txt(c, "EDGE ROUTER", 32, 48, `500 20px ${F.mono}`, "#8c8279");
  txt(c, "TLS 1.3 · SRTP · AES-256", 32, 78, `500 18px ${F.mono}`, hot > 0.2 ? AMBER : "#6b625a");
  txt(c, v < 0.9 ? "—" : String(lat).padStart(3, "0"), 30, 160, `500 84px ${F.mono}`, "#f4efe7");
  txt(c, "ms", 172, 160, `500 26px ${F.mono}`, "#8c8279");
  txt(c, "END-TO-END LATENCY", 232, 160, `500 16px ${F.mono}`, "#6b625a");
  ["SIN", "FRA", "IAD"].forEach((r, i) => {
    const y = 40 + i * 44;
    txt(c, r, 468, y + 14, `500 18px ${F.mono}`, "#8c8279");
    rr(c, 516, y, 92, 12, 6);
    c.fillStyle = "#2a241f";
    c.fill();
    const w = 92 * (0.25 + hot * (0.5 + 0.2 * Math.sin(t * 2 + i)));
    rr(c, 516, y, w, 12, 6);
    c.fillStyle = AMBER;
    c.fill();
  });
}

/* Agent: base plaque ---------------------------------------------------------- */
function drawBase(c: Ctx, v: number, t: number) {
  const F = fonts();
  const W = 640;
  const H = 200;
  c.clearRect(0, 0, W, H);
  rr(c, 0, 0, W, H, 22);
  c.fillStyle = "#14110f";
  c.fill();
  // brand mark
  c.save();
  c.translate(34, 40);
  c.scale(4.2, 4.2);
  c.fillStyle = "#f4efe7";
  c.fill(new Path2D("M16 2 28 24H4L16 2Z"));
  c.strokeStyle = BROWN;
  c.lineWidth = 1.6;
  c.stroke(new Path2D("M4 24 16 14l12 10"));
  c.fillStyle = "#e7c6a4";
  c.beginPath();
  c.arc(16, 19, 2.2, 0, Math.PI * 2);
  c.fill();
  c.restore();
  c.letterSpacing = "8px";
  txt(c, "AURLYNN", 190, 92, `500 40px ${F.sans}`, "#f4efe7");
  c.letterSpacing = "3px";
  txt(c, "VOICE AGENT", 192, 130, `500 18px ${F.mono}`, "#8c8279");
  c.letterSpacing = "0px";
  const states = [
    { t: "STANDBY", c: "#8c8279" },
    { t: "LISTENING", c: AMBER },
    { t: "PROCESSING", c: AMBER },
    { t: "RESPONDING", c: GREEN },
  ];
  const k = v < 1.2 ? 0 : v < 2.3 ? 1 : v < 3.0 ? 2 : 3;
  const st = states[k];
  c.beginPath();
  c.arc(196, 166, 7, 0, Math.PI * 2);
  c.fillStyle = st.c;
  c.globalAlpha = k === 0 ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(t * 4));
  c.fill();
  c.globalAlpha = 1;
  txt(c, st.t, 214, 173, `500 22px ${F.mono}`, st.c);
}

/* Agent: the four processing layers ----------------------------------------- */
const TRANSCRIPT = "“Can I book a table for Friday at 7?”";
const CARD_RANGES: [number, number, number, number][] = [
  // fade-in start, full, fade-out start, gone
  [1.0, 1.3, 2.5, 2.7],
  [2.3, 2.5, 2.75, 2.9],
  [2.6, 2.8, 3.05, 3.2],
  [3.0, 3.25, 99, 100],
];
const cardAct = (i: number, v: number) => {
  const [a, b, c, d] = CARD_RANGES[i];
  return sm(a, b, v) * (1 - sm(c, d, v));
};

function cardFrame(c: Ctx, act: number, num: string, title: string, meta: string) {
  const F = fonts();
  const W = 780;
  const H = 240;
  c.clearRect(0, 0, W, H);
  rr(c, 0, 0, W, H, 26);
  c.fillStyle = "#14110f";
  c.fill();
  c.strokeStyle = act > 0.3 ? AMBER : "#3a342e";
  c.lineWidth = 2.5;
  c.stroke();
  c.beginPath();
  c.arc(40, 46, 7, 0, Math.PI * 2);
  c.fillStyle = act > 0.3 ? AMBER : "#4a423b";
  c.fill();
  c.letterSpacing = "2px";
  txt(c, `${num}  ${title}`, 60, 53, `500 21px ${F.mono}`, act > 0.3 ? "#f4efe7" : "#8c8279");
  txt(c, meta, W - 36, 53, `500 18px ${F.mono}`, "#6b625a", "right");
  c.letterSpacing = "0px";
}

function drawListen(c: Ctx, v: number, t: number) {
  const F = fonts();
  const act = cardAct(0, v);
  cardFrame(c, act, "01", "LISTEN", "ASR · STREAMING");
  const n = Math.floor(TRANSCRIPT.length * sm(1.5, 2.35, v));
  const text = TRANSCRIPT.slice(0, n) + (act > 0.3 && Math.floor(t * 2) % 2 === 0 && n < TRANSCRIPT.length ? "▍" : "");
  txt(c, text, 40, 130, `500 32px ${F.sans}`, "#f4efe7");
  const bars = 40;
  for (let i = 0; i < bars; i++) {
    const h = 4 + act * 22 * Math.abs(Math.sin(t * 6 + i * 0.8)) * (0.4 + 0.6 * Math.sin((i / bars) * Math.PI));
    rr(c, 40 + i * 17.5, 196 - h / 2, 7, h, 3);
    c.fillStyle = act > 0.3 ? AMBER : "#3a342e";
    c.fill();
  }
}

function drawUnderstand(c: Ctx, v: number) {
  const F = fonts();
  const act = cardAct(1, v);
  cardFrame(c, act, "02", "UNDERSTAND", "INTENT · ENTITIES");
  const shown = sm(2.3, 2.55, v);
  if (shown > 0.05) {
    c.globalAlpha = shown;
    rr(c, 40, 86, 332, 50, 25);
    c.fillStyle = BROWN;
    c.fill();
    txt(c, "Intent · Book reservation", 62, 120, `500 25px ${F.sans}`, "#fff");
    txt(c, "CONFIDENCE", 40, 176, `500 17px ${F.mono}`, "#8c8279");
    rr(c, 190, 162, 400, 12, 6);
    c.fillStyle = "#2a241f";
    c.fill();
    rr(c, 190, 162, Math.max(12, 400 * 0.96 * sm(2.35, 2.7, v)), 12, 6);
    c.fillStyle = AMBER;
    c.fill();
    txt(c, `${Math.round(96 * sm(2.35, 2.7, v))}%`, 740, 175, `500 22px ${F.mono}`, "#f4efe7", "right");
    txt(c, "Fri · 7:00 PM · Party of 2", 40, 218, `400 21px ${F.sans}`, "#8c8279");
    c.globalAlpha = 1;
  } else {
    txt(c, "Waiting for utterance…", 40, 130, `400 26px ${F.sans}`, "#4a423b");
  }
}

function drawAct(c: Ctx, v: number, t: number) {
  const F = fonts();
  const act = cardAct(2, v);
  cardFrame(c, act, "03", "ACT", "TOOL EXECUTION");
  ["Check availability", "Create booking", "Send confirmation"].forEach((n, i) => {
    const y = 100 + i * 44;
    const done = sm(2.65 + i * 0.1, 2.76 + i * 0.1, v);
    const prevDone = i === 0 ? 1 : sm(2.65 + (i - 1) * 0.1, 2.76 + (i - 1) * 0.1, v);
    const running = act > 0.3 && done < 0.5 && prevDone > 0.5;
    c.beginPath();
    c.arc(52, y - 8, 13, 0, Math.PI * 2);
    if (done > 0.5) {
      c.fillStyle = GREEN;
      c.fill();
      c.strokeStyle = "#fff";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(45, y - 8);
      c.lineTo(50, y - 3);
      c.lineTo(59, y - 14);
      c.stroke();
    } else {
      c.strokeStyle = running ? AMBER : "#4a423b";
      c.lineWidth = 3;
      if (running) {
        c.beginPath();
        c.arc(52, y - 8, 13, t * 6, t * 6 + Math.PI * 1.3);
      }
      c.stroke();
    }
    txt(c, n, 82, y, `500 26px ${F.sans}`, done > 0.5 ? "#f4efe7" : "#8c8279");
    txt(c, done > 0.5 ? "DONE" : running ? "RUNNING" : "QUEUED", 740, y, `500 17px ${F.mono}`, done > 0.5 ? GREEN : running ? AMBER : "#4a423b", "right");
  });
}

function drawRespond(c: Ctx, v: number, t: number) {
  const F = fonts();
  const act = cardAct(3, v);
  cardFrame(c, act, "04", "RESPOND", "TTS · NEURAL VOICE");
  txt(c, "“You’re all set for Friday at 7 PM.”", 40, 116, `500 30px ${F.sans}`, act > 0.2 ? "#f4efe7" : "#6b625a");
  const bars = 38;
  for (let i = 0; i < bars; i++) {
    const h = 5 + act * 24 * Math.abs(Math.sin(t * 6.5 + i * 0.7)) * (0.4 + 0.6 * Math.sin((i / bars) * Math.PI));
    rr(c, 40 + i * 12.2, 168 - h / 2, 6, h, 3);
    c.fillStyle = act > 0.2 ? GREEN : "#3a342e";
    c.fill();
  }
  rr(c, 520, 150, 224, 52, 26);
  c.strokeStyle = "#3a342e";
  c.lineWidth = 2;
  c.stroke();
  c.beginPath();
  c.arc(548, 176, 6, 0, Math.PI * 2);
  c.fillStyle = GREEN;
  c.fill();
  txt(c, "Human handoff · standby", 562, 183, `500 17px ${F.sans}`, "#cfc6ba");
}

/* ───────────────────────── shared pieces ───────────────────────── */

function drawLabel(ctx: Ctx, text: string, on: boolean) {
  const F = fonts();
  ctx.clearRect(0, 0, 520, 96);
  rr(ctx, 4, 8, 512, 80, 40);
  ctx.fillStyle = on ? INK : "rgba(255,255,255,.88)";
  ctx.fill();
  ctx.strokeStyle = on ? INK : "rgba(10,10,11,.18)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.letterSpacing = "5px";
  txt(ctx, text.toUpperCase(), 262, 60, `500 30px ${F.mono}`, on ? "#ffffff" : "#55555c", "center");
  ctx.letterSpacing = "0px";
}

/** Name tag that always faces the camera. A canvas sprite, so it creates no extra React roots. */
function Label({ text, on, y }: { text: string; on: boolean; y: number }) {
  const { ctx, tex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 520;
    canvas.height = 96;
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return { ctx: canvas.getContext("2d")!, tex: t };
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  useEffect(() => {
    drawLabel(ctx, text, on);
    refresh(tex);
  }, [ctx, tex, text, on]);
  return (
    <Billboard position={[0, y, 0]}>
      <mesh renderOrder={10}>
        <planeGeometry args={[2.6, 0.48]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthTest={false} />
      </mesh>
    </Billboard>
  );
}

type LineLike = { geometry: { instanceCount: number } };
/** A lit route that "draws on" with scroll by limiting how many line segments are rendered. */
function TraceOverlay({ pts, color, width, s, level }: { pts: Vector3[]; color: string; width: number; s: SRef; level: (v: number) => number }) {
  const ref = useRef<LineLike | null>(null);
  const n = pts.length - 1;
  useFrame(() => {
    if (ref.current) ref.current.geometry.instanceCount = Math.floor(n * MathUtils.clamp(level(s.current), 0, 1));
  });
  return (
    <Line
      ref={(r) => {
        ref.current = r as unknown as LineLike | null;
      }}
      points={pts}
      color={color}
      lineWidth={width}
      toneMapped={false}
    />
  );
}

type MatLike = { material: { opacity: number } };
/** Dark module plate; a thin outline lights up when the module is active. */
function Plate({ w, d, h = 0.18, s, level }: { w: number; d: number; h?: number; s: SRef; level: (v: number) => number }) {
  const rim = useRef<MatLike | null>(null);
  const outline = useMemo(() => {
    const x = w / 2 - 0.02;
    const z = d / 2 - 0.02;
    return [new Vector3(-x, h + 0.004, -z), new Vector3(x, h + 0.004, -z), new Vector3(x, h + 0.004, z), new Vector3(-x, h + 0.004, z), new Vector3(-x, h + 0.004, -z)];
  }, [w, d, h]);
  useFrame(() => {
    if (rim.current) rim.current.material.opacity = 0.15 + level(s.current) * 0.85;
  });
  return (
    <group>
      <mesh geometry={rbox(w, h, d, 0.05)} position={[0, h / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#26211d" roughness={0.5} metalness={0.5} />
      </mesh>
      <Line
        ref={(r) => {
          rim.current = r as unknown as MatLike | null;
        }}
        points={outline}
        color={AMBER}
        lineWidth={1.8}
        transparent
        opacity={0.2}
        toneMapped={false}
      />
    </group>
  );
}

/** Rings that expand across a plate: "audio is being transmitted from here". */
function Ripples({ s, level, r = 0.5, count = 3 }: { s: SRef; level: (v: number) => number; r?: number; count?: number }) {
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const on = level(s.current);
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = (clock.elapsedTime * 0.5 + i / count) % 1;
      m.scale.setScalar(0.5 + k * 2.1);
      (m.material as MeshBasicMaterial).opacity = on * (1 - k) * 0.5;
      m.visible = on > 0.02;
    });
  });
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={torus(r, 0.012)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color={AMBER} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/* ───────────────────────── caller ───────────────────────── */

const callerLit = (v: number) => Math.max(bump(0, 1.0, 0.3, v), sm(3.45, 3.85, v));

function Caller({ s, on }: { s: SRef; on: boolean }) {
  const tex = useScreen(520, 1060, drawPhone, s);
  const phone = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const ringing = 1 - sm(0.45, 0.9, s.current);
    if (phone.current) {
      phone.current.position.y = 1.78 + Math.sin(t * 1.2) * 0.025;
      phone.current.rotation.z = ringing * Math.sin(t * 38) * 0.012;
    }
  });

  return (
    <group position={CALLER_AT} rotation={[0, 0.5, 0]}>
      <Plate w={2.8} d={2.8} s={s} level={callerLit} />
      <Label text="Customer" on={on} y={3.85} />
      <group position={[0, 0.2, 0]}>
        <Ripples s={s} r={0.55} level={(v) => Math.max(bump(0.05, 2.2, 0.3, v), sm(3.45, 3.85, v) * 0.8)} />
      </group>
      <mesh geometry={cyl(0.5, 0.1)} position={[0, 0.23, 0]} castShadow>
        <meshStandardMaterial color="#2b2622" roughness={0.35} metalness={0.7} />
      </mesh>
      <group ref={phone} position={[0, 1.78, 0]} rotation={[-0.06, 0, 0]}>
        <mesh geometry={rbox(1.32, 2.68, 0.15, 0.2)} castShadow>
          <meshStandardMaterial color={TITANIUM} roughness={0.28} metalness={0.9} envMapIntensity={1.3} />
        </mesh>
        <mesh geometry={rbox(1.2, 2.56, 0.02, 0.15)} position={[0, 0, 0.078]}>
          <meshStandardMaterial color="#050403" roughness={0.1} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[1.2, 2.56]} />
          <meshBasicMaterial map={tex} toneMapped={false} transparent alphaTest={0.5} />
        </mesh>
        <mesh geometry={rbox(0.03, 0.34, 0.05, 0.015)} position={[-0.665, 0.5, 0]}>
          <meshStandardMaterial color={TITANIUM} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh geometry={rbox(0.03, 0.5, 0.05, 0.015)} position={[0.665, 0.35, 0]}>
          <meshStandardMaterial color={TITANIUM} roughness={0.3} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ───────────────────────── edge network ───────────────────────── */

const EDGE_X = [-1.75, -0.9, 0.9, 1.75];
const EDGE_Z = [-1.1, 0, 1.1];

const EDGE_TRACES: Vector3[] = (() => {
  const p: Vector3[] = [];
  const seg = (a: V3, b: V3) => p.push(new Vector3(...a), new Vector3(...b));
  const y = 0.206;
  EDGE_X.forEach((x) => seg([x, y, -1.1], [x, y, 1.1]));
  [-1.1, 1.1].forEach((z) => {
    for (let i = 0; i < EDGE_X.length - 1; i++) seg([EDGE_X[i], y, z], [EDGE_X[i + 1], y, z]);
  });
  seg([-2.4, y, 0], [-1.75, y, 0]);
  seg([-1.75, y, 0], [-0.9, y, 0]);
  seg([-0.9, y, 0], [-0.6, y, 0]);
  seg([0.6, y, 0], [0.9, y, 0]);
  seg([0.9, y, 0], [1.75, y, 0]);
  seg([1.75, y, 0], [2.4, y, 0]);
  return p;
})();

const COL_ON = new Color(AMBER);
const COL_OFF = new Color("#5a5148");
const frontPt = new Vector3();

function Network({ s, on }: { s: SRef; on: boolean }) {
  const tex = useScreen(640, 200, drawEdge, s);
  const leds = useRef<(MeshBasicMaterial | null)[]>([]);
  const slabs = useRef<(Mesh | null)[]>([]);
  const nodes = useMemo(() => EDGE_X.flatMap((x) => EDGE_Z.map((z) => ({ x, z }))), []);

  useFrame(() => {
    const v = s.current;
    FWD.at(flowMax(v), frontPt);
    const hot = bump(0.9, 2.1, 0.4, v);
    nodes.forEach((n, i) => {
      const m = leds.current[i];
      if (!m) return;
      const reached = v < 0.95 ? 0 : MathUtils.clamp((frontPt.x - n.x) / 0.6 + 0.2, 0, 1);
      m.color.copy(COL_OFF).lerp(COL_ON, n.z === 0 ? reached : reached * 0.7);
    });
    slabs.current.forEach((m, i) => {
      if (m) m.position.y = 0.1 + i * (0.19 + hot * 0.035);
    });
  });

  return (
    <group>
      <Plate w={5.0} d={3.4} h={0.2} s={s} level={(v) => bump(0.9, 2.0, 0.35, v)} />
      <Label text="Edge network" on={on} y={2.0} />

      <Line points={EDGE_TRACES} segments color="#7a6f64" lineWidth={1} transparent opacity={0.85} />

      {nodes.map((n, i) => (
        <group key={i} position={[n.x, 0.2, n.z]}>
          <mesh geometry={rbox(0.5, 0.16, 0.5, 0.04)} position={[0, 0.08, 0]} castShadow>
            <meshStandardMaterial color="#2a2420" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh geometry={rbox(0.14, 0.02, 0.14, 0.01)} position={[0, 0.17, 0]}>
            <meshBasicMaterial
              ref={(m) => {
                leds.current[i] = m;
              }}
              color="#5a5148"
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* central routing core: three stacked processing slabs */}
      <group position={[0, 0.3, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              slabs.current[i] = el;
            }}
            geometry={rbox(1.15, 0.15, 1.15, 0.04)}
            position={[0, 0.1 + i * 0.19, 0]}
            castShadow
          >
            <meshStandardMaterial color={i === 2 ? "#3a332e" : "#241f1b"} roughness={0.35} metalness={0.8} envMapIntensity={1.2} />
          </mesh>
        ))}
      </group>

      {/* router readout, standing behind the platform */}
      <group position={[0, 0.7, -2.15]} rotation={[-0.1, 0, 0]}>
        <mesh geometry={rbox(2.6, 0.82, 0.07, 0.07)} castShadow>
          <meshStandardMaterial color={TITANIUM} roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.5, 0.78]} />
          <meshBasicMaterial map={tex} toneMapped={false} transparent alphaTest={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ───────────────────────── agent ───────────────────────── */

const CARD_Y = [1.5, 2.45, 3.4, 4.35];
const agentLit = (v: number) => bump(1.9, 3.6, 0.3, v);

function Agent({ s, on }: { s: SRef; on: boolean }) {
  const base = useScreen(640, 200, drawBase, s);
  const t0 = useScreen(780, 240, drawListen, s);
  const t1 = useScreen(780, 240, drawUnderstand, s);
  const t2 = useScreen(780, 240, drawAct, s);
  const t3 = useScreen(780, 240, drawRespond, s);
  const texs = [t0, t1, t2, t3];
  const cards = useRef<(Group | null)[]>([]);
  const glows = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const v = s.current;
    cards.current.forEach((g, i) => {
      if (!g) return;
      const a = cardAct(i, v);
      g.position.z = MathUtils.lerp(g.position.z, -0.2 + a * 0.32, 0.12);
      const m = glows.current[i];
      if (m) (m.material as MeshBasicMaterial).opacity = a;
    });
  });

  return (
    <group position={AGENT_AT} rotation={[0, -0.5, 0]}>
      <Plate w={3.2} d={3.0} s={s} level={agentLit} />
      <Label text="Aurlynn agent" on={on} y={5.35} />

      {/* identity + state plaque */}
      <group position={[0, 0.18, 0.85]}>
        <mesh geometry={rbox(2.5, 0.6, 0.9, 0.07)} position={[0, 0.3, 0]} castShadow>
          <meshStandardMaterial color="#241f1b" roughness={0.4} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0.3, 0.456]}>
          <planeGeometry args={[2.36, 0.5]} />
          <meshBasicMaterial map={base} toneMapped={false} transparent alphaTest={0.5} />
        </mesh>
      </group>

      {/* rack rails */}
      {[-1.45, 1.45].map((x) => (
        <mesh key={x} geometry={rbox(0.08, 4.5, 0.14, 0.03)} position={[x, 2.45, -0.2]} castShadow>
          <meshStandardMaterial color="#2a2420" roughness={0.35} metalness={0.8} />
        </mesh>
      ))}

      {/* the four processing layers */}
      {texs.map((tx, i) => (
        <group
          key={i}
          ref={(el) => {
            cards.current[i] = el;
          }}
          position={[0, CARD_Y[i], -0.2]}
        >
          <mesh geometry={rbox(2.74, 0.84, 0.08, 0.08)} castShadow>
            <meshStandardMaterial color="#0f0d0b" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.7, 0.8]} />
            <meshBasicMaterial map={tx} toneMapped={false} transparent alphaTest={0.5} />
          </mesh>
          <mesh
            ref={(el) => {
              glows.current[i] = el;
            }}
            geometry={rbox(0.05, 0.84, 0.1, 0.02)}
            position={[-1.4, 0, 0]}
          >
            <meshBasicMaterial color={i === 3 ? GREEN : AMBER} transparent opacity={0} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ───────────────────────── data flow ───────────────────────── */

const FWD_PTS = FWD.dense();
const BACK_PTS = BACK.dense();
const PACKETS = 8;
const p3 = new Vector3();

function DataFlow({ s }: { s: SRef }) {
  const fwd = useRef<(Group | null)[]>([]);
  const back = useRef<(Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const v = s.current;
    // inbound audio: only exists once the call is live, fades as the reply takes over
    const fStrength = sm(0.08, 0.4, v) * (1 - sm(3.0, 3.4, v));
    const fMax = flowMax(v);
    fwd.current.forEach((g, i) => {
      if (!g) return;
      const phase = (t * 0.1 + i / PACKETS) % 1;
      const ang = FWD.at(phase * fMax, p3);
      g.position.copy(p3);
      g.rotation.y = ang;
      g.scale.setScalar(Math.max(0.0001, fStrength * Math.pow(Math.sin(Math.PI * phase), 0.55)));
    });
    // outbound response: its own lane, travelling back to the customer
    const bStrength = sm(3.0, 3.2, v);
    const bMax = sm(3.0, 3.9, v);
    back.current.forEach((g, i) => {
      if (!g) return;
      const phase = (t * 0.11 + i / PACKETS) % 1;
      const ang = BACK.at(phase * bMax, p3);
      g.position.copy(p3);
      g.rotation.y = ang;
      g.scale.setScalar(Math.max(0.0001, bStrength * Math.pow(Math.sin(Math.PI * phase), 0.55)));
    });
  });

  return (
    <group>
      <Line points={FWD_PTS} color={INK} lineWidth={1.1} transparent opacity={0.22} dashed dashSize={0.1} gapSize={0.09} />
      <Line points={BACK_PTS} color={INK} lineWidth={1.1} transparent opacity={0.22} dashed dashSize={0.1} gapSize={0.09} />
      <TraceOverlay pts={FWD_PTS} color={AMBER} width={2.4} s={s} level={flowMax} />
      <TraceOverlay pts={BACK_PTS} color={GREEN} width={2.4} s={s} level={(v) => sm(3.0, 3.9, v)} />

      {Array.from({ length: PACKETS }).map((_, i) => (
        <group
          key={`f${i}`}
          ref={(el) => {
            fwd.current[i] = el;
          }}
          scale={0.0001}
        >
          <mesh geometry={rbox(0.3, 0.07, 0.12, 0.03)} position={[0, 0.06, 0]}>
            <meshBasicMaterial color={AMBER} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: PACKETS }).map((_, i) => (
        <group
          key={`b${i}`}
          ref={(el) => {
            back.current[i] = el;
          }}
          scale={0.0001}
        >
          <mesh geometry={rbox(0.3, 0.07, 0.12, 0.03)} position={[0, 0.06, 0]}>
            <meshBasicMaterial color={GREEN} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ───────────────────────── deck, camera, scene ───────────────────────── */

const GRID: Vector3[] = (() => {
  const p: Vector3[] = [];
  for (let x = -9; x <= 9; x++) p.push(new Vector3(x, 0.004, -4.2), new Vector3(x, 0.004, 4.2));
  for (let z = -4; z <= 4; z++) p.push(new Vector3(-9.2, 0.004, z), new Vector3(9.2, 0.004, z));
  return p;
})();

function Deck() {
  return (
    <group>
      <mesh geometry={rbox(19.6, 0.3, 9.2, 0.1)} position={[0, -0.15, 0]} receiveShadow>
        <meshStandardMaterial color="#ebe4d8" roughness={0.85} metalness={0} />
      </mesh>
      <Line points={GRID} segments color={INK} lineWidth={1} transparent opacity={0.07} />
    </group>
  );
}

const FOCUS: V3[] = [CALLER_AT, [0, 0, 0], AGENT_AT];
const tmp = new Vector3();
const dirv = new Vector3();

function Rig({ s }: { s: SRef }) {
  const { camera, size, pointer } = useThree();
  const look = useRef(new Vector3());

  useFrame(() => {
    const v = s.current;
    const f = MathUtils.clamp(v - 0.5, 0, 2);
    const i = Math.min(1, Math.floor(f));
    const k = sm(0, 1, f - i);
    const a = FOCUS[i];
    const b = FOCUS[i + 1];
    tmp.set(MathUtils.lerp(a[0], b[0], k), 0, MathUtils.lerp(a[2], b[2], k));

    // step 4 pulls back so the reply can be seen returning to the customer
    const wide = sm(2.95, 3.9, v);
    tmp.x = MathUtils.lerp(tmp.x, 0, wide);
    tmp.z = MathUtils.lerp(tmp.z, -0.6, wide);

    const aspect = size.width / size.height;
    const base = 17 * Math.max(1, 1.05 / aspect);
    const dist = MathUtils.lerp(base, base * 1.6, wide);
    const yaw = MathUtils.lerp(-0.28, 0.26, v / 4);
    dirv.set(Math.sin(yaw) * 0.55, 0.46, 1).normalize().multiplyScalar(dist);
    camera.position.set(tmp.x + dirv.x + pointer.x * 0.45, 0.6 + dirv.y + pointer.y * 0.2, tmp.z + dirv.z);
    look.current.set(tmp.x, 0.8 + wide * 0.2, tmp.z);
    camera.lookAt(look.current);
  });
  return null;
}

function Clock({ sRef, progress }: { sRef: SRef; progress: MutableRefObject<number> }) {
  useFrame((_, dt) => {
    sRef.current = MathUtils.damp(sRef.current, progress.current * 4, 3.2, Math.min(dt, 0.05));
  }, -1);
  return null;
}

function World({ progress, active }: { progress: MutableRefObject<number>; active: number }) {
  const s = useRef(progress.current * 4);
  return (
    <>
      <Clock sRef={s} progress={progress} />
      <Rig s={s} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 15, 7]}
        intensity={1.9}
        color="#fff3e2"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0006}
        shadow-normalBias={0.05}
        shadow-radius={4}
      />
      <directionalLight position={[-8, 5, -5]} intensity={0.45} color="#dbe6ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 8, 6]} scale={[16, 5, 1]} color="#fff3e2" />
        <Lightformer form="rect" intensity={1.4} position={[-9, 3, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1} position={[9, 2, -3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} color="#ffd9b0" />
      </Environment>
      <Deck />
      <DataFlow s={s} />
      <Caller s={s} on={active === 0 || active === 3} />
      <Network s={s} on={active === 1} />
      <Agent s={s} on={active >= 2} />
    </>
  );
}

export default function HowItWorks3D({
  progress,
  active,
  dpr,
}: {
  progress: MutableRefObject<number>;
  active: number;
  dpr: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        shadows="percentage"
        frameloop={visible ? "always" : "never"}
        dpr={[1, dpr]}
        camera={{ fov: 32, near: 0.1, far: 120, position: [-4, 6, 14] }}
        gl={{ alpha: true, antialias: true }}
      >
        <World progress={progress} active={active} />
      </Canvas>
    </div>
  );
}
