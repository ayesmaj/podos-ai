import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is an internal tool with no authentication yet — keep it out of
      // search results. This is crawler hygiene, NOT access control; the route
      // still answers to anyone who knows the URL until real auth lands.
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://www.podosai.com/sitemap.xml",
  };
}
