import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyNewBar() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const btns = await page.$$('button');
    for (const b of btns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Start Creating') || t.includes('Make a Keepsake'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    const modalBtns = await page.$$('button');
    for (const b of modalBtns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Continue') || t.includes('Personalize') || t.includes('Start'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));

    // Crop simulator
    const simBox = await page.evaluate(() => {
      const sim = document.querySelector('.bg-gradient-to-b.from-\\[\\#4a4258\\]')?.parentElement;
      if (!sim) return null;
      const rect = sim.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    if (simBox) {
      await page.screenshot({
        path: 'test/new-sim-with-safari-bg.png',
        clip: {
          x: Math.max(0, Math.floor(simBox.x - 8)),
          y: Math.max(0, Math.floor(simBox.y - 8)),
          width: Math.min(1440 - simBox.x, Math.ceil(simBox.width + 16)),
          height: Math.min(900 - simBox.y, Math.ceil(simBox.height + 16))
        }
      });
      console.log('Saved test/new-sim-with-safari-bg.png');
    }
  } finally {
    await browser.close();
  }
}

verifyNewBar().catch(console.error);
