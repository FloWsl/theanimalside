# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Core Philosophy: KISS, DRY, YAGNI
- **KISS (Keep It Simple)** - Always choose the simplest solution that works
- **DRY (Don't Repeat Yourself)** - Avoid code duplication, extract reusable patterns
- **YAGNI (You Aren't Gonna Need It)** - Build only what's explicitly requested, nothing more
- **Self-Development Loop**: **Test → Validate → Iterate → Repeat** - Every feature follows this cycle

### 🔄 Project Awareness & Context
- **🗺️ ALWAYS read `PLANNING.md` FIRST** - Current MVP roadmap: 6-8 week organization admin system only. Understand what we're building vs. what we're NOT building (YAGNI).
- **Always read `PROJECT_STATUS.md`** at the start of new conversations to understand current 90%+ frontend completion status and 85% database architecture progress.
- **🔥 Use `PRPs/organization-admin-mvp.md` as PRIMARY implementation guide** - 640+ lines of detailed tasks, patterns, and validation loops.
- **Check `DATABASE_GUIDE.md`** before starting database tasks. Current focus: completing Supabase connection implementation.
- **Use consistent React/TypeScript patterns** from existing components in `src/components/` - follow established architecture from `COMPONENTS.md`.
- **Reference `DESIGN_GUIDE.md`** for visual design system and `FEATURES_GUIDE.md` for navigation/search patterns.

### 🧱 Code Structure & Modularity
- **Never create a component file longer than 500 lines of code.** If approaching this limit, split into smaller components or extract hooks/utilities.
- **Organize components by feature/responsibility**, following the established structure:
  - `src/components/[Feature]/` - Feature-specific components
  - `src/hooks/` - Custom React hooks
  - `src/services/` - API and data services
  - `src/types/` - TypeScript interfaces and types
- **Use clear, consistent imports** (prefer relative imports within feature directories).
- **Follow existing component patterns** from `src/components/OrganizationDetail/` and `src/components/OpportunitiesPage/v2/`.

### 🧪 Self-Development Loop: Test → Validate → Iterate
- **Test FIRST** - Write Jest/Vitest tests before implementing features
- **Validate with Playwright MCP** - End-to-end testing for user journeys and responsive behavior
- **Iterate rapidly** - Run tests after every change, fix failures immediately
- **Test structure mirrors app** - `/tests` folder follows `src/` organization
- **Minimum test coverage**:
  - Expected use case (component renders, hook works)
  - Edge case (empty data, loading states)
  - Failure case (error handling)
- **Loop completion** - Tests pass → Feature ready → Start next iteration

### ✅ Validation & Iteration Cycle
- **Immediate validation** - `npm run type-check && npm run lint` after every change
- **Self-loop verification** - Does the feature solve ONLY the requested problem? (YAGNI check)
- **Evidence-based validation** - Use `audit/audit-system/` when available for objective completion assessment
- **Documentation iteration** - Update `PROJECT_STATUS.md` and relevant status docs
- **Prepare next iteration** - Identify the next smallest testable piece

### 📎 Style & Conventions (KISS Principles)
- **Stack simplicity** - React 18 + TypeScript + Tailwind CSS (no additional complexity)
- **Follow existing patterns** - DRY principle, reuse component structures from `src/components/`
- **Consistent styling** - Use established design system from `DESIGN_GUIDE.md`
- **Context-aware colors** - Always consider text contrast on backgrounds
- **TypeScript interfaces** - Use normalized types from `src/types/database.ts`
- **Component simplicity** - Props interface → Component logic → Export (nothing more)

### 📚 Documentation (Iteration Support)
- **Update README.md** when features/dependencies change
- **Comment complex logic** with `// Reason:` explanations
- **Document iteration decisions** - Why this solution over alternatives

### 🧠 AI Behavior Rules
- **🎯 MVP Scope Awareness** - Current focus: organization admin system ONLY. Do not build site admin, complex application tracking, or volunteer user accounts (see PLANNING.md YAGNI section).
- **Never assume missing context. Ask questions if uncertain** about component requirements or data structure.
- **Never hallucinate React/TypeScript libraries** – only use packages verified in `package.json`.
- **Always confirm file paths exist** before referencing components, hooks, or services.
- **Never delete or overwrite existing components** unless explicitly instructed or part of a documented refactoring task.
- **🔥 Follow PRP patterns** - Before implementing, check PRPs for established patterns, gotchas, and validation requirements.


## 📋 Key Files to Reference

### 🗺️ Planning & Implementation Strategy
- **`PLANNING.md`** - **READ FIRST** - MVP roadmap, timeline, scope decisions (what we're building vs YAGNI)
- **`PRPs/organization-admin-mvp.md`** - **PRIMARY implementation guide** - 640+ lines of detailed tasks, patterns, gotchas
- **`PRPs/initial-site-admin-panel.md`** - Future enhancement reference (NOT in current MVP)

### Essential Documentation
- `PROJECT_STATUS.md` - Current implementation status, roadmap, and production readiness
- `DATABASE_GUIDE.md` - Complete database architecture, schema, and integration guide
- `DESIGN_GUIDE.md` - Complete design system, philosophy, and visual guidelines
- `FEATURES_GUIDE.md` - Navigation, search, and advanced feature implementation patterns
- `COMPONENTS.md` - Detailed component documentation and usage patterns
- `README.md` - Project overview, setup instructions, and stakeholder navigation

### Core Implementation
- `src/types/database.ts` - Normalized TypeScript interfaces for Supabase
- `src/services/organizationService.ts` - Main data service layer
- `src/hooks/useOrganizationData.ts` - React Query hooks with caching
- `src/components/OrganizationDetail/index.tsx` - Complex responsive layout example
- `src/components/OpportunitiesPage/v2/` - V2 implementation with performance optimization
