# Physics Daily - Content Migration Plan

## Overview
This document outlines the migration strategy from legacy HTML structure to the modern Eleventy-based system.

## Current State
- **Completed**: Mechanics (partial - chapters 01, 03, 05 in `src/content/mechanics/`)
- **Pending**: All other topics still in legacy HTML format

## Migration Mapping

### Topic Structure
```
Legacy Structure          → Modern Structure
├── thermodynamics/       → src/content/thermodynamics/
│   ├── chapter21/        →   ├── chapter21/
│   ├── chapter22/        →   ├── chapter22/
│   ├── chapter23/        →   ├── chapter23/
│   └── chapter24/        →   └── chapter24/
├── electromagnetism/     → src/content/electromagnetism/
│   ├── chapter25-39/     →   ├── chapter25-39/
├── waves/                → src/content/waves/
│   ├── chapter18-20/     →   ├── chapter18-20/
├── optics/               → src/content/optics/
│   ├── chapter40-45/     →   ├── chapter40-45/
├── fluids/               → src/content/fluids/
│   ├── chapter15-17/     →   ├── chapter15-17/
└── modern/               → src/content/modern/
    ├── chapter46-52/     →   ├── chapter46-52/
```

## Migration Strategy

### Phase 1: Content Structure Creation
1. Create topic directories in `src/content/`
2. Create chapter subdirectories with consistent naming
3. Convert HTML content to Markdown with proper front matter

### Phase 2: Template Integration  
1. Ensure base templates support all topics
2. Update navigation and breadcrumbs
3. Test quiz data integration

### Phase 3: Asset Consolidation
1. Move topic-specific assets to `src/assets/`
2. Update asset references in templates
3. Maintain backward compatibility during transition

### Phase 4: Legacy Cleanup
1. Gradually remove passthrough copying
2. Implement redirects for SEO preservation
3. Remove duplicate asset files

## Required Front Matter Template
```yaml
---
layout: chapter.njk
title: "Chapter Title"
topic: "topic-name"
chapter: "01"
description: "Brief chapter description"
breadcrumbs:
  - name: "Home"
    url: "/"
  - name: "Topic Name"
    url: "/topic-name/"
  - name: "Chapter 01"
    url: "/topic-name/chapter01/"
---
```

## Content Migration Checklist

### Per Topic:
- [ ] Create `src/content/{topic}/` directory
- [ ] Convert HTML content to Markdown with front matter
- [ ] Migrate MCQ data to structured format
- [ ] Update asset references
- [ ] Test Eleventy build
- [ ] Verify quiz functionality

### Topics to Migrate:
- [ ] Thermodynamics (chapters 21-24)
- [ ] Electromagnetism (chapters 25-39) 
- [ ] Waves (chapters 18-20)
- [ ] Optics (chapters 40-45)
- [ ] Fluids (chapters 15-17)
- [ ] Modern Physics (chapters 46-52)

## Asset Migration Strategy

### Current Duplication Issue:
```
assets/css/topics/           # Legacy location
src/assets/css/topics/       # Modern location (identical files)
```

### Resolution:
1. Keep `src/assets/` as single source of truth
2. Update legacy HTML to reference modern assets
3. Remove root `assets/` when all content migrated
4. Update `.eleventy.js` passthrough configuration

## Backward Compatibility

### During Migration:
- Maintain passthrough copying for legacy URLs
- Keep existing HTML files functional
- Preserve SEO with proper redirects

### Post-Migration:
- Implement 301 redirects from legacy URLs
- Remove passthrough copying
- Clean up duplicate assets

## Validation Requirements

### MCP Server Enhancements:
- Validate front matter consistency
- Check chapter numbering sequence
- Verify asset reference integrity
- Test quiz data structure

## Timeline Considerations

This migration should be done incrementally:
1. **Week 1-2**: Complete 1-2 topics
2. **Week 3-4**: Complete remaining topics  
3. **Week 5**: Asset consolidation
4. **Week 6**: Legacy cleanup and validation

## Success Metrics

- [ ] All content accessible via Eleventy build
- [ ] No broken links or missing assets
- [ ] Quiz functionality preserved
- [ ] SEO rankings maintained
- [ ] Build performance improved