# Physics Daily - AI Agent Guidelines

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing & Quality](#testing--quality)
6. [Agent-Specific Instructions](#agent-specific-instructions)
7. [Troubleshooting](#troubleshooting)

## Project Overview

Physics Daily is a comprehensive physics education platform built as a **static site with PWA capabilities**. The project serves 52 chapters across mechanics, thermodynamics, electromagnetism, optics, and modern physics.

### Key Technologies
- **Static Site Generator**: Eleventy (11ty) v2.0+
- **Templates**: Nunjucks (.njk)
- **Content**: Markdown with front matter
- **PWA**: Service Worker + Web App Manifest
- **Authentication**: Firebase Auth (optional)
- **Deployment**: GitHub Pages (static files)
- **Node**: >=18 required

### Dual Structure (Important!)
The project maintains **both legacy and modern structures** during migration:
- **Legacy**: Root-level HTML files and topic folders (maintained for compatibility)
- **Modern**: `src/` directory with Eleventy-generated content
- **Build Target**: `_site/` (generated, do not edit directly)

## Architecture & Structure

### Directory Layout
```
├── src/                          # Modern Eleventy source
│   ├── _includes/               # Nunjucks templates
│   ├── _data/                   # Global JSON data
│   ├── pages/                   # Site pages (.njk)
│   ├── content/<topic>/         # Markdown content
│   └── assets/                  # CSS, JS, images
├── mcp-server/                  # Standalone validation tool
├── <topic>/                     # Legacy topic folders (preserved)
├── _site/                       # Build output (generated)
└── [root files]                # Legacy HTML + PWA files
```

### Build Process
1. **Source**: `src/` (Markdown + Nunjucks templates)
2. **Processing**: Eleventy compiles with collections, filters, transforms
3. **Output**: `_site/` (static HTML/CSS/JS)
4. **Deployment**: GitHub Pages serves from `_site/`

### Key Collections & Filters
- **Collections**: `chapters`, `sitemapPages`
- **Filters**: `slug` (URL-safe strings), `topicName` (display names)
- **Transforms**: HTML minification (production only)
- **Passthrough**: Static assets, PWA files, legacy directories

### PWA & Performance Features
- **Service Worker**: Cache-first strategy with offline support
- **Web App Manifest**: `manifest.webmanifest` for app-like experience
- **Performance**: HTML minification in production builds
- **Assets**: Optimized CSS/JS bundling via passthrough copying

### Firebase Integration (Optional)
- **Authentication**: Firebase Auth for user accounts
- **Config**: `src/assets/js/firebase-config.js` (safe client-side config)
- **Persistence**: Local storage for offline functionality
- **Security**: No sensitive keys in client-side code

## Development Workflow

### Environment Setup
1. **Prerequisites**: Node.js >=18, npm
2. **Install**: `npm install` (both root and `mcp-server/`)
3. **Development**: `npm run start` (live reload)
4. **Build**: `npm run build` (production-ready)

### File Creation Guidelines
- **New Content**: Place in `src/content/<topic>/chapter*/index.md`
- **New Pages**: Create in `src/pages/*.njk`
- **Assets**: Add to `src/assets/` with appropriate subdirectories
- **Templates**: Extend existing layouts in `src/_includes/`

### Legacy Migration Strategy
- **Preserve**: Keep legacy files until Eleventy equivalents are verified
- **Test**: Always test both legacy and new pages during transition
- **Gradual**: Migrate one section at a time, not wholesale changes

## Build, Test, and Dev Commands
- Root (site):
  - `npm run start` - local dev server with watch.
  - `npm run serve` - serve once for local preview.
  - `npm run build` - generate static site to `_site/`.
  - `npm run lint` / `npm run format` - ESLint/Prettier.
  - `npm run clean` - remove `_site/`.
- MCP server:
  - `cd mcp-server && npm run dev` - watch mode.
  - `npm run test`, `test:unit`, `test:integration`, `coverage` - Node test runner with `c8`.

## Coding Standards

### Style Guidelines
- **Prettier**: 2 spaces, 100 columns, semicolons, single quotes
- **ESLint**: Browser + Node environments; `no-unused-vars` as warning; `no-console` allowed
- **File Naming**: kebab-case for all files (e.g., `src/pages/quiz-generator.njk`)
- **Front Matter**: Include `layout`, `title`, `topic`, `chapter`; use lowerCamelCase for keys
- **Templates**: Nunjucks (`.njk`) for pages/layouts; JavaScript as ES modules

### Content Structure
- **Markdown Files**: `src/content/<topic>/chapter*/index.md` with proper front matter
- **Global Data**: JSON files in `src/_data/` for site-wide configuration
- **Assets Organization**: Topic-specific CSS in `css/topics/`, JS in `js/topics/`

## Testing & Quality

### Site Testing
- No formal test suite - ensure `npm run build` succeeds without errors
- Manual testing: verify pages render correctly in browser
- Check console for JavaScript errors during development
- Validate responsive design across device sizes

### MCP Server Testing
- Write tests in `mcp-server/test/` directory
- Use Node.js built-in test runner with `c8` for coverage
- Target >=80% code coverage: `npm run coverage`
- Keep unit tests fast and focused

### Quality Checks
- Run `npm run format` before committing code
- Ensure `npm run lint` passes for both root and `mcp-server/`
- Validate HTML output with browser developer tools
- Test offline functionality via service worker

## Commit & PR Guidelines
- Commits: concise, imperative. Prefer conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- PRs: include scope/summary, linked issues, screenshots or GIFs for UI changes, and steps to verify. Confirm `lint` and `build` are clean (root and `mcp-server/`).

## Security & Config Tips
- Do not commit secrets. This site is static; any API keys must be proxied or injected at build via safe config.
- Production build: set `NODE_ENV=production` to enable HTML minification.
- Node >=18 required for `mcp-server/`.

## Agent-Specific Instructions

### File Creation & Organization
- **New Content**: Place in `src/content/<topic>/chapter*/index.md` with proper front matter
- **New Pages**: Create in `src/pages/*.njk` using existing layouts from `src/_includes/`
- **Assets**: Add to `src/assets/` with appropriate subdirectories (`css/`, `js/`, `images/`)
- **Legacy Migration**: Avoid editing root HTML files unless specifically migrating them

### Development Constraints
- **Dual Structure**: Respect both legacy (`/`) and modern (`src/`) file structures
- **Passthrough Config**: Preserve existing passthrough copies in `.eleventy.js`
- **Asset Organization**: Keep topic-specific assets in `css/topics/` and `js/topics/`
- **Template Extensions**: Use `.njk` for pages/layouts, maintain existing template hierarchy

### Best Practices for AI Agents
- **Incremental Changes**: Make focused edits rather than wholesale rewrites
- **Test Before Deploy**: Always run `npm run build` to verify changes don't break the build
- **Respect Conventions**: Follow existing naming patterns and file organization
- **Documentation**: Update relevant docs when making structural changes

## Troubleshooting

### Common Build Issues
- **"Cannot find module"**: Run `npm install` in both root and `mcp-server/`
- **Empty `_site/` directory**: Check `.eleventy.js` configuration and ensure `src/` exists
- **Assets not copying**: Verify passthrough copy configuration in `.eleventy.js`
- **Template errors**: Check Nunjucks syntax in `.njk` files and front matter formatting

### Development Issues
- **Live reload not working**: Restart dev server with `npm run start`
- **Legacy pages not loading**: Ensure passthrough directories are configured
- **PWA not updating**: Clear browser cache and service worker
- **Firebase auth errors**: Check console for configuration issues

### Performance Optimization
- **Large build times**: Use `npm run serve` for one-time builds during development
- **Large bundle sizes**: Review asset organization and remove unused files
- **Slow page loads**: Enable production build with `NODE_ENV=production`

