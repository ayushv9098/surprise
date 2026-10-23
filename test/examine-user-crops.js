import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineUserCrops() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 700 });

  const bTop = fs.readFileSync('test/user_crop_top.png').toString('base64');
  const bMid = fs.readFileSync('test/user_crop_mid.png').toString('base64');
  const bBot = fs.readFileSync('test/user_crop_bot.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; } img { border: 2px solid #444; margin-bottom: 20px; }</style></head>
    <body>
      <h3>User 212020 TOP</h3>
      <img src="data:image/png;base64,${bTop}" />
      <h3>User 212020 MID</h3>
      <img src="data:image/png;base64,${bMid}" />
      <h3>User 212020 BOT</h3>
      <img src="data:image/png;base64,${bBot}" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/user_crops_full_view.png' });
  console.log('Saved test/user_crops_full_view.png');

  // Let's inspect the bottom crop in detail:
  // Is the home bar visible? Is the address bar visible?
  const botStats = await page.evaluate(() => {
    const imB = document.querySelectorAll('img')[2];
    const c = document.createElement('canvas');
    c.width = imB.naturalWidth; c.height = imB.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(imB, 0, 0);

    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Scan vertical center column
    const col = [];
    for (let y = 0; y < c.height; y += 10) {
      col.push({ y, hex: getHex(Math.round(c.width/2), y) });
    }

    return { col };
  });

  console.log('Bot stats:', JSON.stringify(botStats, null, 2));
  await browser.close();
}

examineUserCrops().catch(console.error);
