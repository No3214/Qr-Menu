
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 5'] });

test('mobile screenshots', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('button:has-text("Accept"), button:has-text("Kabul Et")');
    await page.screenshot({ path: 'verification/mobile_landing.png' });

    await page.click('button:has-text("Explore Menu"), button:has-text("Menüyü Keşfedin")');
    await page.screenshot({ path: 'verification/mobile_menu_grid.png' });

    await page.locator('h3').first().click();
    await page.screenshot({ path: 'verification/mobile_menu_list.png' });

    await page.locator('h3').first().click();
    await page.screenshot({ path: 'verification/mobile_product_modal.png' });
});
