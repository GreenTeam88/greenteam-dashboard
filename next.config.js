/** @type {import('next').NextConfig} */

const withSvgr = require('@newhighsco/next-plugin-svgr');
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  prettier: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'greenteam-calculator.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withSvgr(nextConfig);
