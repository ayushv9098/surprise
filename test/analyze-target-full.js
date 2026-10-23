import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function analyzeTargetFull() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const b2 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #000; color: #fff; font-family: sans-serif; }
        .row { display: flex; gap: 20px; }
      </style>
    </head>
    <body>
      <div class="row">
        <div>
          <h3>Target Mockup 204201</h3>
          <img id="im1" src="data:image/png;base64,${b1}" style="width: 400px; border: 2px solid cyan;" />
        </div>
        <div>
          <h3>Produced 204952</h3>
          <img id="im2" src="data:image/png;base64,${b2}" style="width: 400px; border: 2px solid coral;" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/direct-side-by-side.png' });
  console.log('Saved test/direct-side-by-side.png');

  await browser.close();
}

analyzeTargetFull().catch(console.error);
