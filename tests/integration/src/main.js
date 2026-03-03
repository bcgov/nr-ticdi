'use strict';

/**
 * Very basic integration tests for the TICDI NestJS backend API.
 *
 * Environment variables:
 *   API_URL  - Direct URL to the backend service (e.g. https://nr-ticdi-42-backend.apps.silver.devops.gov.bc.ca)
 *              Defaults to http://localhost:3001 if not set.
 *
 * Requires Node.js >= 18 for built-in fetch.
 */

const API_URL = (process.env.API_URL || 'http://localhost:3001').replace(/\/$/, '');

let passed = 0;
let failed = 0;

/**
 * Make an HTTP request and assert the response status.
 *
 * @param {string} description - Human-readable test label
 * @param {string} method      - HTTP method (GET, POST, …)
 * @param {string} path        - Path relative to API_URL
 * @param {object} opts
 * @param {number} opts.expectedStatus - Expected HTTP status code
 * @param {Record<string, string>} [opts.headers] - Optional request headers
 */
async function check(description, method, path, { expectedStatus, headers = {} } = {}) {
  const url = `${API_URL}${path}`;
  try {
    const response = await fetch(url, { method, headers });
    if (response.status === expectedStatus) {
      console.log(`  ✓ ${description} (${response.status})`);
      passed++;
    } else {
      console.error(`  ✗ ${description} — expected ${expectedStatus}, got ${response.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ ${description} — request failed: ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log(`Running integration tests against: ${API_URL}\n`);

  // ── Public endpoints ──────────────────────────────────────────────────────
  // These should be reachable without any authentication token.
  console.log('Public endpoints:');
  await check('GET /report/healthcheck returns 200', 'GET', '/report/healthcheck', { expectedStatus: 200 });

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
