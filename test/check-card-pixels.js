import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkCardPixels() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const svgs = [
    'royal-sapphire.svg',
    'golden-birthday.svg',
    'polaroid-scrapbook.svg',
    'blush-rose.svg',
    'lavender-dream.svg',
    'princess-peach.svg'
  ];

  const results = [];

  for (const s of svgs) {
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 300 });
    await page.goto(`http://localhost:5174/previews/${s}`);
    
    const stats = await page.evaluate(() => {
      const im = document.querySelector('image');
      return {
        hasImage: !!im,
        hrefStart: im ? im.getAttribute('href').substring(0, 25) : null,
        bbox: im ? { x: im.getAttribute('x'), y: im.getAttribute('y'), w: im.getAttribute('width'), h: im.getAttribute('height') } : null
      };
    });

    results.push({ svg: s, stats });
    await page.close();
  }

  console.log('SVG verification results:', JSON.stringify(results, null, 2));
  await browser.close();
}

checkCardPixels().catch(console.error);
