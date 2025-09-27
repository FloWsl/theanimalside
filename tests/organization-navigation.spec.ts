import { test, expect, Page } from '@playwright/test';

test.describe('Organization Card Navigation Tests', () => {
  let consoleLogs: string[] = [];
  let consoleErrors: string[] = [];
  let navigations: string[] = [];

  const setupConsoleLogging = (page: Page) => {
    consoleLogs = [];
    consoleErrors = [];
    navigations = [];

    // Capture console logs
    page.on('console', (msg) => {
      const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    // Capture navigation events
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        navigations.push(frame.url());
      }
    });
  };

  test('should navigate from sea-turtles-volunteer page to organization cards', async ({ page }) => {
    setupConsoleLogging(page);

    console.log('=== Starting test: sea-turtles-volunteer page navigation ===');

    // Navigate to the animal page
    await page.goto('http://localhost:5177/sea-turtles-volunteer');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('Initial console logs after page load:');
    consoleLogs.forEach(log => console.log(log));

    // Look for organization cards
    const organizationCards = page.locator('[data-testid="organization-card"], .organization-card, .card').filter({
      hasText: /Marine Life Protection|Sea Turtle|Conservation|Organization/i
    });

    const cardCount = await organizationCards.count();
    console.log(`Found ${cardCount} potential organization cards`);

    if (cardCount > 0) {
      // Get the first card and its text content
      const firstCard = organizationCards.first();
      const cardText = await firstCard.textContent();
      console.log(`Clicking on card with text: ${cardText}`);

      // Click the card and wait for navigation
      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        firstCard.click()
      ]);

      // Capture final URL
      const finalUrl = page.url();
      console.log(`Navigated to: ${finalUrl}`);

      // Log all navigations that occurred
      console.log('Navigation history:');
      navigations.forEach(nav => console.log(`  -> ${nav}`));

      // Log console output after navigation
      console.log('Console logs after navigation:');
      consoleLogs.forEach(log => console.log(log));

      if (consoleErrors.length > 0) {
        console.log('Console errors found:');
        consoleErrors.forEach(error => console.log(error));
      }

      // Verify we're on an organization page
      expect(finalUrl).toMatch(/\/organization\/|\/org\//);
    } else {
      console.log('No organization cards found on the page');

      // Let's see what's actually on the page
      const pageContent = await page.textContent('body');
      console.log('Page content preview:', pageContent?.substring(0, 500));

      // Look for any clickable elements that might be organization cards
      const allCards = await page.locator('.card, [role="button"], button, a').all();
      console.log(`Found ${allCards.length} clickable elements`);

      for (let i = 0; i < Math.min(allCards.length, 5); i++) {
        const cardText = await allCards[i].textContent();
        console.log(`Clickable element ${i}: ${cardText?.substring(0, 100)}`);
      }
    }
  });

  test('should navigate from volunteer-costa-rica page to organization cards', async ({ page }) => {
    setupConsoleLogging(page);

    console.log('=== Starting test: volunteer-costa-rica page navigation ===');

    // Navigate to the country page
    await page.goto('http://localhost:5177/volunteer-costa-rica');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('Initial console logs after page load:');
    consoleLogs.forEach(log => console.log(log));

    // Look for organization cards
    const organizationCards = page.locator('[data-testid="organization-card"], .organization-card, .card').filter({
      hasText: /Marine Life Protection|Conservation|Organization|Volunteer/i
    });

    const cardCount = await organizationCards.count();
    console.log(`Found ${cardCount} potential organization cards`);

    if (cardCount > 0) {
      // Get the first card and its text content
      const firstCard = organizationCards.first();
      const cardText = await firstCard.textContent();
      console.log(`Clicking on card with text: ${cardText}`);

      // Click the card and wait for navigation
      await Promise.all([
        page.waitForNavigation({ timeout: 10000 }),
        firstCard.click()
      ]);

      // Capture final URL
      const finalUrl = page.url();
      console.log(`Navigated to: ${finalUrl}`);

      // Log all navigations that occurred
      console.log('Navigation history:');
      navigations.forEach(nav => console.log(`  -> ${nav}`));

      // Log console output after navigation
      console.log('Console logs after navigation:');
      consoleLogs.forEach(log => console.log(log));

      if (consoleErrors.length > 0) {
        console.log('Console errors found:');
        consoleErrors.forEach(error => console.log(error));
      }

      // Verify we're on an organization page
      expect(finalUrl).toMatch(/\/organization\/|\/org\//);
    } else {
      console.log('No organization cards found on the page');

      // Let's see what's actually on the page
      const pageContent = await page.textContent('body');
      console.log('Page content preview:', pageContent?.substring(0, 500));

      // Look for any clickable elements that might be organization cards
      const allCards = await page.locator('.card, [role="button"], button, a').all();
      console.log(`Found ${allCards.length} clickable elements`);

      for (let i = 0; i < Math.min(allCards.length, 5); i++) {
        const cardText = await allCards[i].textContent();
        console.log(`Clickable element ${i}: ${cardText?.substring(0, 100)}`);
      }
    }
  });

  test('should investigate page structure and routing behavior', async ({ page }) => {
    setupConsoleLogging(page);

    console.log('=== Starting investigation test ===');

    // First, let's check what routes are available
    await page.goto('http://localhost:5177/sea-turtles-volunteer');
    await page.waitForLoadState('networkidle');

    // Check for React Router or Next.js routing
    const reactRouterPresent = await page.evaluate(() => {
      return !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
             !!(window as any).__NEXT_DATA__ ||
             !!(document.querySelector('[data-reactroot]'));
    });

    console.log(`React/Next.js detected: ${reactRouterPresent}`);

    // Look for all links on the page
    const links = await page.locator('a[href]').all();
    console.log(`Found ${links.length} links on the page`);

    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const href = await links[i].getAttribute('href');
      const text = await links[i].textContent();
      console.log(`Link ${i}: "${text}" -> ${href}`);
    }

    // Check for organization-related data
    const organizationData = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts
        .map(script => script.textContent || '')
        .filter(content => content.includes('organization') || content.includes('Marine Life'))
        .slice(0, 3)
        .map(content => content.substring(0, 200));
    });

    console.log('Organization-related script content:');
    organizationData.forEach(data => console.log(data));

    // Final console log capture
    console.log('All console messages during investigation:');
    consoleLogs.forEach(log => console.log(log));

    if (consoleErrors.length > 0) {
      console.log('All console errors during investigation:');
      consoleErrors.forEach(error => console.log(error));
    }
  });
});