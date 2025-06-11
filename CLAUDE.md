# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Animal Side is a wildlife volunteer discovery platform built with React 18 + TypeScript + Vite, implementing a "discovery-first" design philosophy. This is currently a frontend prototype with comprehensive mock data, designed for future API integration.

## Development Commands

```bash
# Start development server
npm run dev

# Start development server with host access
npm run dev:host

# Build for production
npm run build

# Build with bundle analysis
npm run build:analyze

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Preview production build
npm run preview

# Clean build artifacts and dependencies
npm run clean
npm run dev:clean  # Clean + reinstall + dev
```

## Architecture Overview

### Core Philosophy: Discovery-First Design
- **Visual exploration over search-focused interfaces**
- **Progressive disclosure** for mobile-first experiences
- **Equal opportunity showcase** - no promotional hierarchies
- **Authentic content over promotional copy**

### Application Structure

```
src/
├── components/
│   ├── HomePage/           # Discovery-focused landing experience
│   │   ├── DiscoveryGateway/   # Interactive map + conservation feed
│   │   └── HeroSection.tsx     # Immersive wildlife photography
│   ├── OrganizationDetail/ # Optimized tab-based system (recently consolidated)
│   │   ├── tabs/              # 6 content tabs (Overview, Experience, etc.)
│   │   ├── TabNavigation.tsx  # Cross-device tab system
│   │   └── EssentialInfoSidebar.tsx # Desktop sticky sidebar
│   ├── SmartNavigation/    # Instagram-style discovery system (NEW)
│   │   ├── SmartNavigation.tsx    # Main component with variants
│   │   ├── NavigationCard.tsx     # Reusable recommendation cards
│   │   ├── NavigationContainer.tsx # Layout wrapper with styling
│   │   └── NavigationSkeleton.tsx # Loading states (unused - sync generation)
│   ├── Layout/             # Container and responsive utilities
│   └── ui/                 # shadcn/ui + custom components
├── data/                   # Mock data (TypeScript interfaces ready for API)
├── types/                  # Comprehensive type definitions
├── lib/                    # Utilities and helpers
├── hooks/                  # React hooks and state management
│   └── useSmartNavigation.ts   # Performance-optimized navigation generation
└── utils/                  # Performance monitoring and optimization
    └── performance/
        └── navigationMetrics.ts # Navigation performance tracking
```

### Key Design Patterns

**Responsive Architecture:**
- **Desktop (1024px+)**: Two-column layout with sticky sidebar
- **Mobile (<1024px)**: Tab-based navigation with progressive disclosure
- **Cross-device state persistence** via localStorage + URL synchronization

**Component Variants:**
- Most components support `variant` props for different contexts
- Mobile-first design with desktop enhancement
- Touch-optimized interactions (48px minimum touch targets)

## Data Layer Architecture

### Current Status: Mock Data Only
- All data lives in `src/data/` as TypeScript objects
- Comprehensive interfaces in `src/types/index.ts` ready for API integration
- No backend, authentication, or external services currently

### Key Data Models
- `OrganizationDetail`: Complex nested structure for organization pages
- `Opportunity`: Wildlife volunteer opportunities with location, cost, requirements
- `Program`: Specific volunteer programs with schedules and activities
- `SearchFilters`: Advanced filtering capabilities (implemented in UI only)

## Organization Detail Page (Major Updates ✅)

**Photo-First Discovery Implementation (June 10, 2025):**
- **Complete Overview Tab redesign** with photo-first storytelling approach
- **Industry-standard full-screen photo modal** using React Portal for true viewport coverage
- **Intelligent photo curation system** with emotional weight categorization
- **Conservation context auto-generation** based on animal type and location
- **Mobile-first responsive design** with progressive disclosure patterns

**Smart Navigation System (June 10, 2025):**
- **Instagram-style discovery navigation** with emoji-based visual system
- **SEO-optimized URLs** following `/opportunities/lions`, `/opportunities/costa-rica` patterns
- **Performance-optimized** with 5-minute caching and memory leak prevention
- **Modular architecture** with reusable NavigationCard, NavigationContainer, NavigationSkeleton components
- **Isolated placement** below main content, never in sidebar, consistent across all tabs

