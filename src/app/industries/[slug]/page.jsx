import { notFound } from "next/navigation";
import IndustryPage from "@/views/IndustryPage";
import { industries, industryBySlug } from "@/data/industries";

export const dynamicParams = false;
export const generateStaticParams = () => industries.map((i) => ({ slug: i.slug }));

export default async function Page({ params }) {
  const { slug } = await params;
  if (!industryBySlug[slug]) notFound();
  return <IndustryPage slug={slug} />;
}
