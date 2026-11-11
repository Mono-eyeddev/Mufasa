
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  allowedDevOrigins: [
    "192.168.0.18",
    "localhost",
  ],

  turbopack: {
    root: process.cwd(),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/lbs3zryh/image/upload/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
};

export default nextConfig;
