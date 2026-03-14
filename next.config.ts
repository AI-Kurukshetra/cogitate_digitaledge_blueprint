import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-release",
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;

