# 🔧 Troubleshooting Guide - The Animal Side

This guide covers common issues you might encounter while developing The Animal Side and their solutions. Issues are organized by category for easy navigation.

## 📋 Table of Contents

- [Development Environment](#development-environment)
- [Dependencies and Installation](#dependencies-and-installation)
- [TypeScript Issues](#typescript-issues)
- [Styling and UI Issues](#styling-and-ui-issues)
- [Build and Performance](#build-and-performance)
- [Component and State Issues](#component-and-state-issues)
- [SEO and Meta Tags](#seo-and-meta-tags)
- [Third-party Integrations](#third-party-integrations)
- [Browser-Specific Issues](#browser-specific-issues)
- [Deployment Issues](#deployment-issues)

---

## 🛠️ Development Environment

### Issue: `npm run dev` fails to start
**Symptoms:**
```bash
Error: Cannot find module 'vite'
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Check if port is in use
lsof -ti:5173 | xargs kill -9

# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Try alternative port
npm run dev -- --port 3000
```

### Issue: VS Code TypeScript not working
**Symptoms:**
- No IntelliSense
- Import suggestions not working
- Red squiggly lines everywhere

**Solution:**
```bash
# 1. Restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"

# 2. Check workspace TypeScript version
# Cmd+Shift+P > "TypeScript: Select TypeScript Version" > "Use Workspace Version"

# 3. Verify tsconfig.json is valid
npx tsc --noEmit

# 4. Clear VS Code workspace settings
rm -rf .vscode/settings.json
```

### Issue: Hot reload not working
**Symptoms:**
- Changes don't reflect in browser
- Need to manually refresh

**Solution:**
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // For WSL/Docker users
    },
    hmr: {
      overlay: false, // Disable error overlay if problematic
    },
  },
});
```

---

## 📦 Dependencies and Installation

### Issue: Package version conflicts
**Symptoms:**
```bash
npm ERR! peer dep missing: react@^18.0.0
npm ERR! conflicting dependencies
```

**Solution:**
```bash
# Check for version conflicts
npm ls

# Update specific package
npm update @types/react

# Force install (use cautiously)
npm install --force

# Alternative: Use npm overrides in package.json
{
  "overrides": {
    "@types/react": "^18.0.0"
  }
}
```

### Issue: shadcn/ui components not importing
**Symptoms:**
```typescript
Module '"@/components/ui/button"' has no exported member 'Button'
```

**Solution:**
```bash
# 1. Ensure path aliases are configured correctly
# Check tsconfig.json and vite.config.ts

# 2. Verify component exists
ls src/components/ui/

# 3. Re-add component via shadcn CLI
npx shadcn-ui@latest add button

# 4. Check import path
import { Button } from "@/components/ui/button"; // ✅ Correct
import { Button } from "./ui/button"; // ❌ Wrong
```

### Issue: Tailwind CSS not working
**Symptoms:**
- Classes not applying
- No styling visible

**Solution:**
```bash
# 1. Check if Tailwind is imported in index.css
# Ensure these lines exist:
@tailwind base;
@tailwind components;
@tailwind utilities;

# 2. Verify tailwind.config.js content paths
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

# 3. Restart dev server after config changes
npm run dev

# 4. Check for CSS conflicts
# Remove any global CSS that might override Tailwind
```

---

## 🔤 TypeScript Issues

### Issue: TypeScript compilation errors
**Symptoms:**
```bash
error TS2307: Cannot find module '@/lib/utils'
error TS2339: Property 'title' does not exist on type
```

**Solution:**
```bash
# 1. Check path aliases in tsconfig files
# tsconfig.json and tsconfig.app.json should have:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 2. Verify file extensions
import { cn } from "@/lib/utils"; // ✅ No .ts extension
import { cn } from "@/lib/utils.ts"; // ❌ Don't include extension

# 3. Type missing properties
interface Opportunity {
  title: string; // ✅ Add missing property
  description?: string; // ✅ Use optional for optional props
}
```

### Issue: shadcn/ui component TypeScript errors
**Symptoms:**
```typescript
Type 'string' is not assignable to type 'VariantProps<typeof buttonVariants>'
```

**Solution:**
```typescript
// ✅ Proper typing for variant props
import { Button, type ButtonProps } from "@/components/ui/button";

const MyComponent = () => (
  <Button variant="outline" size="lg">
    Click me
  </Button>
);

// ✅ Extending component props
interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  loading, 
  children, 
  ...props 
}) => (
  <Button {...props} disabled={loading}>
    {loading ? "Loading..." : children}
  </Button>
);
```

### Issue: Framer Motion TypeScript errors
**Symptoms:**
```typescript
Property 'whileHover' does not exist on type 'HTMLDivElement'
```

**Solution:**
```typescript
// ✅ Use motion components
import { motion } from 'framer-motion';

const AnimatedDiv = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    Content
  </motion.div>
);

// ✅ Proper typing for custom motion components
import { HTMLMotionProps } from 'framer-motion';

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  title: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  title, 
  children, 
  ...motionProps 
}) => (
  <motion.div {...motionProps}>
    <h3>{title}</h3>
    {children}
  </motion.div>
);
```

---

## 🎨 Styling and UI Issues

### Issue: Tailwind classes not applying
**Symptoms:**
- Classes appear in DevTools but no styles
- Hover states not working

**Solution:**
```typescript
// ✅ Check class name conflicts
<div className="bg-white bg-red-500"> // ❌ Conflicting classes
<div className="bg-red-500"> // ✅ Single background class

// ✅ Use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // Props className should be last
)}>

