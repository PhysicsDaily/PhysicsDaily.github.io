# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Physics Daily is an **Eleventy-based static site** providing comprehensive physics education content with gamification features, user authentication, and interactive quizzes. The site covers 52 chapters across 5 major physics areas (Classical Mechanics, Thermodynamics, Electricity & Magnetism, Optics, and Modern Physics).

## Common Development Commands

### Development
```bash
# Start development server (http://localhost:8080)
npm start

# Build production site (outputs to _site/)
npm run build

# Clean build artifacts
npm run clean
```

### Code Quality
```bash
# Format code
npm run format

# Lint JavaScript
npm run lint
```

### Testing
No test suite is currently configured (returns error).

## Architecture & Structure

### Build System
- **Static Site Generator**: Eleventy (11ty) v3.1.2
- **Input Directory**: `CONTENT/`
- **Output Directory**: `_site/`
- **Template Engine**: Nunjucks (`.njk` files)
- **Configuration**: `config/eleventy.js`

### Content Organization
- **Layout Templates**: `CONTENT/_includes/layouts/` (base.njk, mechanics.njk)
- **Pages**: `CONTENT/*.njk` (index, dashboard, settings, leaderboard, about, resources)
- **Topic Pages**: `CONTENT/mechanics/` (kinematics, measurements, etc.)
- **Static Assets**: `assets/` (CSS, JS, images - copied via passthrough)
- **Configuration Files**: `config/` (eleventy.js, eslint.config.mjs, .prettierrc)

### Key Features & Integration Points

#### 1. Firebase Integration
- **Config**: `assets/js/firebase-config.js` (exposed config is intentional for client-side)
- **Authentication**: `assets/js/auth-manager.js`, `assets/js/auth-ui.js`
- **Firestore Collections**:
  - `users` - XP totals, profile info (nickname, country)
  - `xp_logs` - Individual XP award records with metadata
- **Auth Flow**: Uses Firebase Compat SDK (v9.22.0), sign-in handled via `auth-navigation.js`

#### 2. Gamification System
- **Core Module**: `assets/js/gamification.js`
- **State Storage**: localStorage key `pd:gamification` (XP, level, coins, badges)
- **XP Sync Logic**: Local XP syncs to Firestore when user signs in via `syncXpToCloud()`
- **Level Calculation**: Progressive curve starting at 250 XP, increases by +50 XP per level
- **Quiz Rewards**: 10 XP per correct answer + speed/score bonuses

#### 3. Component Loading Pattern
- **Dynamic Components**: Header/footer loaded via `header-loader.js`/`footer-loader.js`
- **Insertion Points**: `<div id="global-header">` and `<div id="global-footer">` in base.njk
- **Global Scripts**: Always loaded in base template (firebase, auth, global.js)

#### 4. Theme System
- **Implementation**: CSS custom properties with `[data-theme="dark"]` selector
- **Toggle**: User preference saved to localStorage, applied on page load
- **Variables**: Defined in inline `<style>` blocks in page front matter (e.g., index.njk:54-88)

#### 5. Quiz System
- **Manager**: `assets/js/quiz-manager.js`
- **Template**: `CONTENT/mcq-template.njk`
- **Result Tracking**: Saves to authManager for streaks, calls `gamification.awardForQuiz()`
- **Styling**: `assets/css/mcq-styles.css`

### Front Matter Patterns

Pages use extensive front matter for:
- **pageStyles**: Array or string of CSS paths to include
- **pageScripts**: Array of script objects with `src`, `defer`, `async`, `type` properties
- **headExtra**: Raw HTML injected into `<head>` (structured data, analytics, meta tags)
- **bodyExtra**: Raw HTML injected before `</body>`
- **skipMainWrapper**: Boolean to bypass `<main>` wrapper (used on index.njk)

### Deployment

- **Platform**: GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch or manual dispatch
- **Build**: Runs `npx @11ty/eleventy`, uploads `_site/` artifact
- **URL**: https://physicsdaily.github.io

### Important Conventions

1. **Asset References**: Use absolute paths from root (e.g., `/assets/js/file.js`, not relative)
2. **Safe HTML**: Use `| safe` filter when rendering HTML from variables
3. **Passthrough Copy**: Static files must be declared in `config/eleventy.js` (service-worker.js, robots.txt, manifest, ads.txt, sitemap.xml)
4. **Markdown Processing**: Uses Nunjucks engine (`markdownTemplateEngine: "njk"`)
5. **XP Award Pattern**: Always use `gamification.grantXp()` (not `addXp()`) to ensure cloud logging
6. **Auth State**: Pages use `body.auth-pending` class; JavaScript updates when auth resolves

### Directory Structure

```
PhysicsDaily/
├── config/                  # All configuration files (rarely edited)
│   ├── .prettierrc         # Code formatting rules
│   ├── eleventy.js         # Eleventy build configuration
│   └── eslint.config.mjs   # JavaScript linting rules
├── CONTENT/                # Your content (edit frequently)
│   ├── _includes/          # Layout templates and components
│   ├── _data/              # Data files for site generation
│   ├── mechanics/          # Physics topic pages
│   └── *.njk               # Main site pages
├── assets/                 # Static files
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Images and media
├── .github/                # GitHub Actions workflows
├── _site/                  # Generated site (auto-created, don't edit)
├── node_modules/           # Dependencies (auto-created)
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── CLAUDE.md               # This file
```

### For Beginners

**Files you'll edit:**
- `CONTENT/` - All your content and pages
- `assets/css/` - Styling
- `assets/js/` - JavaScript functionality (if needed)

**Files you rarely touch:**
- `config/` - Technical configuration
- `package.json` - Only when adding new dependencies
- Root files (robots.txt, manifest, etc.) - Static site files
