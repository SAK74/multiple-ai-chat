import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: Array.from({ length: 9 }, (_, i) => `192.168.0.5${i + 1}`),
};

export default nextConfig;
