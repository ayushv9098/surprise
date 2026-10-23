import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkButtonsAndIsland() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bUser = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="imT" src="data:image/png;base64,${bTarget}" />
      <img id="imU" src="data:image/png;base64,${bUser}" />
      <canvas id="cT"></canvas>
      <canvas id="cU"></canvas>
    </body>
    </html>
  `);

  const comparison = await page.evaluate(() => {
    const imT = document.getElementById('imT');
    const imU = document.getElementById('imU');
    const cT = document.getElementById('cT');
    const cU = document.getElementById('cU');
    cT.width = imT.naturalWidth; cT.height = imT.naturalHeight;
    cU.width = imU.naturalWidth; cU.height = imU.naturalHeight;
    const ctxT = cT.getContext('2d');
    const ctxU = cU.getContext('2d');
    ctxT.drawImage(imT, 0, 0);
    ctxU.drawImage(imU, 0, 0);

    const getHex = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Find dynamic island width in Target vs User
    function getIslandMetrics(ctx, w, h) {
      let minY = 1000, maxY = 0, minX = 1000, maxX = 0;
      for (let y = 10; y < 100; y++) {
        for (let x = 80; x < w - 80; x++) {
          const hex = getHex(ctx, x, y);
          if (hex === '#000000' || hex === '#020202' || hex === '#070707') {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
      }
      return { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

    return {
      islandTarget: getIslandMetrics(ctxT, cT.width, cT.height),
      islandUser: getIslandMetrics(ctxU, cU.width, cU.height),
    };
  });

  console.log('Island metrics comparison:', JSON.stringify(comparison, null, 2));
  await browser.close();
}

checkButtonsAndIsland().catch(console.error);
