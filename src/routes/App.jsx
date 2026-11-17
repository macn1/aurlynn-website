import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd, organizationSchema } from "@/components/seo/Seo";
import { Home } from "./Home";
import { ScrollManager } from "./ScrollManager";

const B2B = lazy(() => import("@/pages/B2B"));
const B2C = lazy(() => import("@/pages/B2C"));
const Capabilities = lazy(() => import("@/pages/Capabilities"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Industries = lazy(() => import("@/pages/Industries"));
const IndustryPage = lazy(() => import("@/pages/IndustryPage"));
const UseCases = lazy(() => import("@/pages/UseCases"));
const UseCasePage = lazy(() => import("@/pages/UseCasePage"));
const Integrations = lazy(() => import("@/pages/Integrations"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Security = lazy(() => import("@/pages/Security"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  const location = useLocation();
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
      <ScrollManager />
      <Navbar />
      <main id="main" className="min-h-[70vh]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
          >
            <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/b2b" element={<B2B />} />
                <Route path="/b2c" element={<B2C />} />
                <Route path="/capabilities" element={<Capabilities />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/industries/:slug" element={<IndustryPage />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/use-cases/:slug" element={<UseCasePage />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/security" element={<Security />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </MotionConfig>
  );
}

export { App };
