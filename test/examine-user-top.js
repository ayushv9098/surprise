import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineUserTop() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 400 });

  const bTop = fs.readFileSync('test/user_crop_top.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c"></canvas>
      <img id="im" src="data:image/png;base64,${bTop}" />
    </body>
    </html>
  `);

  const topDetails = await page.evaluate(() => {
    const im = document.getElementById('im');
    const c = document.getElementById('c');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(im, 0, 0);

    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Scan vertical center column
    const col = [];
    for (let y = 0; y < c.height; y += 5) {
      col.push({ y, hex: getHex(Math.round(c.width/2), y) });
    }

    return { col: col.slice(0, 20) };
  });

  console.log('Top details:', JSON.stringify(topDetails, null, 2));
  await browser.close();
}

examineUserTop().catch(console.error);