**Previous Consolidation (June 8, 2025):**
- **PracticalInformation.tsx** → Integrated into **PracticalTab.tsx** (466 lines)
- **ProgramDescription.tsx** → Integrated into **ExperienceTab.tsx** (242 lines)
- **WildlifeCareSection.tsx** → Removed (unused component)
- **Result**: 708+ lines eliminated, zero redundancy, improved maintainability

**Architecture:**
```tsx
// Responsive layout pattern
<DesktopLayout>          // 1024px+ only
  <main>
    <TabNavigation />
    <TabContent />
  </main>
  <aside>
    <EssentialInfoSidebar /> // Sticky sidebar with critical info
  </aside>
</DesktopLayout>

<MobileLayout>           // <1024px only
  <TabNavigation />      // Touch-optimized
  <TabContent />         // Progressive disclosure
</MobileLayout>
```

**State Management:**
- Cross-device state persistence using `useCrossDeviceState` hook
- URL synchronization for deep linking
- localStorage for form data and preferences

## Design System Integration

### Color System (Earth-Tone Palette)
```css
--deep-forest: #1a2e1a    /* Primary text, headers */
--rich-earth: #8B4513     /* Primary CTAs, emphasis */
--warm-sunset: #D2691E    /* Secondary actions */
--golden-hour: #DAA520    /* Highlights, special elements */
--sage-green: #87A96B     /* Trust indicators */
--warm-beige: #F5E8D4     /* Card backgrounds */
--soft-cream: #F8F3E9     /* Page backgrounds */
--gentle-lemon: #FCF59E   /* Subtle accents only */
```

### Typography Scale
- **Display**: Playfair Display (headings)
- **Body**: Inter (text)
- **Mobile-first**: 16px minimum to prevent iOS zoom
- **Responsive**: Uses `clamp()` for fluid scaling

### Component Library
- **Base**: shadcn/ui components
- **Custom**: Wildlife-themed variants with trust indicators
- **Layout**: Comprehensive grid system with nature-inspired spacing
- **Animations**: Framer Motion with reduced-motion support

## CSS Architecture & Styling Guidelines

### Core Styling Philosophy
**IMPORTANT**: Use **context-aware styling** to prevent CSS cascade conflicts and ensure proper text readability across different backgrounds.

### File Structure
```
src/
├── styles/
│   └── theme-contexts.css     # Theme-based color contexts
├── design-tokens.css          # Typography utilities (NO COLORS)
├── index.css                  # Global styles + design system colors
└── components/                # Component-specific styles
```

### Typography System Guidelines

**✅ CORRECT: Separation of Concerns**
```css
/* design-tokens.css - Typography utilities without colors */
.text-hero {
  @apply text-4xl lg:text-5xl font-display font-bold leading-tight;
  /* Color should be set by individual components based on background */
}
```

**❌ AVOID: Hardcoded colors in typography utilities**
```css
/* DON'T DO THIS - causes cascade conflicts */
.text-hero {
  @apply text-4xl lg:text-5xl font-display font-bold text-deep-forest;
}
```

### Component Color Management

**✅ BEST PRACTICE: Explicit color context**
```tsx
// Clear context for dark backgrounds (hero sections, modals)
<div className="bg-deep-forest">
  <h1 className="text-hero text-white">Readable Title</h1>
  <p className="text-body text-white/90">Readable text</p>
</div>

// Clear context for light backgrounds (cards, main content)
<div className="bg-soft-cream">
  <h1 className="text-hero text-deep-forest">Readable Title</h1>
  <p className="text-body text-forest/80">Readable text</p>
</div>
```

**✅ THEME CONTEXT PATTERN** (Advanced)
```tsx
// Use theme context classes for complex scenarios
<div className="theme-dark"> {/* or theme-light, theme-hero */}
  <h1 className="text-hero">Auto-themed title</h1>
  <p className="text-body">Auto-themed text</p>
</div>
```

