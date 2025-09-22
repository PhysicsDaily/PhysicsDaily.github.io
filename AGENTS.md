# Repository Guidelines

## Project Structure & Modules
- Site (Eleventy): `src/` -> builds to `_site/`.
  - Templates: `src/_includes/*.njk`; Data: `src/_data/`; Pages: `src/pages/*.njk`.
  - Content: `src/content/<topic>/chapter*/index.md` (Markdown with front matter).
- Static passthrough: `src/assets/`, `robots.txt`, `manifest.webmanifest`, `service-worker.js`, `.well-known/`.
- Legacy HTML and topic folders at repo root are preserved for compatibility.
- MCP server (Node): `mcp-server/` (own `package.json`, tests, linting).

## Architecture Overview
- Static generator: Eleventy composes Markdown + Nunjucks using `.eleventy.js` collections (`chapters`, `sitemapPages`), filters (`slug`, `topicName`), and passthrough copies. `NODE_ENV=production` enables HTML minification.
- Data flow: `src/content/**` (front matter) + templates in `src/_includes` and `src/pages` -> `_site/` static HTML; global data from `src/_data/*` (e.g., `quizzes.json`).
- Client runtime: Mostly static HTML/CSS; PWA bits via `service-worker.js` and `manifest.webmanifest`; static assets live in `src/assets/` and are passthrough-copied to the build.
- Separation: `mcp-server/` is a standalone Node tool for content validation/automation; it is not bundled into the site.

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

## Coding Style & Naming
- Use Prettier (2 spaces, 100 cols, semicolons, single quotes). Run `npm run format` before PRs.
- ESLint: browser + Node env; `no-unused-vars` is warn; `no-console` allowed.
- Filenames and URLs: kebab-case (e.g., `src/pages/quiz-generator.njk`).
- Content front matter: include `layout`, `title`, `topic`, `chapter`; keep keys in lowerCamelCase.
- Nunjucks templates (`.njk`) for pages/layouts; JS modules as ESM.

## Testing Guidelines
- Site: no formal tests; ensure `npm run build` succeeds and pages render locally without console errors.
- MCP server: write tests under `mcp-server/test/`; keep fast unit tests; target >=80% coverage via `npm run coverage`.

## Commit & PR Guidelines
- Commits: concise, imperative. Prefer conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- PRs: include scope/summary, linked issues, screenshots or GIFs for UI changes, and steps to verify. Confirm `lint` and `build` are clean (root and `mcp-server/`).

## Security & Config Tips
- Do not commit secrets. This site is static; any API keys must be proxied or injected at build via safe config.
- Production build: set `NODE_ENV=production` to enable HTML minification.
- Node >=18 required for `mcp-server/`.

## Agent-Specific Instructions
- Place new site content in `src/content/...` and new pages in `src/pages/...`; avoid editing legacy root HTML unless migrating.
- Keep shared assets under `src/assets/` (topics go in `css/topics` and `js/topics`); leave legacy placeholders only until the Eleventy pages fully replace them.
- Preserve passthrough directories and Eleventy dir config in `.eleventy.js`.
- Keep changes focused; avoid mass reformatting outside touched files.

