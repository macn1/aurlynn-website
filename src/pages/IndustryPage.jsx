import { useParams } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection, Accordion } from "@/components/sections/FAQSection";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { HandoffVisual, RecordCard } from "@/components/visuals/Cards";
import { useStepper } from "@/hooks/useStepper";
import { industries, industryBySlug } from "@/data/industries";
import { useCaseBySlug } from "@/data/useCases";
import { faqs } from "@/data/faqs";
import NotFound from "./NotFound";

function Solution({ ind, flip }) {
  const [ref, i] = useStepper(ind.ui.fields.length + 1, { interval: 1500, loop: false });
  return (
    <div ref={ref} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div>
        <SectionHead eyebrow="The Aurlynn solution" title={`A voice agent for ${ind.name.toLowerCase()} conversations.`}>
          {ind.solution}
        </SectionHead>
      </div>
      <RecordCard title={`${ind.ui.who} call`} subtitle="Captured during the conversation" fields={ind.ui.fields} filled={Math.min(i, ind.ui.fields.length)} status={i >= ind.ui.fields.length ? "Done" : undefined} />
    </div>
  );
}

export default function IndustryPage() {
  const { slug } = useParams();
  const ind = industryBySlug[slug];
  if (!ind) return <NotFound />;
  const idx = industries.indexOf(ind);
  const flip = idx % 2 === 1;
  const crumbs = [["Home", "/"], ["Industries", "/industries"], [ind.name, `/industries/${ind.slug}`]];
  const own = ind.faq.map((q) => faqs.find((f) => f.q === q)).filter(Boolean);
  const pageFaq = [
    ...ind.objections.map(([q, a]) => ({ q, a })),
    ...own,
  ];
  const ucLinks = ind.uc.map((s) => useCaseBySlug[s]).filter(Boolean).map((u) => ({ label: u.name, href: `/use-cases/${u.slug}`, text: u.lead }));

  return (
    <>
      <Seo title={ind.title} description={ind.lead} path={`/industries/${ind.slug}`} crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`Aurlynn for ${ind.name}`}
        title={ind.h1}
        lead={ind.lead}
        primary={{ label: "See Aurlynn in Action", href: "/contact" }}
        secondary={{ label: "Explore Use Cases", href: "/use-cases" }}
        visual={
          <ConversationCard
            title={`${ind.ui.who} call`}
            turns={[["caller", ind.ui.ask], ["agent", "Happy to help. Let me ask a couple of quick questions."]]}
            actionLabel={ind.ui.fields[ind.ui.fields.length - 1].join(": ")}
            actionDetail="→ system updated"
          />
        }
      />

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <SectionHead eyebrow="The problem" title={ind.problem.t}>
            {ind.problem.d}
          </SectionHead>
          <Reveal delay={0.1} className="border-l border-white/15 pl-6">
            <p className="mono text-[10.5px] uppercase tracking-[0.14em] text-accent-light">Why voice matters</p>
            <p className="lead mt-3">{ind.why}</p>
          </Reveal>
        </div>
      </Section>

      <Section tone="light">
        <Solution ind={ind} flip={flip} />
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Use cases" title={`Conversations Aurlynn handles in ${ind.name.toLowerCase()}.`} />
        <Stagger as="ul" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ind.useCases.map((u, n) => (
            <StaggerItem as="li" key={u} className={`border-card rounded-lg p-5 ${n === 0 ? "sm:col-span-2" : ""}`}>
              <span className="mono text-[11px] text-accent">{String(n + 1).padStart(2, "0")}</span>
              <p className={`mt-6 font-[family-name:var(--font-sora)] font-medium leading-snug ${n === 0 ? "text-xl" : "text-[1.02rem]"}`}>{u}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Example customer journey" title="From first contact to follow-up." />
        <div className="mt-12">
          <FlowDiagram steps={ind.journey} vertical={flip} className={flip ? "max-w-xl" : ""} />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="Business outcomes" title="What teams can pursue." />
        <Stagger as="ul" className="mt-12 grid gap-4 md:grid-cols-3">
          {ind.outcomes.map((o) => (
            <StaggerItem as="li" key={o} className="border-card rounded-lg p-6">
              <span aria-hidden className="block h-px w-10 bg-accent" />
              <p className="mt-5 font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">{o}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <SectionHead eyebrow="Human handoff" title="Where people step in.">
            {ind.handoff}
          </SectionHead>
          <HandoffVisual reason="Conversation needs a person" context={["Requirement captured", "Contact verified", "Conversation summary"]} />
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <SectionHead eyebrow="Common objections" title="Honest answers." />
          <Accordion items={ind.objections.map(([q, a]) => ({ q, a }))} />
        </div>
      </Section>

      <RelatedLinks
        title={`Where ${ind.name.toLowerCase()} teams start.`}
        links={[...ucLinks, { label: "Capabilities", href: "/capabilities", text: "Everything an agent can do." }, { label: "How It Works", href: "/how-it-works", text: "From goal to working agent." }]}
      />
      <FAQSection items={pageFaq} tone="alt" title={`${ind.name} FAQ`} />
      <CTABand title={`Put AI to work on your ${ind.name.toLowerCase()} conversations.`} text="Tell us the workflow. We'll show you how an Aurlynn agent would run it." primary={{ label: "See Aurlynn in Action", href: "/contact" }} secondary={{ label: "Build Your AI Agent", href: "/contact" }} />
    </>
  );
}
