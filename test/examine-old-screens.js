import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineOldScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const b163538 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 163538.png').toString('base64');
  const b200939 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 200939.png').toString('base64');
  const b204201 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; }
        .row { display: flex; gap: 20px; }
        .col { display: flex; flex-direction: column; align-items: center; }
        img { max-height: 700px; border: 1px solid #444; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="col">
          <h3>163538 (esa karna hai bola tha)</h3>
          <img src="data:image/png;base64,${b163538}" />
        </div>
        <div class="col">
          <h3>200939 (dekh abhi bhi vesa hi hai)</h3>
          <img src="data:image/png;base64,${b200939}" />
        </div>
        <div class="col">
          <h3>204201 (esa design huna chye simulator ka)</h3>
          <img src="data:image/png;base64,${b204201}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/three-screenshots-comparison.png', fullPage: true });
  console.log('Saved test/three-screenshots-comparison.png');

  await browser.close();
}

examineOldScreenshots().catch(console.error);
