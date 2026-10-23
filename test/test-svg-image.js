import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSvgImg() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  const testUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="#1e3a8a"/>
    <image href="${testUrl.replace(/&/g, '&amp;')}" x="50" y="50" width="200" height="200"/>
    <text x="200" y="280" fill="#ffffff" font-size="20">Test External Image</text>
  </svg>`;
  fs.writeFileSync('public/test-ext-img.svg', svgContent);

  await page.setContent(`
    <!DOCTYPE html>
    <html><body>
      <h3>SVG as &lt;img&gt;:</h3>
      <img id="imgTest" src="http://localhost:5174/test-ext-img.svg" width="400" height="300" />
      <h3>Inline SVG:</h3>
      ${svgContent}
    </body></html>
  `);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'test/test-img-vs-inline.png' });
  console.log('Saved test/test-img-vs-inline.png');
  await browser.close();
}

testSvgImg().catch(console.error);
