import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSecurity() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  // Download small thumbnail from unsplash to base64
  const res = await fetch('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
  const buf = Buffer.from(await res.arrayBuffer());
  const b64 = buf.toString('base64');
  console.log('Downloaded photo size:', buf.length, 'bytes');

  // Test 1: SVG with base64 embedded in <image href="data:image/jpeg;base64,...">
  const svgBase64 = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="400" height="300">
      <rect width="400" height="300" fill="#1e3a8a"/>
      <image href="data:image/jpeg;base64,${b64}" x="50" y="50" width="200" height="200"/>
      <text x="200" y="280" fill="#ffffff" font-size="20">Test Base64 in SVG</text>
    </svg>
  `;
  fs.writeFileSync('public/test-b64-svg.svg', svgBase64);

  await page.setContent(`
    <!DOCTYPE html>
    <html><body>
      <h3>SVG with Base64 in &lt;img&gt;:</h3>
      <img id="img1" src="http://localhost:5174/test-b64-svg.svg" width="400" height="300" />
    </body></html>
  `);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test/test-b64-result.png' });
  console.log('Saved test/test-b64-result.png');

  // Check if pixels in image area are rendered
  const hasPixels = await page.evaluate(() => {
    const im = document.getElementById('img1');
    const c = document.createElement('canvas');
    c.width = 400; c.height = 300;
    const ctx = c.getContext('2d');
    ctx.drawImage(im, 0, 0);
    const p = ctx.getImageData(100, 100, 1, 1).data;
    return [p[0], p[1], p[2]];
  });
  console.log('Pixel at (100,100):', hasPixels);

  await browser.close();
}

testSecurity().catch(console.error);
