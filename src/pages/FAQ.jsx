import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Seo, JsonLd, faqSchema } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Accordion } from "@/components/sections/FAQSection";
import { CTABand } from "@/components/sections/CTABand";
import { faqs, faqCategories } from "@/data/faqs";

const crumbs = [["Home", "/"], ["FAQ", "/faq"]];

export default function FAQ() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return faqs.filter((f) => (cat === "All" || f.c === cat) && (!t || f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t)));
  }, [cat, q]);
  return (
    <>
      <Seo title="AI Voice Agent FAQ | Aurlynn" description="Answers to 40 common questions about AI voice agents: what they are, how they work, what they cost, how they integrate and how they stay secure." path="/faq" crumbs={crumbs} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        crumbs={crumbs}
        eyebrow="FAQ"
        title="AI Voice Agent FAQ"
        lead="An AI voice agent is software that conducts spoken conversations using artificial intelligence. It can understand what a caller wants and perform configured actions. Here are forty straight answers."
        primary={{ label: "Talk to an Expert", href: "/contact" }}
        secondary={{ label: "See How It Works", href: "/how-it-works" }}
      />
      <Section tone="light">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
              {["All", ...faqCategories].map((c) => (
                <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${cat === c ? "border-dark bg-dark text-white" : "border-border bg-white hover:border-accent/60"}`}>
                  {c}
                </button>
              ))}
            </div>
            <label className="relative block sm:w-64">
              <span className="sr-only">Search questions</span>
              <Search size={15} aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="h-10 w-full rounded-full border border-border bg-white pl-10 pr-4 text-sm outline-none focus:border-accent" />
            </label>
          </div>
          <p className="mono mt-6 text-[11px] uppercase tracking-[0.14em] text-secondary" aria-live="polite">{list.length} of {faqs.length} questions</p>
          <div className="mt-4">
            {list.length ? <Accordion key={`${cat}-${q}`} items={list} /> : <p className="rounded-lg border border-dashed border-border p-8 text-center text-secondary">No questions match. Try another term, or ask us directly.</p>}
          </div>
        </div>
      </Section>
      <CTABand title="Still have a question?" text="Ask us about your workflow." primary={{ label: "Talk to an Expert", href: "/contact" }} secondary={{ label: "Explore Capabilities", href: "/capabilities" }} />
    </>
  );
}
