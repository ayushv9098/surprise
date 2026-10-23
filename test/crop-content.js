import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function cropContent() {
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
    <body style="margin: 0; background: #000;">
      <canvas id="c" width="300" height="500"></canvas>
      <script>
        const im = new Image();
        im.src = "data:image/png;base64,${bTarget}";
        im.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          // Crop phone screen content area: x=55, y=70, w=300, h=500
          ctx.drawImage(im, 55, 70, 300, 500, 0, 0, 300, 500);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  await page.screenshot({ path: 'test/target-screen-content-crop.png' });
  console.log('Saved test/target-screen-content-crop.png');

  // Let's inspect colors and elements in this content area
  const contentInfo = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      top: getHex(150, 10),
      center: getHex(150, 200),
      buttonArea: getHex(150, 350),
      bottom: getHex(150, 480)
    };
  });

  console.log('Content info:', contentInfo);

  await browser.close();
}

cropContent().catch(console.error);
