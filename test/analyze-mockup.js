import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function analyze() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const b2 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #000; display: flex; flex-direction: column; gap: 20px; padding: 20px; }
        canvas { border: 1px solid #444; }
      </style>
    </head>
    <body>
      <canvas id="c1" width="409" height="715"></canvas>
      <canvas id="c2" width="415" height="618"></canvas>
      <script>
        const img1 = new Image();
        img1.src = "data:image/png;base64,${b1}";
        img1.onload = () => {
          const ctx = document.getElementById('c1').getContext('2d');
          ctx.drawImage(img1, 0, 0);
        };
        const img2 = new Image();
        img2.src = "data:image/png;base64,${b2}";
        img2.onload = () => {
          const ctx = document.getElementById('c2').getContext('2d');
          ctx.drawImage(img2, 0, 0);
        };
      </script>
    </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 1000));

  // Let's sample colors and regions from canvas 1 (target mockup)
  const analysis1 = await page.evaluate(() => {
    const c1 = document.getElementById('c1');
    const ctx = c1.getContext('2d');

    // Sample top, middle, bottom
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      width: c1.width,
      height: c1.height,
      sampleCorners: {
        topLeft: getHex(10, 10),
        topCenter: getHex(204, 10),
        center: getHex(204, 350),
        bottomCenter: getHex(204, 700),
      }
    };
  });

  console.log('Target analysis:', analysis1);

  await browser.close();
}

analyze().catch(console.error);
