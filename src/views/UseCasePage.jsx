"use client";
import { Seo, softwareSchema } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConversationCard } from "@/components/visuals/ConversationCard";
import { FlowDiagram } from "@/components/visuals/FlowDiagram";
import { HandoffVisual } from "@/components/visuals/Cards";
import { Link } from "@/components/ui/Link";
import { useCases, useCaseBySlug } from "@/data/useCases";
import { industryBySlug } from "@/data/industries";
import { integrationById } from "@/data/integrations";
import { faqs } from "@/data/faqs";
import NotFound from "./NotFound";

export default function UseCasePage({ slug }) {
  const u = useCaseBySlug[slug];
  if (!u) return <NotFound />;
  const crumbs = [["Home", "/"], ["Use Cases", "/use-cases"], [u.name, `/use-cases/${u.slug}`]];
  const faq = faqs.find((f) => f.q === u.faq);
  const extra = faqs.find((f) => f.q === "What happens when Aurlynn cannot answer a question?");
  const pageFaq = [faq, extra].filter(Boolean);
  const audienceLink = u.audience.startsWith("B2B") ? { label: "B2B sales workflows", href: "/b2b" } : { label: "B2C customer workflows", href: "/b2c" };
  const others = useCases.filter((x) => x.slug !== u.slug && x.tier === 1).slice(0, 2);

  return (
    <>
      <Seo title={`${u.h1} | Aurlynn`} description={u.meta} path={`/use-cases/${u.slug}`} crumbs={crumbs} schema={[softwareSchema(`${u.name}: ${u.lead}`)]} />
      <PageHero
        crumbs={crumbs}
        eyebrow={`Use case · ${u.audience}`}
        title={u.h1}
        lead={u.lead}
        primary={{ label: "Build Your AI Agent", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
        visual={<ConversationCard title={u.name.replace("AI ", "")} turns={u.convo} />}
      />

      <Section tone="dark">
        <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <SectionHead eyebrow="The problem" title={u.problem} />
          <Reveal delay={0.1}>
            <p className="lead">
              Aurlynn is an AI voice agent platform for businesses. For this workflow, it turns the conversation into the next completed step.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="How Aurlynn works" title="Three things happen on every call." />
        <Stagger as="ol" className="mt-12 grid gap-4 md:grid-cols-3">
          {u.how.map((h, n) => (
            <StaggerItem as="li" key={h} className="border-card rounded-lg p-6">
              <span className="mono text-[11px] text-accent">0{n + 1}</span>
              <p className="mt-8 font-[family-name:var(--font-sora)] text-lg font-medium leading-snug">{h}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="alt">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHead eyebrow="Example conversation" title="What it sounds like." >
            An illustrative exchange. Questions, tone and rules are configured around your business.
          </SectionHead>
          <ConversationCard title={u.name.replace("AI ", "")} turns={u.convo} actionLabel={u.workflow[u.workflow.length - 1]} actionDetail="→ completed" />
        </div>
      </Section>

      <Section tone="light">
        <SectionHead eyebrow="Workflow" title="From the first word to the completed action." />
        <div className="mt-12">
          <FlowDiagram steps={u.workflow} />
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="Integrations" title="Connected to the systems that matter.">
          Where the required integration or API is available. Capabilities are confirmed per deployment.
        </SectionHead>
        <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-3">
          {u.integ.map((id) => {
            const c = integrationById[id];
            return (
              <StaggerItem as="li" key={id} className="border-card rounded-lg p-5">
                <p className="font-[family-name:var(--font-sora)] text-lg font-medium">{c.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Link href="/integrations" className="mt-8 inline-block text-sm text-accent-light underline underline-offset-4 hover:text-white">
          All integration categories
        </Link>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.3fr] lg:gap-16">
          <SectionHead eyebrow="Human handoff" title="Where people step in.">
            {u.handoff}
          </SectionHead>
          <HandoffVisual reason="Workflow rule triggered" context={["What was asked", "What was captured", "Conversation summary"]} />
        </div>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Outcomes" title="What teams can pursue." />
        <Stagger as="ul" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {u.outcomes.map((o) => (
            <StaggerItem as="li" key={o} className="border-card rounded-lg p-5">
              <span aria-hidden className="block h-px w-8 bg-accent" />
              <p className="mt-5 font-[family-name:var(--font-sora)] text-[1.02rem] font-medium leading-snug">{o}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <RelatedLinks
        title="Related pages."
        links={[
          ...u.industries.map((s) => ({ label: industryBySlug[s].name, href: `/industries/${s}`, text: industryBySlug[s].lead })),
          audienceLink,
          { label: "Capabilities", href: "/capabilities" },
          { label: "How It Works", href: "/how-it-works" },
          ...others.map((o) => ({ label: o.name, href: `/use-cases/${o.slug}` })),
        ]}
      />
      <FAQSection items={pageFaq} tone="alt" />
      <CTABand title={`Put ${u.name} to work.`} text={u.lead} primary={{ label: "See Aurlynn in Action", href: "/contact" }} secondary={{ label: "Build Your AI Agent", href: "/contact" }} />
    </>
  );
}
