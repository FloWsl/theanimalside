# Setup Guide - The Animal Side

> **Complete installation and configuration guide for developers taking over the project.**

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm equivalent)
- **Git**: Latest version
- **Code Editor**: VS Code recommended with extensions

### **Required Accounts & API Keys**
- **Supabase**: Free tier sufficient for development
- **OpenAI**: API access for content generation
- **Google Maps**: API key for location services
- **Vercel**: For deployment (optional in development)

### **Recommended VS Code Extensions**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode",
    "formulahendry.auto-rename-tag"
  ]
}
```

## 🚀 **Initial Setup**

### **1. Repository Setup**
```bash
# Clone the repository
git clone https://github.com/yourusername/theanimalside.git
cd theanimalside

# Install dependencies
npm install

# Verify installation
npm run type-check
npm run lint
```

### **2. Environment Configuration**

Create `.env.local` file in project root:

```bash
# Copy the example file
cp .env.example .env.local
```

**Environment Variables Explained:**

```bash
# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
# Public URL - safe to expose to client
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Anonymous key - safe to expose to client  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Service role key - SERVER ONLY, never expose to client
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ===========================================
# AI CONTENT GENERATION
# ===========================================
# OpenAI API key for SEO content generation
OPENAI_API_KEY=sk-your_openai_key_here

# ===========================================
# EXTERNAL APIS
# ===========================================
# Google Maps for location services
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Stripe for payment processing
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid for email notifications
SENDGRID_API_KEY=SG.your_sendgrid_key

# ===========================================
# ANALYTICS & MONITORING
# ===========================================
# Google Analytics
NEXT_PUBLIC_GA_ID=G-YOUR_GA_ID

# Sentry for error tracking
SENTRY_DSN=https://your_sentry_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# PostHog for product analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ===========================================
# DEVELOPMENT SETTINGS
# ===========================================
# Next.js environment
NODE_ENV=development

# Database URL for Prisma (if used alongside Supabase)
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres

# Enable debug logging
DEBUG=true

# Disable telemetry
NEXT_TELEMETRY_DISABLED=1
```

## 🗄️ **Supabase Setup**

### **1. Create Supabase Project**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize local development
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref
```

### **2. Database Migration**
```bash
# Reset database with latest schema
supabase db reset

# Or apply migrations individually
supabase migration up

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts
```

### **3. Local Development Database**
```bash
# Start local Supabase services
supabase start

# Your local URLs will be:
# Studio: http://localhost:54323
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
```

### **4. Seed Data**
```bash
# Run seed script to populate development data
npm run db:seed

# Or manually via Supabase Studio
# Navigate to http://localhost:54323
# Go to Table Editor and import seed data
```

## 🔧 **Development Workflow**

### **1. Start Development Server**
```bash
# Start Next.js development server
npm run dev

# Server will be available at:
# http://localhost:3000
```

### **2. Available Scripts**
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Database
npm run db:generate      # Generate Supabase types
npm run db:reset         # Reset local database
npm run db:seed          # Seed development data
npm run db:migrate       # Apply new migrations

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:coverage    # Generate coverage report

# Utilities
npm run format           # Format code with Prettier
npm run analyze          # Bundle analyzer
npm run lighthouse       # Performance audit
```

## 🎨 **Design System Setup**

### **1. shadcn/ui Configuration**
The project uses shadcn/ui components. Configuration is in `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### **2. Adding New Components**
```bash
# Add individual components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input

# Add multiple components
npx shadcn-ui@latest add button card input dialog
```

### **3. Custom Component Development**
```bash
# Create new components in appropriate directories
components/
├── ui/              # shadcn/ui components
├── custom/          # Project-specific components  
├── illustrations/   # SVG illustrations
├── forms/          # Form components
└── layout/         # Layout components
```

## 🔍 **SEO System Setup**

