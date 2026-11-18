"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { Link } from "@/components/ui/Link";
import { ConversationToAction } from "@/components/visuals/ConversationToAction";
import { industries } from "@/data/industries";
import { useCaseBySlug } from "@/data/useCases";

const crumbs = [["Home", "/"], ["Industries", "/industries"]];

function Selector() {
  const [slug, setSlug] = useState(industries[0].slug);
  const ind = industries.find((i) => i.slug === slug);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.55fr_1.5fr] lg:gap-14">
      <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
        {industries.map((i) => (
          <button
            key={i.slug}
            role="tab"
            aria-selected={i.slug === slug}
            aria-controls="ind-panel"
            onClick={() => setSlug(i.slug)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-left text-[0.95rem] transition-all duration-300 lg:rounded-none lg:border-0 lg:border-b lg:border-white/10 lg:bg-transparent lg:px-0 lg:py-3.5 ${
              i.slug === slug ? "border-accent bg-accent text-white lg:text-white" : "border-white/15 text-white/55 hover:text-white lg:text-white/45"
            }`}
          >
            <span className={`inline-block transition-transform duration-300 ${i.slug === slug ? "lg:translate-x-1.5" : ""}`}>{i.name}</span>
          </button>
        ))}
      </div>
      <div id="ind-panel" role="tabpanel" className="min-h-[26rem]">
        <AnimatePresence mode="wait">
          <motion.div key={slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-9">
            <h3 className="font-[family-name:var(--font-sora)] text-2xl font-medium leading-tight sm:text-3xl">{ind.h1}</h3>
            <p className="lead mt-3 max-w-[60ch]">{ind.lead}</p>
            <p className="mono mb-5 mt-8 text-[10.5px] uppercase tracking-[0.14em] text-accent-light">Customer journey</p>
            <FlowDiagram dark steps={ind.journey} />
            <p className="mono mb-3 mt-9 text-[10.5px] uppercase tracking-[0.14em] text-accent-light">Relevant use cases</p>
            <ul className="flex flex-wrap gap-2">
              {ind.useCases.slice(0, 6).map((u) => (
                <li key={u} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80">
                  {u}
                </li>
              ))}
            </ul>
            <Link href={`/industries/${ind.slug}`} className="group mt-8 inline-flex items-center gap-2 text-accent-light hover:text-white">
              Explore {ind.name}
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Industries() {
  return (
    <>
      <Seo title="AI Voice Agents by Industry | Aurlynn" description="Aurlynn AI voice agents for automotive, real estate, healthcare, education, BFSI, insurance, SaaS, travel, retail and professional services." path="/industries" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Industries"
        title="AI Voice Agents by Industry"
        lead="Each industry has its own customer journey, operational friction and highest-value conversations. Aurlynn agents are configured around them, not around a generic template."
        primary={{ label: "See Aurlynn in Action", href: "/contact" }}
        secondary={{ label: "Explore Use Cases", href: "/use-cases" }}
        visual={<ConversationToAction />}
      />

      <Section tone="dark">
        <SectionHead eyebrow="Industry selector" title="Pick an industry. See the workflow." />
        <div className="mt-12">
          <Selector />
        </div>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="All industries" title="Ten industries, ten different journeys." />
        <Stagger as="ul" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((i) => (
            <StaggerItem as="li" key={i.slug}>
              <Link href={`/industries/${i.slug}`} className="border-card group flex h-full flex-col justify-between rounded-lg p-5">
                <span className="font-[family-name:var(--font-sora)] text-[1.02rem] font-medium leading-snug">{i.name}</span>
                <span className="mt-8 flex items-center justify-between text-[12.5px] text-secondary">
                  {i.journey.length} steps
                  <ArrowRight size={14} aria-hidden className="text-accent transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <RelatedLinks
        tone="alt"
        title="Popular workflows across industries."
        links={["ai-lead-qualification", "ai-appointment-booking", "ai-customer-support"].map((s) => ({ label: useCaseBySlug[s].name, href: `/use-cases/${s}`, text: useCaseBySlug[s].lead }))}
      />
      <CTABand title="Don't see your industry?" text="Aurlynn is designed for businesses across industries. Tell us your workflow." primary={{ label: "Talk to an Expert", href: "/contact" }} secondary={{ label: "Explore Capabilities", href: "/capabilities" }} />
    </>
  );
}
