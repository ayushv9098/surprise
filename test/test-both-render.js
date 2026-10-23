import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  const b64 = fs.readFileSync('public/previews/photos/royal-sapphire.jpg').toString('base64');

  // Test SVG 1: using data URI
  const svgDataUri = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="#0f172a"/>
    <image href="data:image/jpeg;base64,${b64}" x="50" y="50" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>
    <text x="50" y="200" fill="#fff" font-size="16">Data URI Test</text>
  </svg>`;
  fs.writeFileSync('public/previews/test-data-uri.svg', svgDataUri);

  // Test SVG 2: using relative URL
  const svgRelative = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="#1e3a8a"/>
    <image href="/previews/photos/royal-sapphire.jpg" x="50" y="50" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>
    <text x="50" y="200" fill="#fff" font-size="16">Relative URL Test</text>
  </svg>`;
  fs.writeFileSync('public/previews/test-relative.svg', svgRelative);

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="background: #222; display: flex; gap: 20px; padding: 20px;">
        <div>
          <h4>Data URI in &lt;img&gt;</h4>
          <img id="img1" src="http://localhost:5174/previews/test-data-uri.svg" width="300" height="225" />
        </div>
        <div>
          <h4>Relative in &lt;img&gt;</h4>
          <img id="img2" src="http://localhost:5174/previews/test-relative.svg" width="300" height="225" />
        </div>
      </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test/test-both-render-comparison.png' });
  console.log('Saved test/test-both-render-comparison.png');

  // Let's sample pixels on page
  const result = await page.evaluate(() => {
    function getPixel(imgId) {
      const im = document.getElementById(imgId);
      const cv = document.createElement('canvas');
      cv.width = im.naturalWidth || 400;
      cv.height = im.naturalHeight || 300;
      const ctx = cv.getContext('2d');
      try {
        ctx.drawImage(im, 0, 0);
        const p = ctx.getImageData(80, 80, 1, 1).data;
        return { ok: true, pixel: Array.from(p) };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
    return {
      dataUri: getPixel('img1'),
      relative: getPixel('img2')
    };
  });

  console.log('Comparison evaluation:', JSON.stringify(result, null, 2));
  await browser.close();
}

test().catch(console.error);
