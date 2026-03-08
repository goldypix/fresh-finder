import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.woolworths.com.au",
      },
      {
        protocol: "https",
        hostname: "**.woolworths.media",
      },
      {
        protocol: "https",
        hostname: "**.coles.com.au",
      },
      {
        protocol: "https",
        hostname: "**.colesgroup.com.au",
      },
    ],
  },
};

export default nextConfig;
