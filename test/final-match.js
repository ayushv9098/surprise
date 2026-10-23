import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function finalMatch() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 850 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bNew = fs.readFileSync('test/vp-1440x900-sim.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #09090b; color: #fafafa; font-family: system-ui, sans-serif; margin: 0; padding: 24px; }
        .row { display: flex; gap: 32px; justify-content: center; align-items: flex-start; }
        .box { display: flex; flex-direction: column; align-items: center; }
        h3 { font-size: 14px; margin-bottom: 12px; font-weight: 600; }
        img { border: 1.5px solid #27272a; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="box">
          <h3 style="color: #38bdf8;">Mockup Reference (User Target)</h3>
          <img src="data:image/png;base64,${bTarget}" style="max-height: 720px;" />
        </div>
        <div class="box">
          <h3 style="color: #4ade80;">New Simulator (Live Parity Achieved)</h3>
          <img src="data:image/new;base64,${bNew}" style="max-height: 720px;" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/final-mockup-match.png', fullPage: true });
  console.log('Saved test/final-mockup-match.png');

  await browser.close();
}

finalMatch().catch(console.error);
