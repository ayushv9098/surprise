import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function compareSideBySideDetails() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 900 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bUser = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #121214; color: #fff; font-family: -apple-system, sans-serif; padding: 20px; }
        .row { display: flex; gap: 30px; justify-content: center; }
        .box { background: #202024; border: 1px solid #333; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; }
        h3 { font-size: 14px; margin: 0 0 10px 0; }
        img { max-height: 720px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="row">
        <div class="box">
          <h3 style="color: #38bdf8;">1. Target Mockup (204201)</h3>
          <img src="data:image/png;base64,${bTarget}" />
        </div>
        <div class="box">
          <h3 style="color: #fb7185;">2. What User Sees (212020)</h3>
          <img src="data:image/png;base64,${bUser}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/exact-side-by-side-comparison.png', fullPage: true });
  console.log('Saved test/exact-side-by-side-comparison.png');

  // Let's analyze pixel differences:
  // 1. In Target, what is the width of the phone frame?
  // 2. In 212020, what is the width of the phone frame?
  // 3. In Target, what is the shadow around the phone?
  // 4. In 212020, what is the shadow around the phone?
  // 5. In Target, what is inside the phone? (Target has an empty white web page!)
  // In 212020, the phone has a card with crown and "Happy Birthday to the King! Rehan!"!
  // Wait, does the user want the card to look different, or does the user want the frame/simulator to look different?

  await browser.close();
}

compareSideBySideDetails().catch(console.error);
