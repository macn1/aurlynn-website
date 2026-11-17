import { ArrowUpRight } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { Section, SectionHead } from "./Section";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** Internal linking block. links: [{label, href, text?}] */
export function RelatedLinks({ title = "Keep exploring", eyebrow = "Related", links, tone = "light" }) {
  return (
    <Section tone={tone}>
      <SectionHead eyebrow={eyebrow} title={title} />
      <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <StaggerItem as="li" key={l.href}>
            <Link href={l.href} className="border-card group flex h-full items-start justify-between gap-4 rounded-lg p-5">
              <span>
                <span className="block font-[family-name:var(--font-sora)] text-[1.02rem] font-medium">{l.label}</span>
                {l.text && <span className="mt-1.5 block text-sm leading-relaxed text-secondary">{l.text}</span>}
              </span>
              <ArrowUpRight aria-hidden size={18} className="mt-0.5 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

/** Answer-first definition block (GEO/AEO). */
export function Definition({ term, children }) {
  return (
    <aside className="border-l-2 border-accent bg-surface/70 py-4 pl-5 pr-4 sm:pl-7" aria-label={`Definition: ${term}`}>
      <p className="eyebrow-sm !text-accent">Definition</p>
      <p className="mt-2 max-w-[70ch] text-[1.02rem] leading-relaxed">
        <strong className="font-semibold">{term}</strong> {children}
      </p>
    </aside>
  );
}
