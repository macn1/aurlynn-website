"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConnectionMap } from "@/components/visuals/Diagrams";
import { confirmedPlatforms, integrationCategories } from "@/data/integrations";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["Integrations", "/integrations"]];

function Badge({ state }) {
  const confirmed = state === "confirmed";
  return (
    <span className={`mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${confirmed ? "border-[#2e9d78]/50 bg-[#7CF0C6]/30" : "border-accent/50 text-accent"}`}>
      <span className={`size-1.5 rounded-full ${confirmed ? "bg-[#2e9d78]" : "bg-accent"}`} aria-hidden />
      {confirmed ? "Confirmed" : "Planned"}
    </span>
  );
}

function Explorer() {
  const [id, setId] = useState(integrationCategories[0].id);
  const cat = integrationCategories.find((c) => c.id === id);
  const live = confirmedPlatforms.filter((p) => p.category === id);
  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
      <div>
        <div className="hidden md:block">
          <ConnectionMap dark nodes={integrationCategories.map((c) => ({ id: c.id, label: c.name }))} active={id} onSelect={setId} />
        </div>
        <div role="tablist" aria-label="Integration categories" className="flex flex-wrap gap-2 md:hidden">
          {integrationCategories.map((c) => (
            <button key={c.id} role="tab" aria-selected={c.id === id} onClick={() => setId(c.id)} className={`rounded-full border px-3.5 py-2 text-[13px] ${c.id === id ? "border-accent bg-accent text-white" : "border-white/20 text-white/70"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <Badge state={live.length ? "confirmed" : "planned"} />
            <h3 className="mt-4 font-[family-name:var(--font-sora)] text-2xl font-medium">{cat.name}</h3>
            <p className="lead mt-2">{cat.text}</p>
            <p className="mono mt-6 text-[10px] uppercase tracking-[0.14em] text-accent-light">Example flow</p>
            <p className="mt-1.5 text-[15px]">{cat.flow}</p>
            <p className="mono mt-6 text-[10px] uppercase tracking-[0.14em] text-accent-light">Confirmed platforms</p>
            {live.length ? (
              <ul className="mt-2 space-y-1.5 text-[15px]">{live.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
            ) : (
              <p className="mt-1.5 text-[14px] text-white/55">None confirmed yet in this category.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Integrations() {
  return (
    <>
      <Seo title="AI Voice Agent Integrations | Aurlynn" description="Connect Aurlynn voice conversations to CRM, calendars, contact centers, marketing automation, support, ERP, databases, APIs and webhooks." path="/integrations" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Integrations"
        title="Connect conversation to the systems you already use."
        lead="Aurlynn can be designed to connect voice interactions with business systems through supported integrations, APIs and webhooks. This page separates what is confirmed from what is planned."
        primary={{ label: "Discuss Your Workflow", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={
          <div className="rounded-2xl border border-border bg-white/80 p-6 backdrop-blur" role="group" aria-label="Status legend">
            <p className="mono mb-5 text-[10.5px] uppercase tracking-[0.14em] text-accent">How we label integrations</p>
            <dl className="space-y-5">
              <div>
                <dt><Badge state="confirmed" /></dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-secondary">A specific platform that is live and available. Listed by name only once confirmed.</dd>
              </div>
              <div>
                <dt><Badge state="planned" /></dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-secondary">A category or platform in scope. Availability is confirmed for each deployment.</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section tone="dark">
        <SectionHead eyebrow="Explore categories" title="Ten ways a conversation reaches your systems." />
        <div className="mt-12">
          <Explorer />
        </div>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Confirmed platforms" title="Named integrations, added when they're live.">
          We don't list a platform until it is confirmed. If you need a specific system, tell us. Where an API or webhook is available, a connection can often be designed around it.
        </SectionHead>
        {confirmedPlatforms.length === 0 ? (
          <p className="mt-10 max-w-xl rounded-lg border border-dashed border-border bg-white p-6 text-[0.95rem] text-secondary">No platform integrations are confirmed yet. This list will name each one as it goes live.</p>
        ) : (
          <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-3">
            {confirmedPlatforms.map((p) => (
              <StaggerItem as="li" key={p.name} className="border-card rounded-lg p-5">
                <Badge state="confirmed" />
                <p className="mt-3 font-[family-name:var(--font-sora)] text-lg">{p.name}</p>
                <p className="mt-1 text-sm text-secondary">{p.note}</p>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Categories at a glance" title="What each connection does." />
        <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {integrationCategories.map((c) => (
            <StaggerItem as="li" key={c.id} className="border-card flex flex-col gap-3 rounded-lg p-5">
              <Badge state="planned" />
              <p className="font-[family-name:var(--font-sora)] font-medium leading-snug">{c.name}</p>
              <p className="text-[13px] leading-relaxed text-secondary">{c.flow}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <RelatedLinks title="Related." links={[{ label: "CRM-driven calling", href: "/use-cases/ai-crm-calling-agent", text: "Call from records, write outcomes back." }, { label: "Security & Trust", href: "/security", text: "Integration controls and access." }, { label: "How It Works", href: "/how-it-works", text: "Where Connect fits in the process." }]} />
      <FAQSection items={faqSets.integrations} tone="alt" />
      <CTABand title="Tell us which systems matter." text="We'll confirm what can be connected for your workflow." primary={{ label: "Discuss Your Workflow", href: "/contact" }} secondary={{ label: "Talk to an Expert", href: "/contact" }} />
    </>
  );
}
