import { test, expect } from '@playwright/test';
import { stat } from 'fs/promises';
import { loginAsIdir } from './helpers/login';

/**
 * Dev-environment-only E2E tests.
 *
 * To test these locally, add E2E_TARGET, E2E_USERNAME, E2E_PASSWORD to /frontend/.env.local
 *
 * These tests alter and generate data which is why they are limited to the dev environment.
 */

const isDevTarget = process.env.E2E_TARGET === 'dev';
const hasCredentials = !!process.env.E2E_USERNAME && !!process.env.E2E_PASSWORD;

test.describe('Dev environment', () => {
  test.skip(!isDevTarget, 'Skipped dev-only tests');
  test.skip(!hasCredentials, 'Skipped dev-only tests: set E2E_USERNAME and E2E_PASSWORD to enable authenticated tests');

  test('Create Document page: retrieve DTID 921528, select Notice of Final Review, and create document', async ({
    page,
  }) => {
    await page.goto('/');
    await loginAsIdir(page);

    // Enter the DTID and retrieve
    await page.fill('#dtid', '921528');
    await page.getByRole('button', { name: 'Retrieve' }).click();

    // Wait for tenure file number to populate
    const tfn = page.locator('#tfn');
    await expect(tfn).not.toBeEmpty({ timeout: 15000 });

    // Select 'Notice of Final Review' from the Document Type dropdown.
    // The select is only visible after a successful retrieve, so wait for it to be enabled.
    const docTypeSelect = page.locator('h3:has-text("Create Document") ~ div select').first();
    await expect(docTypeSelect).toBeEnabled({ timeout: 10000 });
    await docTypeSelect.selectOption({ label: 'Notice of Final Review' });

    // Click Create and expect a file download
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.getByRole('button', { name: 'Create' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBeTruthy();

    // Verify the downloaded file is greater than 1 KB
    const filePath = await download.path();
    expect(filePath, 'Download path should exist').toBeTruthy();
    const { size } = await stat(filePath!);
    expect(size, 'Downloaded file should be larger than 1 KB').toBeGreaterThan(1024);
  });

  test('Search page: find DTID 921528, open Notice of Final Review, and create document', async ({ page }) => {
    await page.goto('/search');
    await loginAsIdir(page);

    // Filter the table to DTID 921528
    await page.fill('input[placeholder="Search..."]', '921528');

    // Filter by document type
    await page.locator('select').selectOption({ label: 'Notice of Final Review' });

    // Wait for the filtered row to appear and click its radio button
    const radioButton = page.locator('table tbody tr input[type="radio"]').first();
    await expect(radioButton).toBeVisible({ timeout: 15000 });
    await radioButton.click();

    // Click Open — this navigates to the landing page with the DTID and doc type pre-loaded
    await page.getByRole('button', { name: 'Open' }).click();

    // The landing page auto-retrieves via Redux searchState; wait for tenure file number
    const tfn = page.locator('#tfn');
    await expect(tfn).not.toBeEmpty({ timeout: 15000 });

    // Click Create and expect a file download
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await page.getByRole('button', { name: 'Create' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBeTruthy();

    // Verify the downloaded file is greater than 1 KB
    const filePath = await download.path();
    expect(filePath, 'Download path should exist').toBeTruthy();
    const { size } = await stat(filePath!);
    expect(size, 'Downloaded file should be larger than 1 KB').toBeGreaterThan(1024);
  });

  test('Manage Doc Types: create, enable, edit name, add provision group, associate provision, delete', async ({
    page,
  }) => {
    // Use a timestamp-based name to avoid conflicts with existing doc types
    const docTypeName = `E2E Test ${Date.now()}`;
    const editedDocTypeName = `${docTypeName} Edited`;
    const provisionGroupNum = '99';
    const provisionGroupDesc = 'E2E Provision Group';

    await page.goto('/manage-doc-types');
    await loginAsIdir(page);
    await expect(page.locator('h1', { hasText: 'Manage Document Types' })).toBeVisible();

    // ------------------------------------------------------------------
    // Step 1: Create a new document type
    // ------------------------------------------------------------------
    await page.getByRole('button', { name: 'Add New' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // First text input = Document Type Name, second = File Prefix
    await dialog.locator('input[type="text"]').nth(0).fill(docTypeName);
    await dialog.locator('input[type="text"]').nth(1).fill('E2E');
    await dialog.getByRole('button', { name: 'Add' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    // ------------------------------------------------------------------
    // Step 2: Enable the new doc type via the Active checkbox
    // ------------------------------------------------------------------
    const newRow = page.locator('table tbody tr').filter({ has: page.locator(`input[value="${docTypeName}"]`) });
    await expect(newRow).toBeVisible({ timeout: 10000 });
    await newRow.locator('input[type="checkbox"]').check();

    // ------------------------------------------------------------------
    // Step 3: Navigate to the edit page
    // ------------------------------------------------------------------
    await newRow.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h1').filter({ hasText: 'Edit Document Type' })).toBeVisible();

    // Step 3a: Edit the document type name in the inline table
    const editDocTypeTable = page
      .locator('table')
      .filter({ has: page.locator('th', { hasText: 'Document Type Name' }) });
    await editDocTypeTable.getByRole('button', { name: 'Edit' }).click();

    const nameInput = editDocTypeTable.locator('input.form-control:not(.readonlyInput)').first();
    await nameInput.fill(editedDocTypeName);
    await nameInput.press('Tab'); // trigger onBlur to update state
    await editDocTypeTable.getByRole('button', { name: 'Save' }).click();

    // Step 3b: Add a provision group
    await page.getByRole('button', { name: 'Edit Provision Groups' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('dialog').getByRole('button', { name: 'Add Provision Group' }).click();
    await expect(page.getByRole('dialog').locator('.modal-title', { hasText: 'Add Provision Group' })).toBeVisible();

    await page.getByRole('dialog').locator('input[name="group"]').fill(provisionGroupNum);
    await page.getByRole('dialog').locator('input[name="description"]').fill(provisionGroupDesc);
    await page.getByRole('dialog').locator('input[name="max"]').fill('10');
    await page.getByRole('dialog').getByRole('button', { name: 'Add' }).click();

    // After adding, modal returns to the Edit Provision Groups list — save it
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Add Provision Group' })).toBeVisible({
      timeout: 5000,
    });
    await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });

    // Step 3c: Associate a provision and assign it to the new group
    const firstProvisionRow = page.locator('.MuiDataGrid-row').first();
    await expect(firstProvisionRow).toBeVisible({ timeout: 15000 });

    // Tick the Associated checkbox
    await firstProvisionRow.locator('[data-field="associated"] input[type="checkbox"]').click();

    // Click the Group cell — handleCellClick puts it into edit mode
    await firstProvisionRow.locator('[data-field="provision_group"]').click();
    const groupInput = firstProvisionRow.locator('[data-field="provision_group"] input');
    await groupInput.fill(provisionGroupNum);
    await page.keyboard.press('Enter');

    // Save all provision changes
    await page.getByRole('button', { name: 'Save' }).last().click();

    // ------------------------------------------------------------------
    // Step 4: Go back and delete the doc type
    // ------------------------------------------------------------------
    await page.getByRole('button', { name: 'Go Back' }).click();
    await expect(page.locator('h1', { hasText: 'Manage Document Types' })).toBeVisible();

    const editedRow = page
      .locator('table tbody tr')
      .filter({ has: page.locator(`input[value="${editedDocTypeName}"]`) });
    await expect(editedRow).toBeVisible({ timeout: 10000 });
    await editedRow.getByRole('button', { name: 'Remove' }).click();

    const removeDialog = page.getByRole('dialog');
    await expect(removeDialog).toBeVisible();
    await removeDialog.getByRole('button', { name: 'Remove' }).click();
    await expect(editedRow).not.toBeVisible({ timeout: 10000 });
  });

  test('Manage Provisions: create, edit, add variable, verify, delete', async ({ page }) => {
    const provisionName = `E2E Provision ${Date.now()}`;
    const updatedProvisionName = `${provisionName} Updated`;
    const freeText = 'E2E free text content';
    const category = 'E2E Category';
    const variableName = 'E2E_VAR';
    const variableValue = 'e2e variable value';

    await page.goto('/manage-provisions');
    await loginAsIdir(page);
    await expect(page.locator('h1', { hasText: 'Manage Provisions' })).toBeVisible();

    // ------------------------------------------------------------------
    // Step 1: Add a new provision
    // ------------------------------------------------------------------
    await page.getByRole('button', { name: 'Add a Provision' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.modal-title', { hasText: 'Add Provision' })).toBeVisible();

    await dialog.locator('input[name="provision"]').fill(provisionName);
    await dialog.locator('textarea[name="free_text"]').fill(freeText);
    await dialog.locator('input[name="category"]').fill(category);
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    // ------------------------------------------------------------------
    // Step 2: Filter to the new provision and open Edit
    // ------------------------------------------------------------------
    await page.locator('input.form-control[placeholder="Search..."]').fill(provisionName);

    const provisionRow = page
      .locator('table tbody tr')
      .filter({ has: page.locator(`input[value="${provisionName}"]`) });
    await expect(provisionRow).toBeVisible({ timeout: 10000 });
    await provisionRow.getByRole('button', { name: 'Edit' }).click();

    // ------------------------------------------------------------------
    // Step 3: Edit the provision name, add a variable, and save
    // ------------------------------------------------------------------
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.locator('.modal-title', { hasText: 'Edit Provision' })).toBeVisible();

    // Add a variable
    await editDialog.getByRole('button', { name: 'Add a Variable' }).click();
    await expect(editDialog.locator('.modal-title', { hasText: 'Add Variable' })).toBeVisible();

    // Variable Name / Variable Value / Help Text — no name attrs, target by order
    await editDialog.locator('input[type="text"]').nth(0).fill(variableName);
    await editDialog.locator('textarea').fill(variableValue);
    await editDialog.getByRole('button', { name: 'Save' }).click();

    // After saving variable, modal returns to Edit Provision view
    await expect(editDialog.locator('.modal-title', { hasText: 'Edit Provision' })).toBeVisible({ timeout: 10000 });

    // Change the provision name.
    // The EditProvisionModalForm uses defaultValue (uncontrolled input) and re-mounts when
    // navigating to Add Variable and back, so we triple-click to select all before filling
    // to ensure the native input event fires and React's onChange updates state.
    const nameInput = editDialog.locator('input[name="provision"]');
    await nameInput.click({ clickCount: 3 });
    await nameInput.fill(updatedProvisionName);
    await nameInput.press('Tab'); // trigger onBlur / ensure onChange has fired

    // Save the provision
    await editDialog.getByRole('button', { name: 'Save' }).click();
    await expect(editDialog).not.toBeVisible({ timeout: 10000 });

    // ------------------------------------------------------------------
    // Step 4: Open Edit again and verify the updated name and variable
    // ------------------------------------------------------------------
    // Re-apply the filter with the updated name so the row is visible
    await page.locator('input.form-control[placeholder="Search..."]').fill(updatedProvisionName);

    const updatedRow = page
      .locator('table tbody tr')
      .filter({ has: page.locator(`input[value="${updatedProvisionName}"]`) });
    await expect(updatedRow).toBeVisible({ timeout: 10000 });
    await updatedRow.getByRole('button', { name: 'Edit' }).click();

    const verifyDialog = page.getByRole('dialog');
    await expect(verifyDialog.locator('.modal-title', { hasText: 'Edit Provision' })).toBeVisible();

    // Verify updated provision name
    await expect(verifyDialog.locator('input[name="provision"]')).toHaveValue(updatedProvisionName);

    // Verify the variable row exists in the variables table
    // variableName is rendered inside an <input>, so match by value attribute rather than text content
    await expect(
      verifyDialog.locator('table tbody tr').filter({ has: page.locator(`input[value="${variableName}"]`) })
    ).toBeVisible({
      timeout: 10000,
    });

    await verifyDialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(verifyDialog).not.toBeVisible({ timeout: 10000 });

    // ------------------------------------------------------------------
    // Step 5: Delete the provision
    // ------------------------------------------------------------------
    await updatedRow.getByRole('button', { name: 'Remove' }).click();

    const removeDialog = page.getByRole('dialog');
    await expect(removeDialog).toBeVisible();
    await removeDialog.getByRole('button', { name: 'Remove' }).click();
    await expect(updatedRow).not.toBeVisible({ timeout: 10000 });
  });
});
