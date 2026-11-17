import { Link } from "@/components/ui/Link";
import { Mail } from "lucide-react";
import { navGroups, site } from "@/lib/site";
const COLUMNS = navGroups
  .filter((g) => g.label !== "Resources")
  .map((g) => ({
    title: g.label,
    links: (g.label === "Company" ? [...g.items, ...navGroups.find((x) => x.label === "Resources").items] : g.items).map((i) => [i.label, i.href]),
  }));
function Footer() {
  return <footer className="section-x border-t border-border bg-background pb-8 pt-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.7fr)]">
        {COLUMNS.map((col) => <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow-sm text-secondary">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, href]) => <li key={href}>
                  <Link href={href} className="text-[0.8125rem] text-[#4a4643] transition-colors duration-200 hover:text-accent">
                    {label}
                  </Link>
                </li>)}
            </ul>
          </nav>)}

        {
    /* email support, on the right */
  }
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
          <h2 className="eyebrow-sm text-secondary">Email support</h2>
          <p className="mt-4 max-w-[30ch] text-[0.8125rem] leading-relaxed text-[#4a4643]">Questions about Aurlynn or your account? Write to our team and we’ll get back to you.</p>
          <a
    href={`mailto:${site.supportEmail}`}
    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-dark px-5 text-[0.8125rem] font-medium text-white transition-[background-color,box-shadow] duration-250 hover:bg-[#2a2420] hover:shadow-[0_10px_26px_-10px_rgba(183,122,72,0.6)]"
  >
            <Mail size={14} aria-hidden />
            {site.supportEmail}
          </a>
        </div>
      </div>

      {
    /* oversized wordmark */
  }
      <div className="mt-[clamp(2.5rem,6vw,5rem)] pb-2">
        <img src="/brand/aurlynn-wordmark.png" alt="Aurlynn" width={1800} height={140} loading="lazy" className="h-auto w-full select-none" />
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-secondary sm:flex-row sm:justify-between">
        <p>© 2026 Aurlynn. All rights reserved.</p>
        <p>AI voice agents that turn conversations into completed actions.</p>
      </div>
    </footer>;
}
export {
  Footer
};
