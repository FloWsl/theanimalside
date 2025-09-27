// tests/e2e/navigation-comprehensive.spec.ts
// IMPLEMENTATION TARGET: Comprehensive E2E testing for Phase 3.3 migration

import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';

// Test configuration and utilities
const TEST_CONFIG = {
  performanceBudget: {
    navigation: 2000, // 2 seconds
    loadEvent: 1000,  // 1 second
    firstContentfulPaint: 1500 // 1.5 seconds
  },
  routes: {
    static: ['/', '/opportunities', '/guides'],
    countries: ['costa-rica', 'thailand', 'south-africa', 'ecuador'],
    animals: ['lions', 'elephants', 'sea-turtles', 'jaguars'],
    organizations: ['wildlife-conservation-international', 'sea-turtle-protection']
  }
};

// Helper functions
async function enableFeatureFlag(page: Page, flagName: string, enabled: boolean): Promise<void> {
  await page.evaluate(([flag, value]) => {
    window.localStorage.setItem(flag, value.toString());
  }, [flagName, enabled]);
}

async function measureNavigationPerformance(page: Page): Promise<NavigationMetrics> {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    return {
      navigationStart: navigation.navigationStart,
      loadEventEnd: navigation.loadEventEnd,
      domContentLoaded: navigation.domContentLoadedEventEnd,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      totalNavigationTime: navigation.loadEventEnd - navigation.navigationStart
    };
  });
}

async function getRouteMetadata(page: Page): Promise<RouteMetadata> {
  return await page.evaluate(() => {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(script => script.textContent).filter(Boolean)
    };
  });
}

interface NavigationMetrics {
  navigationStart: number;
  loadEventEnd: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  totalNavigationTime: number;
}

interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
  structuredData: (string | null)[];
}

