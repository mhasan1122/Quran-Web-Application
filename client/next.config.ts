import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Locally you asked for `dist/`. On Vercel, keep default to avoid builder issues.
  ...(process.env.VERCEL ? {} : { distDir: 'dist' }),
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
