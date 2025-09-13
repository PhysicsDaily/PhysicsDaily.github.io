# Physics Daily - AI Coding Instructions

## Project Overview
Physics Daily is a comprehensive physics education platform covering 52 chapters across mechanics, thermodynamics, electromagnetism, optics, and modern physics. It's a static site with Progressive Web App (PWA) features, Firebase authentication, and interactive learning components.

## Architecture & Key Components

### Build System & Deployment
- **11ty (Eleventy)** static site generator (`npm run build`, `npm run serve`)
- **GitHub Pages** deployment (static files served from root)
- **Service Worker** for offline functionality (`service-worker.js` with cache-first strategy)
- **PWA manifest** (`manifest.webmanifest`) for app-like experience

### Component Architecture Pattern
The project uses a **modular component loading system** with caching:

```javascript
// Pattern: Async component loading with localStorage cache
const CACHE_KEY = 'pd:component:html';
const CACHE_VER = '8'; // Bump to invalidate cache
```

**Key Example**: `assets/js/header-loader.js` - demonstrates the critical pattern of:
1. Cache-first loading with version control
2. Graceful fallback to network/stale cache
3. DOM replacement with event binding
4. Idempotent initialization to prevent double-loading

### File Organization
```
assets/
├── css/           # Modular stylesheets
├── js/            # Component modules 
│   └── mcq-data/  # Quiz data JSON files
├── partials/      # Reusable HTML components
└── images/

[topic-areas]/     # Physics content areas
├── [topic].html   # Overview pages
├── chapter[N]/    # Individual chapters
│   ├── index.html # Theory content
│   └── mcq.html   # Quiz interface
└── shared/        # Common topic resources
```

## Critical Development Patterns

### 1. Component Loading System
All shared components (header, footer) use async loading with caching:
- Load from `assets/partials/[component].html`
- Cache in localStorage with version keys
- Handle offline/network failure gracefully
- Prevent double initialization with flags like `window.__headerLoaderLoaded`

### 2. Authentication Integration
Firebase Auth with custom management layer:
- `assets/js/firebase-config.js` - Configuration (safe to expose)
- `assets/js/auth-manager.js` - Central auth state management
- `assets/js/auth-ui.js` - UI components for auth flows
- Pattern: Wait for `authManager.init()` before auth-dependent operations

### 3. Theme System
CSS custom properties with localStorage persistence:
```css
:root { --primary-color: #2563eb; /* light theme */ }
[data-theme="dark"] { --primary-color: #1d4ed8; /* dark theme */ }
```
- Theme state in localStorage as 'theme'
- Applied via `data-theme` attribute on `<html>`

### 4. Quiz System Architecture
- `assets/js/quiz-manager.js` - Core quiz logic
- MCQ data in `assets/js/mcq-data/[topic]-quiz.json`
- Pattern: Initialize with `new QuizManager({dataUrl, maxQuestions, ...})`
- Progress tracking via localStorage keys

### 5. Progressive Enhancement
Base functionality works without JavaScript:
- CSS-only mobile nav fallbacks in `assets/partials/header.html`
- Service worker provides offline experience
- Auth flows gracefully degrade

## Development Commands

```bash
# Development
npm run start        # Start with live reload
npm run serve        # Serve without watch
npm run build        # Build for production

# Code Quality
npm run format       # Prettier formatting
npm run lint         # ESLint checking
```

## Critical Conventions

### CSS Architecture
- **CSS Custom Properties** for theming (avoid hardcoded colors)
- **Responsive-first** with mobile breakpoints at 768px, 480px
- **Component-scoped** classes (e.g., `.quiz-interface`, `.topic-card`)

### JavaScript Patterns
- **IIFE modules** to prevent global pollution
- **Event delegation** over direct element binding
- **localStorage** for client-side persistence (prefix with 'pd:')
- **Graceful error handling** with console warnings, never throw

### HTML Structure
- **Semantic HTML** with proper ARIA labels
- **Breadcrumb navigation** for deep pages
- **Fixed header** with `.has-fixed-header` body class
- **Theme toggle** positioned via fixed CSS

### Firebase Integration
- **Firestore** for user progress/stats sync
- **Auth persistence** set to LOCAL
- **Offline support** via enablePersistence()
- Pattern: Always check `authManager.isSignedIn()` before user operations

## Content Patterns

### Chapter Structure
Each physics chapter follows consistent structure:
- `index.html` - Theory and explanations
- `mcq.html` - Assessment quiz interface
- Breadcrumb: Home → [Topic] → Chapter → Quiz

### Quiz Data Format
```json
{
  "questions": [
    {
      "question": "Text with LaTeX: $E = mc^2$",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Detailed explanation"
    }
  ]
}
```

## Common Tasks

### Adding New Chapter
1. Create `[topic]/chapter[N]/` directory
2. Copy `mcq-template.html` → `mcq.html`
3. Update breadcrumbs and data URLs
4. Create corresponding quiz JSON in `assets/js/mcq-data/`

### Modifying Global Components
1. Edit `assets/partials/[component].html`
2. Bump cache version in corresponding loader JS
3. Test across different page types

### Theme/Styling Changes
1. Modify CSS custom properties in `:root` and `[data-theme="dark"]`
2. Test both light and dark modes
3. Ensure mobile responsiveness

## Testing Considerations
- **Local testing**: Use `npm run serve` for service worker functionality
- **Auth testing**: Add localhost to Firebase authorized domains
- **Offline testing**: Use Chrome DevTools network throttling
- **Mobile testing**: Test navigation and quiz interfaces on mobile viewports

Remember: This is a static site with PWA features, not a traditional SPA. Each page loads independently but shares common components via the loading system.