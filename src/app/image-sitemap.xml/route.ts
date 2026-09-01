/**
 * /image-sitemap.xml — image sitemap for the proprietary renders and
 * diagrams, so Google Images can index them (SEO master brief §12).
 *
 * Built from the SEO image registry, which already pairs each asset with
 * the page it appears on and its alt text. Only assets whose status is
 * "ready" are listed — an unlisted placeholder must never be advertised.
 */

import { SEO_IMAGES } from "@/data/seo-page-images";
import { SITE, canonicalUrl } from "@/lib/seo/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  // group images by the page they appear on — one <url> per page
  const byPage = new Map<string, typeof SEO_IMAGES>();
  for (const img of SEO_IMAGES) {
    if (img.status !== "ready") continue;
    const page = img.page.split(" ")[0]; // registry stores "/route" or "/route / note"
    if (!page.startsWith("/")) continue;
    const list = byPage.get(page) ?? [];
    list.push(img);
    byPage.set(page, list);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...byPage.entries()]
  .map(
    ([page, imgs]) => `  <url>
    <loc>${canonicalUrl(page)}</loc>
${imgs
  .map(
    (i) => `    <image:image>
      <image:loc>${SITE.baseUrl}${i.src}</image:loc>
      <image:title>${esc(i.alt || "PODOS AI infrastructure")}</image:title>
    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