// ✅ Check hover state syntax
<button className="hover:bg-blue-500"> // ✅ Correct
<button className="hover:background-blue-500"> // ❌ Wrong
```

### Issue: shadcn/ui components not styled correctly
**Symptoms:**
- Components look unstyled
- Colors not matching design system

**Solution:**
```bash
# 1. Ensure CSS variables are defined in index.css
:root {
  --background: 46 28 18;
  --foreground: 28 57 28;
  --primary: 226 135 67;
  /* ... other variables */
}

# 2. Check if component imports CSS
# Verify in main.tsx or index.tsx:
import "./index.css";

# 3. Reinstall shadcn component
npx shadcn-ui@latest add button --overwrite
```

### Issue: Custom animations not working
**Symptoms:**
- CSS animations not playing
- Framer Motion animations stuttering

**Solution:**
```css
/* tailwind.config.js - Ensure custom animations are defined */
module.exports = {
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
};
```

```typescript
// ✅ Proper Framer Motion setup
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  // Add will-change for better performance
  style={{ willChange: 'transform, opacity' }}
>
```

### Issue: Mobile responsive issues
**Symptoms:**
- Layout breaks on mobile
- Text too small or large

**Solution:**
```typescript
// ✅ Mobile-first responsive design
<div className="
  text-sm md:text-base lg:text-lg    // ✅ Progressive sizing
  px-4 md:px-6 lg:px-8             // ✅ Progressive spacing  
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // ✅ Progressive layout
">

// ✅ Test responsive breakpoints
const breakpoints = {
  sm: '640px',   // @media (min-width: 640px)
  md: '768px',   // @media (min-width: 768px)  
  lg: '1024px',  // @media (min-width: 1024px)
  xl: '1280px',  // @media (min-width: 1280px)
};

// ✅ Use DevTools device simulation for testing
```

---

## 🏗️ Build and Performance

### Issue: Build fails
**Symptoms:**
```bash
Build failed with errors
Module not found: Error: Can't resolve '@/components/ui/button'
```

**Solution:**
```bash
# 1. Check for build-specific TypeScript errors
npx tsc --noEmit

# 2. Verify all imports exist
find src -name "*.ts*" -exec grep -l "import.*@/" {} \; | xargs -I {} sh -c 'echo "Checking {}" && node -e "console.log(\"OK\")"'

# 3. Clean build cache
rm -rf dist .vite node_modules/.vite
npm run build

# 4. Check for dynamic imports
# Ensure lazy imports have proper error boundaries
const LazyComponent = React.lazy(() => 
  import('./Component').catch(() => ({ 
    default: () => <div>Failed to load</div> 
  }))
);
```

### Issue: Large bundle size
**Symptoms:**
- Slow page loads
- Warning about bundle size

**Solution:**
```bash
# 1. Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# 2. Check for unnecessary imports
# ❌ Imports entire library
import * as lodash from 'lodash';

# ✅ Import only what you need
import { debounce } from 'lodash';

# 3. Use code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

# 4. Optimize images
# Use appropriate formats and sizes
# Consider using a CDN for images
```

### Issue: Slow development server
**Symptoms:**
- HMR takes long time
- Dev server becomes unresponsive

**Solution:**
```javascript
// vite.config.ts optimizations
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: ['lucide-react'], // Large icon libraries
  },
  server: {
    fs: {
      strict: false, // If you have symlinks
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
});
```

---

## ⚛️ Component and State Issues

### Issue: Component not re-rendering
**Symptoms:**
- State changes but UI doesn't update
- Props change but component stays the same

**Solution:**
```typescript
// ❌ Mutating state directly
const addItem = (item) => {
  items.push(item); // ❌ Mutates array
  setItems(items);
};

// ✅ Create new state
const addItem = (item) => {
  setItems(prev => [...prev, item]); // ✅ New array
};

// ✅ Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

