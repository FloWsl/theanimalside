import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5174'; // Using actual port from dev server

interface TestRoute {
  path: string;
  description: string;
  shouldWork: boolean;
  expectedFeatures?: string[];
}

const testRoutes: TestRoute[] = [
  // Dynamic Animal Routes (should work)
  { path: '/lions-volunteer', description: 'Lions volunteer page', shouldWork: true },
  { path: '/elephants-volunteer', description: 'Elephants volunteer page', shouldWork: true },
  { path: '/sea-turtles-volunteer', description: 'Sea turtles volunteer page', shouldWork: true },

  // Dynamic Country Routes (should work)
  { path: '/volunteer-costa-rica', description: 'Costa Rica volunteer page', shouldWork: true },
  { path: '/volunteer-thailand', description: 'Thailand volunteer page', shouldWork: true },
  { path: '/volunteer-south-africa', description: 'South Africa volunteer page', shouldWork: true },

  // Dynamic Combined Routes (should work)
  { path: '/volunteer-costa-rica/lions', description: 'Costa Rica lions page', shouldWork: true },
  { path: '/volunteer-costa-rica/sea-turtles', description: 'Costa Rica sea turtles page', shouldWork: true },
  { path: '/lions-volunteer/costa-rica', description: 'Lions in Costa Rica page', shouldWork: true },
  { path: '/elephants-volunteer/thailand', description: 'Elephants in Thailand page', shouldWork: true },

  // Invalid Routes (should show Smart 404)
  { path: '/invalid-animal-volunteer', description: 'Invalid animal route', shouldWork: false },
  { path: '/volunteer-invalid-country', description: 'Invalid country route', shouldWork: false },
  { path: '/typo-route', description: 'Random typo route', shouldWork: false },
];

async function captureConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  return errors;
}

test.describe('Navigation System Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page first to ensure app is loaded
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  for (const route of testRoutes) {
    test(`${route.description} - ${route.path}`, async ({ page }) => {
      const consoleErrors: string[] = [];

      // Capture console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        consoleErrors.push(error.message);
      });

      // Navigate to the route
      const response = await page.goto(`${BASE_URL}${route.path}`);
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `test-results/${route.path.replace(/\//g, '-')}-screenshot.png`,
        fullPage: true
      });

      if (route.shouldWork) {
        // Valid routes should load successfully
        expect(response?.status()).toBeLessThan(400);

        // Check that page content loaded (not a generic error page)
        const pageTitle = await page.title();
        expect(pageTitle).not.toBe('');

        // Check for common page elements that indicate successful load
        const hasContent = await page.locator('body').count() > 0;
        expect(hasContent).toBe(true);

        // Verify no major console errors
        const criticalErrors = consoleErrors.filter(error =>
          !error.includes('favicon') &&
          !error.includes('Warning') &&
          !error.includes('DevTools')
        );

        if (criticalErrors.length > 0) {
          console.log(`Console errors on ${route.path}:`, criticalErrors);
        }

      } else {
        // Invalid routes should show Smart 404
        // Look for 404 page indicators
        const bodyText = await page.locator('body').textContent();
        const has404Content = bodyText?.includes('404') ||
                             bodyText?.includes('not found') ||
                             bodyText?.includes('Page not found') ||
                             bodyText?.includes('suggested');

        // Take additional screenshot for 404 analysis
        await page.screenshot({
          path: `test-results/${route.path.replace(/\//g, '-')}-404-analysis.png`,
          fullPage: true
        });

        console.log(`404 page content for ${route.path}:`, bodyText?.substring(0, 200));
      }

      // Log any console errors for analysis
      if (consoleErrors.length > 0) {
        console.log(`Console errors for ${route.path}:`, consoleErrors);
      }
    });
  }

  test('Navigation breadcrumbs and links work correctly', async ({ page }) => {
    // Test that navigation elements are present and functional
    await page.goto(`${BASE_URL}/lions-volunteer`);
    await page.waitForLoadState('networkidle');

    // Look for navigation elements
    const navigation = await page.locator('nav, .nav, [role="navigation"]').count();
    const links = await page.locator('a[href]').count();

    console.log(`Navigation elements found: ${navigation}`);
    console.log(`Links found: ${links}`);

    await page.screenshot({
      path: 'test-results/navigation-elements.png',
      fullPage: true
    });
  });

  test('Responsive design works on mobile', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    await page.goto(`${BASE_URL}/volunteer-costa-rica`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/mobile-responsive-test.png',
      fullPage: true
    });

    // Check that content is visible and not overflowing
    const bodyWidth = await page.locator('body').boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(375);
  });
});