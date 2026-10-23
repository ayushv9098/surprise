import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function diagnoseUserScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const bUser = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="im" src="data:image/png;base64,${bUser}" />
    </body>
    </html>
  `);

  // Let's create 3 crops: top bar, card content, bottom safari bar
  await page.evaluate(() => {
    const im = document.getElementById('im');
    function cropCanvas(y, h, id) {
      const c = document.createElement('canvas');
      c.id = id;
      c.width = im.naturalWidth;
      c.height = h;
      c.getContext('2d').drawImage(im, 0, y, im.naturalWidth, h, 0, 0, im.naturalWidth, h);
      document.body.appendChild(c);
    }
    cropCanvas(35, 75, 'crop_top_status');
    cropCanvas(110, 360, 'crop_mid_card');
    cropCanvas(470, 130, 'crop_bot_safari');
  });

  const cTop = await page.$('#crop_top_status');
  await cTop.screenshot({ path: 'test/diag_top_status.png' });
  const cMid = await page.$('#crop_mid_card');
  await cMid.screenshot({ path: 'test/diag_mid_card.png' });
  const cBot = await page.$('#crop_bot_safari');
  await cBot.screenshot({ path: 'test/diag_bot_safari.png' });

  console.log('Saved diag_top_status, diag_mid_card, diag_bot_safari');

  // Let's also check what is around the phone in 212020:
  // Is the phone centered? What is the background?
  const layout = await page.evaluate(() => {
    const im = document.getElementById('im');
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(im, 0, 0);

    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      topLeftCorner: getHex(10, 10),
      topCenter: getHex(Math.round(c.width/2), 10),
      topRightCorner: getHex(c.width - 10, 10),
      bottomLeft: getHex(10, c.height - 10),
      bottomCenter: getHex(Math.round(c.width/2), c.height - 10),
      bottomRight: getHex(c.width - 10, c.height - 10)
    };
  });

  console.log('Surrounding layout in 212020:', layout);
  await browser.close();
}

diagnoseUserScreenshot().catch(console.error);
