"use client";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks, Definition } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal } from "@/components/motion/Reveal";
import { HowItWorksDemo } from "@/components/howitworks/HowItWorksDemo";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { model } from "@/data/capabilities";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["How It Works", "/how-it-works"]];

export default function HowItWorks() {
  return (
    <>
      <Seo
        title="How AI Voice Agents Work | Aurlynn"
        description="How an AI voice agent goes from business goal to working agent: define, connect, converse, understand, act, escalate and learn."
        path="/how-it-works"
        crumbs={crumbs}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="How it works"
        title="From business goal to working AI voice agent."
        lead="An AI voice agent listens to a caller, interprets what they mean, determines the appropriate response or action and continues the conversation based on business-defined rules. Seven steps take it from an outcome you define to a workflow you can improve."
        primary={{ label: "See Aurlynn in Action", href: "/contact" }}
        secondary={{ label: "Explore Capabilities", href: "/capabilities" }}
        visual={
          <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-[0_24px_60px_-30px_rgba(10,10,11,.2)] backdrop-blur">
            <p className="mono mb-5 text-[10.5px] uppercase tracking-[0.14em] text-accent">Aurlynn's model</p>
            <FlowDiagram steps={model.map((m) => ({ label: m }))} vertical />
          </div>
        }
      />

      <Section tone="light" className="!pb-4">
        <Reveal>
          <Definition term="Listen → Understand → Decide → Act → Escalate">is how Aurlynn summarises a voice workflow: hear the caller, interpret intent, choose the next step, perform the configured action and bring in a person when the rules require it.</Definition>
        </Reveal>
      </Section>

      <Section tone="light" className="!pt-[clamp(2rem,4vw,4rem)]">
        <SectionHead eyebrow="Seven steps" title="One conversation. Seven intelligent steps.">
          From the moment a customer calls to the moment their request is resolved, Aurlynn handles every stage intelligently.
        </SectionHead>
        <div className="mt-10">
          <HowItWorksDemo />
        </div>
      </Section>

      <Section tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow-sm mb-5 !text-accent-light">The takeaway</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="h-section">You don't need to think about Aurlynn as another call center system.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mt-6">Think of it as a digital employee for conversations, one configured around a specific business outcome.</p>
          </Reveal>
        </div>
      </Section>

      <RelatedLinks
        title="Go deeper."
        links={[
          { label: "Capabilities", href: "/capabilities", text: "What an agent can do." },
          { label: "Integrations", href: "/integrations", text: "Connect your systems." },
          { label: "Security & Trust", href: "/security", text: "Controls and human escalation." },
          { label: "Use cases", href: "/use-cases", text: "Where teams start." },
          { label: "Industries", href: "/industries", text: "Journeys by industry." },
          { label: "Pricing", href: "/pricing", text: "How scope shapes cost." },
        ]}
      />
      <FAQSection items={faqSets.howItWorks} tone="alt" />
      <CTABand title="Start with the outcome." text="Tell us what the agent should accomplish. We'll help you define the workflow." primary={{ label: "Build Your AI Agent", href: "/contact" }} secondary={{ label: "Talk to an Expert", href: "/contact" }} />
    </>
  );
}
