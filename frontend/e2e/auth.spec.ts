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

  // ttls data for 921528 exists on all environments
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

  // These tests verify that each admin pages & search page loads data into their tables.
  test.describe('page table data loads', () => {
    test.describe.configure({ retries: 2 });

    test('search page loads data into table', async ({ page }) => {
      await page.goto('/search');
      await loginAsIdir(page);

      await expect(page.locator('.h1', { hasText: 'Search' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    });

    test('manage-admins page loads data into table', async ({ page }) => {
      await page.goto('/manage-admins');
      await loginAsIdir(page);

      await expect(page.locator('h1', { hasText: 'Manage Administrators' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    });

    test('manage-doc-types page loads data into table', async ({ page }) => {
      await page.goto('/manage-doc-types');
      await loginAsIdir(page);

      await expect(page.locator('h1', { hasText: 'Manage Document Types' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    });

    test('manage-templates page loads data into table', async ({ page }) => {
      await page.goto('/manage-templates');
      await loginAsIdir(page);

      await expect(page.locator('h1', { hasText: 'Manage Templates' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    });

    test('manage-provisions page loads data into table', async ({ page }) => {
      await page.goto('/manage-provisions');
      await loginAsIdir(page);

      await expect(page.locator('h1', { hasText: 'Manage Provisions' })).toBeVisible();
      await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    });
  });
});