// ✅ Add key props for list items
{items.map(item => (
  <ItemComponent key={item.id} item={item} /> // ✅ Stable key
))}
```

### Issue: Infinite re-renders
**Symptoms:**
```bash
Error: Too many re-renders. React limits the number of renders
```

**Solution:**
```typescript
// ❌ Missing dependency array
useEffect(() => {
  fetchData();
}); // ❌ Runs on every render

// ✅ Proper dependency array
useEffect(() => {
  fetchData();
}, []); // ✅ Runs once

// ❌ Object/function as dependency
useEffect(() => {
  doSomething(config);
}, [config]); // ❌ New object each render

// ✅ Stable dependencies
const config = useMemo(() => ({ key: value }), [value]);
useEffect(() => {
  doSomething(config);
}, [config]); // ✅ Stable reference
```

### Issue: Context provider issues
**Symptoms:**
- Context value is undefined
- Components not updating with context changes

**Solution:**
```typescript
// ✅ Proper context setup
const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
} | undefined>(undefined);

// ✅ Custom hook with error handling
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ✅ Memoize context value
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## 🔍 SEO and Meta Tags

### Issue: Meta tags not updating
**Symptoms:**
- Same title on all pages
- Social media previews showing wrong content

**Solution:**
```typescript
// ✅ Proper React Helmet usage
import { Helmet } from 'react-helmet-async';

// ✅ Ensure HelmetProvider wraps your app
// In App.tsx or main.tsx
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* Your app */}
      </Router>
    </HelmetProvider>
  );
}

// ✅ Dynamic meta tags in components
const OpportunityPage: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => (
  <>
    <Helmet>
      <title>{opportunity.title} | The Animal Side</title>
      <meta name="description" content={opportunity.description} />
      <meta property="og:title" content={opportunity.title} />
      <meta property="og:description" content={opportunity.description} />
      <meta property="og:image" content={opportunity.images[0]} />
      <link rel="canonical" href={`https://theanimalside.com/opportunities/${opportunity.slug}`} />
    </Helmet>
    {/* Page content */}
  </>
);
```

### Issue: Poor SEO performance
**Symptoms:**
- Low Google PageSpeed scores
- Not ranking in search results

**Solution:**
```typescript
// ✅ Semantic HTML structure
<article itemScope itemType="https://schema.org/Event">
  <header>
    <h1 itemProp="name">{opportunity.title}</h1>
    <p itemProp="organizer">{opportunity.organization}</p>
  </header>
  <section itemProp="description">
    {opportunity.description}
  </section>
</article>

// ✅ Add structured data
const opportunitySchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": opportunity.title,
  "description": opportunity.description,
  "location": {
    "@type": "Place",
    "name": `${opportunity.location.city}, ${opportunity.location.country}`,
  },
};

<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(opportunitySchema)}
  </script>
</Helmet>
```

---

## 🔌 Third-party Integrations

### Issue: Leaflet map not displaying
**Symptoms:**
- Map container is empty
- Console errors about Leaflet

**Solution:**
```typescript
// ✅ Proper Leaflet CSS import
import 'leaflet/dist/leaflet.css';

// ✅ Fix marker icons (common Leaflet issue)
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ✅ Proper map initialization
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const MapView: React.FC = () => (
  <MapContainer
    center={[51.505, -0.09]}
    zoom={13}
    style={{ height: '400px', width: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    />
    <Marker position={[51.505, -0.09]} />
  </MapContainer>
);
```

### Issue: Framer Motion performance issues
**Symptoms:**
- Choppy animations
- High CPU usage

**Solution:**
```typescript
// ✅ Use transform properties for better performance
<motion.div
  animate={{ x: 100 }} // ✅ Uses transform
  // instead of animate={{ left: 100 }} ❌ Causes layout
/>

// ✅ Use will-change for complex animations
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ scale: 1.1 }}
/>

// ✅ Reduce motion for accessibility
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>

// ✅ Use layout animations sparingly
<motion.div layout> // Only when necessary
```

### Issue: OpenAI API integration (Future)
**Symptoms:**
- API calls failing
- Rate limiting issues

**Solution:**
```typescript
// ✅ Proper error handling
const generateContent = async (prompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    if (error.status === 429) {
      // Rate limit hit, implement exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateContent(prompt); // Retry
    }
    throw error;
  }
};

// ✅ Implement caching to reduce API calls
const contentCache = new Map();

const getCachedContent = async (key: string, generator: () => Promise<string>) => {
  if (contentCache.has(key)) {
    return contentCache.get(key);
  }
  
  const content = await generator();
  contentCache.set(key, content);
  return content;
};
```

---

## 🌐 Browser-Specific Issues

### Issue: Safari CSS issues
**Symptoms:**
- Animations not working in Safari
- Layout differences

**Solution:**
```css
/* Add vendor prefixes for Safari */
.custom-animation {
  -webkit-animation: float 6s ease-in-out infinite;
  animation: float 6s ease-in-out infinite;
}

