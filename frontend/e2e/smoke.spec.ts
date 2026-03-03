import { test, expect } from '@playwright/test';

/**
 * Smoke tests — run on every PR, simply checks that the login redirect is working.
 *
 * Authenticated tests are in auth.spec.ts and only run when
 * E2E_USERNAME / E2E_PASSWORD env vars are provided.
 */

test.describe('Smoke — unauthenticated', () => {
  test('app URL responds without a server error', async ({ page }) => {
    const response = await page.goto('/');
    // Allow 2xx and 3xx (redirects); anything 5xx is a real failure
    expect(response?.status()).toBeLessThan(500);
  });

  test('app redirects to BC Government SSO', async ({ page }) => {
    await page.goto('/');
    // The Keycloak `login-required` adapter fires immediately and redirects to SSO
    await page.waitForURL(/loginproxy\.gov\.bc\.ca|keycloak/, { timeout: 15000 });
    expect(page.url()).toMatch(/loginproxy\.gov\.bc\.ca|keycloak/);
  });

  test('SSO login page is reachable and has interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/loginproxy\.gov\.bc\.ca|keycloak/, { timeout: 15000 });

    // BC Gov SSO presents identity provider tiles or a login form.
    // Either way there should be at least one clickable element on the page.
    const interactiveElements = page.locator('a, button, input');
    await expect(interactiveElements.first()).toBeVisible({ timeout: 10000 });
  });
});
