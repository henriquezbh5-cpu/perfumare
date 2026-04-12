import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

export default withNextIntl(nextConfig);
