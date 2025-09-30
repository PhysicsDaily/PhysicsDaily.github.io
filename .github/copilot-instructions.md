# Physics Daily - AI Coding Agent Instructions

## Project Overview
Educational physics platform built with **Eleventy (11ty)** static site generator, Firebase authentication, and gamification. Deployed to GitHub Pages via GitHub Actions.

## Architecture

### Build System
- **Static Site Generator**: Eleventy 3.x (`npm start` for dev server on :8080, `npm run build` for production)
- **Source**: `src/` (Nunjucks `.njk` templates) → **Output**: `_site/` (HTML/CSS/JS)
- **Templates**: `src/_includes/layouts/` — `base.njk` for general pages, `mechanics.njk` for topic pages
- **Configuration**: `.eleventy.js` (passthrough copies for `assets/`, `service-worker.js`, `robots.txt`, etc.)
- **Deployment**: GitHub Actions workflow at `.github/workflows/deploy.yml` (Node 20, `npm ci`, build, deploy to Pages)

### Directory Structure
```
src/                    # Nunjucks templates (source)
  _includes/layouts/    # Base layouts
  mechanics/            # Physics topic templates
assets/                 # Static assets (copied to _site/)
  css/                  # Stylesheets (global.css, header-fixed.css, auth-styles.css)
  js/                   # Client-side JavaScript (see JavaScript Architecture)
  partials/             # Reusable HTML fragments (header.html, footer.html)
_site/                  # Build output (do NOT edit directly)
```

### JavaScript Architecture

**Core Authentication & State Management** (loaded in every page via `base.njk`):
- `firebase-config.js` — Firebase config (exposed as `window.firebaseConfig`)
- `auth-manager.js` — **AuthManager** class singleton (`window.authManager`)
  - Handles sign-up/sign-in/sign-out, Firebase Firestore sync, onboarding flow
  - User document structure: `users/{uid}` with fields: `displayName`, `xp.total`, `streak`, `stats`, `profile.country`, `onboardingCompleted`
  - **Important**: New users MUST complete onboarding (returns `requiresOnboarding: true`). Use `signUpWithOnboarding()` or `updateUserDocument()` with onboarding data
  - Auto-syncs progress to Firestore every 30s and on visibility change
- `auth-ui.js` — UI for sign-in/sign-up modals
- `header-loader.js` — Loads/caches header from `/assets/partials/header.html` (7-day localStorage cache with version key `pd:header:ver`)
- `auth-navigation.js` — Handles auth-dependent navigation (show/hide dashboard, sign-out buttons)
- `global.js` — Theme toggle (localStorage `theme` key), back-to-top button

**Gamification System** (2 implementations, backwards compatible):
- **Legacy**: `gamification.js` — Simple XP/level/badges (localStorage `pd:gamification`)
- **Enhanced**: `enhanced-xp.js` — **EnhancedXPSystem** class (`window.enhancedXP`)
  - Topic-based mastery tracking (13 topics defined in `this.topics`)
  - XP calculation: 4 XP/correct answer for new questions, 0.5 XP/correct for high mastery (≥70% completion)
  - Milestone badges at 50%/70%/90% topic mastery
  - Daily login XP (+2 base, +0.5 per streak day, max +5 bonus)
  - Logs XP to Firestore `xp_logs` collection and updates `users/{uid}.xp.total`
  - **Backward compatibility**: `window.gamification` wraps `enhancedXP` methods

**Page-Specific Scripts**:
- `quiz-manager.js` — **QuizManager** class for MCQ pages
  - Config: `dataUrl`, `maxQuestions`, `defaultTime`, `positiveMarks`, `negativeMarks`
  - Loads questions (JSON), shuffles, tracks user answers, timer, question palette
  - Awards XP via `enhancedXP.awardQuizXP()` on submit
  - Saves results to Firestore via `authManager.saveQuizResult()`
  - **Retry incorrect** feature: filters incorrect answers and restarts quiz with only those questions
- `dashboard.js` — User dashboard (stats, recent quizzes, XP progress)
- `leaderboard.js` — Global/country leaderboards (queries Firestore `users` collection ordered by `xp.total`)
- `settings.js` — User profile settings (display name, country, theme)

### Firebase Data Model

**Collections**:
- `users/{uid}` — User profiles, XP totals, streaks, stats, preferences
  - `onboardingCompleted` (boolean) — MUST be `true` for full access
  - `profile.country` (string) — Used for country leaderboards
  - `xp.total` (number) — Incremented via `FieldValue.increment()`
  - `xp.lastAwardAt` (timestamp)
- `xp_logs` — XP award logs (uid, displayName, country, xp, reason, meta, timestamp)
- `users/{uid}/progress/data` — Synced progress data (localStorage keys)
- `users/{uid}/quizzes` — Quiz results (chapter, topic, correctAnswers, score, timeSpent)

**Auth Flow**:
1. New user signs up → `requiresOnboarding: true` returned
2. Show onboarding UI (collect displayName, country)
3. Call `signUpWithOnboarding()` or `updateUserDocument()` with onboarding data
4. Creates user doc with `onboardingCompleted: true`

### CSS Architecture

**CSS Variables** (light/dark theme in `:root` and `[data-theme="dark"]`):
```css
--primary-color, --bg-primary, --text-primary, --border-color, --card-bg
```
- Theme toggle via `global.js` sets `data-theme` attribute and persists to localStorage
- Print styles: Hide header, nav, unnecessary buttons for MCQ results

