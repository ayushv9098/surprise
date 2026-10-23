import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function scan() {
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
    <body>
      <canvas id="c1" width="409" height="715"></canvas>
      <canvas id="c2" width="415" height="618"></canvas>
      <script>
        const img1 = new Image();
        img1.src = "data:image/png;base64,${b1}";
        img1.onload = () => {
          const ctx = document.getElementById('c1').getContext('2d');
          ctx.drawImage(img1, 0, 0);
          window.ready1 = true;
        };
        const img2 = new Image();
        img2.src = "data:image/png;base64,${b2}";
        img2.onload = () => {
          const ctx = document.getElementById('c2').getContext('2d');
          ctx.drawImage(img2, 0, 0);
          window.ready2 = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready1 && window.ready2);

  const result = await page.evaluate(() => {
    function findPhoneBounds(canvasId) {
      const c = document.getElementById(canvasId);
      const ctx = c.getContext('2d');
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;

      // Find non-white/non-transparent bounds
      let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const idx = (y * c.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          // Check if not pure white/near white (e.g. > 250)
          if (a > 50 && (r < 240 || g < 240 || b < 240)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

    return {
      targetBounds: findPhoneBounds('c1'),
      producedBounds: findPhoneBounds('c2')
    };
  });

  console.log('Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

scan().catch(console.error);
