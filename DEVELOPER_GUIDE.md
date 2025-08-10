# Developer Guide: Adding New Lessons

This guide helps you add new physics lessons while maintaining code quality and performance standards.

## Quick Start for New Lessons

### 1. Use the Standardized LessonPage Component

For new lesson pages, use the `LessonPage` component:

```javascript
import LessonPage from '../../../components/LessonPage';
import styles from '../../../styles/ContentPage.module.css';

export default function YourLessonPage() {
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/mechanics/foundations', label: 'Classical Mechanics' },
    { label: '📚 Your Lesson' }
  ];

  const navigationLinks = [
    { href: '#section1', label: 'Section 1' },
    { href: '#section2', label: 'Section 2' },
    // ... more navigation links
  ];

  return (
    <LessonPage
      title="Your Lesson Title - Physics Daily"
      description="Brief description of your lesson content"
      breadcrumbItems={breadcrumbItems}
      chapterTitle="📚 Chapter X: Your Lesson Title"
      chapterSubtitle="Subtitle describing the lesson focus"
      navigationLinks={navigationLinks}
    >
      {/* Your lesson content here */}
      <section id="section1" className={styles.section}>
        <h2>Section 1</h2>
        <p>Your content...</p>
      </section>
    </LessonPage>
  );
}
```

### 2. Available CSS Classes

Use these predefined classes from `styles/ContentPage.module.css`:

- `styles.section` - Main content sections
- `styles.beginnerNote` - Blue highlighted boxes for beginners
- `styles.intermediateNote` - Orange highlighted boxes for intermediate content  
- `styles.advancedNote` - Green highlighted boxes for advanced content
- `styles.exampleBox` - Yellow boxes for examples
- `styles.keyPoint` - Green boxes for key points
- `styles.warningBox` - Red boxes for warnings
- `styles.formulaBox` - Gray boxes for formulas

### 3. MathJax Integration

MathJax is automatically loaded and configured. Use these formats:

- Inline math: `$E = mc^2$`
- Display math: `$$\int_0^\infty e^{-x} dx = 1$$`
- LaTeX commands: `\alpha`, `\beta`, `\gamma`, etc.

The `useMathJax()` hook is automatically called in `LessonPage`.

## Performance Guidelines

### ✅ Do's

- Use CSS modules instead of inline styles
- Import components from the shared components folder
- Use the `LessonPage` or `PageLayout` components
- Use proper semantic HTML structure
- Use Next.js `Link` for internal navigation
- Keep content in separate sections with proper headings

### ❌ Don'ts

- Don't add inline `<style jsx>` blocks
- Don't duplicate Google Analytics or MathJax loading
- Don't use `<a>` tags for internal navigation
- Don't add scripts directly to individual pages
- Don't create large monolithic components

## File Structure

```
pages/
├── [subject]/
│   ├── [topic]/
│   │   ├── index.js          # Main topic page
│   │   ├── [lesson1].js      # Individual lessons
│   │   ├── [lesson2].js
│   │   └── [lesson-type]/    # Sub-lessons (mcq, conceptual, etc.)
│   │       ├── index.js
│   │       ├── mcq.js
│   │       └── conceptual.js
│   └── foundations.js

components/
├── LessonPage.js             # Standard lesson template
├── PageLayout.js             # Basic page layout
├── Header.js                 # Site header
├── Footer.js                 # Site footer
└── [other-components].js

styles/
├── globals.css               # Global styles and CSS variables
├── ContentPage.module.css    # Lesson and content page styles (reusable)
└── [Component].module.css    # Component-specific styles
```

## Code Quality Standards

- ESLint is configured with Next.js best practices
- All external scripts are loaded efficiently
- MathJax is loaded once in `_document.js`
- Use proper TypeScript-style prop validation where needed
- Follow React hooks rules

## Testing Your Changes

1. Run `npm run build` to check for build errors
2. Run `npm run lint` to check for code quality issues
3. Test in both light and dark themes
4. Verify MathJax renders correctly
5. Check performance with browser dev tools

## Examples

Look at these existing pages for reference:
- `/pages/mechanics/measurements/index.js` - Full lesson page
- `/pages/mechanics/measurements/conceptual.js` - Conceptual questions
- `/pages/mechanics/measurements/mcq.js` - Multiple choice quiz

## Need Help?

- Check existing components in `/components/`
- Look at existing lessons for patterns
- Ensure you're following the established CSS class naming
- Test thoroughly before committing