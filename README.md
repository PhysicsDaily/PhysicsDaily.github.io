# PhysicsDaily GitHub Pages (Jekyll)

This repository is now a Jekyll site for GitHub Pages.

## Local development

1. Install Ruby (2.7+ recommended) and Bundler.
2. Install dependencies:
   ```
   bundle install
   ```
3. Serve locally:
   ```
   bundle exec jekyll serve
   ```
4. Visit http://localhost:4000

## Adding content

- Pages: put Markdown files in `_pages/` with front matter.
- Posts: add files to `_posts/` named `YYYY-MM-DD-title.md`.
- Layouts: `_layouts/` contain templates.
- Shared partials: `_includes/`.

## Migrating existing HTML

Add YAML front matter at the top of an existing HTML file so Jekyll processes it:

```
---
layout: page
title: "My Existing Page"
permalink: /my-existing-page/
---
```

Then remove duplicate `<head>`, header, and footer markup from the page body so the layout handles them. Place any common header/footer HTML into `_includes/header.html` and `_includes/footer.html`.
