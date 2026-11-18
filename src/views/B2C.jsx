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
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { BookingCard, RecordCard } from "@/components/visuals/Cards";
import { Link } from "@/components/ui/Link";
import { useStepper } from "@/hooks/useStepper";
import { faqSets } from "@/data/faqs";

const crumbs = [["Home", "/"], ["B2C", "/b2c"]];

const stages = [
  { name: "Enquiry", does: "Answers the question and finds out what the customer is looking for.", say: "Do you have the hybrid in white?", panel: "turns" },
  { name: "Qualification", does: "Captures requirements, contact details and preferences as structured data.", say: "Mostly city driving, and I'd like to test it this weekend.", panel: "record" },
  { name: "Booking", does: "Offers available slots and books the one the customer picks.", say: "Saturday morning works.", panel: "turns2" },
  { name: "Confirmation", does: "Confirms the appointment and updates the relevant system.", say: "Great, see you Saturday.", panel: "booking" },
  { name: "Follow-up", does: "Reminds, reschedules or checks in afterwards, on your rules.", say: "Can we move it to Sunday?", panel: "turns3" },
];

const panelTurns = {
  turns: [["caller", "Do you have the hybrid in white?"], ["agent", "Yes. Is it for daily city driving, or longer trips?"]],
  turns2: [["agent", "I have Saturday at 11:00 or 14:30."], ["caller", "Saturday morning works."]],
  turns3: [["agent", "Reminder: your appointment is tomorrow at 11:00."], ["caller", "Can we move it to Sunday?"], ["agent", "Of course. Sunday at 11:00?"]],
};

