import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i9ilt2apv6.ufs.sh",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // devIndicators: false,
};

export default nextConfig;
