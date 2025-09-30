# 📝 Quick Reference - Common Commands

## Development Commands

```bash
# Start development server (http://localhost:8080)
npm start

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Format code with Prettier
npm run format

# Lint code
npm run lint
```

## Git Workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Your descriptive message"

# Push to GitHub (triggers deployment)
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/your-feature-name

# Switch to main branch
git checkout main

# Merge branch to main
git merge feature/your-feature-name
```

## Deployment Check

```bash
# 1. Test locally
npm start

# 2. Test build
npm run build

# 3. Check for errors (should see files in _site/)
ls _site

# 4. If all good, commit and push
git add .
git commit -m "Update: description"
git push origin main

# 5. Monitor deployment
# Visit: https://github.com/PhysicsDaily/PhysicsDaily.github.io/actions
```

## Troubleshooting

```bash
# Build failing? Clear and rebuild
npm run clean
npm install
npm run build

# Port already in use?
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Port already in use? (macOS/Linux)
lsof -ti:8080 | xargs kill -9

# Node modules corrupted?
rm -rf node_modules package-lock.json
npm install
```

## File Structure

```
├── .github/workflows/     # GitHub Actions
├── src/                   # Source files (.njk templates)
├── assets/               # CSS, JS, images
├── _site/                # Built site (don't commit)
├── .eleventy.js          # Eleventy config
├── package.json          # Dependencies
└── README.md             # Documentation
```

## Important URLs

- **Live Site**: https://physicsdaily.github.io/
- **Repository**: https://github.com/PhysicsDaily/PhysicsDaily.github.io
- **Actions**: https://github.com/PhysicsDaily/PhysicsDaily.github.io/actions
- **Settings**: https://github.com/PhysicsDaily/PhysicsDaily.github.io/settings

## Firebase Setup

Your Firebase configuration is in:
- `assets/js/firebase-config.js`

Firestore security rules should be deployed separately via Firebase Console.

## Quick Checks Before Pushing

- [ ] `npm run build` succeeds
- [ ] `npm start` runs without errors
- [ ] No console errors in browser
- [ ] Responsive design looks good
- [ ] Authentication works (if modified)
- [ ] Leaderboard loads (if modified)

## Emergency Rollback

```bash
# View commit history
git log --oneline

# Rollback to previous commit
git reset --hard <commit-hash>

# Force push (be careful!)
git push origin main --force
```

---

**Tip**: Keep this file open while developing for quick command reference!
