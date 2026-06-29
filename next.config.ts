import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "api.samshardware.co.za" },
      { hostname: "samshardware.co.za" },
      { hostname: "*.samshardware.co.za" },
    ],
  },
};

export default nextConfig;
