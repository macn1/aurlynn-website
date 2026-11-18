"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTABand } from "@/components/sections/CTABand";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["Pricing", "/pricing"]];

const factors = [
  ["Conversation volume", "How many calls the agent will handle."],
  ["Workflow complexity", "How many steps, rules and branches a conversation has."],
  ["Integrations", "Which systems the agent reads from and writes to."],
  ["Deployment requirements", "Inbound, outbound, hours of coverage and environment."],
  ["Service configuration", "How the agent is set up, tested and supported."],
];

const questions = [
  { id: "dir", q: "Which conversations?", opts: ["Inbound", "Outbound", "Both"] },
  { id: "wf", q: "How many workflows?", opts: ["One", "A few", "Many"] },
  { id: "int", q: "Which systems?", opts: ["None yet", "CRM or calendar", "Several systems"] },
  { id: "vol", q: "Expected volume?", opts: ["Pilot", "Steady", "High"] },
];

function ScopeBuilder() {
  const [a, setA] = useState({ dir: 0, wf: 0, int: 1, vol: 0 });
  const brief = questions.map((q) => `${q.q.replace("?", "")}: ${q.opts[a[q.id]]}`);
  const href = `/contact?brief=${encodeURIComponent(brief.join("; "))}`;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
      <div className="space-y-7">
        {questions.map((q) => (
          <fieldset key={q.id}>
            <legend className="font-[family-name:var(--font-sora)] text-lg font-medium">{q.q}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.opts.map((o, n) => (
                <label key={o} className={`cursor-pointer rounded-full border px-4 py-2 text-[0.95rem] transition-all duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-accent ${a[q.id] === n ? "border-dark bg-dark text-white" : "border-border bg-white hover:border-accent/60"}`}>
                  <input type="radio" name={q.id} className="sr-only" checked={a[q.id] === n} onChange={() => setA({ ...a, [q.id]: n })} />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8" aria-live="polite">
        <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Your scoping brief</p>
        <ul className="mt-5 space-y-3">
          {brief.map((b) => (
            <li key={b} className="flex gap-2.5 text-[0.95rem]">
              <Check size={16} aria-hidden className="mt-1 shrink-0 text-accent" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[13px] leading-relaxed text-secondary">This is a starting point for a conversation, not a quote. We'll price the specific use case with you.</p>
        <Button href={href} arrow className="mt-6">
          Send this to sales
        </Button>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <Seo title="AI Voice Agent Pricing | Aurlynn" description="Aurlynn pricing is based on your use case: conversation volume, workflow complexity, integrations, deployment requirements and service configuration." path="/pricing" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Pricing"
        title="Pricing built around your use case."
        lead="The cost of an AI voice agent depends on factors such as conversation volume, workflow complexity, integrations, deployment requirements and service configuration. Aurlynn pricing is presented based on the specific use case rather than an unsupported universal price."
        primary={{ label: "Talk to an Expert", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={
          <div className="rounded-2xl border border-border bg-white/80 p-6 backdrop-blur">
            <p className="mono mb-4 text-[10.5px] uppercase tracking-[0.14em] text-accent">What shapes the cost</p>
            <ul className="divide-y divide-border">
              {factors.map(([t]) => (
                <li key={t} className="flex items-center gap-3 py-3 text-[0.95rem]">
                  <Check size={15} aria-hidden className="text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="light">
        <SectionHead eyebrow="Five factors" title="What we scope with you." />
        <Stagger as="ul" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {factors.map(([t, d], n) => (
            <StaggerItem as="li" key={t} className="border-card rounded-lg p-5">
              <span className="mono text-[11px] text-accent">0{n + 1}</span>
              <p className="mt-6 font-[family-name:var(--font-sora)] font-medium leading-snug">{t}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-secondary">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Scope builder" title="Describe the shape of your deployment.">
          Answer four questions and send the brief to our team. No prices are shown because they depend on your specific workflow.
        </SectionHead>
        <div className="mt-12">
          <ScopeBuilder />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="From scoping to live" title="How a deployment typically goes.">
          Businesses typically define the desired workflow, configure the agent, connect relevant systems, test the experience and then deploy it into the appropriate voice workflow.
        </SectionHead>
        <div className="mt-12">
          <FlowDiagram dark steps={[{ label: "Define", sub: "The workflow" }, { label: "Configure", sub: "The agent" }, { label: "Connect", sub: "Relevant systems" }, { label: "Test", sub: "The experience" }, { label: "Deploy", sub: "Into the voice workflow" }]} />
        </div>
      </Section>

      <FAQSection items={faqSets.pricing} tone="light" />
      <CTABand title="Get pricing for your use case." text="Tell us the workflow and volume. We'll come back with a scoped proposal." primary={{ label: "Talk to an Expert", href: "/contact" }} secondary={{ label: "Discuss Your Workflow", href: "/contact" }} />
    </>
  );
}
