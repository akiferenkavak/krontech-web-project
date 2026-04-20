import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'krontech.com',
      },
    ],
  },
};

export default nextConfig;
