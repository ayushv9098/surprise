import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectQuality() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  // Load the screenshots and check them
  const b1 = fs.readFileSync('test/qa-studio-birthday-boy-upgraded.png').toString('base64');
  const b2 = fs.readFileSync('test/all-6-birthday-previews.png').toString('base64');

  await page.setContent(`
    <html>
      <body style="background:#111; color:#fff; font-family:sans-serif; padding:20px;">
        <h2>Birthday Boy Grid in Studio</h2>
        <img src="data:image/png;base64,${b1}" style="max-width:100%; border:2px solid #3b82f6; border-radius:8px;" />
        <h2 style="margin-top:30px;">All 6 Previews Grid</h2>
        <img src="data:image/png;base64,${b2}" style="max-width:100%; border:2px solid #ec4899; border-radius:8px;" />
      </body>
    </html>
  `);

  await page.screenshot({ path: 'test/qa-inspection-combined.png', fullPage: true });
  console.log('Saved test/qa-inspection-combined.png');

  await browser.close();
}

inspectQuality().catch(console.error);
