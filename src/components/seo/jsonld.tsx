/**
 * jsonld.tsx — structured-data components (SEO master brief §12).
 *
 * Every component renders a single <script type="application/ld+json">
 * in server HTML and must mirror VISIBLE page content only. No offers,
 * ratings, certifications, or awards exist — none may be emitted.
 */

import { SITE, canonicalUrl } from "@/lib/seo/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        url: `${SITE.baseUrl}/`,
        logo: SITE.logo,
        email: SITE.email,
        telephone: SITE.phone,
        description: SITE.description,
      }}
    />
  );
}

export function WebSiteJsonLd() {
  // No SearchAction: the site has no real search (brief §12 rule).
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: `${SITE.baseUrl}/`,
      }}
    />
  );
}

export interface Crumb {
  name: string;
  path: string;
}

export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: canonicalUrl(c.path),
        })),
      }}
    />
  );
}

export function TechArticleJsonLd(props: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  image?: string;
  articleType?: "TechArticle" | "Article";
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": props.articleType ?? "TechArticle",
        headline: props.headline,
        description: props.description,
        url: canonicalUrl(props.path),
        datePublished: props.datePublished,
        dateModified: props.dateModified ?? props.datePublished,
        author: { "@type": "Person", name: props.authorName },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          logo: { "@type": "ImageObject", url: SITE.logo },
        },
        ...(props.image ? { image: props.image } : {}),
      }}
    />
  );
}

export function ProductJsonLd(props: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  // Deliberately NO offers, price, aggregateRating, availability (brief §12).
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: props.name,
        description: props.description,
        url: canonicalUrl(props.path),
        brand: { "@type": "Organization", name: SITE.name },
        manufacturer: { "@type": "Organization", name: SITE.name },
        ...(props.image ? { image: props.image } : {}),
      }}
    />
  );
}

export function PersonJsonLd(props: { name: string; jobTitle: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: props.name,
        jobTitle: props.jobTitle,
        url: canonicalUrl(props.path),
        worksFor: { "@type": "Organization", name: SITE.name },
      }}
    />
  );
}

/** Only pass Q&A pairs that are VISIBLE on the page (brief §12). */
export function FAQJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}