function JourneyScrubber() {
  const [ref, i, select] = useStepper(stages.length, { interval: 3000 });
  const s = stages[i];
  return (
    <div ref={ref}>
      <FlowDiagram steps={stages.map((x) => x.name)} active={i} onChange={select} />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.1fr]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={`l-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Stage {i + 1} · {s.name}</p>
            <p className="mt-3 font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">{s.does}</p>
            <p className="mt-6 border-l-2 border-accent pl-4 text-[15px] italic text-secondary">“{s.say}”</p>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div key={`r-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            {s.panel === "record" ? (
              <RecordCard title="Customer record" subtitle="Captured on the call" fields={[["Interest", "Hybrid SUV"], ["Colour", "White"], ["Use", "City driving"], ["Contact", "Verified"]]} />
            ) : s.panel === "booking" ? (
              <BookingCard title="Test drive confirmed" when="Saturday, 11:00" who="Customer notified" where="Showroom team updated" />
            ) : (
              <ConversationCard key={s.panel} title="Customer call" turns={panelTurns[s.panel]} status="Illustrative" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const verticals = [
  {
    id: "automotive", name: "Automotive", h: "Turn vehicle enquiries into showroom visits.", href: "/industries/automotive",
    uses: ["Vehicle enquiries", "Product questions", "Test-drive booking", "Dealer appointment booking", "Service booking", "Availability questions", "Follow-ups", "Customer questions"],
    journey: ["Customer enquires about a vehicle", "Aurlynn understands requirements", "Answers initial questions", "Captures details", "Offers a test drive", "Schedules it", "Confirms the appointment", "Updates the relevant system"],
  },
  {
    id: "real-estate", name: "Real Estate", h: "Turn property interest into site visits.", href: "/industries/real-estate",
    uses: ["Property enquiries", "Lead qualification", "Requirement capture", "Site visit scheduling", "Agent routing", "Follow-up"],
    journey: ["Property enquiry", "Requirements captured", "Qualification", "Site visit scheduled", "Agent routing", "Follow-up"],
  },
  {
    id: "healthcare", name: "Healthcare", h: "Make appointment conversations easier.", href: "/industries/healthcare",
    uses: ["Appointment requests", "Basic information", "Scheduling", "Reminders", "Follow-ups"],
    journey: ["Appointment request", "Basic information", "Scheduling", "Reminder", "Follow-up"],
    note: "Healthcare deployments should be configured carefully around organizational policies, privacy requirements and appropriate human escalation.",
  },
  {
    id: "education", name: "Education", h: "Keep prospective students moving.", href: "/industries/education",
    uses: ["Course enquiries", "Admissions enquiries", "Information collection", "Counselling appointments", "Follow-ups"],
    journey: ["Course enquiry", "Information collection", "Counselling appointment", "Follow-up"],
  },
  {
    id: "travel", name: "Travel & Hospitality", h: "Make booking conversations effortless.", href: "/industries/travel-hospitality",
    uses: ["Booking enquiries", "Reservations", "Customer questions", "Availability", "Confirmation", "Follow-up"],
    journey: ["Booking enquiry", "Availability", "Reservation", "Confirmation", "Follow-up"],
  },
];

function Verticals() {
  const [id, setId] = useState(verticals[0].id);
  const v = verticals.find((x) => x.id === id);
  return (
    <div>
      <div role="tablist" aria-label="Industries" className="flex gap-1 overflow-x-auto border-b border-white/10 pb-px [scrollbar-width:none]">
        {verticals.map((x) => (
          <button
            key={x.id}
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={x.id === id}
            aria-controls="vertical-panel"
            onClick={() => setId(x.id)}
            className={`relative shrink-0 px-4 py-3 text-[0.95rem] transition-colors ${x.id === id ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            {x.name}
            {x.id === id && <motion.span layoutId="vtab" className="absolute inset-x-3 -bottom-px h-[2px] bg-accent" />}
          </button>
        ))}
      </div>
      <div id="vertical-panel" role="tabpanel" aria-labelledby={`tab-${id}`} className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <h3 className="font-[family-name:var(--font-sora)] text-2xl font-medium leading-tight sm:text-3xl">{v.h}</h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {v.uses.map((u) => (
                <li key={u} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80">
                  {u}
                </li>
              ))}
            </ul>
            {v.note && <p className="mt-6 border-l-2 border-accent pl-4 text-[13.5px] leading-relaxed text-white/60">{v.note}</p>}
            <Link href={v.href} className="mt-7 inline-block text-sm text-accent-light underline underline-offset-4 hover:text-white">
              {v.name} in detail
            </Link>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div key={`j-${id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <p className="mono mb-5 text-[10.5px] uppercase tracking-[0.14em] text-accent-light">Example journey</p>
            <FlowDiagram dark vertical steps={v.journey} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const examples = ["Vehicle enquiries", "Test-drive booking", "Property enquiries", "Site visits", "Healthcare appointments", "Course enquiries", "Hotel and travel enquiries", "Service appointments", "Customer support", "Booking confirmation", "Rescheduling", "Reminders", "Feedback", "Re-engagement"];

export default function B2C() {
  return (
    <>
      <Seo
        title="AI Voice Agents for Customer Service & Booking | Aurlynn"
        description="Automate customer enquiries, appointment booking, confirmations, follow-ups and support with AI voice agents."
        path="/b2c"
        crumbs={crumbs}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow="Aurlynn for B2C"
        title="AI Voice Agents for Customer Enquiries, Bookings and Support"
        lead="Give customers an immediate voice response, and connect every conversation to the next action. Aurlynn can answer enquiries, qualify customers, schedule appointments, confirm bookings, follow up and escalate to humans when needed."
        primary={{ label: "Automate Customer Conversations", href: "/contact" }}
        secondary={{ label: "Explore Capabilities", href: "/capabilities" }}
        visual={
          <ConversationCard
            title="Customer enquiry"
            turns={[["caller", "Hi, I'd like to test drive the hybrid."], ["agent", "Great choice. Which day suits you?"], ["caller", "Saturday morning."], ["agent", "I have 11:00 at the showroom. Shall I book it?"]]}
            actionLabel="Test drive booked"
            actionDetail="→ confirmation sent"
          />
        }
      />

      <Section tone="light">
        <SectionHead eyebrow="Customer journey" title="From enquiry to action.">
          From the first enquiry to the final follow-up, Aurlynn can manage customer conversations across the journey. Step through it to see what the agent does and what the business gets.
        </SectionHead>
        <div className="mt-12">
          <JourneyScrubber />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="Industry journeys" title="The same conversation, shaped by your industry." />
        <div className="mt-10">
          <Verticals />
        </div>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Examples" title="Conversations Aurlynn can handle across the customer journey." />
        <Stagger as="ul" className="mt-10 flex flex-wrap gap-2.5">
          {examples.map((e) => (
            <StaggerItem as="li" key={e} className="border-card rounded-full px-4 py-2.5 text-[0.95rem]">
              {e}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="light">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHead eyebrow="Human handoff" title="Escalate to a person when it matters.">
            Aurlynn can answer routine questions and book the next step. When a customer needs judgment, an exception or a specialist, the conversation can be passed to your team together with what has been captured.
          </SectionHead>
          <RecordCard title="Handoff summary" subtitle="Passed to your team" status="Escalated" fields={[["Reason", "Needs a specialist"], ["Customer", "Name and contact verified"], ["Request", "Captured in the call"], ["Next step", "Callback requested"]]} />
        </div>
      </Section>

      <RelatedLinks
        tone="alt"
        title="Popular customer-facing workflows."
        links={[
          { label: "AI Appointment Booking", href: "/use-cases/ai-appointment-booking", text: "Turn conversations into scheduled appointments." },
          { label: "AI Enquiry Handling", href: "/use-cases/ai-enquiry-handling", text: "Answer routine questions, route the rest." },
          { label: "AI Customer Support", href: "/use-cases/ai-customer-support", text: "Without rigid menus." },
          { label: "AI Receptionist", href: "/use-cases/ai-receptionist", text: "Answer every call and route it." },
          { label: "Automotive", href: "/industries/automotive", text: "Enquiries to showroom visits." },
          { label: "Real Estate", href: "/industries/real-estate", text: "Property interest to site visits." },
          { label: "Healthcare", href: "/industries/healthcare", text: "Easier appointment conversations." },
        ]}
      />
      <FAQSection items={faqSets.b2c} tone="light" />
      <CTABand title="Your customers shouldn't have to wait for an answer." text="See how Aurlynn can respond to every customer conversation." primary={{ label: "See Aurlynn in Action", href: "/contact" }} secondary={{ label: "Build Your AI Agent", href: "/contact" }} />
    </>
  );
}
