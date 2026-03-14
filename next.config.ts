import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  outputFileTracingIncludes: {
    "/api/upload-pdf": ["./node_modules/pdfjs-dist/**/*"],
    "/api/process-book": ["./node_modules/pdfjs-dist/**/*"],
  },
};

export default nextConfig;
