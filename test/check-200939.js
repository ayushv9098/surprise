import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function check200939() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 800 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 200939.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; background: #000;">
      <img src="data:image/png;base64,${b}" style="max-width: 100%;" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/view-200939.png' });
  console.log('Saved test/view-200939.png');
  await browser.close();
}

check200939().catch(console.error);
