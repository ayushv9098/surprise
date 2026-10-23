import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTemplatePreviews() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Open builder
    const btns = await page.$$('button');
    for (const b of btns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Start Creating') || t.includes('Make a Keepsake'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Handle initial modal
    const modalBtns = await page.$$('button');
    for (const b of modalBtns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Continue') || t.includes('Personalize') || t.includes('Start'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));

    // 1. Screenshot Birthday Boy templates grid
    const templateGrid = await page.$('.grid.grid-cols-2');
    if (templateGrid) {
      await templateGrid.screenshot({ path: 'test/qa-grid-birthday-boy.png' });
      console.log('Saved test/qa-grid-birthday-boy.png');
    }

    // 2. Toggle to Birthday Girl
    const switchBtn = await page.$('button[title*="Switch to Girl"]');
    if (switchBtn) {
      await switchBtn.click();
      await new Promise(r => setTimeout(r, 600));
      if (templateGrid) {
        await templateGrid.screenshot({ path: 'test/qa-grid-birthday-girl.png' });
        console.log('Saved test/qa-grid-birthday-girl.png');
      }
    }

    // Full screen view of builder with the templates
    await page.screenshot({ path: 'test/qa-builder-templates-view.png' });
    console.log('Saved test/qa-builder-templates-view.png');
  } finally {
    await browser.close();
  }
}

testTemplatePreviews().catch(console.error);
