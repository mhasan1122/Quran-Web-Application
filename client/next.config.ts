import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
