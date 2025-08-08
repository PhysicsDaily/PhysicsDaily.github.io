/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells Next.js to create a static export of your site in an 'out' folder.
  // GitHub Pages can only host static files, so this is essential.
  output: 'export',

  // This setting is needed for the static export to handle images correctly
  // without a dedicated server. It ensures your images will show up.
  images: {
    unoptimized: true,
  },

  // Because your GitHub Pages URL is PhysicsDaily.github.io/PhysicsDaily.github.io,
  // we need to tell Next.js that all paths start with '/PhysicsDaily.github.io'.
  basePath: '/PhysicsDaily.github.io',

  // This tells Next.js where to find assets like CSS and images on the live server.
  // It must match the basePath for GitHub Pages.
  assetPrefix: '/PhysicsDaily.github.io/',
  
  // This adds a trailing slash to URLs (e.g., /about becomes /about/).
  // It helps ensure links work correctly in a static export environment.
  trailingSlash: true,
};

module.exports = nextConfig;