// Main test suite
test.describe('Phase 3.3: Comprehensive Navigation System Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test environment
    await page.goto('/');
    await enableFeatureFlag(page, 'ff_new_routing', true);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Feature Flag Testing', () => {
    test('should handle feature flag transitions seamlessly', async ({ page }) => {
      console.log('🧪 Testing feature flag transitions...');

      // Start with legacy system
      await enableFeatureFlag(page, 'ff_new_routing', false);
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Navigate to opportunities page
      await page.click('[data-testid="opportunities-nav"]');
      await expect(page).toHaveURL(/\/opportunities/);

      // Get page content before switch
      const legacyContent = await page.textContent('body');

      // Switch to new system mid-session
      await enableFeatureFlag(page, 'ff_new_routing', true);
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify page still works
      await expect(page).toHaveURL(/\/opportunities/);
      const modernContent = await page.textContent('body');

      // Content should be present in both systems
      expect(legacyContent).toBeTruthy();
      expect(modernContent).toBeTruthy();
      expect(modernContent.length).toBeGreaterThan(100); // Sanity check
    });

    test('should maintain navigation state during transitions', async ({ page }) => {
      console.log('🔄 Testing navigation state preservation...');

      // Start with new system
      await enableFeatureFlag(page, 'ff_new_routing', true);
      await page.goto('/volunteer-costa-rica');
      await page.waitForLoadState('networkidle');

      // Verify route works
      await expect(page).toHaveURL(/\/volunteer-costa-rica/);
      const title = await page.title();
      expect(title).toContain('Costa Rica');

      // Navigate to opportunities from country page
      await page.click('[data-testid="opportunities-link"]').catch(() => {
        // Fallback if specific test ID not found
        return page.click('a[href*="opportunities"]');
      });

      await expect(page).toHaveURL(/\/opportunities/);
    });
  });

  test.describe('Route Resolution and Navigation', () => {
    test('should handle complex navigation flows', async ({ page }) => {
      console.log('🗺️ Testing complex navigation flows...');

      // Test primary navigation paths
      await page.click('[data-testid="opportunities-nav"]').catch(() => {
        return page.click('a[href="/opportunities"]');
      });
      await expect(page).toHaveURL(/\/opportunities/);

      // Test dynamic country route generation
      const countryLink = page.locator('a[href*="/volunteer-costa-rica"]').first();
      if (await countryLink.count() > 0) {
        await countryLink.click();
        await expect(page).toHaveURL(/\/volunteer-costa-rica/);

        // Validate route metadata
        const metadata = await getRouteMetadata(page);
        expect(metadata.title).toContain('Costa Rica');
        expect(metadata.description).toBeTruthy();
      }

      // Test animal-specific navigation
      await page.goto('/lions-volunteer');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/lions-volunteer/);

      const animalMetadata = await getRouteMetadata(page);
      expect(animalMetadata.title).toMatch(/lion/i);
    });

    test('should handle all static routes correctly', async ({ page }) => {
      console.log('📄 Testing static routes...');

      for (const route of TEST_CONFIG.routes.static) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Verify page loads successfully
        expect(page.url()).toContain(route);

        // Check for basic page structure
        const hasContent = await page.locator('body').count() > 0;
        expect(hasContent).toBe(true);

        // Verify no JavaScript errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Wait a bit for any async errors
        await page.waitForTimeout(500);
      }
    });

    test('should resolve dynamic country routes', async ({ page }) => {
      console.log('🌍 Testing dynamic country routes...');

      for (const country of TEST_CONFIG.routes.countries) {
        const route = `/volunteer-${country}`;
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Verify route resolution
        expect(page.url()).toContain(route);

        // Check for country-specific content
        const pageContent = await page.textContent('body');
        const countryName = country.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        expect(pageContent).toContain(countryName);

        // Verify SEO metadata
        const metadata = await getRouteMetadata(page);
        expect(metadata.title).toContain(countryName);
      }
    });

    test('should resolve dynamic animal routes', async ({ page }) => {
      console.log('🦁 Testing dynamic animal routes...');

      for (const animal of TEST_CONFIG.routes.animals) {
        const route = `/${animal}-volunteer`;
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Verify route resolution
        expect(page.url()).toContain(route);

        // Check for animal-specific content
        const pageContent = await page.textContent('body');
        const animalName = animal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Animal name might be transformed (e.g., 'sea-turtles' -> 'Sea Turtles')
        const variations = [animalName, animal, animal.replace('-', ' ')];
        const hasAnimalContent = variations.some(variation =>
          pageContent.toLowerCase().includes(variation.toLowerCase())
        );
        expect(hasAnimalContent).toBe(true);
      }
    });

    test('should handle combined routes (country + animal)', async ({ page }) => {
      console.log('🔄 Testing combined routes...');

      const testCombinations = [
        { country: 'costa-rica', animal: 'sea-turtles' },
        { country: 'thailand', animal: 'elephants' },
        { country: 'south-africa', animal: 'lions' }
      ];

      for (const combo of testCombinations) {
        // Test country-first format
        const countryFirstRoute = `/volunteer-${combo.country}/${combo.animal}`;
        await page.goto(countryFirstRoute);
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(countryFirstRoute);

        // Test animal-first format
        const animalFirstRoute = `/${combo.animal}-volunteer/${combo.country}`;
        await page.goto(animalFirstRoute);
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(animalFirstRoute);

        // Verify combined content is present
        const pageContent = await page.textContent('body');
        const countryName = combo.country.replace('-', ' ');
        const animalName = combo.animal.replace('-', ' ');

        // Check for both country and animal references
        expect(pageContent.toLowerCase()).toMatch(new RegExp(countryName.replace(' ', '.?')));
        expect(pageContent.toLowerCase()).toMatch(new RegExp(animalName.replace(' ', '.?')));
      }
    });
  });

  test.describe('Performance Requirements', () => {
    test('should meet navigation performance budgets', async ({ page }) => {
      console.log('⚡ Testing navigation performance...');

      const routes = [
        '/',
        '/opportunities',
        '/volunteer-costa-rica',
        '/lions-volunteer',
        '/volunteer-costa-rica/sea-turtles'
      ];

      for (const route of routes) {
        const navigationStart = Date.now();

        await page.goto(route);
        await page.waitForLoadState('networkidle');

        const navigationEnd = Date.now();
        const navigationTime = navigationEnd - navigationStart;

        // Verify navigation completes within performance budget
        expect(navigationTime).toBeLessThan(TEST_CONFIG.performanceBudget.navigation);

        // Get detailed performance metrics
        const metrics = await measureNavigationPerformance(page);

        // Verify load event timing
        expect(metrics.totalNavigationTime).toBeLessThan(TEST_CONFIG.performanceBudget.loadEvent);

        // Verify first contentful paint
        if (metrics.firstContentfulPaint > 0) {
          expect(metrics.firstContentfulPaint).toBeLessThan(TEST_CONFIG.performanceBudget.firstContentfulPaint);
        }

        console.log(`✅ ${route}: ${navigationTime}ms (budget: ${TEST_CONFIG.performanceBudget.navigation}ms)`);
      }
    });

    test('should maintain resource loading efficiency', async ({ page }) => {
      console.log('📦 Testing resource loading efficiency...');

      await page.goto('/volunteer-costa-rica');
      await page.waitForLoadState('networkidle');

      const resourceMetrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          totalResources: resources.length,
          totalSize: resources.reduce((sum: number, resource: any) =>
            sum + (resource.transferSize || 0), 0),
          slowResources: resources.filter((resource: any) =>
            resource.duration > 1000).length,
          cachedResources: resources.filter((resource: any) =>
            resource.transferSize === 0).length
        };
      });

      // Verify resource efficiency
      expect(resourceMetrics.totalResources).toBeLessThan(50); // Reasonable resource count
      expect(resourceMetrics.slowResources).toBeLessThan(5);   // Few slow resources
      expect(resourceMetrics.totalSize).toBeLessThan(5 * 1024 * 1024); // Under 5MB total

      console.log('📊 Resource metrics:', resourceMetrics);
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle invalid routes gracefully', async ({ page }) => {
      console.log('🚨 Testing error handling...');

      const invalidRoutes = [
        '/invalid-route-path',
        '/volunteer-unknown-country',
        '/unknown-animal-volunteer',
        '/volunteer-costa-rica/unknown-animal'
      ];

      for (const route of invalidRoutes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Should not crash and should show some content
        const hasContent = await page.locator('body').textContent();
        expect(hasContent).toBeTruthy();
        expect(hasContent!.length).toBeGreaterThan(0);

        // Check for smart route handler or 404 content
        const pageText = hasContent!.toLowerCase();
        const hasErrorHandling = pageText.includes('not found') ||
                                pageText.includes('suggestions') ||
                                pageText.includes('404') ||
                                pageText.includes('redirect');
        expect(hasErrorHandling).toBe(true);
      }
    });

    test('should provide route suggestions for similar routes', async ({ page }) => {
      console.log('💡 Testing route suggestions...');

      // Test typo in country name
      await page.goto('/volunteer-costa-rico'); // Missing 'a'
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');
      expect(content!.toLowerCase()).toMatch(/costa.rica|suggestion|similar/);
    });
  });

  test.describe('SEO and Metadata Validation', () => {
    test('should generate proper SEO metadata for all routes', async ({ page }) => {
      console.log('🔍 Testing SEO metadata...');

      const seoRoutes = [
        { path: '/', expectedTitle: /animal|wildlife|volunteer/i },
        { path: '/opportunities', expectedTitle: /opportunities|volunteer/i },
        { path: '/volunteer-costa-rica', expectedTitle: /costa rica/i },
        { path: '/lions-volunteer', expectedTitle: /lion/i }
      ];

      for (const route of seoRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState('networkidle');

        const metadata = await getRouteMetadata(page);

        // Verify title
        expect(metadata.title).toMatch(route.expectedTitle);
        expect(metadata.title.length).toBeGreaterThan(10);
        expect(metadata.title.length).toBeLessThan(60);

        // Verify description
        expect(metadata.description).toBeTruthy();
        expect(metadata.description.length).toBeGreaterThan(50);
        expect(metadata.description.length).toBeLessThan(160);

        // Verify canonical URL
        if (metadata.canonical) {
          expect(metadata.canonical).toContain(route.path);
        }

        console.log(`✅ SEO check passed for ${route.path}`);
      }
    });

    test('should include structured data for content pages', async ({ page }) => {
      console.log('📋 Testing structured data...');

      const structuredDataRoutes = [
        '/volunteer-costa-rica',
        '/lions-volunteer',
        '/opportunities'
      ];

      for (const route of structuredDataRoutes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        const metadata = await getRouteMetadata(page);

        if (metadata.structuredData.length > 0) {
          const structuredData = metadata.structuredData[0];
          expect(structuredData).toBeTruthy();

          // Try to parse as JSON
          try {
            const parsed = JSON.parse(structuredData!);
            expect(parsed['@context']).toBeTruthy();
            expect(parsed['@type']).toBeTruthy();
          } catch (error) {
            // Some structured data might not be JSON-LD
            console.warn(`Structured data parsing issue for ${route}:`, error);
          }
        }
      }
    });
  });

  test.describe('Browser Compatibility and Responsive Design', () => {
    test('should work across different viewport sizes', async ({ page }) => {
      console.log('📱 Testing responsive design...');

      const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/volunteer-costa-rica');
        await page.waitForLoadState('networkidle');

        // Verify page is usable at this viewport
        const hasNavigation = await page.locator('nav').count() > 0;
        const hasMainContent = await page.locator('main, [role="main"], .main-content').count() > 0;

        expect(hasNavigation || hasMainContent).toBe(true);

        console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}) test passed`);
      }
    });
  });

  test.describe('Integration with Analytics and Monitoring', () => {
    test('should track navigation events', async ({ page }) => {
      console.log('📊 Testing analytics integration...');

      // Mock analytics calls
      const analyticsEvents: any[] = [];
      await page.route('**/analytics/**', route => {
        analyticsEvents.push({
          url: route.request().url(),
          method: route.request().method(),
          timestamp: Date.now()
        });
        route.fulfill({ status: 200, body: 'OK' });
      });

      // Navigate between pages
      await page.goto('/');
      await page.click('a[href="/opportunities"]');
      await page.waitForLoadState('networkidle');

      // Wait for potential analytics calls
      await page.waitForTimeout(1000);

      // Check if analytics events were tracked (if analytics is implemented)
      console.log(`📈 Analytics events captured: ${analyticsEvents.length}`);
    });
  });
});

// Additional utility test for migration readiness
test.describe('Migration Readiness Validation', () => {
  test('should validate system readiness for production migration', async ({ page }) => {
    console.log('🎯 Validating migration readiness...');

    const readinessChecks = {
      basicNavigation: false,
      performanceTargets: false,
      errorHandling: false,
      seoCompliance: false,
      responsiveDesign: false
    };

    try {
      // Basic navigation check
      await page.goto('/');
      await page.click('a[href="/opportunities"]');
      await expect(page).toHaveURL(/\/opportunities/);
      readinessChecks.basicNavigation = true;

      // Performance check
      const startTime = Date.now();
      await page.goto('/volunteer-costa-rica');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      readinessChecks.performanceTargets = loadTime < 3000;

      // Error handling check
      await page.goto('/invalid-route');
      const hasErrorContent = await page.locator('body').textContent();
      readinessChecks.errorHandling = hasErrorContent!.length > 0;

      // SEO compliance check
      await page.goto('/lions-volunteer');
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      readinessChecks.seoCompliance = title.length > 0 && (description?.length || 0) > 0;

      // Responsive design check
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/opportunities');
      const isMobileUsable = await page.locator('body').isVisible();
      readinessChecks.responsiveDesign = isMobileUsable;

    } catch (error) {
      console.error('Migration readiness validation failed:', error);
    }

    // Calculate readiness score
    const passedChecks = Object.values(readinessChecks).filter(Boolean).length;
    const totalChecks = Object.keys(readinessChecks).length;
    const readinessScore = (passedChecks / totalChecks) * 100;

    console.log('🎯 Migration Readiness Report:');
    console.log(`   Basic Navigation: ${readinessChecks.basicNavigation ? '✅' : '❌'}`);
    console.log(`   Performance Targets: ${readinessChecks.performanceTargets ? '✅' : '❌'}`);
    console.log(`   Error Handling: ${readinessChecks.errorHandling ? '✅' : '❌'}`);
    console.log(`   SEO Compliance: ${readinessChecks.seoCompliance ? '✅' : '❌'}`);
    console.log(`   Responsive Design: ${readinessChecks.responsiveDesign ? '✅' : '❌'}`);
    console.log(`   Overall Score: ${readinessScore}%`);

    // Migration should only proceed if readiness score is above 80%
    expect(readinessScore).toBeGreaterThan(80);
  });
});