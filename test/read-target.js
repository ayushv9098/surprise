import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function readTargetMockup() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  // Load tesseract.js from CDN or let's use canvas pixel sampling to analyze
  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="409" height="715"></canvas>
      <script>
        const img = new Image();
        img.src = "data:image/png;base64,${b1}";
        img.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          ctx.drawImage(img, 0, 0);
          window.loaded = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.loaded);

  // Let's sample colors across the screen to understand the exact card and layout
  const layout = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      phoneCenterColor: getHex(204, 300),
      phoneBgTop: getHex(204, 80),
      cardBg: getHex(204, 250),
      cardBorder: getHex(100, 250),
      bottomToolbarBg: getHex(204, 640),
      homeBarColor: getHex(204, 680),
      addressBarColor: getHex(204, 605),
      dynamicIslandColor: getHex(204, 35),
      statusBarTimeArea: getHex(80, 35),
    };
  });

  console.log('Layout colors:', layout);
  await browser.close();
}

readTargetMockup().catch(console.error);
