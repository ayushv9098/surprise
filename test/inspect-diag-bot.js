import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectDiagBot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600 });

  const bBot = fs.readFileSync('test/diag_bot_safari.png').toString('base64');
  const bTop = fs.readFileSync('test/diag_top_status.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #000; color: #fff; font-family: sans-serif; padding: 20px; } img { width: 100%; border: 1px solid #444; margin-bottom: 20px; }</style></head>
    <body>
      <h3>diag_top_status in 212020</h3>
      <img src="data:image/png;base64,${bTop}" />
      <h3>diag_bot_safari in 212020</h3>
      <img src="data:image/png;base64,${bBot}" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/diag_view.png' });
  console.log('Saved test/diag_view.png');
  await browser.close();
}

inspectDiagBot().catch(console.error);
