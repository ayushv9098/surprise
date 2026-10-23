import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineToolbarIcons() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 200 });

  const bToolbar = fs.readFileSync('test/crop_toolbar.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="333" height="50"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${bToolbar}";
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

  const iconPositions = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;

    // Find blue pixels (iOS blue is #007aff or similar: b > 200, r < 100)
    const blueXs = [];
    for (let x = 0; x < c.width; x++) {
      let count = 0;
      for (let y = 0; y < c.height; y++) {
        const idx = (y * c.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (b > 180 && r < 100 && g > 100) count++;
      }
      if (count > 0) blueXs.push(x);
    }
    return { blueXs };
  });

  console.log('Blue icon X positions:', iconPositions);
  await browser.close();
}

examineToolbarIcons().catch(console.error);
