/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Workaround for Next.js 15.5.4 Html import error
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Ensure Prisma files are properly included
    if (isServer) {
      config.externals.push('@prisma/client');
    }

    return config;
  },
  // Ensure Prisma engines are included in the build
  serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
}

module.exports = nextConfig
