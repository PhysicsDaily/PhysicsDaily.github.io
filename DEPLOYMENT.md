# 🚀 Deployment Guide - Physics Daily

## GitHub Pages Deployment via GitHub Actions

This project is configured to automatically deploy to GitHub Pages using GitHub Actions whenever you push to the `main` branch.

## 📋 Prerequisites

- ✅ GitHub repository: `PhysicsDaily/PhysicsDaily.github.io`
- ✅ GitHub Pages enabled with source set to **GitHub Actions**
- ✅ Node.js 20+ installed locally for development

## 🔄 Automatic Deployment

### How It Works

1. You push changes to the `main` branch
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) is triggered
3. Workflow installs dependencies with `npm ci`
4. Eleventy builds the site to `_site/` folder
5. Built site is deployed to GitHub Pages
6. Site is live at: https://physicsdaily.github.io/

### Deployment Status

Check deployment status in your repository:
- Go to **Actions** tab: https://github.com/PhysicsDaily/PhysicsDaily.github.io/actions
- View latest workflow run
- Green checkmark ✅ = successful deployment
- Red X ❌ = failed deployment (check logs)

## 🛠️ Manual Deployment

If you need to manually trigger deployment:

1. Go to **Actions** tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow" button

## 💻 Local Development

### Setup

```bash
# Clone repository
git clone https://github.com/PhysicsDaily/PhysicsDaily.github.io.git
cd PhysicsDaily.github.io

# Install dependencies
npm install

# Start development server
npm start
```

Visit http://localhost:8080 to view your local site.

### Build Locally

```bash
# Clean previous build
npm run clean

# Build site
npm run build

# Output is in _site/ folder
```

### Before Pushing Changes

```bash
# 1. Test build locally
npm run build

# 2. Test locally with dev server
npm start

# 3. Commit and push
git add .
git commit -m "Your commit message"
git push origin main

# 4. Monitor deployment in Actions tab
```

## 📁 Important Files

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `.eleventy.js` - Eleventy configuration
- `package.json` - Dependencies and scripts
- `.gitignore` - Excludes `_site/` and `node_modules/`

## 🐛 Troubleshooting

### Build Fails in GitHub Actions

**Check the Actions log:**
1. Go to Actions tab
2. Click on failed workflow
3. Click on "build" job
4. Review error messages

**Common fixes:**
- Ensure all dependencies are in `package.json`
- Test build locally first: `npm run build`
- Check for syntax errors in `.njk` files

### Site Shows 404

**Solutions:**
1. Verify GitHub Pages source is set to "GitHub Actions"
2. Check that deployment completed successfully (green checkmark)
3. Wait 2-3 minutes for GitHub CDN to update
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Assets Not Loading (CSS/JS 404)

**Check:**
1. Verify `.eleventy.js` has passthrough copy for assets:
   ```js
   eleventyConfig.addPassthroughCopy("assets");
   ```
2. Ensure asset paths don't have leading `/assets` in HTML
3. Rebuild and redeploy

### Changes Not Appearing

**Steps:**
1. Check Actions tab - deployment completed?
2. Hard refresh browser (Ctrl+Shift+R)
3. Wait 2-3 minutes for CDN cache
4. Check correct branch was pushed (`main`)

## 🔐 Environment Variables

If you need environment variables (e.g., Firebase config):

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add your secrets (e.g., `FIREBASE_API_KEY`)
4. Reference in workflow: `${{ secrets.FIREBASE_API_KEY }}`

**Note:** Client-side Firebase config is public and doesn't need secrets.

## 📊 Deployment Workflow Details

```yaml
# Triggers
- Push to main branch
- Manual trigger via Actions tab

# Jobs
1. Build
   - Checkout code
   - Setup Node.js 20
   - Install dependencies (npm ci)
   - Build with Eleventy
   - Upload _site/ as artifact

2. Deploy
   - Download artifact
   - Deploy to GitHub Pages
   - Update live site
```

## 🎯 Best Practices

### Before Each Push

1. ✅ Test locally: `npm start`
2. ✅ Test build: `npm run build`
3. ✅ Check for errors in console
4. ✅ Verify all links work
5. ✅ Test authentication features
6. ✅ Check responsive design

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Test locally
npm run build

# Push to main (triggers deployment)
git checkout main
git merge feature/new-feature
git push origin main
```

## 📝 Deployment Checklist

- [ ] All changes tested locally
- [ ] Build succeeds: `npm run build`
- [ ] Dev server works: `npm start`
- [ ] No console errors
- [ ] Responsive design checked
- [ ] Authentication tested (if changed)
- [ ] Leaderboard working (if changed)
- [ ] Committed to main branch
- [ ] Pushed to GitHub
- [ ] Actions workflow succeeded
- [ ] Live site verified

## 🌐 Live URLs

- **Production**: https://physicsdaily.github.io/
- **Repository**: https://github.com/PhysicsDaily/PhysicsDaily.github.io
- **Actions**: https://github.com/PhysicsDaily/PhysicsDaily.github.io/actions

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Last Updated:** September 30, 2025
