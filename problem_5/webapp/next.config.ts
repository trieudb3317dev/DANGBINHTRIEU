import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@geist-ui/react", "@geist-ui/icons"],
  images: {
    domains: ["https://res.cloudinary.com"],
  },
};

export default nextConfig;
