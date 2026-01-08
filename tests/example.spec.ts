import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/CommerceOS/);
});

test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    // Check for a known element
    await expect(page.getByRole('main')).toBeVisible();
});
