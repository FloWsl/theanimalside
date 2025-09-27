import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check that the page title is correct
  await expect(page).toHaveTitle(/The Animal Side/);

  // Check that main content is visible
  await expect(page.locator('main')).toBeVisible();
});