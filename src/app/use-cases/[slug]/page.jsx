import { notFound } from "next/navigation";
import UseCasePage from "@/views/UseCasePage";
import { useCases, useCaseBySlug } from "@/data/useCases";

export const dynamicParams = false;
export const generateStaticParams = () => useCases.map((u) => ({ slug: u.slug }));

export default async function Page({ params }) {
  const { slug } = await params;
  if (!useCaseBySlug[slug]) notFound();
  return <UseCasePage slug={slug} />;
}
