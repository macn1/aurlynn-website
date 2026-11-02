import { HeroSection } from "@/components/hero/HeroSection";
import { WorkflowSection } from "@/components/workflow/WorkflowSection";
import { IndustryShowcase } from "@/components/industries/IndustryShowcase";
import { IntegrationSection } from "@/components/integrations/IntegrationSection";
import { FinalCTA } from "@/components/cta/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <IndustryShowcase />
      <IntegrationSection />
      <FinalCTA />
    </>
  );
}
