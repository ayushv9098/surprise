import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkStatusCrop() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 200 });

  const bStatus = fs.readFileSync('test/crop_status.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="background: #000; margin: 0;">
      <canvas id="c" width="333" height="50"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${bStatus}";
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

  // Zoom in on the time area (x=10 to 80, y=10 to 40)
  const timeDetails = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;

    // Check pixel density in time area
    let darkPixels = 0;
    for (let y = 15; y < 35; y++) {
      for (let x = 15; x < 85; x++) {
        const idx = (y * c.width + x) * 4;
        if (data[idx] < 50 && data[idx+1] < 50 && data[idx+2] < 50) {
          darkPixels++;
        }
      }
    }
    return { darkPixels };
  });

  console.log('Time details:', timeDetails);
  await browser.close();
}

checkStatusCrop().catch(console.error);
