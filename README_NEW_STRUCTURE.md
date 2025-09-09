# Physics Daily - Modern Static Site Structure

## 🚀 What's New

Your Physics Daily website has been restructured using **Eleventy (11ty)**, a powerful static site generator. This solves your main problems:

1. **No more code duplication** - Headers, footers, and navigation are defined once
2. **Easy content creation** - Write in Markdown instead of HTML
3. **Centralized quiz management** - All questions in one JSON file
4. **Automatic page generation** - New pages are created automatically from your content

## 📋 Prerequisites

Before you can build the site, you need to install Node.js:

1. **Download Node.js** from https://nodejs.org/ (choose the LTS version)
2. **Install Node.js** by running the downloaded installer
3. **Verify installation** by opening Command Prompt and typing:
   ```
   node --version
   npm --version
   ```

## 🏗️ New Project Structure

```
PhysicsDaily.github.io/
├── src/                       # Source files (you edit these)
│   ├── _data/                # Data files
│   │   └── quizzes.json      # All quiz questions in one place
│   ├── _includes/            # Reusable templates
│   │   ├── base.njk          # Main layout template
│   │   └── chapter.njk       # Chapter page template
│   ├── content/              # Your content in Markdown
│   │   └── mechanics/
│   │       └── chapter5/
│   │           └── conceptual.md
│   └── quiz-generator.njk    # Automatic quiz page generator
├── assets/                   # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   │   └── unified-quiz.js  # Single quiz engine for all topics
├── _site/                    # Generated site (created by Eleventy)
├── .eleventy.js              # Eleventy configuration
└── package.json              # Project dependencies
```

## 🛠️ How to Build and Run

1. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

2. **Build the site**:
   ```bash
   npm run build
   ```
   This creates the `_site` folder with your complete website.

3. **Development mode** (with live reload):
   ```bash
   npm run start
   ```
   This starts a local server at http://localhost:8080 and automatically rebuilds when you make changes.

## 📝 Adding New Content

### Adding a New Chapter

1. Create a new Markdown file in `src/content/[topic]/[chapter]/`:
   ```markdown
   ---
   layout: chapter.njk
   title: "Your Chapter Title"
   chapter: 7
   topic: mechanics
   ---
   
   # Your Content Here
   
   Write your content in Markdown. It's much easier than HTML!
   
   - Use bullet points
   - Add **bold** and *italic* text
   - Include images: ![description](path/to/image.png)
   ```

2. Run `npm run build` to generate the HTML page

### Adding Quiz Questions

1. Open `src/_data/quizzes.json`
2. Add your questions to the appropriate topic:
   ```json
   {
     "mechanics": {
       "questions": [
         {
           "id": 6,
           "question": "Your new question here?",
           "options": ["Option A", "Option B", "Option C", "Option D"],
           "answer": "Option B",
           "solution": "Explanation of why Option B is correct."
         }
       ]
     }
   }
   ```

3. The quiz page is automatically updated!

## 🎯 Key Benefits

### Before (Old Structure)
- Copy-paste navigation into every new HTML file
- Write complex HTML for content
- Quiz questions scattered across multiple JavaScript files
- Manual creation of every quiz page
- Inconsistent styling and functionality

### After (New Structure)
- Navigation defined once in `base.njk`
- Write simple Markdown for content
- All quiz questions in `quizzes.json`
- Quiz pages generated automatically
- Consistent, maintainable codebase

## 🔄 Migrating Existing Content

To migrate your existing HTML pages to the new structure:

1. **Create a Markdown file** in the appropriate `src/content/` folder
2. **Add front matter** (the YAML at the top of the file)
3. **Copy the content** from your HTML file
4. **Convert HTML to Markdown**:
   - `<h1>` → `#`
   - `<h2>` → `##`
   - `<p>` → Plain text
   - `<strong>` → `**bold**`
   - `<em>` → `*italic*`
   - `<ul><li>` → `- bullet point`

## 🚢 Deployment

After building your site with `npm run build`, the `_site` folder contains your complete static website. You can:

1. **Deploy to GitHub Pages**: Push the `_site` contents to your repository
2. **Deploy to Netlify**: Connect your repository and set build command to `npm run build`
3. **Deploy anywhere**: The `_site` folder works on any static hosting service

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build site | `npm run build` |
| Start dev server | `npm run start` |
| Clean build folder | `npm run clean` |

## 🆘 Troubleshooting

**Node.js not found**: Make sure Node.js is installed and restart your terminal

**Build errors**: Check that all Markdown files have valid front matter

**Quiz not working**: Verify `quizzes.json` is valid JSON (use a JSON validator)

**Styles not loading**: Make sure paths in templates start with `/` (e.g., `/assets/css/global.css`)

## 📖 Next Steps

1. **Install Node.js** if you haven't already
2. **Run `npm install`** to install Eleventy
3. **Try `npm run start`** to see your site locally
4. **Create a test Markdown file** to see how easy it is
5. **Gradually migrate** your existing content

## 🎉 Congratulations!

Your Physics Daily website is now:
- ✅ Easier to maintain
- ✅ Faster to extend
- ✅ More consistent
- ✅ Professional and scalable

Happy content creation! 🚀
