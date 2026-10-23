import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectMidCard() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600 });

  const bMid = fs.readFileSync('test/diag_mid_card.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #000; color: #fff; font-family: sans-serif; padding: 20px; } img { width: 100%; border: 1px solid #444; }</style></head>
    <body>
      <h3>Card inside 212020</h3>
      <img src="data:image/png;base64,${bMid}" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/card_view_212020.png' });
  console.log('Saved test/card_view_212020.png');
  await browser.close();
}

inspectMidCard().catch(console.error);
