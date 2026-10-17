import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  serverExternalPackages: ["clashofclans.js"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api-assets.clashofclans.com" },
      { protocol: "https", hostname: "api.clashk.ing" },
      { protocol: "https", hostname: "assets.clashk.ing" },
    ],
  },
};

export default config;