### **1. Content Generation Setup**
```bash
# Verify OpenAI integration
npm run test:openai

# Generate sample SEO content
npm run seo:generate -- --location="costa-rica" --animal="sea-turtles"

# Build SEO pages
npm run seo:build
```

### **2. Dynamic Route Configuration**
The SEO system generates pages at these routes:
```
/volunteer/[location]/           # Location pages
/volunteer/[animal]/             # Animal pages
/volunteer/[location]/[animal]/  # Combined pages
/volunteer/[category]/           # Category pages
```

### **3. Sitemap Generation**
```bash
# Generate sitemap
npm run sitemap:generate

# Verify sitemap
npm run sitemap:validate

# Submit to search engines
npm run sitemap:submit
```

## 🧪 **Testing Setup**

### **1. Jest Configuration**
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### **2. Playwright E2E Tests**
```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run specific test
npm run test:e2e -- tests/homepage.spec.ts
```

### **3. Component Testing**
```bash
# Test individual components
npm run test -- --testPathPattern=components

# Test with Storybook
npm run storybook
```

## 📱 **Mobile Development & Testing Setup - IMPLEMENTED ✅**

### **Required Mobile Testing Devices**
- **iOS Device**: iPhone 12+ with Safari for real device testing
- **Android Device**: Pixel 5+ with Chrome for Android validation
- **Tablet**: iPad for tablet-specific testing
- **Various Screen Sizes**: Test across 320px to 1024px viewport ranges

### **Mobile Testing Commands**
```bash
# Mobile-specific test suite
npm run test:mobile          # Run mobile-optimized test suite
npm run test:touch          # Validate touch interface interactions
npm run test:performance    # Mobile performance benchmarks
npm run dev:mobile          # Mobile-optimized development server

# Device-specific testing
npm run test:iphone         # iPhone-specific test scenarios
npm run test:android        # Android-specific validation
npm run test:tablet         # Tablet layout and interaction tests
```

### **Mobile Performance Testing**
```bash
# Core Web Vitals for mobile
npm run lighthouse:mobile   # Mobile Lighthouse audit
npm run vitals:mobile      # Mobile Core Web Vitals testing
npm run speed:mobile       # Mobile speed index benchmarks

# Touch interaction testing
npm run test:gestures      # Swipe, tap, pinch gesture validation
npm run test:targets       # 48px touch target compliance
npm run test:responsive    # Responsive design validation
```

### **Mobile Development Environment**
```bash
# Start mobile-optimized dev server
npm run dev:mobile

# Mobile debugging tools
npm run debug:ios          # iOS Safari debugging
npm run debug:android      # Android Chrome debugging
npm run debug:responsive   # Responsive design debugging

# Mobile preview server
npm run preview:mobile     # Mobile-optimized preview build
```

### **Real Device Testing Configuration**
```typescript
// playwright.mobile.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/mobile',
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### **Mobile Testing Checklist**
```bash
# Organization Detail Page Mobile Tests
- [ ] MobileEssentialsCard displays correctly with sticky positioning
- [ ] Tab navigation provides 48px minimum touch targets
- [ ] Progressive disclosure works smoothly on touch devices
- [ ] Touch gestures (swipe, tap) respond within 100ms
- [ ] Mobile application flow works from interest to completion
- [ ] Auto-save functionality persists across app switches
- [ ] WhatsApp/SMS links open correctly on mobile devices
- [ ] Cross-device continuity maintains state synchronization
- [ ] Performance meets sub-3s load time targets
- [ ] WCAG AA compliance for all mobile interactions
```

### **Mobile Debugging Tools**
```bash
# iOS Safari Web Inspector
# 1. Enable Safari Developer menu on Mac
# 2. Connect iPhone via USB
# 3. Enable Web Inspector in iPhone Settings > Safari > Advanced
# 4. Open Safari > Develop > [Device Name] > [Page]

