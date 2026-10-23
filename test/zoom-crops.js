import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function zoomCrops() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });

  const bStatus = fs.readFileSync('test/crop_status.png').toString('base64');
  const bAddr = fs.readFileSync('test/crop_addr.png').toString('base64');
  const bToolbar = fs.readFileSync('test/crop_toolbar.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; } img { image-rendering: pixelated; width: 800px; margin-bottom: 20px; border: 2px solid #555; }</style></head>
    <body>
      <h3>Status Bar (Enlarged)</h3>
      <img src="data:image/png;base64,${bStatus}" />
      <h3>Address Bar (Enlarged)</h3>
      <img src="data:image/png;base64,${bAddr}" />
      <h3>Toolbar (Enlarged)</h3>
      <img src="data:image/png;base64,${bToolbar}" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/crops-enlarged.png', fullPage: true });
  console.log('Saved test/crops-enlarged.png');
  await browser.close();
}

zoomCrops().catch(console.error);
