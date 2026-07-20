import type { NextConfig } from "next";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/ --
// the GitHub Actions workflow sets BASE_PATH to "/<repo>" at build time so
// internal links and assets resolve correctly. Locally (no BASE_PATH set)
// this is a no-op and the site behaves like a normal root-hosted app.
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
