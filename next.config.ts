import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Dockerfile copies .next/standalone (server.js + minimal node_modules).
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
