/** @type {import('next').NextConfig} */
const nextConfig = {
  // We remove 'output: export' because Vercel handles this automatically.
  // We remove 'basePath' and 'assetPrefix' as Vercel doesn't need them.
  // We keep 'images: { unoptimized: true }' for static compatibility if ever needed.
  images: {
    unoptimized: true,
  },
  reactStrictMode: true, // Good practice for spotting potential problems in React.
};

module.exports = nextConfig;
