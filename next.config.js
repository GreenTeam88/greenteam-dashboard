/** @type {import('next').NextConfig} */

const withSvgr = require('@newhighsco/next-plugin-svgr');
const nextConfig = {};

module.exports = withSvgr(nextConfig);
