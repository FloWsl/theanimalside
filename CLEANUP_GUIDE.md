# 🧹 Production Cleanup Guide

This guide provides a comprehensive roadmap for cleaning up your codebase to achieve a production-ready, maintainable state. Files are categorized by safety level and cleanup priority.

## 🎯 Cleanup Objectives
- Remove development artifacts and temporary files
- Clean up legacy/unused documentation
- Eliminate test scaffolding files
- Keep only production-essential files
- Maintain a clean, professional codebase

---

## 🔴 SAFE TO DELETE IMMEDIATELY

These files are development artifacts that can be safely removed:

### Test Results & Artifacts
```bash
# Playwright test outputs (regenerated on each test run)
rm -rf test-results/
rm -rf .playwright-artifacts-*/

# Test integration files (development only)
rm test-routing-foundation.mjs
rm test-routing-integration.mjs
rm test-phase-3-2-integration.cjs
rm src/test-routing-integration.tsx
```

### Legacy Development Files
```bash
# Legacy source directories
rm -rf src/legacy/
rm -rf src/test/
rm -rf src/testing/

# Archive documentation (completed phases)
rm -rf docs-archive/
rm -rf docs-backup/
```

### Development Planning Documents
```bash
# Completed phase documentation
rm PHASE_2_ACHIEVEMENTS.md
rm PHASE_2_EXECUTION_PLAN.md
rm PHASE_3_2_COMPLETION_REPORT.md
rm phase-3-1-foundation.md

# Initial planning documents (superseded)
rm INITIAL_SITE_ADMIN_PANEL.md
rm INITIAL_ORGANIZATION_ADMIN_PANEL.md
rm INITIAL_IMPLEMENTATION_AUDIT.md
rm INITIAL_NAVIGATION_SYSTEM_IMPROVEMENTS.md
rm INITIAL_DUAL_AUTHENTICATION_SYSTEM.md
```

### Automation Scripts
```bash
# Development automation (no longer needed)
rm -rf scripts/
```

---

## 🟡 REVIEW BEFORE DELETING

These files may contain useful information but are likely outdated:

### PRP Documents
**Location:** `PRPs/`
- `phase-3-3-migration.md` - Check if migration is complete
- `volunteer-journey-management.md` - May contain future requirements
- Other PRP files - Review for future development needs

**Recommendation:** Archive these in a `docs/planning-archive/` folder rather than delete

### Route Documentation
```bash
# These may be useful for future reference
# REVIEW FIRST:
ROUTE_RECREATION_PLAN.md
ROUTING_SYSTEM_OVERVIEW.md
```

### API Documentation
```bash
# Check if still relevant:
API.md
```

---

## 🟢 KEEP (PRODUCTION ESSENTIAL)

These files are essential for production and should be kept:

### Core Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration
- `vite.config.ts` - Build configuration
- `playwright.config.ts` - E2E testing (if keeping tests)

### Documentation (Essential)
- `README.md` - Project overview
- `CLAUDE.md` - Development guidelines
- `PLANNING.md` - Current roadmap
- `DATABASE_GUIDE.md` - Database schema
- `DESIGN_GUIDE.md` - Design system
- `FEATURES_GUIDE.md` - Feature documentation
- `COMPONENTS.md` - Component documentation
- `PROJECT_STATUS.md` - Current status

### Source Code
- `src/` directory (except legacy/test folders)
- `public/` directory
- `tests/` directory (if keeping E2E tests)

---

## 🔧 CLEANUP COMMANDS

### Quick Cleanup (Safe)
```bash
# Navigate to project root
cd /home/flowsl/theanimalside

# Remove test artifacts
rm -rf test-results/ .playwright-artifacts-*/
rm test-routing-foundation.mjs test-routing-integration.mjs test-phase-3-2-integration.cjs
rm src/test-routing-integration.tsx

# Remove legacy directories
rm -rf src/legacy/ src/test/ src/testing/
rm -rf docs-archive/ docs-backup/ scripts/

# Remove completed phase docs
rm PHASE_2_ACHIEVEMENTS.md PHASE_2_EXECUTION_PLAN.md PHASE_3_2_COMPLETION_REPORT.md
rm phase-3-1-foundation.md
rm INITIAL_*.md
```

### Archive Cleanup (Preserve Planning)
```bash
# Create archive directory
mkdir -p docs/planning-archive

# Move (don't delete) planning documents
mv PRPs/ docs/planning-archive/
mv ROUTE_RECREATION_PLAN.md docs/planning-archive/
mv API.md docs/planning-archive/

# Review these files later when needed
```

### Final Verification
```bash
# Ensure application still works
npm run type-check
npm run lint
npm run build

# Test key functionality
npm run dev
# Navigate to key pages: /, /volunteer-costa-rica, /lions-volunteer, etc.
```

---

## 📊 Before/After Comparison

### Current State
- ~50+ documentation files
- Multiple test artifact directories
- Legacy code directories
- Development planning files

### After Cleanup
- ~15 essential documentation files
- Clean source directory structure
- Production-ready codebase
- Clear separation of concerns

---

## ⚠️ Important Notes

1. **Backup First**: Consider creating a git tag before cleanup:
   ```bash
   git tag v1.0-pre-cleanup
   git push origin v1.0-pre-cleanup
   ```

2. **Test After Cleanup**: Always verify the application works after each cleanup step

3. **Team Coordination**: If working with others, coordinate cleanup to avoid conflicts

4. **Gradual Approach**: You can do this cleanup in stages over multiple sessions

---

## 🎉 Post-Cleanup Benefits

- **Faster Development**: Less cognitive overhead from irrelevant files
- **Easier Navigation**: Clear project structure
- **Professional Appearance**: Clean codebase for stakeholders
- **Reduced Confusion**: No legacy/outdated documentation
- **Better Performance**: Smaller repository size

---

*This guide was generated after completing the navigation system improvements and organizationSlug routing fixes. All core functionality is working and ready for production.*