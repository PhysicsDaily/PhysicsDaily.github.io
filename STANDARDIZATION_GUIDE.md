# 📚 Physics Daily - Standardized Development Guide

## Overview
This codebase has been standardized to make it easy for you to focus on writing lesson content without worrying about technical setup. All the complex code is now in reusable components and utilities.

## 🎯 What You Need to Know

### For Adding New Question Pages
You only need to work with **3 simple steps**:

1. **Create your questions data file**
2. **Create your page file** 
3. **Done!** 🎉

## 🔧 How to Add New Content

### Step 1: Create Questions Data File
Create a new file in `data/questions/[topic]/[type].js`:

```javascript
// data/questions/mechanics/kinematics.js
export const kinematicsQuestions = [
  {
    id: 1,
    difficulty: 'Easy', // 'Easy', 'Medium', or 'Hard'
    question: 'What is velocity? Use LaTeX like $v = \\frac{d}{t}$',
    answer: '<p>Velocity is displacement per unit time: $v = \\frac{\\Delta x}{\\Delta t}$</p>'
  },
  // Add more questions...
];
```

### Step 2: Create Your Page File
Create a new file in `pages/[subject]/[topic]/[type].js`:

```javascript
// pages/mechanics/kinematics/conceptual.js
import QuestionsPage from '../../../components/QuestionsPage';
import { kinematicsQuestions } from '../../../data/questions/mechanics/kinematics';
import { createBreadcrumbs } from '../../../utils/breadcrumbs';

export default function KinematicsConceptualPage() {
  const pageConfig = {
    title: 'Conceptual Questions',
    subtitle: 'Chapter 2: Kinematics',
    description: 'Test your understanding of motion and kinematics.',
    questions: kinematicsQuestions,
    breadcrumbs: createBreadcrumbs('mechanics/kinematics/conceptual')
  };

  return <QuestionsPage {...pageConfig} />;
}
```

### Step 3: Add Breadcrumb Configuration
Update `utils/breadcrumbs.js` to include your new path:

```javascript
// Add to breadcrumbConfigs object
'mechanics/kinematics/conceptual': [
  commonBreadcrumbs.home,
  commonBreadcrumbs.mechanics,
  { text: '🚀 Kinematics', href: '/mechanics/kinematics' },
  { text: '🤔 Conceptual Questions', current: true }
]
```

## 📝 LaTeX Guidelines

### For Math Equations:
- **Inline math**: Use `$equation$` 
- **Block math**: Use `$$equation$$`
- **Common symbols**: 
  - `\\frac{a}{b}` for fractions
  - `\\sqrt{x}` for square roots
  - `\\Delta` for delta
  - `\\alpha`, `\\beta`, `\\gamma` for Greek letters
  - `\\rightarrow` or `\\Rightarrow` for arrows
  - `\\implies` for implies

### Examples:
```javascript
question: 'Find the acceleration when $v = 10$ m/s and $t = 5$ s',
answer: '<p>Using $a = \\frac{v}{t}$, we get: $$a = \\frac{10}{5} = 2 \\text{ m/s}^2$$</p>'
```

## 🎨 Styling System

### Difficulty Colors (Automatic):
- **Easy**: Green
- **Medium**: Orange  
- **Hard**: Red

### Global CSS Classes Available:
- `.container` - Max-width content wrapper
- `.btn` - Primary button style
- `.btn-secondary` - Secondary button style
- `.fade-in` - Animation class
- `.math` - Math equation styling

## 📁 File Structure

```
├── components/
│   ├── QuestionsPage.js     # ✅ Main reusable component
│   ├── Header.js
│   └── Footer.js
├── data/
│   └── questions/
│       └── [subject]/
│           └── [topic].js   # 📝 Your question data
├── pages/
│   └── [subject]/
│       └── [topic]/
│           └── [type].js    # 📄 Your simple page files
├── utils/
│   └── breadcrumbs.js       # 🧭 Navigation helper
├── hooks/
│   └── useMathJax.js        # ✅ Math rendering (automatic)
└── styles/
    ├── globals.css          # ✅ Global styles
    └── ContentPage.module.css # ✅ Page-specific styles
```

## 🔧 Technical Details (You Don't Need to Touch These)

### Automatic Features:
- ✅ **MathJax Loading**: Equations render automatically
- ✅ **Responsive Design**: Works on all devices
- ✅ **Dark/Light Theme**: Automatic theme switching
- ✅ **SEO**: Meta tags and descriptions handled
- ✅ **Breadcrumbs**: Navigation handled automatically
- ✅ **Error Handling**: Build errors are minimized

### Components You Can Use:
- `QuestionsPage` - Main component for question pages
- `Header` - Site header
- `Footer` - Site footer

### Hooks Available:
- `useMathJax()` - Called automatically in QuestionsPage
- `useScrollAnimation()` - For animations

## 🚀 Getting Started Checklist

1. ✅ **MathJax is working** - Equations render properly
2. ✅ **Build system is fixed** - No more build errors
3. ✅ **Reusable components** - Easy to add new content
4. ✅ **Standardized structure** - Consistent everywhere
5. ✅ **Global styles** - Beautiful design automatically

## 🆘 Need Help?

### Common Tasks:
- **Add new topic**: Create data file + page file + breadcrumb entry
- **Fix equation**: Check LaTeX syntax (double backslashes: `\\frac`)
- **Change styling**: Modify `styles/globals.css` or `ContentPage.module.css`
- **Add navigation**: Update `utils/breadcrumbs.js`

### Build and Test:
```bash
npm run build  # Check for errors
npm run dev    # Test locally
```

## 🎉 You're All Set!

Now you can focus on what you do best - creating amazing physics content! The technical foundation is solid and standardized. Just follow the 3-step process above for each new page you want to create.

Happy coding! 🚀
