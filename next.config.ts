import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["firebase-admin", "grpc", "@google-cloud/firestore"],
};

export default nextConfig;
