import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12/13
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/landing_final.png' });

  // Click enter
  await page.click('button:has-text("Menüyü Keşfedin")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/grid_final.png' });

  await browser.close();
})();
