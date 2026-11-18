"use client";
import { Reveal, TextReveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Waveform } from "@/components/visuals/Waveform";

/** Closing call to action. Dark band with the brand's conversation → action line. */
export function CTABand({
  title = "What if every customer got an intelligent response?",
  text = "Put AI to work on the conversations your business handles every day.",
  primary = { label: "Build Your AI Agent", href: "/contact" },
  secondary = { label: "Talk to an Expert", href: "/contact" },
}) {
  return (
    <section aria-labelledby="final-cta" className="on-dark section-x relative overflow-hidden bg-dark py-[clamp(4rem,8vw,8rem)] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex h-40 items-end justify-center opacity-40">
        <Waveform bars={64} height={120} color="var(--accent)" className="w-full max-w-5xl" />
      </div>
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow-sm mb-5 !text-accent-light">Conversation → Intelligence → Action</p>
        </Reveal>
        <TextReveal as="h2" text={title} className="h-section" />
        <Reveal delay={0.15}>
          <p className="lead mx-auto mt-5 max-w-[48ch]">{text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={primary.href} variant="light" arrow>
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="ghostDark">
              {secondary.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
