"use client";
import { Link } from "@/components/ui/Link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { navGroups, site } from "@/lib/site";
function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("a")?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return <AnimatePresence>
      {open && <motion.div
    id="mobile-menu"
    ref={panelRef}
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    initial={{ clipPath: "inset(0 0 100% 0)" }}
    animate={{ clipPath: "inset(0 0 0% 0)" }}
    exit={{ clipPath: "inset(0 0 100% 0)" }}
    transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
    className="fixed inset-0 z-40 flex flex-col bg-background px-5 pb-8 pt-28 md:px-8"
  >
          <ul className="flex flex-1 flex-col gap-1">
            {navGroups.map((group, i) => <motion.li
    key={group.label}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
    exit={{ opacity: 0 }}
  >
                <Link
    href={group.items[0].href}
    onClick={onClose}
    className="font-display block border-b border-border py-3 text-[2.2rem] leading-none"
  >
                  {group.label}
                </Link>
              </motion.li>)}
          </ul>
          <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.6 } }}
    exit={{ opacity: 0 }}
    className="flex flex-col gap-3"
  >
            <Link href="/#demo" onClick={onClose} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-dark text-sm font-medium text-white">
              See a live demo <ArrowRight size={15} aria-hidden />
            </Link>
            <Link href={site.signInUrl} onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-full border border-border text-sm font-medium">
              Sign in
            </Link>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}
export {
  MobileMenu
};
