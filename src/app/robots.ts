import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin has no auth yet, and /e/ holds private per-client estimates.
      // Crawler hygiene — the secret token is what actually protects /e/.
      disallow: ["/api/", "/admin/", "/e/"],
    },
    sitemap: [
      "https://www.podosai.com/sitemap.xml",
      "https://www.podosai.com/image-sitemap.xml",
    ],
  };
}
