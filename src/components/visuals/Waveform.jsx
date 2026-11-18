"use client";
/** Sound-wave bars. Animates transform only; `active` pauses it. Pure CSS, no JS per frame. */
export function Waveform({ bars = 28, height = 36, color = "currentColor", active = true, className = "" }) {
  const w = bars * 6;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" aria-hidden className={className} style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => {
        // deterministic pseudo-random envelope so it looks like speech, and is stable across renders
        const env = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37 + 1));
        const h = Math.max(3, env * height);
        return (
          <rect
            key={i}
            className={active ? "wave-bar" : ""}
            x={i * 6 + 1}
            y={(height - h) / 2}
            width="3"
            height={h}
            rx="1.5"
            fill={color}
            style={{ animationDelay: `${(i % 9) * -0.13}s`, animationDuration: `${0.9 + (i % 5) * 0.12}s`, transformBox: "fill-box" }}
          />
        );
      })}
    </svg>
  );
}
