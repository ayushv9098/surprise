import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkScreen() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const b = fs.readFileSync('test/test-both-render-comparison.png').toString('base64');
  await page.setContent(`<img id="im" src="data:image/png;base64,${b}" />`);
  
  const colors = await page.evaluate(() => {
    const im = document.getElementById('im');
    const cv = document.createElement('canvas');
    cv.width = im.naturalWidth;
    cv.height = im.naturalHeight;
    const ctx = cv.getContext('2d');
    ctx.drawImage(im, 0, 0);
    // Find non-background pixels in both cards:
    // Left card background is #0f172a = [15, 23, 42]
    // Right card background is #1e3a8a = [30, 58, 138]
    // Sample inside left photo (around x: 70, y: 100)
    const p1 = Array.from(ctx.getImageData(80, 100, 1, 1).data);
    // Sample inside right photo (around x: 380, y: 100)
    const p2 = Array.from(ctx.getImageData(380, 100, 1, 1).data);
    return {
      leftCardDataUriPhotoPixel: p1,
      rightCardRelativePhotoPixel: p2
    };
  });
  console.log('Sampled pixels:', colors);
  await browser.close();
}
checkScreen().catch(console.error);
