import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testBase64InSvg() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  const b64 = fs.readFileSync('public/previews/photos/royal-sapphire.jpg').toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="#1e3a8a"/>
    <image href="data:image/jpeg;base64,${b64}" x="50" y="50" width="200" height="200" preserveAspectRatio="xMidYMid slice"/>
    <text x="200" y="280" fill="#ffffff" font-size="20">Base64 Image Test</text>
  </svg>`;
  fs.writeFileSync('public/test-b64.svg', svgContent);

  await page.setContent(`
    <!DOCTYPE html>
    <html><body>
      <h3>SVG loaded via &lt;img&gt;:</h3>
      <img id="imgTest" src="http://localhost:5174/test-b64.svg" width="400" height="300" />
    </body></html>
  `);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test/test-b64-result.png' });
  console.log('Saved test/test-b64-result.png');

  // Verify non-empty pixels in image area
  const nonBlack = await page.evaluate(() => {
    const im = document.getElementById('imgTest');
    const cv = document.createElement('canvas');
    cv.width = 400; cv.height = 300;
    const ctx = cv.getContext('2d');
    ctx.drawImage(im, 0, 0);
    const p = ctx.getImageData(100, 100, 1, 1).data;
    return Array.from(p);
  });
  console.log('Pixel at 100,100:', nonBlack);

  await browser.close();
}

testBase64InSvg().catch(console.error);
