import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api-assets.clashofclans.com" },
      { protocol: "https", hostname: "api.clashk.ing" },
    ],
  },
};

export default config;
