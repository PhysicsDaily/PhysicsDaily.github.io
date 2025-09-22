# Build Optimization Recommendations

## Current Build Process Analysis

The current `.eleventy.js` has basic optimizations:
- HTML minification for production (`NODE_ENV=production`)
- Asset passthrough copying
- Collection-based content organization

## Recommended Enhancements

### 1. Asset Fingerprinting & Caching

```javascript
// Add to .eleventy.js
const crypto = require('crypto');

// Generate content-based hashes for assets
eleventyConfig.addFilter("hash", function(absolutePath) {
  const content = fs.readFileSync(absolutePath);
  return crypto.createHash('md5').update(content).digest('hex').substr(0, 8);
});

// Usage in templates:
// <link rel="stylesheet" href="/assets/css/global.css?v={{ '/src/assets/css/global.css' | hash }}">
```

### 2. Environment-Specific Configuration

```javascript
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Conditional transforms
if (isProd) {
  eleventyConfig.addTransform("htmlmin", htmlMinifierTransform);
  eleventyConfig.addTransform("criticalCSS", criticalCSSTransform);
}

if (isDev) {
  eleventyConfig.setServerOptions({
    watch: ["src/assets/**/*"],
    liveReload: true
  });
}
```

### 3. Critical CSS Extraction

```javascript
// Add transform for critical CSS inlining
eleventyConfig.addTransform("criticalCSS", async function(content, outputPath) {
  if (isProd && outputPath && outputPath.endsWith(".html")) {
    // Extract critical CSS for above-the-fold content
    // Inline critical styles, async load non-critical
  }
  return content;
});
```

### 4. Image Optimization

```javascript
// Add image processing for physics diagrams
eleventyConfig.addShortcode("physicsImage", function(src, alt, loading = "lazy") {
  return `<picture>
    <source srcset="/assets/images/${src}.webp" type="image/webp">
    <img src="/assets/images/${src}.png" alt="${alt}" loading="${loading}">
  </picture>`;
});
```

### 5. Bundle Analysis & Performance

```javascript
// Add bundle size tracking
eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
  if (isProd) {
    const bundleAnalysis = await analyzeBundleSize(dir.output);
    console.log('Bundle Analysis:', bundleAnalysis);
  }
});
```

## Package.json Script Enhancements

```json
{
  "scripts": {
    "dev": "NODE_ENV=development eleventy --serve --watch",
    "build": "NODE_ENV=production eleventy",
    "build:analyze": "NODE_ENV=production ANALYZE=true eleventy",
    "preview": "npm run build && npx serve _site",
    "optimize:images": "node scripts/optimize-images.js",
    "precommit": "npm run lint && npm run build"
  }
}
```

## Development Dependencies

Consider adding:
- `@11ty/eleventy-img` - Image optimization
- `eleventy-plugin-bundle` - Asset bundling
- `critical` - Critical CSS extraction
- `workbox-build` - Service worker generation
- `webpack-bundle-analyzer` - Bundle analysis

## Performance Monitoring

### Metrics to Track:
- Build time per environment
- Bundle sizes (CSS, JS, Images)
- Page load metrics
- Core Web Vitals

### Implementation:
```javascript
// Add performance monitoring
eleventyConfig.addGlobalData("buildMetrics", () => {
  return {
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    buildMode: process.env.NODE_ENV || 'development'
  };
});
```

## Recommended Implementation Order

1. **Immediate** (Week 1):
   - Environment-specific configurations
   - Asset fingerprinting for CSS/JS
   - Build time optimization

2. **Short-term** (Week 2-3):
   - Image optimization pipeline
   - Critical CSS extraction
   - Service worker enhancement

3. **Long-term** (Month 2):
   - Advanced bundling strategies
   - Performance monitoring dashboard
   - Automated optimization CI/CD

## Expected Performance Gains

- **Build Time**: 20-30% faster with optimized asset handling
- **Bundle Size**: 15-25% reduction with tree shaking and minification
- **Load Time**: 30-40% improvement with critical CSS and image optimization
- **Cache Hit Rate**: 80%+ with proper fingerprinting

## Implementation Scripts

### Asset Optimization Script
```javascript
// scripts/optimize-assets.js
const { optimize } = require('svgo');
const sharp = require('sharp');

async function optimizeImages() {
  // Process physics diagrams, convert to WebP
  // Resize for different viewports
  // Generate low-quality placeholders
}

async function optimizeSVGs() {
  // Optimize physics equation SVGs
  // Remove unnecessary metadata
  // Minify paths
}
```

### Build Analysis
```javascript
// scripts/analyze-build.js
const fs = require('fs');
const path = require('path');

function analyzeBundleSize(outputDir) {
  // Calculate total bundle size
  // Identify largest assets
  // Generate optimization recommendations
  // Output performance report
}
```

This optimization strategy maintains the current simplicity while adding production-ready enhancements for better performance and developer experience.