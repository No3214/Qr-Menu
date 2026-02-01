
import { test, expect } from '@playwright/test';

test('verify innovative features', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Accept cookies
    await page.click('button:has-text("Accept"), button:has-text("Kabul Et")');

    // Enter menu
    await page.click('button:has-text("Explore Menu"), button:has-text("Menüyü Keşfedin")');

    // Verify Call Waiter button exists
    const callWaiterBtn = page.getByRole('button', { name: /Call Waiter|Garsonu Çağır/i });
    await expect(callWaiterBtn).toBeVisible();

    // Click Call Waiter
    await callWaiterBtn.click();

    // Wait for success message
    await expect(page.getByText(/Waiter Notified|Garson Bilgilendirildi/i)).toBeVisible({ timeout: 10000 });

    // Click any category to go to list view
    await page.locator('h3').first().click();

    // Click any product to open modal
    await page.locator('h3').first().click();

    // Verify Share button exists
    const shareBtn = page.locator('button >> .lucide-share2').locator('..');
    await expect(shareBtn).toBeVisible();

    // Click share button
    await shareBtn.click();

    // Verify check icon appears
    await expect(page.locator('.lucide-check')).toBeVisible();

    console.log('Innovative features verified successfully');
});
