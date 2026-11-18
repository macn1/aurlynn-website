import { site } from "@/lib/site";

const abs = (p) => `${site.url}${p === "/" ? "" : p}`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aurlynn",
  url: site.url,
  logo: `${site.url}/brand/aurlynn-mark.png`,
  description: site.description,
};

export function softwareSchema(description) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aurlynn",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/**
 * Per-page head tags (React 19 hoists title/meta/link into <head>).
 * `crumbs` is [[label, path], ...] and emits BreadcrumbList.
 */
export function Seo({ title, description, path = "/", crumbs, schema = [] }) {
  const url = abs(path);
  const crumbSchema = crumbs && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) })),
  };
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Aurlynn" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      {crumbSchema && <JsonLd data={crumbSchema} />}
      {schema.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
