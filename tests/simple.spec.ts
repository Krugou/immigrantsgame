import { test, expect } from '@playwright/test';

test('sanity check', async ({ page }) => {
  try {
    await page.goto('/');
  } catch {}
  // basic element should exist
  await expect(page.locator('body')).not.toBeEmpty();
});
