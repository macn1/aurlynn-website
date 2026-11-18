"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Link } from "@/components/ui/Link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { useCases } from "@/data/useCases";

const crumbs = [["Home", "/"], ["Use Cases", "/use-cases"]];

function Filter() {
  const [f, setF] = useState("All");
  const tier2 = useCases.filter((u) => u.tier === 2).filter((u) => f === "All" || u.audience.includes(f));
  return (
    <div>
      <div role="group" aria-label="Filter by audience" className="inline-flex rounded-full border border-border bg-white p-1">
        {["All", "B2B", "B2C"].map((k) => (
          <button key={k} aria-pressed={f === k} onClick={() => setF(k)} className={`rounded-full px-5 py-2 text-sm transition-colors ${f === k ? "bg-dark text-white" : "text-secondary hover:text-foreground"}`}>
            {k}
          </button>
        ))}
      </div>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        <AnimatePresence initial={false}>
          {tier2.map((u) => (
            <motion.li key={u.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Link href={`/use-cases/${u.slug}`} className="group grid items-center gap-2 py-5 sm:grid-cols-[1fr_1.4fr_auto] sm:gap-8">
                <span className="font-[family-name:var(--font-sora)] text-lg font-medium transition-transform duration-300 group-hover:translate-x-1.5">{u.name}</span>
                <span className="text-[0.95rem] text-secondary">{u.lead}</span>
                <span className="flex items-center gap-3">
                  <span className="mono rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-secondary">{u.audience}</span>
                  <ArrowUpRight size={17} aria-hidden className="text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default function UseCases() {
  const tier1 = useCases.filter((u) => u.tier === 1);
  return (
    <>
      <Seo title="AI Voice Agent Use Cases | Aurlynn" description="AI lead qualification, appointment booking, inbound lead response, customer support, receptionist and more: Aurlynn AI voice agent use cases." path="/use-cases" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Use cases"
        title="AI Voice Agent Use Cases"
        lead="Start with the conversation you most want to automate. Each use case follows the same path: problem, how Aurlynn works, an example conversation, the workflow, integrations, human handoff and outcomes."
        primary={{ label: "See Aurlynn in Action", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={<ConversationCard title="Lead qualification" turns={tier1[0].convo} actionLabel="Qualified" actionDetail="→ routed to sales" />}
      />

      <Section tone="dark">
        <SectionHead eyebrow="Start here" title="Five high-intent workflows." />
        <Stagger as="ul" className="mt-12 grid gap-3 md:grid-cols-6">
          {tier1.map((u, n) => (
            <StaggerItem as="li" key={u.slug} className={n < 2 ? "md:col-span-3" : "md:col-span-2"}>
              <Link href={`/use-cases/${u.slug}`} className="border-card group flex h-full min-h-[13rem] flex-col justify-between rounded-lg p-6">
                <span className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent-light">{u.audience}</span>
                <span>
                  <span className="block font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">{u.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">{u.lead}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden className="mt-4 text-accent-light transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="More workflows" title="Nine more conversations to automate." />
        <div className="mt-10">
          <Filter />
        </div>
      </Section>

      <RelatedLinks
        tone="alt"
        title="Find your fit."
        links={[
          { label: "B2B sales workflows", href: "/b2b" },
          { label: "B2C customer workflows", href: "/b2c" },
          { label: "Industries", href: "/industries" },
          { label: "Capabilities", href: "/capabilities" },
          { label: "How It Works", href: "/how-it-works" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <CTABand title="Not sure where to start?" text="Describe the conversation. We'll suggest the workflow." primary={{ label: "Talk to an Expert", href: "/contact" }} secondary={{ label: "Discuss Your Workflow", href: "/contact" }} />
    </>
  );
}
