import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin", "grpc", "@google-cloud/firestore"],
};

export default nextConfig;
