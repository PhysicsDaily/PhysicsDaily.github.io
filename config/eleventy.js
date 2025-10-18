module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the 'assets' folder to the output folder (_site)
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("service-worker.js");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("ads.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Tell Eleventy to use the 'CONTENT' folder as the input directory
  return {
    dir: {
      input: "CONTENT",
      includes: "_includes",
      data: "_data",
      output: "_site" // This is the default, but it's good to be explicit
    },
    // Set the default template engine to Nunjucks
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
