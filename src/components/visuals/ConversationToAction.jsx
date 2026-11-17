import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, AudioLines, BrainCircuit, Zap } from "lucide-react";
import { Waveform } from "./Waveform";

const cols = [
  { Icon: AudioLines, label: "Conversation", text: "A natural spoken call, inbound or permission-based outbound.", extra: "wave" },
  { Icon: BrainCircuit, label: "Intelligence", text: "Intent, context and answers understood; next step decided.", extra: "chips" },
  { Icon: Zap, label: "Action", text: "Book, qualify, update, route, follow up or escalate.", extra: "result" },
];

/** The brand concept as a diagram: Conversation → Intelligence → Action. */
export function ConversationToAction({ className = "", dark = false }) {
  const reduce = useReducedMotion();
  const surface = dark ? "border-white/10 bg-white/[0.04]" : "border-border bg-white shadow-[0_24px_60px_-30px_rgba(10,10,11,.2)]";
  return (
    <div className={`grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] ${className}`}>
      {cols.map((c, i) => (
        <div key={c.label} className="contents">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-2xl border p-5 ${surface}`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-dark text-white">
              <c.Icon size={16} aria-hidden />
            </span>
            <p className="mono mt-4 text-[10.5px] uppercase tracking-[0.14em] text-accent">0{i + 1}</p>
            <p className="font-[family-name:var(--font-sora)] text-lg font-medium">{c.label}</p>
            <p className={`mt-1.5 text-[13px] leading-snug ${dark ? "text-white/60" : "text-secondary"}`}>{c.text}</p>
            <div className="mt-4 h-8">
              {c.extra === "wave" && <Waveform bars={20} height={28} color="var(--accent)" className="w-full" />}
              {c.extra === "chips" && (
                <div className="flex flex-wrap gap-1.5">
                  {["Intent", "Context", "Rules"].map((t) => (
                    <span key={t} className="mono rounded-full border border-accent/40 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {c.extra === "result" && <span className="mono rounded-full bg-[#7CF0C6]/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]">Completed</span>}
            </div>
          </motion.div>
          {i < cols.length - 1 && (
            <div className="flex items-center justify-center text-accent" aria-hidden>
              <ArrowRight className="rotate-90 sm:rotate-0" size={20} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
