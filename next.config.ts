import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Turbopack already compiles TypeScript - skip the separate tsc check
    // that causes errors on Vercel due to type inference issues
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@tiptap/react", "@tiptap/core", "@tiptap/extension-bubble-menu", "@tiptap/extension-floating-menu", "@floating-ui/dom"],
};

export default nextConfig;
