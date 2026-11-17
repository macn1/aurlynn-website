import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { Section, SectionHead } from "./Section";
import { JsonLd, faqSchema } from "@/components/seo/Seo";

export function Accordion({ items, dark = false }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <ul className={`divide-y ${dark ? "divide-white/10 border-y border-white/10" : "divide-border border-y border-border"}`}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left font-[family-name:var(--font-sora)] text-[1.05rem] font-medium leading-snug sm:text-lg"
              >
                <span>{f.q}</span>
                <Plus aria-hidden size={18} className={`shrink-0 text-accent transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className={`max-w-[70ch] pb-6 leading-relaxed ${dark ? "text-white/65" : "text-[#5b5652]"}`}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/** FAQ block with matching FAQPage structured data (only the visible questions). */
export function FAQSection({ items, title = "Questions, answered.", eyebrow = "FAQ", tone = "alt", more = true }) {
  if (!items?.length) return null;
  return (
    <Section tone={tone}>
      <JsonLd data={faqSchema(items)} />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div>
          <SectionHead eyebrow={eyebrow} title={title} />
          {more && (
            <Link href="/faq" className="mt-6 inline-block text-sm underline decoration-accent underline-offset-4 hover:text-accent">
              All 40 questions
            </Link>
          )}
        </div>
        <Accordion items={items} />
      </div>
    </Section>
  );
}
