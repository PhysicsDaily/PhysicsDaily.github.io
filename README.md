# PhysicsDaily

A static physics learning website built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build). It supports Markdown/MDX chapters, optimized images, YouTube videos, external simulations, and KaTeX equations.

## Develop locally

```sh
npm install
npm run dev
```

The development server runs in Astro's background mode. Manage it with:

```sh
npm run dev:status
npm run dev:logs
npm run dev:stop
```

Create a production build with:

```sh
npm run build
```

## Content structure

Chapter pages live in `src/content/docs/`. A short chapter is a single file; a chapter long enough to be read in sittings becomes a directory whose files are its sections. Such a chapter has no page of its own — it begins at its first section, and its own URL redirects there through the `redirects` map in `astro.config.mjs`.

Name a chapter's file or directory `chapter-<number>-<slug>`, directly inside its branch. The homepage chapter counts and the overview cards find chapters by that name, so a page inside a branch that is named otherwise is listed in the sidebar but counted as a chapter nowhere; the build prints a warning naming the page when that happens.

So content divides at two levels: files divide a chapter into sections, and Markdown headings divide a section.

```md
---
title: Position and displacement
---

## Position

Write your notes here.

## Displacement

Continue the section here.
```

Starlight automatically adds level-two and level-three headings to the page table of contents.

### Reading order and the Next link

The sidebar is generated from the files in `src/content/docs/` by `src/data/generateSidebar.mjs` — adding a page means creating the file, and the sidebar picks it up on the next build. Reading order comes from an `order` field in each page's frontmatter (pages without one sort alphabetically after ordered ones; a directory's index page always comes first):

```md
---
title: Position and displacement
order: 1
---
```

A subdirectory becomes a collapsible group. Its label, collapse state, and position among its siblings are declared in an optional `_meta.json` beside its pages:

```json
{ "title": "Chapter 2: Kinematics", "collapsed": true, "order": 2 }
```

Those three fields are the only ones `_meta.json` may set, and the build fails with the file's path if one is missing a value of the right type — a mistyped field would otherwise look exactly like having written no `_meta.json` at all.

Starlight builds each page's Previous/Next footer links from that order, so giving a new section an `order` places it in the chain readers click through. A page opts out of the footer with `prev: false` and `next: false` in its frontmatter, as `mechanics/index.mdx` does. The homepage chapter counts and the chapter cards on each branch's overview page read the same generated sidebar, so a chapter listed there is a chapter everywhere.

The sidebar is built when the Astro config is evaluated — once at dev server startup, and on each build — so creating a page while a dev server is running requires restarting it to appear.

The relative paths in the examples below (`../../../`) are written from a chapter file such as `mechanics/chapter-1-vectors.md`. A section file sits one directory deeper, so it needs one more `../`.

## Equations

KaTeX is configured for inline and display equations:

```md
Inline equation: $v = u + at$

$$
s = ut + \frac{1}{2}at^2
$$
```

## Images

Place source images in `src/assets/` and reference them with a relative Markdown path. Astro will optimize local images during the build.

```md
![Position-time graph](../../../assets/position-time-graph.png)
```

Files that should not be processed, such as downloadable PDFs, can go in `public/`.

## YouTube videos

Change a chapter from `.md` to `.mdx`, import the reusable component, and pass the video ID:

```mdx
import YouTube from '../../../components/YouTube.astro';

<YouTube id="VIDEO_ID" title="Introduction to kinematics" />
```

Videos use YouTube's privacy-enhanced `youtube-nocookie.com` domain and load lazily.

## Simulations

Use the generic simulation component in an MDX chapter:

```mdx
import Simulation from '../../../components/Simulation.astro';

<Simulation
  src="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html"
  title="PhET Projectile Motion simulation"
/>
```

An external website can only be embedded if it permits iframe embedding.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever `main` is pushed. It automatically detects the repository name and configures Astro's GitHub Pages base path.

After pushing the repository to GitHub:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.

For a custom domain, set `SITE_URL` and (if needed) `BASE_PATH` in the build environment and add the domain in the repository's Pages settings.
