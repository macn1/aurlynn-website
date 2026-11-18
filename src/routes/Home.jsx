import { HeroSection } from "@/components/hero/HeroSection";
import { ProblemStatement } from "@/components/problem/ProblemStatement";
import { WorkflowSection } from "@/components/workflow/WorkflowSection";
import { VoiceUseCases } from "@/components/voice/VoiceUseCases";
import { IndustryShowcase } from "@/components/industries/IndustryShowcase";
import { IntegrationSection } from "@/components/integrations/IntegrationSection";
import { FinalCTA } from "@/components/cta/FinalCTA";
import { Seo, softwareSchema } from "@/components/seo/Seo";
import { site } from "@/lib/site";
function Home() {
  return <>
      <Seo title="Aurlynn | AI Voice Agents for Business" description="AI voice agents that talk to customers, qualify leads, book appointments, answer enquiries and automate business workflows." path="/" schema={[softwareSchema(site.description)]} />
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
