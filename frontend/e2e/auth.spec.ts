import { test, expect } from '@playwright/test';
import { loginAsIdir } from './helpers/login';

/**
 * Authenticated E2E tests.
 *
 * These tests only run when E2E_USERNAME and E2E_PASSWORD environment
 * variables are set, otherwise they are skipped.
 *
 */

const hasCredentials = !!process.env.E2E_USERNAME && !!process.env.E2E_PASSWORD;

test.describe('Authenticated user', () => {
  test.skip(!hasCredentials, 'Skipped: set E2E_USERNAME and E2E_PASSWORD to enable authenticated tests');

  test('can log in with IDIR credentials', async ({ page }) => {
    await page.goto('/');
    await loginAsIdir(page);
  });

  test('shows TICDI header after login', async ({ page }) => {
    await page.goto('/');
    await loginAsIdir(page);

    // TICDI brand should appear in the navbar
    await expect(page.locator('.navbar-brand').filter({ hasText: 'TICDI' })).toBeVisible();
  });

  test('navigation links are present after login', async ({ page }) => {
    await page.goto('/');
    await loginAsIdir(page);

    await expect(page.locator('#searchLink')).toBeVisible();
    await expect(page.locator('#createDocumentLink')).toBeVisible();
  });

  test('retrieving DTID 921528 populates tenure file number without errors', async ({ page }) => {
    await page.goto('/');
    await loginAsIdir(page);

    // Enter the DTID and retrieve
    await page.fill('#dtid', '921528');
    await page.getByRole('button', { name: 'Retrieve' }).click();

    // Wait for the skeleton loader to be replaced by real data
    // The tenure file number div always exists; we wait until it has non-empty text
    const tfn = page.locator('#tfn');
    await expect(tfn).not.toBeEmpty({ timeout: 15000 });

    // No error alert should be visible
    await expect(page.locator('[role="alert"].alert-danger')).not.toBeVisible();
  });
});
