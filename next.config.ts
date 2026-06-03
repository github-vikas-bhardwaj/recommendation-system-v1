import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
