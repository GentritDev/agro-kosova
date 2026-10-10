import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' https://*.public.blob.vercel-storage.com data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://*.neon.tech https://blob.vercel-storage.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
        ]
      }
    ];
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] }
};

export default nextConfig;
