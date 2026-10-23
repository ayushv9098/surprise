import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const p1 = 'C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png';
const p2 = 'C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png';

async function inspect() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const b1 = fs.readFileSync(p1).toString('base64');
  const b2 = fs.readFileSync(p2).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #18181b; color: #fff; font-family: system-ui, sans-serif; padding: 20px; }
        .row { display: flex; gap: 40px; align-items: flex-start; }
        .col { display: flex; flex-direction: column; align-items: center; }
        h2 { margin: 0 0 10px 0; font-size: 16px; font-weight: 600; }
        img { border: 2px solid #3f3f46; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="col">
          <h2 style="color: #4ade80;">1. Target Mockup (Screenshot 2026-10-23 204201.png)</h2>
          <img src="data:image/png;base64,${b1}" id="img1" />
        </div>
        <div class="col">
          <h2 style="color: #f87171;">2. Current Produced (Screenshot 2026-10-23 204952.png)</h2>
          <img src="data:image/png;base64,${b2}" id="img2" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/side-by-side.png', fullPage: true });
  console.log('Saved side-by-side screenshot to test/side-by-side.png');

  // Let's also analyze dimensions and differences inside the DOM
  const metrics = await page.evaluate(() => {
    const im1 = document.getElementById('img1');
    const im2 = document.getElementById('img2');
    return {
      img1: { naturalWidth: im1.naturalWidth, naturalHeight: im1.naturalHeight },
      img2: { naturalWidth: im2.naturalWidth, naturalHeight: im2.naturalHeight }
    };
  });
  console.log('Metrics:', metrics);

  await browser.close();
}

inspect().catch(console.error);
