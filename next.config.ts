import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore specific rules during production builds
    ignoreDuringBuilds: true, // Completely ignores ESLint during builds (use cautiously)
    // Alternatively, specify rules to ignore (not supported directly, but can be done via .eslintrc)
  },
};

export default nextConfig;
