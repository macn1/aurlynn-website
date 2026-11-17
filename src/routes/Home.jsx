import { HeroSection } from "@/components/hero/HeroSection";
import { ProblemStatement } from "@/components/problem/ProblemStatement";
import { WorkflowSection } from "@/components/workflow/WorkflowSection";
import { VoiceUseCases } from "@/components/voice/VoiceUseCases";
import { IndustryShowcase } from "@/components/industries/IndustryShowcase";
import { IntegrationSection } from "@/components/integrations/IntegrationSection";
import { FinalCTA } from "@/components/cta/FinalCTA";
function Home() {
  return <>
      <HeroSection />
      <ProblemStatement />
      <WorkflowSection />
      <VoiceUseCases />
      <IndustryShowcase />
      <IntegrationSection />
      <FinalCTA />
    </>;
}
export {
  Home
};
