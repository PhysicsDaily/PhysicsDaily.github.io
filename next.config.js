/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to create a static export of your site.
  output: 'export',

  // This is still needed for images to work correctly on GitHub Pages.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