/* Fix flexbox issues in Safari */
.flex-container {
  display: -webkit-flex; /* Safari */
  display: flex;
}

/* Fix backdrop-filter in Safari */
.glass-effect {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

### Issue: Internet Explorer compatibility (if required)
**Symptoms:**
- Site completely broken in IE
- JavaScript errors

**Solution:**
```javascript
// Add polyfills for IE support
// In index.html or main.tsx
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Check for IE and show warning
if (window.document.documentMode) {
  // Show IE warning message
  alert('This browser is not supported. Please use a modern browser.');
}
```

### Issue: Mobile browser issues
**Symptoms:**
- Touch events not working
- Viewport issues

**Solution:**
```html
<!-- Ensure proper viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- Prevent zoom on input focus (iOS) -->
<style>
input, select, textarea {
  font-size: 16px; /* Prevents zoom on iOS */
}
</style>
```

```typescript
// Handle touch events properly
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault(); // Prevent scrolling if needed
  // Handle touch logic
};

<div
  onTouchStart={handleTouchStart}
  style={{ touchAction: 'pan-y' }} // Allow vertical scrolling only
>
```

---

## 🚀 Deployment Issues

### Issue: Build fails in production
**Symptoms:**
- Works locally but fails in CI/CD
- Environment variable issues

**Solution:**
```bash
# 1. Check environment variables
# Ensure all VITE_ prefixed vars are available in production

# 2. Reproduce production build locally
npm run build
npm run preview

# 3. Check for absolute imports
# Ensure all imports use @/ aliases or relative paths

# 4. Verify all dependencies are in package.json (not devDependencies)
npm run build --verbose
```

### Issue: Assets not loading in production
**Symptoms:**
- Images not displaying
- CSS/JS files 404 errors

**Solution:**
```javascript
// vite.config.ts - Set correct base URL
export default defineConfig({
  base: '/your-subdirectory/', // If deployed to subdirectory
  build: {
    assetsDir: 'assets', // Ensure assets are in correct directory
  },
});

// Use proper asset imports
import heroImage from '@/assets/hero.jpg'; // ✅ Bundled asset
// Instead of <img src="/images/hero.jpg" /> ❌ Public folder
```

### Issue: Supabase connection issues (Future)
**Symptoms:**
- Database queries failing
- Authentication not working

**Solution:**
```typescript
// ✅ Proper Supabase client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Handle connection errors
const fetchOpportunities = async () => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error:', error);
    // Handle error appropriately
    return [];
  }
};
```

---

## 🆘 Emergency Fixes

### Issue: Site completely broken
**Quick fixes to try:**

```bash
# 1. Revert to last working commit
git log --oneline -10
git checkout [commit-hash]

# 2. Clear all caches
rm -rf node_modules package-lock.json .vite dist
npm install
npm run dev

# 3. Check for recent changes
git diff HEAD~1 HEAD

# 4. Rollback specific file
git checkout HEAD~1 -- src/problematic-file.tsx
```

### Issue: Performance suddenly degraded
**Quick diagnostics:**

```bash
# 1. Check bundle size
npm run build
ls -lah dist/assets/

# 2. Check for console errors
# Open DevTools > Console tab

# 3. Check for memory leaks
# DevTools > Performance tab > Record and analyze

# 4. Revert recent performance-related changes
git log --grep="performance\|optimization\|refactor"
```

---

## 📞 Getting Additional Help

### When to escalate an issue:
1. **Security concerns**: Any potential security vulnerabilities
2. **Data loss risk**: Database or user data related issues
3. **Blocking deployment**: Issues preventing production releases
4. **Performance critical**: Site unusably slow for users

### How to report issues:
1. **Search existing issues** in GitHub first
2. **Provide reproduction steps** with minimal example
3. **Include environment details** (Node version, OS, browser)
4. **Add relevant logs** and error messages
5. **Mention urgency level** and business impact

### Useful debugging commands:
```bash
# System information
node --version
npm --version
git --version

# Project information
npm ls --depth=0
npm outdated

# Build information
npm run build 2>&1 | tee build.log
npx tsc --noEmit --listFiles

# Performance profiling
npm run dev -- --debug
npm run build -- --mode=development
```

---

## 🔄 Keeping This Guide Updated

This troubleshooting guide should be updated when:
- New common issues are discovered
- Solutions become outdated
- New tools or dependencies are added
- Development environment changes

**Contribution process:**
1. Encounter an issue not covered here
2. Document the problem and solution
3. Add to appropriate section
4. Test the solution works
5. Submit PR with clear description

**Last Updated**: December 2024
**Next Review**: January 2025
**Version**: 1.0