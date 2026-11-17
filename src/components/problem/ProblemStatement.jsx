"use client";
import { motion } from "framer-motion";
const queue = ["Booking request", "Order question", "Pricing enquiry", "Rescheduling", "New lead", "Callback"];
const sora = "font-[family-name:var(--font-sora)] tracking-tight";
const inter = "font-[family-name:var(--font-inter)]";
const mono = "font-[family-name:var(--font-jetbrains)]";
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
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className={`${mono} mb-4 text-[11px] uppercase tracking-[0.18em] text-[#7C7C84]`}>The problem</p>
          <h2 className={`${sora} text-3xl font-medium leading-[1.1] sm:text-5xl`}>
            Your customers are ready. Is your phone line?
          </h2>
          <p className="mt-6 max-w-lg text-[#55555C]">
            Calls arrive in bursts, after hours and on busy days. Every unanswered ring is a booking, a sale or a
            relationship that quietly goes elsewhere.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div
    className="rounded-3xl border border-[#0A0A0B]/10 bg-white p-5 shadow-[0_1px_0_rgba(10,10,11,.04),0_12px_40px_-12px_rgba(10,10,11,.14)]"
    role="img"
    aria-label="Illustration: a queue of waiting calls being cleared by an Aurlynn agent"
  >
            <div className={`${mono} mb-4 flex justify-between text-[11px] text-[#7C7C84]`}>
              <span>CALL QUEUE</span>
              <span>ILLUSTRATIVE</span>
            </div>
            <ul className="space-y-2">
              {queue.map((q, i) => <motion.li
    key={q}
    initial={{ opacity: 1 }}
    whileInView={{ opacity: [1, 1, 0.45] }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 + i * 0.25, duration: 0.6 }}
    className="flex items-center justify-between rounded-xl bg-[#F6F3EC] px-4 py-3 text-sm"
  >
                  <span>{q}</span>
                  <motion.span
    initial={{ backgroundColor: "#ECE7DB" }}
    whileInView={{ backgroundColor: "#7CF0C6" }}
    viewport={{ once: true }}
    transition={{ delay: 0.9 + i * 0.25 }}
    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
  >
                    Answered
                  </motion.span>
                </motion.li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>;
}
export {
  ProblemStatement
};
