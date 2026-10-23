import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function breakdown212020() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const text = await page.evaluate(async (img) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize('data:image/png;base64,' + img);
    await worker.terminate();
    return ret.data.text;
  }, b).catch(e => e.message);

  console.log('212020 OCR Text:\n', text);

  // Let's also inspect canvas pixels
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="454" height="602"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${b}";
        im.onload = () => {
          document.getElementById('c').getContext('2d').drawImage(im, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);

  const analysis = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;

    // Find phone bounds in 212020
    let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const idx = (y * c.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r < 235 || g < 235 || b < 235) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    return {
      phoneBounds: { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 }
    };
  });

  console.log('Phone bounds in 212020:', analysis);
  await browser.close();
}

breakdown212020().catch(console.error);
