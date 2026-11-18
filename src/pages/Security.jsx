import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FileSearch, KeyRound, MessageSquareCheck, Plug, Scale, ShieldCheck, SlidersHorizontal, UserCheck, Activity } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal } from "@/components/motion/Reveal";
import { HandoffVisual } from "@/components/visuals/Cards";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["Security & Trust", "/security"]];

// Source: brand document, "Trust". Descriptions explain the intent; specifics are configured per deployment.
const controls = [
  { Icon: ShieldCheck, t: "Privacy-conscious workflows", d: "Workflows shaped around what information a conversation should and should not collect or use." },
  { Icon: MessageSquareCheck, t: "Consent-based communication", d: "Outbound conversations designed to follow applicable consent, opt-in and communication requirements." },
  { Icon: UserCheck, t: "Human escalation", d: "Rules that bring a person into the conversation when judgment or intervention is needed." },
  { Icon: FileSearch, t: "Auditability", d: "Conversation outcomes that can be reviewed afterwards." },
  { Icon: Activity, t: "Monitoring", d: "Visibility into how conversations and workflows are performing." },
  { Icon: SlidersHorizontal, t: "Business rules", d: "The agent acts within rules your organization defines." },
  { Icon: KeyRound, t: "Access controls", d: "Who and what can reach the agent, its data and its configuration." },
  { Icon: Plug, t: "Integration controls", d: "Deliberate choices about which systems the agent can read from and act in." },
  { Icon: Eye, t: "Conversation quality management", d: "Review of conversations to keep the experience accurate and appropriate." },
  { Icon: Scale, t: "Compliance considerations", d: "Deployments configured around your organization's data-handling and regulatory requirements." },
];

function Controls() {
  const [i, setI] = useState(0);
  const c = controls[i];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <ul className="grid gap-2 sm:grid-cols-2">
        {controls.map((x, n) => (
          <li key={x.t}>
            <button type="button" onClick={() => setI(n)} aria-pressed={n === i} className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-[0.92rem] transition-all duration-300 ${n === i ? "border-accent bg-accent/15" : "border-white/10 hover:border-white/30"}`}>
              <x.Icon size={17} aria-hidden className={n === i ? "text-accent-light" : "text-white/50"} />
              {x.t}
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite" className="flex min-h-[15rem] items-center">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <c.Icon size={26} aria-hidden className="text-accent-light" />
            <h3 className="mt-5 font-[family-name:var(--font-sora)] text-2xl font-medium">{c.t}</h3>
            <p className="lead mt-3">{c.d}</p>
            <p className="mono mt-6 text-[10px] uppercase tracking-[0.14em] text-white/45">Configured per deployment</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Security() {
  return (
    <>
      <Seo title="AI Voice Agent Security, Privacy & Trust | Aurlynn" description="How Aurlynn voice agents are configured around business rules, access requirements, escalation policies and data-handling requirements." path="/security" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Security & trust"
        title="Built for business conversations."
        lead="Business conversations can involve customer information, internal processes and consequential actions. Aurlynn should be configured around your organization's business rules, access requirements, escalation policies and data-handling requirements."
        primary={{ label: "Talk to an Expert", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={
          <div className="rounded-2xl border border-border bg-white/80 p-6 backdrop-blur">
            <p className="mono mb-4 text-[10.5px] uppercase tracking-[0.14em] text-accent">Designed to support</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13.5px]">
              {controls.slice(0, 8).map((c) => (
                <li key={c.t} className="flex items-center gap-2">
                  <c.Icon size={14} aria-hidden className="shrink-0 text-accent" />
                  {c.t}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <Section tone="dark">
        <SectionHead eyebrow="Designed to support" title="Ten areas of control." >
          Select one to see what it means. Specifics depend on the architecture, configuration and integrations of each deployment.
        </SectionHead>
        <div className="mt-12">
          <Controls />
        </div>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <SectionHead eyebrow="Human in the loop" title="Escalation is part of the design.">
            An AI voice workflow can include human escalation when a conversation requires judgment, expertise or intervention. The person receives the context, so the caller does not start again.
          </SectionHead>
          <HandoffVisual reason="Defined escalation rule met" context={["What the caller asked", "What was captured", "Conversation summary"]} />
        </div>
      </Section>

      <Section tone="alt">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow-sm !text-accent">Certifications</p>
            <h2 className="h-section mt-4">We only list what's confirmed.</h2>
            <p className="lead mt-5">No security certifications or standards are listed on this page yet. Specific certifications or standards will appear here only once they are confirmed. If your procurement process requires specific assurances, ask us and we will answer plainly.</p>
          </Reveal>
        </div>
      </Section>

      <RelatedLinks title="Related." links={[{ label: "How It Works", href: "/how-it-works", text: "Where rules and escalation are set." }, { label: "Integrations", href: "/integrations", text: "How systems are connected." }, { label: "FAQ", href: "/faq", text: "40 answers about AI voice agents." }]} />
      <FAQSection items={faqSets.security} tone="alt" />
      <CTABand title="Discuss your requirements." text="Bring your data-handling, access and escalation requirements. We'll design the workflow around them." primary={{ label: "Talk to an Expert", href: "/contact" }} secondary={{ label: "Discuss Your Workflow", href: "/contact" }} />
    </>
  );
}
