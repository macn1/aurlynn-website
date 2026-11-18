import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Breadcrumbs({ crumbs }) {
  if (!crumbs?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mono mb-6 text-[11px] uppercase tracking-[0.14em] text-secondary">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map(([label, href], i) => (
          <li key={href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden size={11} />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-accent">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Split hero on the homepage's blush gradient. `visual` sits on the right (below on mobile). */
export function PageHero({ eyebrow, title, lead, primary, secondary, visual, crumbs, note }) {
  const reduce = useReducedMotion();
  const a = (d) => (reduce ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });
  return (
    <header className="hero-bg section-x relative overflow-hidden pb-[clamp(3rem,6vw,6rem)] pt-[calc(var(--nav-h)+clamp(2rem,4.5vw,4.5rem))]">
      <div className={`grid items-center gap-[clamp(2rem,4vw,4rem)] ${visual ? "lg:grid-cols-[1.05fr_1fr]" : ""}`}>
        <div>
          <motion.div {...a(0)}>
            <Breadcrumbs crumbs={crumbs} />
            {eyebrow && <p className="hero-eyebrow mb-5">{eyebrow}</p>}
          </motion.div>
          <motion.h1 {...a(0.08)} className="page-title max-w-[19ch]">
            {title}
          </motion.h1>
          <motion.p {...a(0.18)} className="lead mt-6 max-w-[56ch]">
            {lead}
          </motion.p>
          {(primary || secondary) && (
            <motion.div {...a(0.28)} className="mt-8 flex flex-wrap gap-3">
              {primary && (
                <Button href={primary.href} arrow>
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button href={secondary.href} variant="outline">
                  {secondary.label}
                </Button>
              )}
            </motion.div>
          )}
          {note && (
            <motion.p {...a(0.36)} className="mono mt-6 text-[11px] uppercase tracking-[0.14em] text-secondary">
              {note}
            </motion.p>
          )}
        </div>
        {visual && (
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 30, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] } })}>
            {visual}
          </motion.div>
        )}
      </div>
    </header>
  );
}
