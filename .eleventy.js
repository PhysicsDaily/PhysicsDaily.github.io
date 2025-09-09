module.exports = function(eleventyConfig) {
  // Copy static assets directly to output
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("service-worker.js");
  eleventyConfig.addPassthroughCopy(".well-known");
  eleventyConfig.addPassthroughCopy("ads.txt");
  
  // Keep existing root HTML pages and legacy sections available unchanged
  eleventyConfig.addPassthroughCopy({
    "index.html": "index.html",
    "about.html": "about.html",
    "resources.html": "resources.html",
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
  
  // Do not generate our experimental homepage so the original index.html remains
  eleventyConfig.ignores.add("src/index.njk");

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
