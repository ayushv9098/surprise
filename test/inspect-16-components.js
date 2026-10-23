import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect16Components() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const bTop = fs.readFileSync('test/163538_top.png').toString('base64');
  const bBot = fs.readFileSync('test/163538_bottom.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="cT"></canvas>
      <canvas id="cB"></canvas>
    </body>
    </html>
  `);

  const res = await page.evaluate(async (bTop, bBot) => {
    function loadImg(b) {
      return new Promise(res => {
        const im = new Image();
        im.src = 'data:image/png;base64,' + b;
        im.onload = () => res(im);
      });
    }

    const imT = await loadImg(bTop);
    const cT = document.getElementById('cT');
    cT.width = imT.naturalWidth; cT.height = imT.naturalHeight;
    cT.getContext('2d').drawImage(imT, 0, 0);

    const imB = await loadImg(bBot);
    const cB = document.getElementById('cB');
    cB.width = imB.naturalWidth; cB.height = imB.naturalHeight;
    cB.getContext('2d').drawImage(imB, 0, 0);

    const getHex = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Bottom bar: check horizontal row y=18 (top of bottom chrome)
    const ctxB = cB.getContext('2d');
    const borderRow = [];
    for (let x = 30; x < cB.width - 30; x += 30) {
      borderRow.push({ x, hex: getHex(ctxB, x, 14) });
    }

    // Address bar y=38
    const addrRow = [];
    for (let x = 40; x < cB.width - 40; x += 30) {
      addrRow.push({ x, hex: getHex(ctxB, x, 38) });
    }

    // Toolbar y=75
    const toolbarRow = [];
    for (let x = 40; x < cB.width - 40; x += 30) {
      toolbarRow.push({ x, hex: getHex(ctxB, x, 75) });
    }

    return { borderRow, addrRow, toolbarRow };
  }, bTop, bBot);

  console.log('Inspected 163538:', JSON.stringify(res, null, 2));

  await browser.close();
}

inspect16Components().catch(console.error);
