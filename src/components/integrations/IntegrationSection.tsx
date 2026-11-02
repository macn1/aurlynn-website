"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Code2 } from "lucide-react";
import { siGooglecalendar, siHubspot, siZoho } from "simple-icons";
import { useReveal } from "@/components/animations/useReveal";

function SimpleMark({ icon }: { icon: { path: string; hex: string; title: string } }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[calc(var(--u)*2.7)] min-h-6 min-w-6" fill={`#${icon.hex}`}>
      <path d={icon.path} />
    </svg>
  );
}

// Salesforce and Slack are not in the icon package, so they are drawn as simple brand-coloured marks.
function SalesforceMark() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden className="h-[calc(var(--u)*2.4)] min-h-5">
      <path
        d="M20 4c3 0 5.5 1.6 6.8 4 1.2-.6 2.4-.9 3.8-.9 4.4 0 7.9 3.5 7.9 7.9 0 4.4-3.5 7.9-7.9 7.9-.6 0-1.200-.1-1.800-.2-1.200 2.100-3.400 3.500-6 3.500-1.700 0-3.200-.6-4.400-1.600-1.200 1.100-2.800 1.800-4.600 1.800-3 0-5.500-2-6.200-4.800-.3.100-.7.100-1 .1C6.200 22.200 3 19 3 15c0-3.200 2.100-6 5-7C9 5.300 11.300 3.500 14 3.500c2.300 0 4.300 1.100 5.500 2.800.2-.1.300-.2.500-.3Z"
        fill="#00A1E0"
      />
    </svg>
  );
}

function SlackMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[calc(var(--u)*2.7)] min-h-6 min-w-6">
      <rect x="9.5" y="2" width="4" height="9" rx="2" fill="#36C5F0" />
      <rect x="13" y="9.5" width="9" height="4" rx="2" fill="#2EB67D" />
      <rect x="10.5" y="13" width="4" height="9" rx="2" fill="#ECB22E" />
      <rect x="2" y="10.5" width="9" height="4" rx="2" fill="#E01E5A" />
    </svg>
  );
}

const ITEMS = [
  { name: "Salesforce", mark: <SalesforceMark /> },
  { name: "HubSpot", mark: <SimpleMark icon={siHubspot} /> },
  { name: "Calendar", mark: <SimpleMark icon={siGooglecalendar} /> },
  { name: "Zoho", mark: <SimpleMark icon={siZoho} /> },
  { name: "Slack", mark: <SlackMark /> },
  { name: "API & Webhooks", mark: <Code2 aria-hidden className="size-[calc(var(--u)*2.7)] min-h-6 min-w-6 text-[#2f6fdb]" strokeWidth={2.2} /> },
];

export function IntegrationSection() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} id="integrations" aria-labelledby="integrations-heading" className="section-x bg-background py-[clamp(2.5rem,5vw,5rem)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p data-reveal className="eyebrow-sm">Integrations</p>
          <h2 id="integrations-heading" data-reveal className="display-section mt-[calc(var(--u)*1)] text-[max(1.6rem,calc(var(--u)*2.7))]">
            Connects with the tools you already use.
          </h2>
        </div>
        <Link
          data-reveal
          href="/integrations"
          className="group hidden items-center gap-2 text-[max(0.75rem,calc(var(--u)*1.1))] sm:inline-flex"
        >
          View all integrations
          <ArrowRight size={14} aria-hidden className="transition-transform duration-250 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ul className="mt-[calc(var(--u)*2.3)] grid grid-cols-2 gap-[calc(var(--u)*1.4)] sm:grid-cols-3 lg:grid-cols-6">
        {ITEMS.map((it) => (
          <li
            key={it.name}
            data-reveal
            className="glass-card group flex h-[max(84px,calc(var(--u)*7.3))] flex-col items-center justify-center gap-[calc(var(--u)*1)] rounded-[14px] border border-white/70 text-[max(0.75rem,calc(var(--u)*1.08))] opacity-90 transition-[transform,opacity,box-shadow] duration-300 ease-[var(--ease-out-power3)] hover:-translate-y-0.5 hover:opacity-100 hover:shadow-[0_18px_36px_-16px_rgba(120,80,50,0.35)]"
          >
            <span className="transition-transform duration-300 group-hover:scale-105">{it.mark}</span>
            <span>{it.name}</span>
          </li>
        ))}
      </ul>
      <Link href="/integrations" className="mt-5 inline-flex items-center gap-2 text-sm sm:hidden">
        View all integrations <ArrowRight size={14} aria-hidden />
      </Link>
    </section>
  );
}
