import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLUMNS = [
  { title: "Platform", links: [["Platform overview", "/platform"], ["How it works", "/how-it-works"], ["Integrations", "/integrations"]] },
  { title: "Solutions", links: [["B2B", "/solutions/b2b"], ["B2C", "/solutions/b2c"], ["Use cases", "/use-cases"]] },
  {
    title: "Industries",
    links: [["Automotive", "/industries/automotive"], ["Real Estate", "/industries/real-estate"], ["Healthcare", "/industries/healthcare"], ["Education", "/industries/education"]],
  },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Resources", "/resources"]] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Cookies", "/cookies"]] },
];

export function Footer() {
  return (
    <footer className="section-x border-t border-border bg-background pb-8 pt-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div>
          <Logo />
          <p className="body-sm mt-4 max-w-[26ch]">AI voice agents that turn conversations into completed actions.</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow-sm text-secondary">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[0.8125rem] text-[#4a4643] transition-colors duration-200 hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-secondary sm:flex-row sm:justify-between">
        <p>© 2026 Aurlynn. All rights reserved.</p>
        <p>AI Voice Agents for Business</p>
      </div>
    </footer>
  );
}
