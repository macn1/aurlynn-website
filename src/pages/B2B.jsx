import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { BookingCard, HandoffVisual, RecordCard } from "@/components/visuals/Cards";
import { useStepper } from "@/hooks/useStepper";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["B2B", "/b2b"]];

const criteria = [
  { k: "Need", q: "What are you hoping to solve first?", v: "Calls missed after hours" },
  { k: "Product interest", q: "Which part of the platform caught your eye?", v: "Inbound voice agent" },
  { k: "Use case", q: "Where would the agent help most?", v: "Lead response" },
  { k: "Timing", q: "When would you like this in place?", v: "This quarter" },
  { k: "Location", q: "Which regions would the agent cover?", v: "UK and Ireland" },
  { k: "Budget", q: "Is there a range you are working to?", v: "Range shared" },
  { k: "Existing solution", q: "What handles these calls today?", v: "Voicemail and a shared inbox" },
  { k: "Decision process", q: "Who else is involved in the decision?", v: "Head of Sales, IT lead" },
  { k: "Other criteria", q: "Anything else that matters to your team?", v: "Team of 20 reps" },
];

function QualifierDemo() {
  const [ref, i, select] = useStepper(criteria.length, { interval: 2000 });
  const cur = criteria[i];
  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
      <div>
        <ul className="flex flex-wrap gap-2" aria-label="Qualification criteria">
          {criteria.map((c, n) => (
            <li key={c.k}>
              <button
                type="button"
                onClick={() => select(n)}
                aria-pressed={n === i}
                className={`rounded-full border px-4 py-2 text-[13.5px] transition-all duration-300 ${n === i ? "border-dark bg-dark text-white" : n < i ? "border-accent/60 bg-accent-light/40" : "border-border bg-white hover:border-accent/60"}`}
              >
                {c.k}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8 min-h-[9.5rem] rounded-2xl border border-border bg-white p-5" aria-live="polite">
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-secondary">Aurlynn asks</p>
          <motion.p key={cur.q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">
            “{cur.q}”
          </motion.p>
          <p className="mono mt-5 text-[10px] uppercase tracking-[0.14em] text-secondary">Captured as</p>
          <motion.p key={cur.v} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-1.5 text-[15px]">
            <span className="text-accent">{cur.k}:</span> {cur.v}
          </motion.p>
        </div>
        <p className="mono mt-4 text-[11px] uppercase tracking-[0.12em] text-secondary">Illustrative · criteria are defined by your business</p>
      </div>
      <RecordCard title="Lead record" subtitle="Qualification in progress" fields={criteria.map((c) => [c.k, c.v])} filled={i + 1} status={i === criteria.length - 1 ? "Qualified" : undefined} />
    </div>
  );
}

function Lanes() {
  const lanes = [
    { t: "Without a fast response", dim: true, steps: ["Form submitted", "Waiting in queue", "Callback, hours or days later", "Interest has moved on"] },
    { t: "With Aurlynn", steps: ["Form submitted", "Aurlynn responds", "Need and timing captured", "Meeting booked"] },
  ];
  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-2">
      {lanes.map((l, li) => (
        <div key={l.t} className="border-card rounded-lg p-5 sm:p-6">
          <p className={`mono text-[10.5px] uppercase tracking-[0.14em] ${l.dim ? "text-white/50" : "text-accent-light"}`}>{l.t}</p>
          <ol className="mt-5 space-y-3">
            {l.steps.map((s, n) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: l.dim && n === 3 ? 0.45 : 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: li * 0.25 + n * 0.14 }}
                className="flex items-center gap-3 text-[0.95rem]"
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] ${l.dim ? "bg-white/10 text-white/60" : "bg-accent text-white"}`}>{n + 1}</span>
                {s}
              </motion.li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

const triggers = [
  { say: "Qualified", does: "Create or update CRM opportunity", understood: "Meets the configured criteria" },
  { say: "Meeting requested", does: "Schedule the appointment", understood: "Wants to speak with sales" },
  { say: "Information missing", does: "Collect it in the same call", understood: "A required field is empty" },
  { say: "Needs a specialist", does: "Route to a human", understood: "Outside the agent's scope" },
  { say: "Follow-up requested", does: "Start the defined follow-up", understood: "Prefers a later conversation" },
  { say: "Appointment confirmed", does: "Update the record", understood: "Time and attendee agreed" },
];

function Triggers() {
  const [ref, i, select] = useStepper(triggers.length, { interval: 2600 });
  const t = triggers[i];
  return (
    <div ref={ref} className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.2fr] lg:gap-14">
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {triggers.map((r, n) => (
          <li key={r.say}>
            <button type="button" onClick={() => select(n)} aria-pressed={n === i} className={`flex w-full items-center justify-between py-4 text-left transition-colors ${n === i ? "text-white" : "text-white/50 hover:text-white/80"}`}>
              <span className="font-[family-name:var(--font-sora)] text-lg">{r.say}</span>
              <ArrowRight aria-hidden size={16} className={`transition-all duration-300 ${n === i ? "translate-x-0 text-accent-light opacity-100" : "-translate-x-2 opacity-0"}`} />
            </button>
          </li>
        ))}
      </ul>
      <div className="grid content-center gap-3 sm:grid-cols-3" aria-live="polite">
        {[["Customer says", t.say], ["Aurlynn understands", t.understood], ["Business system", t.does]].map(([k, v], n) => (
          <motion.div key={`${i}-${k}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.15, duration: 0.5 }} className="border-card relative rounded-lg p-5">
            <p className="mono text-[10px] uppercase tracking-[0.14em] text-accent-light">{k}</p>
            <p className="mt-3 font-[family-name:var(--font-sora)] text-lg leading-snug">{v}</p>
            {n < 2 && <ArrowRight aria-hidden size={16} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-accent-light sm:block" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VerifyDemo() {
  const [ref, i] = useStepper(5, { interval: 1500, loop: false });
  return (
    <div ref={ref}>
      <RecordCard
        title="Lead record"
        subtitle="Verified during the call"
        status={i >= 4 ? "Complete" : "Updating"}
        filled={i + 1}
        fields={[["Name", "Priya Rao"], ["Phone", "Confirmed on call"], ["Email", "Missing → collected"], ["Company", "Northline Ltd"], ["Role", "Head of Sales"]]}
      />
    </div>
  );
}

export default function B2B() {
  return (
    <>
      <Seo
        title="AI Voice Agents for B2B Sales & Lead Qualification | Aurlynn"
        description="Respond to B2B leads, qualify prospects, book meetings and automate follow-up with AI voice agents."
        path="/b2b"
        crumbs={crumbs}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Aurlynn for B2B"
        title="AI Voice Agents for B2B Sales, Lead Qualification and Follow-up"
        lead="Respond to prospects instantly. Qualify opportunities automatically. Book meetings without waiting for a salesperson to call back. Aurlynn gives B2B teams AI voice agents that can handle inbound and permission-based outbound conversations and connect them to sales workflows."
        primary={{ label: "Qualify More Leads", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={
          <ConversationCard
            title="Inbound lead"
            direction="Outbound response"
            turns={[["agent", "Hi Priya, you just asked about our voice agents. Is now a good moment?"], ["caller", "Yes, go ahead."], ["agent", "What are you hoping to solve first?"], ["caller", "We miss calls after hours and leads go cold."]]}
            actionLabel="Qualified"
            actionDetail="→ routed to sales"
          />
        }
      />

      <Section tone="dark">
        <SectionHead eyebrow="Capture every opportunity" title="Respond while intent is high.">
          A lead that waits may become a lead that disappears. Aurlynn can respond to inbound enquiries quickly, identify why the prospect reached out, collect relevant information and determine what should happen next.
        </SectionHead>
        <Lanes />
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Qualify before your sales team calls" title="Let sales conversations start further down the funnel.">
          Aurlynn can conduct initial qualification conversations using your business-defined criteria. Select a criterion to see what the agent asks and what it captures. Qualified opportunities can then be routed to the appropriate sales representative.
        </SectionHead>
        <div className="mt-12">
          <QualifierDemo />
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead eyebrow="Verify and enrich lead information" title="Better information before the handoff.">
              Aurlynn can validate contact details, ask for missing information and capture structured responses during the conversation. The result is a more useful lead record for the next human or automated workflow.
            </SectionHead>
          </div>
          <VerifyDemo />
        </div>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Book meetings automatically" title="From qualified lead to calendar invite.">
          When a prospect is ready, Aurlynn can connect the conversation to scheduling workflows.
        </SectionHead>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <FlowDiagram steps={[{ label: "Qualify", sub: "Criteria met" }, { label: "Find availability", sub: "Scheduling workflow" }, { label: "Book", sub: "Time agreed" }, { label: "Confirm", sub: "Sent to the prospect" }, { label: "Update CRM", sub: "Record written back" }]} />
          <BookingCard title="Meeting booked" when="Thursday, 11:00" who="Priya Rao · Head of Sales" where="With a sales representative" />
        </div>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Follow up and promote" title="Don't let interested prospects disappear." />
        <Stagger className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <StaggerItem className="border-card rounded-lg p-6 sm:p-8">
            <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Follow up automatically</p>
            <p className="mt-3 max-w-[48ch] text-[1.02rem] leading-relaxed">Aurlynn can execute business-defined follow-up workflows for qualified leads, missed opportunities and re-engagement campaigns.</p>
            <ol className="mt-6 grid gap-2 sm:grid-cols-3">
              {["Qualified lead, no meeting yet", "Missed opportunity", "Re-engagement campaign"].map((s, n) => (
                <li key={s} className="rounded-md bg-background-secondary px-3.5 py-3 text-[13px]">
                  <span className="mono mb-1 block text-[10px] text-accent">0{n + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </StaggerItem>
          <StaggerItem className="border-card rounded-lg p-6 sm:p-8">
            <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Content promotion</p>
            <h3 className="mt-3 font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">Turn opted-in audiences into conversations.</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["Webinars", "Whitepapers", "Research", "Reports", "Product content", "Events", "Educational resources"].map((c) => (
                <li key={c} className="rounded-full border border-border px-3 py-1.5 text-[13px]">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-secondary">All outbound communication should follow applicable consent, opt-in and communication requirements.</p>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="Conversation-driven workflows" title="The conversation can trigger what happens next.">
          A conversation is not the end of the workflow. It can become the trigger: customer says X, Aurlynn understands, a business system does Y.
        </SectionHead>
        <Triggers />
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <SectionHead eyebrow="Human handoff" title="Know when AI should step aside.">
            Aurlynn can be configured to escalate conversations when the workflow requires human judgment, expertise or intervention.
          </SectionHead>
          <Reveal>
            <HandoffVisual reason="Prospect needs a specialist" context={["Contact details verified", "Qualification answers captured", "Conversation summary attached"]} />
          </Reveal>
        </div>
      </Section>

      <RelatedLinks
        tone="alt"
        title="Where B2B teams start."
        links={[
          { label: "AI Lead Qualification", href: "/use-cases/ai-lead-qualification", text: "Qualify inbound opportunities before sales gets involved." },
          { label: "AI Inbound Lead Response", href: "/use-cases/ai-inbound-lead-response", text: "Respond to leads when intent is highest." },
          { label: "AI Appointment Booking", href: "/use-cases/ai-appointment-booking", text: "Turn qualified conversations into meetings." },
          { label: "AI Follow-up Agent", href: "/use-cases/ai-follow-up-agent", text: "Keep prospects moving on your rules." },
          { label: "AI Sales Assistant", href: "/use-cases/ai-sales-assistant", text: "Give reps back their time." },
          { label: "CRM Integration", href: "/integrations", text: "Connect outcomes to your CRM." },
          { label: "How It Works", href: "/how-it-works", text: "From business goal to working agent." },
        ]}
      />
      <FAQSection items={faqSets.b2b} tone="light" />
      <CTABand title="Give your sales team conversations worth having." text="Let Aurlynn handle the first conversation, so your team starts with qualified opportunities." />
    </>
  );
}
