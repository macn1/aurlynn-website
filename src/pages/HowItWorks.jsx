import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks, Definition } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal } from "@/components/motion/Reveal";
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { BookingCard, HandoffVisual, RecordCard } from "@/components/visuals/Cards";
import { AnalyticsMock, ConnectVisual } from "@/components/visuals/Diagrams";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { steps7, model } from "@/data/capabilities";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["How It Works", "/how-it-works"]];

function StepVisual({ i }) {
  switch (i) {
    case 0:
      return <RecordCard title="Agent brief" subtitle="Defined first" fields={[["Outcome", "Qualify inbound leads"], ["Success", "Meeting booked"], ["Rules", "Business-defined criteria"], ["Escalate when", "Specialist requested"]]} />;
    case 1:
      return <ConnectVisual />;
    case 2:
      return <ConversationCard title="Live call" turns={[["agent", "Hello, thanks for calling. How can I help?"], ["caller", "I'd like to know about your premium plan."], ["agent", "Happy to help. Is it for a team?"]]} />;
    case 3:
      return <RecordCard title="Understood" subtitle="From the conversation" fields={[["Intent", "Pricing enquiry"], ["Context", "Team of 20"], ["Answers", "Timing: this quarter"], ["Next step", "Book a meeting"]]} />;
    case 4:
      return <BookingCard title="Meeting booked" when="Thursday, 11:00" who="Record updated" where="Confirmation sent" />;
    case 5:
      return <HandoffVisual reason="Caller needs a specialist" context={["Intent captured", "Answers recorded", "Summary attached"]} />;
    default:
      return <AnalyticsMock />;
  }
}

function Step({ s, i, active, setActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-42% 0px -42% 0px" });
  useEffect(() => {
    if (inView) setActive(i);
  }, [inView, i, setActive]);
  return (
    <li ref={ref} className="relative lg:min-h-[72vh] lg:py-[14vh]">
      <div className={`transition-opacity duration-500 ${active === i ? "opacity-100" : "lg:opacity-35"}`}>
        <p className="mono text-[11px] uppercase tracking-[0.16em] text-accent">{s.n} — {s.name}</p>
        <h3 className="mt-3 font-[family-name:var(--font-sora)] text-2xl font-medium leading-tight sm:text-[2rem]">{s.text}</h3>
        <p className="lead mt-4 max-w-[48ch]">{s.detail}</p>
      </div>
      <div className="mt-8 lg:hidden">
        <StepVisual i={i} />
      </div>
    </li>
  );
}

function Sticky7() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <ol className="relative">
        {steps7.map((s, i) => (
          <Step key={s.n} s={s} i={i} active={active} setActive={setActive} />
        ))}
      </ol>
      <div className="relative hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+4vh)] flex h-[calc(100vh-var(--nav-h)-8vh)] flex-col justify-center">
          <div className="mb-6 flex gap-1.5" aria-hidden>
            {steps7.map((s, i) => (
              <span key={s.n} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-accent" : "bg-border"}`} />
            ))}
          </div>
          <div aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <StepVisual i={active} />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mono mt-5 text-[10.5px] uppercase tracking-[0.14em] text-secondary">
            Step {steps7[active].n} · {steps7[active].name} · Illustrative
          </p>
        </div>
      </div>
    </div>
  );
}

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
        <SectionHead eyebrow="Seven steps" title="Conversations become actions.">
          Scroll through the process. Each step shows what happens and what the business sees.
        </SectionHead>
        <div className="mt-8 lg:mt-4">
          <Sticky7 />
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
