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
  await page.setViewport({ width: 800, height: 600 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: #000;">
        <img id="im" src="http://localhost:5174/previews/test-data-uri.svg" style="width: 400px; height: 300px; display: block;" />
      </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test/direct-crop-im.png' });
  console.log('Saved test/direct-crop-im.png');

  const b = fs.readFileSync('test/direct-crop-im.png').toString('base64');
  await page.setContent(`<img id="shot" src="data:image/png;base64,${b}" />`);
  const px = await page.evaluate(() => {
    const shot = document.getElementById('shot');
    const cv = document.createElement('canvas');
    cv.width = shot.naturalWidth;
    cv.height = shot.naturalHeight;
    const ctx = cv.getContext('2d');
    ctx.drawImage(shot, 0, 0);
    // In test-data-uri.svg:
    // width=400, height=300
    // image is at x=50, y=50, width=100, height=100
    // so center of photo is x=100, y=100
    // background is x=10, y=10 -> should be #0f172a = [15, 23, 42]
    return {
      bgPixel: Array.from(ctx.getImageData(10, 10, 1, 1).data),
      photoPixel: Array.from(ctx.getImageData(100, 100, 1, 1).data)
    };
  });
  console.log('Pixels:', px);
  await browser.close();
}

test().catch(console.error);
