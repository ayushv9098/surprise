import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkTop16() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600 });

  const bTop = fs.readFileSync('test/163538_top.png').toString('base64');
  const bBot = fs.readFileSync('test/163538_bottom.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #000; color: #fff; font-family: sans-serif; }</style></head>
    <body>
      <h3>163538 TOP</h3>
      <img src="data:image/png;base64,${bTop}" style="border: 1px solid lime;" />
      <h3>163538 BOTTOM</h3>
      <img src="data:image/png;base64,${bBot}" style="border: 1px solid cyan;" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/view-163538-crops.png' });
  console.log('Saved test/view-163538-crops.png');
  await browser.close();
}

checkTop16().catch(console.error);
