"use client";
import { motion } from "framer-motion";
import { Clock, Moon, PhoneMissed } from "lucide-react";
import { ProblemDemo } from "./demo/ProblemDemo";
import { ALERT, inter, mono, sora } from "./demo/shared";

const POINTS = [
  { icon: PhoneMissed, text: "Missed calls during busy hours" },
  { icon: Moon, text: "Lost enquiries after business hours" },
  { icon: Clock, text: "Delayed responses and missed opportunities" },
];

function Reveal({ children, delay = 0 }) {
  return <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
      {children}
    </motion.div>;
}
function ProblemStatement() {
  return <section className={`${inter} section-x bg-[#F6F3EC] py-[clamp(3rem,6vw,6rem)] text-[#0A0A0B]`}>
      <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <Reveal>
          <p className={`${mono} mb-4 text-[11px] uppercase tracking-[0.18em] text-[#7C7C84]`}>The problem</p>
          <h2 className={`${sora} text-3xl font-medium leading-[1.1] sm:text-5xl`}>
            Your customers are ready. Is your phone line?
          </h2>
          <p className="mt-6 max-w-lg text-[#55555C]">
            Every missed call is a potential customer, booking, or sale slipping away. When your team is busy,
            unavailable, or closed, customers shouldn’t have to wait for an answer.
          </p>
          <ul className="mt-8 max-w-lg space-y-3">
            {POINTS.map(({ icon: Icon, text }) => <li key={text} className="flex items-center gap-3 text-[15px]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${ALERT}14`, color: ALERT }}>
                  <Icon size={15} aria-hidden />
                </span>
                {text}
              </li>)}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ProblemDemo />
        </Reveal>
      </div>
    </section>;
}
export {
  ProblemStatement
};
