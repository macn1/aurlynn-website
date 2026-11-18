"use client";
import { Reveal, TextReveal } from "@/components/motion/Reveal";

const tones = {
  light: "bg-background text-foreground",
  alt: "bg-background-secondary text-foreground",
  white: "bg-surface text-foreground",
  dark: "on-dark bg-dark text-white",
};

/** Page section with tone and consistent rhythm. */
export function Section({ tone = "light", id, className = "", children, label }) {
  return (
    <section id={id} aria-label={label} className={`section-x py-[clamp(3.5rem,7vw,7rem)] ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, align = "left", className = "", max = "max-w-3xl" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${max} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow-sm mb-4 !text-accent">{eyebrow}</p>
        </Reveal>
      )}
      <TextReveal text={title} className="h-section" />
      {children && (
        <Reveal delay={0.15} className="lead mt-5">
          {children}
        </Reveal>
      )}
    </div>
  );
}
