import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.fragella.com" },
      { protocol: "https", hostname: "cdn.fragrancenet.com" },
      { protocol: "https", hostname: "**.fragella.com" },
    ],
  },
};

export default nextConfig;
