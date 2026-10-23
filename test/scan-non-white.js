import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function scanNonWhite() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 800 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="409" height="715"></canvas>
      <script>
        const im = new Image();
        im.src = "data:image/png;base64,${bTarget}";
        im.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          ctx.drawImage(im, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);

  const nonWhite = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;

    const items = [];
    // Scan by grid of 10
    for (let y = 60; y < 560; y += 10) {
      let nonWhiteCount = 0;
      for (let x = 60; x < 350; x += 5) {
        const idx = (y * c.width + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (r < 240 || g < 240 || b < 240) {
          nonWhiteCount++;
        }
      }
      if (nonWhiteCount > 0) {
        items.push({ y, nonWhiteCount });
      }
    }
    return items;
  });

  console.log('Non-white lines in screen area:', JSON.stringify(nonWhite, null, 2));

  await browser.close();
}

scanNonWhite().catch(console.error);
