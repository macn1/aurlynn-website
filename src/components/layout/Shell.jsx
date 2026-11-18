"use client";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd, organizationSchema } from "@/components/seo/Seo";

export function Shell({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <JsonLd data={organizationSchema} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-dark focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Navbar />
      <main id="main" className="min-h-[70vh]">
        {children}
      </main>
      <Footer />
    </MotionConfig>
  );
}