**Key Stylesheets**:
- `global.css` — Base styles, theme variables, typography
- `header-fixed.css` — Fixed header with mobile nav toggle
- `auth-styles.css` — Modal overlays, sign-in/sign-up forms
- `mcq-styles.css` — Quiz interface, question palette, results summary
- `topics/mechanics-style.css` — Physics topic pages (cards, breadcrumbs)

### Service Worker & PWA

- `service-worker.js` — Cache-first strategy for same-origin GETs, 7-day cache (`pd-v30`)
- `manifest.webmanifest` — PWA manifest (icons, theme colors)
- **Cache invalidation**: Bump `CACHE_NAME` version in `service-worker.js`

## Development Workflows

### Starting Dev Server
```bash
npm start  # Eleventy dev server on http://localhost:8080
```
- Auto-rebuilds on file changes in `src/` and `assets/`
- Browser sync enabled

### Building for Production
```bash
npm run build  # Outputs to _site/
```
- GitHub Actions runs this command on push to `main` branch

### Linting & Formatting
```bash
npm run lint    # ESLint (JS, JSON, Markdown, CSS via eslint.config.mjs)
npm run format  # Prettier
```

### Testing Firebase Locally
- Firebase config is public (free tier, authorized domains configured)
- For local testing, ensure `localhost` is in Firebase Console → Authentication → Settings → Authorized domains
- **Important**: OAuth providers (Google) require domain whitelisting

## Project-Specific Conventions

### Nunjucks Template Patterns
- **Front matter variables**: `title`, `description`, `layout`, `pageScripts`, `pageStyles`, `skipMainWrapper`, `bodyClass`
- **pageScripts** accepts array of objects: `{ src, type, async, defer }` or plain string
- Example:
  ```njk
  ---
  layout: layouts/base.njk
  title: "Quiz"
  pageScripts:
    - src: "/assets/js/quiz-manager.js"
      defer: true
  ---
  ```

### Quiz JSON Structure
```json
[
  {
    "question": "What is the SI unit of force?",
    "options": ["Newton", "Joule", "Watt", "Pascal"],
    "answer": "Newton",
    "solution": "Force = mass × acceleration, unit: kg⋅m/s² = Newton"
  }
]
```
- Store in `assets/data/` (NOT tracked, pass URL to `QuizManager` config)

### XP & Gamification Best Practices
- **Always** use `enhancedXP.grantXp()` (not `addXP()`) for new XP awards — it logs to Firestore
- Topic IDs must match keys in `enhancedXP.topics` object (e.g., `'mechanics-foundations'`)
- XP backfill on sign-in: `enhancedXP.syncXpToCloud()` is called automatically by auth state listener

### Auth UI States
- Pages start with `<body class="auth-pending">` → changed to `auth-ready` after Firebase auth check
- Use `authManager.isSignedIn()` to conditionally show content
- **Onboarding check**: If `!user.onboardingCompleted`, redirect to onboarding or show modal

### Header/Footer Loading
- Header loaded via `header-loader.js` (cached in localStorage for 7 days)
- **Cache busting**: Increment `CACHE_VER` in `header-loader.js` when header HTML changes
- Fallback header embedded in `header-loader.js` if fetch fails

## Common Pitfalls

1. **Editing `_site/` directly** — Changes will be overwritten on next build. Edit `src/` or `assets/` instead.
2. **Forgetting onboarding check** — New users MUST complete onboarding. Check `onboardingCompleted` field in Firestore user doc.
3. **XP not appearing in leaderboard** — Ensure `enhancedXP.logXPToCloud()` is called (use `grantXp()`, not `addXP()`).
4. **Firebase offline mode** — Firestore persistence enabled, but may fail if already initialized elsewhere (check console warnings).
5. **Quiz data not loading** — QuizManager expects `dataUrl` in config OR `data` array. Check fetch errors in console.
6. **Service worker cache issues** — Hard refresh (Ctrl+Shift+R) or clear cache. Bump `CACHE_NAME` version for production.
7. **OAuth domain errors** — Add domain to Firebase Console → Authentication → Settings → Authorized domains (common for GitHub Pages, localhost).

## Key Files to Reference

- **Build config**: `.eleventy.js`, `package.json`, `.github/workflows/deploy.yml`
- **Auth flow**: `assets/js/auth-manager.js` (lines 100-200 for onboarding logic)
- **XP calculation**: `assets/js/enhanced-xp.js` (lines 150-250 for topic mastery logic)
- **Quiz lifecycle**: `assets/js/quiz-manager.js` (lines 100-300 for question rendering, submit logic)
- **Layout templates**: `src/_includes/layouts/base.njk`, `src/_includes/layouts/mechanics.njk`

## External Dependencies

- **Firebase**: Authentication (email/password, Google OAuth), Firestore (user data, XP logs, quiz results)
- **Google Fonts**: Inter (body), JetBrains Mono (code)
- **Google Analytics**: Tag ID `G-XN081SR2KP` (configured in layouts)
- **AdSense**: Publisher ID `ca-pub-4062746224225625` (configured in `index.njk`)

## Useful Commands

```bash
# Development
npm start                    # Dev server on :8080
npm run build                # Production build
npm run clean                # Remove _site/

# Code Quality
npm run lint                 # Lint JS, JSON, Markdown, CSS
npm run format               # Format with Prettier

# Firebase (manual operations)
# - Use Firebase Console for Firestore queries, user management
# - Local emulators NOT configured (uses live Firebase project)
```

---

**Last Updated**: 2025-01-20 (based on codebase analysis)
