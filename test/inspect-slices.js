import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectTopBottom() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const bTop = fs.readFileSync('test/target_slice_top.png').toString('base64');
  const bBottom = fs.readFileSync('test/target_slice_bottom.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img src="data:image/png;base64,${bTop}" id="imgTop" style="display:block; margin-bottom:20px;"/>
      <img src="data:image/png;base64,${bBottom}" id="imgBottom" style="display:block;"/>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/target_slices_view.png' });
  console.log('Saved test/target_slices_view.png');

  await browser.close();
}

inspectTopBottom().catch(console.error);
