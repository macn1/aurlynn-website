import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHead } from "@/components/sections/Section";
import { RelatedLinks } from "@/components/sections/RelatedLinks";
import { CTABand } from "@/components/sections/CTABand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ConversationToAction } from "@/components/visuals/ConversationToAction";
import { site } from "@/lib/site";

const crumbs = [["Home", "/"], ["About", "/about"]];

const ladder = [
  ["Traditional phone automation", ["Call", "Menu", "Option", "Routing"]],
  ["Basic conversational AI", ["Speech", "Understanding", "Response"]],
  ["Aurlynn", ["Conversation", "Intelligence", "Action"]],
];

export default function About() {
  return (
    <>
      <Seo title="About Aurlynn | AI Voice Agents for Business" description={site.description} path="/about" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="About Aurlynn"
        title="AI that talks. AI that understands. AI that acts."
        lead={site.description}
        primary={{ label: "See Aurlynn in Action", href: "/contact" }}
        secondary={{ label: "How It Works", href: "/how-it-works" }}
        visual={<ConversationToAction />}
      />

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHead eyebrow="What Aurlynn is" title="Businesses don't need another chatbot." />
          <Reveal delay={0.1} className="space-y-5 text-[1.05rem] leading-relaxed">
            <p>They need technology that can handle real conversations and move work forward.</p>
            <p>Aurlynn is an AI voice agent platform built for businesses that need to handle customer and prospect conversations at scale. Aurlynn agents can answer inbound calls, make permission-based outbound calls, qualify leads, collect information, answer questions, book appointments, schedule visits, follow up with prospects, update connected systems and escalate conversations to people when required.</p>
            <p>Rather than simply responding to speech, Aurlynn connects conversation to business action. It helps sales, marketing, customer experience and operations teams automate repetitive voice workflows while maintaining human involvement where judgment or intervention matters. Aurlynn is designed for businesses across industries, from startups and SMBs to enterprises.</p>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark">
        <SectionHead eyebrow="Our distinction" title="Not a menu. Not just a response. An action." />
        <ul className="mt-12 space-y-4">
          {ladder.map(([name, steps], i) => (
            <li key={name} className={`grid items-center gap-4 rounded-lg border p-5 sm:grid-cols-[14rem_1fr] sm:p-6 ${i === 2 ? "border-accent bg-accent/10" : "border-white/10"}`}>
              <p className={`mono text-[11px] uppercase tracking-[0.14em] ${i === 2 ? "text-accent-light" : "text-white/50"}`}>{name}</p>
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {steps.map((s, n) => (
                  <li key={s} className={`flex items-center gap-3 font-[family-name:var(--font-sora)] ${i === 2 ? "text-xl" : "text-lg text-white/60"}`}>
                    {s}
                    {n < steps.length - 1 && <span aria-hidden className="text-accent">→</span>}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="alt">
        <SectionHead eyebrow="Human + AI" title="AI handles the conversation. Humans handle what matters.">
          Aurlynn is not about replacing every human interaction. It is about giving people leverage. AI for scale. Humans for judgment.
        </SectionHead>
        <Stagger as="ul" className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Every conversation deserves an intelligent response.", "Our brand promise: Aurlynn makes that possible at scale."],
            ["Conversations that complete.", "Qualify, book, follow up and update connected systems, not just answer."],
            ["People where it counts.", "Escalation to the right person when judgment or expertise is needed."],
          ].map(([t, d]) => (
            <StaggerItem as="li" key={t} className="border-card rounded-lg p-6">
              <span aria-hidden className="block h-px w-10 bg-accent" />
              <p className="mt-5 font-[family-name:var(--font-sora)] text-xl font-medium leading-snug">{t}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-secondary">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <RelatedLinks title="Explore Aurlynn." links={[{ label: "Capabilities", href: "/capabilities" }, { label: "Use cases", href: "/use-cases" }, { label: "Industries", href: "/industries" }, { label: "Security & Trust", href: "/security" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }]} />
      <CTABand title="From conversation to action." text="Aurlynn turns conversations into action." primary={{ label: "See Aurlynn in Action", href: "/contact" }} secondary={{ label: "Build Your AI Agent", href: "/contact" }} />
    </>
  );
}
