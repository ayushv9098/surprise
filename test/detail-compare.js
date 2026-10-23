import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function detailCompare() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const b2 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: ui-sans-serif, system-ui; padding: 24px; margin: 0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1100px; margin: 0 auto; }
        .card { background: #1e293b; border-radius: 12px; padding: 16px; border: 1px solid #334155; }
        h2 { font-size: 15px; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
        img { max-width: 100%; height: auto; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="grid">
        <div class="card">
          <h2 style="color: #38bdf8;">TARGET MOCKUP (Screenshot 2026-10-23 204201.png) [333 x 676 phone]</h2>
          <img src="data:image/png;base64,${b1}" />
        </div>
        <div class="card">
          <h2 style="color: #f43f5e;">CURRENT SQUASHED (Screenshot 2026-10-23 204952.png) [415 x 592 phone]</h2>
          <img src="data:image/png;base64,${b2}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/direct-comparison.png', fullPage: true });
  console.log('Saved test/direct-comparison.png');
  await browser.close();
}

detailCompare().catch(console.error);
