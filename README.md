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

Chapter pages live in `src/content/docs/`. The current Mechanics content is organized as:

```text
src/content/docs/
├── index.mdx
├── introduction-to-physics.md
└── mechanics/
    ├── index.mdx
    ├── chapter-1-vectors.md
    └── chapter-2-kinematics.md
```

Add sections to a chapter with Markdown headings:

```md
---
title: 'Chapter 2: Kinematics'
---

## Position and displacement

Write your notes here.

## Velocity

Continue the chapter here.
```

Starlight automatically adds level-two and level-three headings to the page table of contents.

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
