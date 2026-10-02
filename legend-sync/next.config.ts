import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api-assets.clashofclans.com" },
      { protocol: "https", hostname: "api.clashk.ing" },
      { protocol: "https", hostname: "assets.clashk.ing" },
    ],
  },
};

export default config;
