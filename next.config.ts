import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i9ilt2apv6.ufs.sh",
      },
    ],
  },
  // devIndicators: true,
};

export default nextConfig;
