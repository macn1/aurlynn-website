import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Reveal } from "@/components/motion/Reveal";
import { industries } from "@/data/industries";
import { useCases } from "@/data/useCases";
import { site } from "@/lib/site";

const crumbs = [["Home", "/"], ["Contact", "/contact"]];

const field = "mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-accent";
const label = "text-[13px] font-medium";

export default function Contact() {
  const [params] = useSearchParams();
  const brief = params.get("brief") || "";
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const next = {};
    if (!d.name?.trim()) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(d.email || "")) next.email = "Please enter a valid work email.";
    setErr(next);
    if (Object.keys(next).length) return;
    const body = [`Name: ${d.name}`, `Work email: ${d.email}`, `Company: ${d.company || "-"}`, `Industry: ${d.industry || "-"}`, `Use case: ${d.usecase || "-"}`, "", d.message || ""].join("\n");
    window.location.href = `mailto:${site.supportEmail}?subject=${encodeURIComponent("Aurlynn demo request")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <Seo title="See Aurlynn in Action | Book a Demo | Aurlynn" description="Talk to an expert, discuss your workflow or see an Aurlynn AI voice agent in action." path="/contact" crumbs={crumbs} />
      <PageHero
        crumbs={crumbs}
        eyebrow="Contact / Demo"
        title="See Aurlynn in action."
        lead="Tell us the conversation you want to automate. We'll show you how an Aurlynn agent would handle it, from the first word to the completed action."
      />
      <Section tone="light" id="demo">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_24px_60px_-34px_rgba(10,10,11,.2)] sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="name">Name</label>
                  <input id="name" name="name" autoComplete="name" required aria-invalid={!!err.name} aria-describedby={err.name ? "name-err" : undefined} className={field} />
                  {err.name && <p id="name-err" className="mt-1.5 text-[12.5px] text-[#b3402a]">{err.name}</p>}
                </div>
                <div>
                  <label className={label} htmlFor="email">Work email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!err.email} aria-describedby={err.email ? "email-err" : undefined} className={field} />
                  {err.email && <p id="email-err" className="mt-1.5 text-[12.5px] text-[#b3402a]">{err.email}</p>}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="company">Company</label>
                  <input id="company" name="company" autoComplete="organization" className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="industry">Industry</label>
                  <select id="industry" name="industry" defaultValue="" className={field}>
                    <option value="">Select an industry</option>
                    {industries.map((i) => <option key={i.slug}>{i.name}</option>)}
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label} htmlFor="usecase">What would you like to automate?</label>
                <select id="usecase" name="usecase" defaultValue="" className={field}>
                  <option value="">Select a use case</option>
                  {useCases.map((u) => <option key={u.slug}>{u.name}</option>)}
                  <option>Something else</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="message">Tell us about your workflow</label>
                <textarea id="message" name="message" rows={5} defaultValue={brief} className={field} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="group inline-flex h-12 items-center gap-2 rounded-full bg-dark px-7 text-sm font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-[#2a2420] hover:shadow-[0_14px_34px_-12px_rgba(183,122,72,0.55)]">
                  See Aurlynn in Action
                  <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-[12.5px] text-secondary">This opens an email to {site.supportEmail}.</p>
              </div>
              {sent && (
                <motion.p role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 rounded-lg bg-[#7CF0C6]/25 p-4 text-[0.92rem]">
                  <Check size={16} aria-hidden className="mt-0.5 shrink-0" />
                  Your email app should open with your request ready to send. If it doesn't, write to {site.supportEmail}.
                </motion.p>
              )}
            </form>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="h-section !text-[1.6rem]">What happens next</h2>
            <ol className="mt-6 space-y-5">
              {[["We read your workflow", "What should the agent accomplish, and where does it fit?"], ["We show you the conversation", "A working example shaped around your use case."], ["We scope it with you", "Volume, integrations and deployment requirements."]].map(([t, d], n) => (
                <li key={t} className="flex gap-4">
                  <span className="mono grid size-8 shrink-0 place-items-center rounded-full border border-accent text-[12px] text-accent">{n + 1}</span>
                  <span>
                    <span className="block font-[family-name:var(--font-sora)] font-medium">{t}</span>
                    <span className="text-[0.92rem] text-secondary">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-l-2 border-accent pl-4 text-[0.92rem] leading-relaxed text-secondary">Prefer to write directly? <a className="underline underline-offset-4 hover:text-accent" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a></p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
