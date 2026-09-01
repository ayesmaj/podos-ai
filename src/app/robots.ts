import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Only /api/ is disallowed. Private prefixes (/e/, /proposal/, /admin/)
      // are deliberately NOT listed: enumerating them in a public robots.txt
      // advertises their existence. They are protected by an authoritative
      // X-Robots-Tag header from proxy.ts instead (audit F5).
      disallow: ["/api/"],
    },
    sitemap: [
      "https://www.podosai.com/sitemap.xml",
      "https://www.podosai.com/image-sitemap.xml",
    ],
  };
}
