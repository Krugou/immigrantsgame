import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('app_lang', 'en');
      localStorage.setItem('app_onboarded', '1');
    });
    try {
      await page.goto('/');
    } catch {}
  });

  test('should display key elements on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Territories/i })).toBeVisible();
  });

  test('should adapt layout for mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Territories/i })).toBeVisible();
  });
});
