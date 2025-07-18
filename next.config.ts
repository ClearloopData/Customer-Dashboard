// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ allows build even with ESLint errors
  },
  // other config options here
};

export default nextConfig;
