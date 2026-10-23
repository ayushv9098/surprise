import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function listExactVisualDiffs() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bNew = fs.readFileSync('test/vp-1440x900-sim.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #000; color: #fff; font-family: sans-serif; padding: 20px; }
        .row { display: flex; gap: 40px; }
        .col { display: flex; flex-direction: column; align-items: center; }
        img { border: 2px solid #333; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="col">
          <h2 style="color: #38bdf8;">User Mockup Target (204201)</h2>
          <img id="imT" src="data:image/png;base64,${bTarget}" />
        </div>
        <div class="col">
          <h2 style="color: #4ade80;">What We Rendered (New Sim)</h2>
          <img id="imN" src="data:image/png;base64,${bNew}" />
        </div>
      </div>
    </body>
    </html>
  `);

  const diffReport = await page.evaluate(() => {
    const imT = document.getElementById('imT');
    const imN = document.getElementById('imN');

    return {
      targetNatural: { w: imT.naturalWidth, h: imT.naturalHeight },
      newNatural: { w: imN.naturalWidth, h: imN.naturalHeight },
    };
  });

  console.log('Diff report:', diffReport);
  await browser.close();
}

listExactVisualDiffs().catch(console.error);
