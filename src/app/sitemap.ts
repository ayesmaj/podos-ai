import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, canonicalUrl } from "@/lib/seo/site";

/* Derived from the indexable-route registry — add pages in
 * src/lib/seo/site.ts, never here (verify-seo checks the same list). */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((r) => ({
    url: canonicalUrl(r.path),
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
