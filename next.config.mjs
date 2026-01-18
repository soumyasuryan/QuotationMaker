/** @type {import('next').NextConfig} */
// next.config.mjs

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cosco.in",
        port: "",
        pathname: "/uploads/fitness/**",
      },
    ],
  },
  experimental: {
    // For Next.js 14.x
    serverComponentsExternalPackages: ['pdfkit'],
  },
};

export default nextConfig;
