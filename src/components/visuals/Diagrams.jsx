import { motion, useReducedMotion } from "framer-motion";
import { BarChart3 } from "lucide-react";

/** Positions n nodes on an ellipse, as percentages of the container. */
function ring(n, rx = 41, ry = 38, start = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    return { x: 50 + rx * Math.cos(a), y: 50 + ry * Math.sin(a) };
  });
}

/**
 * Hub-and-spoke connection map. Aurlynn at the centre, nodes around it.
 * nodes: [{id, label, state?: "planned" | "confirmed"}]. Buttons are positioned in %, so labels stay crisp.
 */
export function ConnectionMap({ nodes, active, onSelect, className = "", dark = false }) {
  const reduce = useReducedMotion();
  const pts = ring(nodes.length);
  return (
    <div className={`relative aspect-[3/2] w-full ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
        {pts.map((p, i) => {
          const on = nodes[i].id === active;
          return (
            <line key={nodes[i].id} x1="50" y1="50" x2={p.x} y2={p.y} vectorEffect="non-scaling-stroke" strokeWidth={on ? 1.6 : 1} stroke={on ? "var(--accent)" : dark ? "rgba(255,255,255,0.18)" : "var(--border)"} className={on && !reduce ? "dash-flow" : ""} strokeDasharray={on ? undefined : "2 5"} />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 z-10 grid size-[5.6rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-dark text-center text-white shadow-[0_0_0_8px_rgba(183,122,72,0.15)]">
        <span className="font-[family-name:var(--font-sora)] text-[0.8rem] font-medium leading-tight">Aurlynn<br />agent</span>
      </div>
      {nodes.map((n, i) => {
        const on = n.id === active;
        return (
          <motion.button
            key={n.id}
            type="button"
            onClick={() => onSelect?.(n.id)}
            aria-pressed={on}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
            style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] transition-colors duration-300 ${
              on ? "border-accent bg-accent text-white" : dark ? "border-white/20 bg-dark text-white/80 hover:border-accent-light" : "border-border bg-white hover:border-accent/60"
            }`}
          >
            {n.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Small hub diagram used in "Connect". */
export function ConnectVisual() {
  const nodes = ["Calendars", "CRM data", "Information sources", "Workflows"];
  const pts = ring(4, 38, 36, -135);
  return (
    <div className="relative aspect-[4/3] w-full rounded-2xl border border-border bg-white p-4">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
        {pts.map((p, i) => (
          <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke="var(--accent)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" className="dash-flow" />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-dark text-[12px] font-medium text-white">Aurlynn</div>
      {nodes.map((n, i) => (
        <span key={n} style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[12px]">
          {n}
        </span>
      ))}
    </div>
  );
}

/** Dashboard mock: relative outcome bars. Illustrative, no figures. */
export function AnalyticsMock() {
  const reduce = useReducedMotion();
  const bars = [["Qualified", 0.78], ["Booked", 0.6], ["Follow-up set", 0.46], ["Escalated", 0.28], ["No answer", 0.2]];
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_24px_60px_-30px_rgba(10,10,11,.2)]" role="img" aria-label="Illustrative analytics: outcomes by workflow">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-medium">
          <BarChart3 size={15} aria-hidden className="text-accent" /> Outcomes by workflow
        </p>
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-secondary">Illustrative</span>
      </div>
      <ul className="mt-5 space-y-3.5">
        {bars.map(([k, v], i) => (
          <li key={k} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-[12.5px]">
            <span className="text-secondary">{k}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-background-secondary">
              <motion.span
                className="block h-full origin-left rounded-full bg-accent"
                style={{ width: `${v * 100}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-border pt-3 text-[12px] text-secondary">Reasons for calling, escalation patterns and drop-off points show where to refine the workflow.</p>
    </div>
  );
}
