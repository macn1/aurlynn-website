"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { gsap } from "@/lib/animation/gsap";
import { navGroups, site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-nav-item]", { opacity: 1, y: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-nav-logo]", { opacity: 0 }, { opacity: 1, duration: 0.8 })
        .fromTo(
          "[data-nav-link]",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
          "-=0.5",
        )
        .fromTo("[data-nav-cta]", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, "-=0.3");
    }, barRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hold = (label: string) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const release = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,backdrop-filter,box-shadow] duration-500 ease-[var(--ease-out-power3)] ${
          scrolled
            ? "h-[calc(var(--nav-h)*0.82)] bg-background/70 shadow-[0_1px_0_var(--border)] backdrop-blur-xl"
            : "h-[var(--nav-h)] bg-transparent"
        }`}
      >
        <div className="flex h-full items-center justify-between pl-5 pr-5 md:pl-8 md:pr-8 lg:pl-[calc(var(--u)*5.6)] lg:pr-[calc(var(--u)*3.9)]">
          <div data-nav-logo data-nav-item>
            <Logo />
          </div>

          <nav aria-label="Primary" className="ml-[calc(var(--u)*1.8)] hidden lg:block">
            <ul className="flex items-center gap-[calc(var(--u)*2.2)]">
              {navGroups.map((group) => {
                const single = group.items.length === 1;
                return (
                  <li
                    key={group.label}
                    data-nav-link
                    data-nav-item
                    className="relative"
                    onMouseEnter={() => !single && hold(group.label)}
                    onMouseLeave={release}
                  >
                    {single ? (
                      <Link href={group.items[0].href} className="nav-link">
                        {group.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="nav-link"
                        aria-expanded={open === group.label}
                        aria-haspopup="true"
                        onClick={() => setOpen(open === group.label ? null : group.label)}
                        onFocus={() => hold(group.label)}
                      >
                        {group.label}
                        <ChevronDown
                          aria-hidden
                          size={12}
                          className={`transition-transform duration-250 ${open === group.label ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                    <AnimatePresence>
                      {!single && open === group.label && (
                        <motion.ul
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: [0.215, 0.61, 0.355, 1] }}
                          className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-4"
                          onBlur={(e) => {
                            if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) setOpen(null);
                          }}
                        >
                          <div className="rounded-2xl border border-border bg-background/95 p-2 shadow-[0_24px_60px_-24px_rgba(17,17,17,0.25)] backdrop-blur-xl">
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(null)}
                                  className="block rounded-xl px-3.5 py-2.5 transition-colors duration-200 hover:bg-background-secondary"
                                >
                                  <span className="block text-[13px] font-medium">{item.label}</span>
                                  {item.description && (
                                    <span className="mt-0.5 block text-xs text-secondary">{item.description}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </div>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href={site.signInUrl}
              data-nav-cta
              data-nav-item
              className="hidden h-[max(32px,calc(var(--u)*3))] items-center rounded-full border border-border px-[calc(var(--u)*1.45)] text-[max(12px,calc(var(--u)*1.12))] font-medium transition-colors duration-200 hover:border-accent/60 hover:bg-white/60 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/#demo"
              data-nav-cta
              data-nav-item
              className="group hidden h-[max(32px,calc(var(--u)*3))] items-center gap-1.5 rounded-full bg-dark px-[calc(var(--u)*1.25)] text-[max(12px,calc(var(--u)*1.12))] font-medium text-white transition-[background-color,box-shadow] duration-250 hover:bg-[#2a2420] hover:shadow-[0_10px_26px_-10px_rgba(183,122,72,0.6)] sm:inline-flex"
            >
              See a live demo
              <ArrowRight aria-hidden size={14} className="transition-transform duration-250 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              data-nav-cta
              data-nav-item
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
