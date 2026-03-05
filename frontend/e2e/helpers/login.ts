import { Page, test } from '@playwright/test';

/**
 * Performs the full IDIR SSO login flow.
 *
 * Wrapped in a `{ box: true }` step so that credential fill values are
 * never surfaced in Playwright reports or traces.
 */
export async function loginAsIdir(page: Page): Promise<void> {
  await page.waitForURL(/loginproxy\.gov\.bc\.ca|keycloak/, { timeout: 15000 });

  // Boxed step: child steps are hidden in reports.
  // Credentials are set via evaluate() rather than fill() so they are never
  // recorded as browser actions in traces or the trace viewer.
  await test.step(
    'Login with IDIR credentials',
    async () => {
      await page.click('#social-idir');

      // Hide the username / password from the report
      await page
        .locator('input[name="user"]')
        .evaluate((el, value) => ((el as HTMLInputElement).value = value), process.env.E2E_USERNAME!);
      await page
        .locator('input[name="password"]')
        .evaluate((el, value) => ((el as HTMLInputElement).value = value), process.env.E2E_PASSWORD!);

      await page.click('input[type="submit"], button[type="submit"]');
    },
    { box: true }
  );

  await page.waitForURL(process.env.BASE_URL || 'http://localhost:3000/**', { timeout: 20000 });
}
