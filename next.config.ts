import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure proper asset handling
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  // Ensure proper trailing slash handling
  trailingSlash: false,
  // Disable x-powered-by header
  poweredByHeader: false,
  // Ensure proper experimental features
  experimental: {
    // Enable optimizePackageImports for better bundle
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