### Color Application Rules

1. **Typography utilities** (`text-hero`, `text-body`, etc.) = Layout + typography ONLY
2. **Component level** = Explicit color declarations (`text-white`, `text-deep-forest`)
3. **Theme contexts** = Automatic color mapping for complex scenarios
4. **Background awareness** = Always consider text contrast on backgrounds

### Common Patterns

**Hero Sections** (Dark backgrounds)
```tsx
<div className="bg-cover bg-center" style={{backgroundImage: 'url(...)'}}>
  <div className="bg-gradient-to-br from-deep-forest/90 to-forest/70">
    <h1 className="text-hero text-white">Title</h1>
    <p className="text-body-large text-white/90">Description</p>
  </div>
</div>
```

**Content Cards** (Light backgrounds)
```tsx
<div className="bg-soft-cream border border-warm-beige/60">
  <h2 className="text-section text-deep-forest">Card Title</h2>
  <p className="text-body text-forest/80">Card content</p>
</div>
```

**Interactive Elements**
```tsx
<button className="bg-rich-earth hover:bg-deep-earth text-white">
  <span className="text-caption font-semibold">Button Text</span>
</button>
```

### Debugging Text Visibility Issues

1. **Check CSS cascade**: Are design tokens overriding component colors?
2. **Verify color contrast**: Use browser dev tools to test contrast ratios
3. **Test across themes**: Ensure readability in light/dark contexts
4. **Validate responsive**: Colors should work across all screen sizes

### Migration Strategy for Existing Components

When updating components with text visibility issues:
1. **Remove colors** from typography utility classes
2. **Add explicit color classes** at component level
3. **Test across different backgrounds**
4. **Consider theme context** for complex scenarios

## Development Guidelines

### Discovery-First Implementation
When building features, prioritize:
1. **Visual impact** over functional efficiency initially
2. **Emotional connection** through authentic imagery/content
3. **Progressive disclosure** for complex information
4. **Equal treatment** for all content (no promotional bias)

### Mobile-First Approach
- Design mobile experience first, enhance for desktop
- All touch targets minimum 48px (WCAG AA compliance)
- Use progressive disclosure pattern for information density
- Test cross-device state persistence

### Performance Targets (Aspirational)
- LCP <2.5s for visual content
- 60fps animations with smooth transitions
- Mobile-optimized bundle sizes
- Accessibility: WCAG 2.1 AA compliance

## Key Files to Understand

- `DISCOVERY_FIRST_PHILOSOPHY.md` - Core design principles
- `DESIGN_SYSTEM.md` - Complete visual and component guidelines
- `COMPONENTS.md` - Detailed component documentation and patterns (includes Smart Navigation)
- `PHOTO_FIRST_STRATEGY.md` - Complete photo-first implementation guide and strategy
- `MODAL_IMPLEMENTATION_VERIFICATION.md` - Full-screen modal technical documentation
- `src/types/index.ts` - Data model architecture
- `src/components/OrganizationDetail/index.tsx` - Complex responsive layout example
- `src/components/OrganizationDetail/SimplePhotoModal.tsx` - Industry-standard full-screen photo modal
- `src/components/OrganizationDetail/tabs/OverviewTab.tsx` - Photo-first discovery implementation
- `src/components/SmartNavigation/` - Instagram-style discovery navigation system
- `src/hooks/useSmartNavigation.ts` - Performance-optimized navigation generation
- `src/design-tokens.css` - Typography utilities (layout only, no colors)
- `src/styles/theme-contexts.css` - Theme-based color contexts for advanced scenarios
- `src/index.css` - Global styles and design system color definitions

## Branch Workflow

- `main` - Production-ready code
- `dev` - Active development
- `feature/*` - Individual features

## Future Integration Points

The codebase is architecturally prepared for:
- API integration (comprehensive TypeScript interfaces ready)
- Authentication system (component patterns established)
- Payment processing (cost structures defined in data models)
- Analytics integration (performance monitoring hooks in place)
- Content management (all content abstracted to data layer)