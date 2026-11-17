import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Fade-up when scrolled into view. Transform + opacity only. */
export function Reveal({ children, delay = 0, y = 24, className = "", as = "div", once = true }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Comp>
  );
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };

/** Staggered group: wrap children in <StaggerItem>. */
export function Stagger({ children, className = "", as = "div" }) {
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Comp>
  );
}
export function StaggerItem({ children, className = "", as = "div" }) {
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

/** Headline reveal: each line slides up out of a mask. Pass lines as an array or a string split on "|". */
export function TextReveal({ text, className = "", as: Tag = "h2", delay = 0 }) {
  const reduce = useReducedMotion();
  const lines = Array.isArray(text) ? text : String(text).split("|");
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
