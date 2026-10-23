import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect212020() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bUserLatest = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui; padding: 20px; margin: 0; }
        .row { display: flex; gap: 30px; justify-content: center; }
        .box { background: #1e293b; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
        h3 { margin: 0 0 12px; font-size: 15px; }
        img { max-height: 750px; border: 1.5px solid #334155; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="box">
          <h3 style="color: #38bdf8;">TARGET MOCKUP (204201)</h3>
          <img id="imgTarget" src="data:image/png;base64,${bTarget}" />
        </div>
        <div class="box">
          <h3 style="color: #f43f5e;">USER SCREENSHOT (212020 - What user sees right now!)</h3>
          <img id="imgUser" src="data:image/png;base64,${bUserLatest}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/user-212020-compare.png', fullPage: true });
  console.log('Saved test/user-212020-compare.png');

  const sizes = await page.evaluate(() => {
    const it = document.getElementById('imgTarget');
    const iu = document.getElementById('imgUser');
    return {
      target: { w: it.naturalWidth, h: it.naturalHeight },
      user: { w: iu.naturalWidth, h: iu.naturalHeight }
    };
  });

  console.log('Image sizes:', sizes);
  await browser.close();
}

inspect212020().catch(console.error);
