import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineParts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const bTop = fs.readFileSync('test/163538_top.png').toString('base64');
  const bBottom = fs.readFileSync('test/163538_bottom.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="imTop" src="data:image/png;base64,${bTop}" />
      <img id="imBottom" src="data:image/png;base64,${bBottom}" />
      <canvas id="canTop"></canvas>
      <canvas id="canBottom"></canvas>
    </body>
    </html>
  `);

  const details = await page.evaluate(() => {
    const imT = document.getElementById('imTop');
    const cT = document.getElementById('canTop');
    cT.width = imT.naturalWidth; cT.height = imT.naturalHeight;
    const ctxT = cT.getContext('2d');
    ctxT.drawImage(imT, 0, 0);

    const imB = document.getElementById('imBottom');
    const cB = document.getElementById('canBottom');
    cB.width = imB.naturalWidth; cB.height = imB.naturalHeight;
    const ctxB = cB.getContext('2d');
    ctxB.drawImage(imB, 0, 0);

    const getHex = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Scan vertical center of top
    const topCol = [];
    for (let y = 0; y < cT.height; y += 5) {
      topCol.push({ y, hex: getHex(ctxT, Math.round(cT.width/2), y) });
    }

    // Scan vertical center of bottom
    const botCol = [];
    for (let y = 0; y < cB.height; y += 5) {
      botCol.push({ y, hex: getHex(ctxB, Math.round(cB.width/2), y) });
    }

    return { topCol: topCol.slice(0, 15), botCol };
  });

  console.log('Details top/bot:', JSON.stringify(details, null, 2));
  await browser.close();
}

examineParts().catch(console.error);
