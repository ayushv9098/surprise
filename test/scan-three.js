import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function scanThree() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b16 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 163538.png').toString('base64');
  const b200 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 200939.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="im16" src="data:image/png;base64,${b16}" />
      <img id="im200" src="data:image/png;base64,${b200}" />
    </body>
    </html>
  `);

  const info = await page.evaluate(() => {
    const i16 = document.getElementById('im16');
    const i200 = document.getElementById('im200');
    return {
      size16: { w: i16.naturalWidth, h: i16.naturalHeight },
      size200: { w: i200.naturalWidth, h: i200.naturalHeight }
    };
  });

  console.log('Sizes:', info);
  await browser.close();
}

scanThree().catch(console.error);
