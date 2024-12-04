/** @type {import('next').NextConfig} **/

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
};

module.exports = withSvgr(nextConfig);