# Android Chrome DevTools
# 1. Enable Developer options on Android device
# 2. Enable USB debugging
# 3. Connect device via USB
# 4. Open Chrome DevTools > More tools > Remote devices

# Cross-platform testing
npm run test:browserstack  # BrowserStack real device testing
npm run test:saucelabs     # Sauce Labs device testing
```

### **Mobile Performance Monitoring**
```typescript
// Real User Monitoring for mobile
export function setupMobileRUM() {
  if (isMobileDevice()) {
    // Track mobile-specific metrics
    trackTouchResponseTime();
    trackScrollPerformance();
    trackViewportChanges();
    trackCrossDeviceContinuity();
  }
}

// Mobile-specific performance budgets
const mobilePerformanceBudgets = {
  fcp: 1500,      // First Contentful Paint: 1.5s
  lcp: 2500,      // Largest Contentful Paint: 2.5s
  tti: 3000,      // Time to Interactive: 3.0s
  cls: 0.1,       // Cumulative Layout Shift: 0.1
  touchResponse: 100  // Touch response time: 100ms
};
```

## 📦 **Build & Deployment**

### **1. Production Build**
```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Analyze bundle size
npm run analyze
```

### **2. Environment-Specific Builds**
```bash
# Staging build
npm run build:staging

# Production build
npm run build:production

# Preview build
npm run build:preview
```

### **3. Deployment Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SEO pages generated
- [ ] Performance audit passed
- [ ] Security scan completed
- [ ] Analytics configured

## 🔒 **Security Configuration**

### **1. Supabase Security**
```sql
-- Enable Row Level Security on all tables
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view published opportunities" 
ON opportunities FOR SELECT 
USING (status = 'published');
```

### **2. API Security**
```typescript
// Rate limiting configuration
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://theanimalside.com'] 
    : ['http://localhost:3000'],
  credentials: true
};
```

### **3. Content Security Policy**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: *.supabase.co;
      connect-src 'self' *.supabase.co *.openai.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Supabase Connection Issues**
```bash
# Check if Supabase is running
supabase status

# Restart Supabase services
supabase stop
supabase start

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

**2. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

**3. Database Issues**
```bash
# Reset database
supabase db reset

# Check migration status
supabase migration list

# Apply specific migration
supabase migration up --target 20231201000000
```

**4. Environment Variable Issues**
```bash
# Verify environment variables are loaded
npm run env:check

# Check for typos in variable names
grep -r "process.env" . --include="*.ts" --include="*.tsx"
```

### **Performance Issues**
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run dev -- --inspect

# Profile application
npm run build && npm run start -- --profile
```

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Supabase debug mode
SUPABASE_DEBUG=true npm run dev

# Next.js debug mode
NODE_OPTIONS='--inspect' npm run dev
```

## 📞 **Getting Help**

### **Documentation Resources**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### **Project-Specific Help**
- Check [GitHub Issues](https://github.com/yourusername/theanimalside/issues)
- Review [API Documentation](./API.md)
- Consult [Database Schema](./API.md#database-schema--architecture)

### **Community Support**
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [TypeScript Discord](https://discord.gg/typescript)

---

## ✅ **Setup Verification**

Once setup is complete, verify everything works:

```bash
# 1. Start development server
npm run dev

# 2. Visit http://localhost:3000
# 3. Check all pages load correctly
# 4. Verify Supabase connection in browser console
# 5. Test search functionality
# 6. Check responsive design on mobile

# 7. Run complete test suite
npm run test
npm run test:mobile        # Mobile-specific tests
npm run test:performance   # Performance validation

# 8. Build for production
npm run build

# 9. Mobile verification checklist
# - Test on actual iPhone and Android devices
# - Verify 48px touch targets work correctly
# - Check progressive disclosure on mobile
# - Test WhatsApp/SMS integration
# - Validate cross-device state continuity
# - Confirm sub-3s mobile load times
```

**🎉 Setup complete! You're ready to develop with mobile-first excellence.**