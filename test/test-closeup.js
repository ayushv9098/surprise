import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testCloseUp() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3 });
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // 1. Playfair
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Playfair_Display'] font-bold text-[21px] tracking-tight text-slate-900 select-none";
  });
  let btn = await page.$('header button');
  await btn.screenshot({ path: 'D:/avprojects/surprise-builder/test/brand-playfair-close.png' });

  // 2. Outfit
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Outfit'] font-bold text-[20px] tracking-tight text-slate-950 select-none";
  });
  btn = await page.$('header button');
  await btn.screenshot({ path: 'D:/avprojects/surprise-builder/test/brand-outfit-close.png' });

  console.log('Saved close-up screenshots to test/brand-playfair-close.png and test/brand-outfit-close.png');
  await browser.close();
}

testCloseUp().catch(console.error);
