# Asset Consolidation Strategy

## Current Problem
The codebase has duplicate asset structures:
```
assets/           # Legacy root assets (36 files)
src/assets/       # Modern Eleventy assets (identical copies)
```

This creates maintenance overhead and potential sync issues.

## Proposed Solution

### Phase 1: Immediate Cleanup
1. **Make `src/assets/` the single source of truth**
2. **Remove root `assets/` directory** 
3. **Update legacy HTML references** to point to `/assets/` (built output)
4. **Maintain Eleventy passthrough** copying from `src/assets/` to `assets/`

### Phase 2: Reference Updates
Update legacy HTML files to use correct asset paths:
```html
<!-- Current legacy reference -->
<link rel="stylesheet" href="../assets/css/topics/mechanics-style.css">

<!-- Should become -->
<link rel="stylesheet" href="/assets/css/topics/mechanics-style.css">
```

### Implementation Script
```powershell
# Step 1: Backup current assets
Copy-Item -Path "assets" -Destination "assets.backup" -Recurse

# Step 2: Remove root assets directory  
Remove-Item -Path "assets" -Recurse -Force

# Step 3: Update HTML references (done via find/replace)
# Step 4: Test build to ensure passthrough copying works
npm run build

# Step 5: Verify all assets accessible in _site/assets/
```

## Updated .eleventy.js Configuration
The current configuration already handles this correctly:
```javascript
// Copy static assets directly to output
eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
```

This maps `src/assets/` → `_site/assets/`, which is exactly what we need.

## Validation Checklist
- [ ] Remove root `assets/` directory
- [ ] Update legacy HTML asset references  
- [ ] Test build process (`npm run build`)
- [ ] Verify `_site/assets/` contains all expected files
- [ ] Test legacy pages render correctly
- [ ] Verify CSS/JS functionality intact

## Risk Mitigation
1. **Backup strategy**: Keep `assets.backup/` until migration verified
2. **Incremental testing**: Test each topic area after reference updates
3. **Rollback plan**: Can restore from backup if issues arise

## Expected Benefits
- **Reduced maintenance**: Single asset location to update
- **Cleaner repository**: Eliminates duplicate files
- **Better build performance**: Fewer files to process
- **Simplified development**: Clear asset organization

## File Count Reduction
Currently tracking ~72+ duplicate files across:
- CSS files (global, topic-specific, component styles)
- JS files (components, utilities, quiz systems)  
- Images (favicons, backgrounds, physics diagrams)
- Partials (HTML components)

After consolidation: ~36 files in single location.