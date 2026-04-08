import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile lenis (ESM-only package)
  transpilePackages: ["lenis"],
  // Turbopack is default in Next.js 16; empty config silences the warning
  turbopack: {
    // Anchor workspace root to this project, not the parent directory
    root: __dirname,
  },
};

export default nextConfig;
