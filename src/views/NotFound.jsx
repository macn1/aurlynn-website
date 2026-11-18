"use client";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="hero-bg section-x flex min-h-[80vh] flex-col items-start justify-center pt-[var(--nav-h)]">
      <Seo title="Page not found | Aurlynn" description="This page could not be found." path="/404" />
      <meta name="robots" content="noindex" />
      <p className="hero-eyebrow mb-4">404</p>
      <h1 className="page-title max-w-[16ch]">That conversation went off script.</h1>
      <p className="lead mt-5 max-w-[46ch]">The page you were looking for doesn't exist. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/" arrow>Home</Button>
        <Button href="/capabilities" variant="outline">Capabilities</Button>
        <Button href="/use-cases" variant="outline">Use cases</Button>
      </div>
    </section>
  );
}
