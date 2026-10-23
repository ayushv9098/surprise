import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function findExactDiscrepancies() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bLive = fs.readFileSync('test/vp-1440x900-sim.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #111; color: #fff; font-family: monospace; padding: 20px; }
        .row { display: flex; gap: 30px; }
        .card { display: flex; flex-direction: column; align-items: center; background: #222; padding: 15px; border-radius: 8px; }
        img { max-height: 750px; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="card">
          <h2 style="color: #00ffcc;">TARGET (Screenshot 2026-10-23 204201.png)</h2>
          <img id="imgTarget" src="data:image/png;base64,${bTarget}" />
        </div>
        <div class="card">
          <h2 style="color: #ffcc00;">CURRENT OURS (vp-1440x900-sim.png)</h2>
          <img id="imgCurrent" src="data:image/png;base64,${bLive}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/discrepancy-side-by-side.png', fullPage: true });
  console.log('Saved test/discrepancy-side-by-side.png');

  await browser.close();
}

findExactDiscrepancies().catch(console.error);
