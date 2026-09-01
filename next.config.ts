import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile lenis (ESM-only package)
  transpilePackages: ["lenis"],
  images: {
    // /invest AI-generated assets carry a ?v= cache-buster that changes on
    // regeneration. Omitting `search` allows any query, scoped to this
    // folder only (Next 16 blocks local-image query strings by default).
    localPatterns: [
      { pathname: "/visuals/invest/**" },
      { pathname: "/**", search: "" },
    ],
  },
  async redirects() {
    return [
      // The estimator shipped briefly at /configure and was registered in the
      // sitemap under that path. Permanent so any indexed URL or bookmark
      // consolidates onto /estimate rather than 404ing.
      { source: "/configure", destination: "/estimate", permanent: true },
    ];
  },
  // Turbopack is default in Next.js 16; empty config silences the warning
  turbopack: {
    // Anchor workspace root to this project, not the parent directory
    root: __dirname,
  },
};

export default nextConfig;
