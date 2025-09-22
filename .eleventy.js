module.exports = function(eleventyConfig) {
  // Manual sitemap generation (without plugin dependency)
  eleventyConfig.addGlobalData("buildTime", () => new Date().toISOString());
  
  // Generate sitemap.xml during build
  eleventyConfig.addCollection("sitemapPages", function(collectionApi) {
    return collectionApi.getAll().filter(item => {
      return item.outputPath && item.outputPath.endsWith('.html') && !item.data.noSitemap;
    });
  });

  // HTML Minification for production
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(process.env.NODE_ENV === "production" && outputPath && outputPath.endsWith(".html")) {
      try {
        const htmlmin = require("html-minifier-terser");
        return htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
      } catch(e) {
        return content;
      }
    }
    return content;
  });

  // Copy static assets directly to output
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("service-worker.js");
  eleventyConfig.addPassthroughCopy(".well-known");
  eleventyConfig.addPassthroughCopy("ads.txt");
  
  // Remove root page passthroughs - now handled by Eleventy templates
  // Keep only essential static files
  eleventyConfig.addPassthroughCopy({
    "offline.html": "offline.html",
    "404.html": "404.html"
  });
  // Passthrough legacy topic directories so old UI/links continue to work
  [
    "mechanics",
    "thermodynamics",
    "electromagnetism",
    "optics",
    "fluids",
    "waves",
    "modern"
  ].forEach(dir => eleventyConfig.addPassthroughCopy(dir));
  
  // Add a filter to create slugs from strings
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return "";
    return str.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  // Add a filter to get topic display name
  eleventyConfig.addFilter("topicName", function(str) {
    const topicNames = {
      "mechanics": "Mechanics",
      "kinematics": "Kinematics",
      "thermodynamics": "Thermodynamics",
      "electromagnetism": "Electromagnetism",
      "waves": "Waves",
      "optics": "Optics",
      "fluids": "Fluids",
      "modern": "Modern Physics"
    };
    return topicNames[str] || str;
  });

  // Add a collection for all chapters
  eleventyConfig.addCollection("chapters", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/**/*.md");
  });
  
  // Enable generation of Eleventy pages from src
  // eleventyConfig.ignores.add("src/index.njk"); // Commented out to enable Eleventy homepage

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};

