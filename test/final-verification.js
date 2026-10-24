import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function finalVerification() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Check Localhost with aria-s91z4
  await page.goto('http://localhost:5174/?v=aria-s91z4', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test/final-local-aria.png' });
  console.log('Saved test/final-local-aria.png');

  // 2. Check Live Production with aria-s91z4
  await page.goto('https://wishcraft-surprise.vercel.app/?v=aria-s91z4', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test/final-prod-aria.png' });
  console.log('Saved test/final-prod-aria.png');

  fs.copyFileSync('test/final-local-aria.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\final-local-aria.png');
  fs.copyFileSync('test/final-prod-aria.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\final-prod-aria.png');

  await browser.close();
}

finalVerification().catch(console.error);
