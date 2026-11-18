"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Seo, softwareSchema } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks, Definition } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal } from "@/components/motion/Reveal";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { ConversationToAction } from "@/components/visuals/ConversationToAction";
import { ComparisonTable } from "@/components/visuals/ComparisonTable";
import { HandoffVisual } from "@/components/visuals/Cards";
import { capabilities, model } from "@/data/capabilities";
import { faqSets } from "@/data/faqs";
import { site } from "@/lib/site";

const crumbs = [["Home", "/"], ["Capabilities", "/capabilities"]];

function Explorer() {
  const [id, setId] = useState(capabilities[0].id);
  const c = capabilities.find((x) => x.id === id);
  const onKey = (e) => {
    const i = capabilities.findIndex((x) => x.id === id);
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const t = capabilities[(next + capabilities.length) % capabilities.length];
    setId(t.id);
    document.getElementById(`cap-${t.id}`)?.focus();
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr] lg:gap-12">
      <div role="tablist" aria-label="Capabilities" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
        {capabilities.map((x, i) => (
          <button
            key={x.id}
            id={`cap-${x.id}`}
            role="tab"
            tabIndex={x.id === id ? 0 : -1}
            aria-selected={x.id === id}
            aria-controls="cap-panel"
            onClick={() => setId(x.id)}
            className={`group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-[0.95rem] transition-all duration-300 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-3.5 ${
              x.id === id ? "border-dark bg-dark text-white lg:border-border lg:bg-transparent lg:text-foreground" : "border-border bg-white text-secondary hover:text-foreground lg:border-border lg:bg-transparent"
            }`}
          >
            <span className={`mono hidden w-6 text-[11px] lg:block ${x.id === id ? "text-accent" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
            <span className={`whitespace-nowrap transition-transform duration-300 lg:whitespace-normal ${x.id === id ? "lg:translate-x-1" : ""}`}>{x.name}</span>
          </button>
        ))}
      </div>
      <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-${id}`} tabIndex={0} className="min-h-[24rem]">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border border-border bg-white p-6 shadow-[0_24px_60px_-34px_rgba(10,10,11,.25)] sm:p-9">
            <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Stage · {c.stage}</p>
            <h3 className="mt-3 font-[family-name:var(--font-sora)] text-2xl font-medium leading-tight sm:text-3xl">{c.name}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed">{c.short}</p>
            <p className="lead mt-3">{c.detail}</p>
            <div className="mt-7 space-y-2 rounded-xl bg-background-secondary p-4">
              <p className="mono text-[10px] uppercase tracking-[0.14em] text-secondary">In a conversation · illustrative</p>
              {c.example.map(([who, t]) => (
                <p key={t} className={`flex gap-2.5 text-[14px] leading-snug ${who === "agent" ? "" : "text-secondary"}`}>
                  <span className="mono w-14 shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.1em] text-accent">{who === "agent" ? "Agent" : "Caller"}</span>
                  {t}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModelMap() {
  const [stage, setStage] = useState(0);
  const sel = model[stage];
  return (
    <div>
      <FlowDiagram steps={model.map((m) => ({ label: m }))} active={stage} onChange={setStage} dark />
      <div className="mt-10">
        <p className="mono mb-3 text-[10.5px] uppercase tracking-[0.14em] text-white/50">Capabilities at the “{sel}” stage are highlighted</p>
        <ul className="flex flex-wrap gap-2">
          {capabilities.map((c) => {
            const on = c.stage === sel;
            return (
              <li key={c.id} className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-500 ${on ? "border-accent bg-accent text-white" : "border-white/15 text-white/45"}`}>
                {c.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Compare() {
  const [tab, setTab] = useState("ivr");
  const sets = {
    ivr: { left: "AI voice agent", right: "IVR", rows: [["Conversational", "Menu-driven"], ["Understands natural language", "Relies on predefined options"], ["Can capture context", "Limited contextual understanding"], ["Can trigger workflows", "Usually routes calls"], ["Can escalate based on conversation", "Primarily routes"]] },
    chatbot: { left: "Voice agent", right: "Chatbot", rows: [["Spoken interaction", "Text interaction"], ["Phone-first", "Web/app-first"], ["Natural spoken conversation", "Written conversation"], ["Useful when customers prefer calling", "Useful for digital self-service"]] },
  };
  const s = sets[tab];
  return (
    <div>
      <div role="tablist" aria-label="Comparison" className="inline-flex rounded-full border border-border bg-white p-1">
        {[["ivr", "vs IVR"], ["chatbot", "vs Chatbot"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-5 py-2 text-sm transition-colors ${tab === k ? "bg-dark text-white" : "text-secondary hover:text-foreground"}`}>
            AI voice agent {l}
          </button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel">
        <ComparisonTable caption={`${s.left} compared with ${s.right}`} left={s.left} right={s.right} rows={s.rows} />
      </div>
      <p className="mt-8 max-w-[62ch] border-l-2 border-accent pl-4 text-[1rem] leading-relaxed">
        AI handles scale and repetition. Humans handle judgment, exceptions and complex interactions.
      </p>
    </div>
  );
}

export default function Capabilities() {
  return (
    <>
      <Seo
        title="AI Voice Agent Platform & Capabilities | Aurlynn"
        description="Explore Aurlynn's AI voice agent capabilities: inbound and outbound voice, lead qualification, booking, follow-up, support, CRM integration, human handoff and analytics."
        path="/capabilities"
        crumbs={crumbs}
        schema={[softwareSchema(site.description)]}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Capabilities"
        title="AI Voice Capabilities Built Around Business Outcomes"
        lead="Aurlynn combines natural voice conversations with business logic, workflows and connected systems."
        primary={{ label: "Explore Use Cases", href: "/use-cases" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={<ConversationToAction />}
      />

      <Section tone="light" className="!pb-0">
        <Reveal>
          <Definition term="An AI voice agent">is software that conducts spoken conversations using artificial intelligence. It can understand what a caller wants and perform configured actions. Aurlynn is an AI voice agent platform for businesses.</Definition>
        </Reveal>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Explore" title="One voice platform. Thirteen capabilities.">
          Select a capability to see what it does and how it sounds in a conversation.
        </SectionHead>
        <div className="mt-12">
          <Explorer />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="How the capabilities connect" title="Listen. Understand. Decide. Act. Escalate.">
          Every Aurlynn workflow follows the same model. Choose a stage to see which capabilities work there.
        </SectionHead>
        <div className="mt-12">
          <ModelMap />
        </div>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Compare" title="Not an IVR. Not a chatbot." />
        <div className="mt-10">
          <Compare />
        </div>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <SectionHead eyebrow="Human + AI" title="AI handles the conversation. Humans handle what matters.">
            Aurlynn is not about replacing every human interaction. It is about giving people leverage. AI for scale. Humans for judgment.
          </SectionHead>
          <HandoffVisual reason="Conversation needs judgment" context={["Intent and requirement captured", "Answers recorded", "Summary attached"]} />
        </div>
      </Section>

      <RelatedLinks
        tone="alt"
        title="See the capabilities at work."
        links={[
          { label: "B2B sales workflows", href: "/b2b", text: "Qualify, book and follow up." },
          { label: "B2C customer workflows", href: "/b2c", text: "Enquiries, bookings and support." },
          { label: "Integrations", href: "/integrations", text: "Connect your systems." },
          { label: "Use cases", href: "/use-cases", text: "High-intent workflows to start with." },
          { label: "Industries", href: "/industries", text: "Journeys by industry." },
          { label: "How It Works", href: "/how-it-works", text: "From goal to working agent." },
        ]}
      />
      <FAQSection items={faqSets.capabilities} tone="light" />
      <CTABand title="See what you can automate." text="Tell us the conversation. We'll show you the workflow." primary={{ label: "See Aurlynn in Action", href: "/contact" }} secondary={{ label: "Build Your AI Agent", href: "/contact" }} />
    </>
  );
}
