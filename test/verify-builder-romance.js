import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyBuilderRomance() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click on "Special Someone & Connection" category card on Home page
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('*'));
    const romanceEl = cards.find(el => (el.textContent || '').includes('Special Someone'));
    if (romanceEl) {
      const btn = romanceEl.closest('button, .cursor-pointer') || romanceEl;
      btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of Romance Builder Studio
  await page.screenshot({ path: 'test/romance-studio-view.png' });
  console.log('Saved test/romance-studio-view.png');

  fs.copyFileSync('test/romance-studio-view.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\romance-studio-view.png');

  await browser.close();
}

verifyBuilderRomance().catch(console.error);
