import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyFinalBuild() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    // User's laptop viewport
    await page.setViewport({ width: 1280, height: 551 });
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
    await new Promise(r => setTimeout(r, 1200));

    // Full screen capture at 1280x551
    await page.screenshot({ path: 'test/laptop-551-perfect.png' });

    // Simulator crop
    const simBox = await page.evaluate(() => {
      const sim = document.querySelector('.bg-gradient-to-b.from-\\[\\#6b627a\\]')?.parentElement;
      if (!sim) return null;
      const r = sim.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });

    console.log('SimBox at 1280x551:', simBox);

    if (simBox) {
      await page.screenshot({
        path: 'test/laptop-551-sim-cropped.png',
        clip: {
          x: Math.max(0, Math.floor(simBox.x - 8)),
          y: Math.max(0, Math.floor(simBox.y - 8)),
          width: Math.min(1280 - simBox.x, Math.ceil(simBox.width + 16)),
          height: Math.min(551 - simBox.y, Math.ceil(simBox.height + 16))
        }
      });
      console.log('Saved test/laptop-551-sim-cropped.png');
    }
  } finally {
    await browser.close();
  }
}

verifyFinalBuild().catch(console.error);
