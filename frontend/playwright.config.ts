import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load .env.local for local development secrets (E2E_USERNAME, E2E_PASSWORD).
// This must run before test files are evaluated so module-level guards like
// `hasCredentials` see the populated env vars.
// On CI these vars are injected directly and override: false leaves them intact.
config({ path: '.env.local', override: false, quiet: true });

/**
 * Playwright configuration for TICDI frontend E2E tests.
 * Tests run against a deployed environment via BASE_URL env var.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  /* Fail fast on CI if a test is accidentally left with .only */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Single worker on CI to avoid flakiness; parallel locally */
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    // The dev SSO (loginproxy.gov.bc.ca) uses a certificate that Firefox Nightly
    // flags as a security threat. This bypasses the warning page so the redirect
    // can proceed normally.
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
