/**
 * metadata.ts — shared Next Metadata builder for indexable pages.
 * Unique title/description per page, one canonical, OG + large Twitter
 * card. Callers write real copy; this only assembles the object.
 */

import type { Metadata } from "next";
import { SITE, canonicalUrl } from "./site";

export function buildMetadata(props: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  /** set true on drafts/previews — emits noindex */
  noindex?: boolean;
}): Metadata {
  const url = canonicalUrl(props.path);
  const image = props.ogImage ?? `${SITE.baseUrl}/opengraph-image.png`;
  return {
    title: props.title,
    description: props.description,
    metadataBase: new URL(SITE.baseUrl),
    alternates: { canonical: url },
    ...(props.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: props.title,
      description: props.description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: props.title,
      description: props.description,
      images: [image],
    },
  };
}
