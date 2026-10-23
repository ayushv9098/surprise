import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectPairs() {
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
      <img id="it" src="data:image/png;base64,${bTarget}" />
      <img id="iu" src="data:image/png;base64,${bUser}" />
      <canvas id="ct"></canvas>
      <canvas id="cu"></canvas>
    </body>
    </html>
  `);

  const report = await page.evaluate(() => {
    const it = document.getElementById('it');
    const iu = document.getElementById('iu');
    const ct = document.getElementById('ct');
    const cu = document.getElementById('cu');
    ct.width = it.naturalWidth; ct.height = it.naturalHeight;
    cu.width = iu.naturalWidth; cu.height = iu.naturalHeight;
    const ctxt = ct.getContext('2d');
    const ctxu = cu.getContext('2d');
    ctxt.drawImage(it, 0, 0);
    ctxu.drawImage(iu, 0, 0);

    const getHex = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // In Target:
    // Dynamic island is at center x=204, y=28 to 58.
    // Width of dynamic island in target:
    let tIslandStart = null, tIslandEnd = null;
    for (let x = 140; x < 280; x++) {
      const hex = getHex(ctxt, x, 40);
      if (hex === '#000000' || hex === '#020202' || hex === '#070707') {
        if (tIslandStart === null) tIslandStart = x;
        tIslandEnd = x;
      }
    }

    // In User 212020:
    // Phone center in user: (59 + 378) / 2 = 218.
    // Dynamic island at y=75:
    let uIslandStart = null, uIslandEnd = null;
    for (let x = 150; x < 300; x++) {
      const hex = getHex(ctxu, x, 75);
      if (hex === '#000000' || hex === '#020202' || hex === '#070707') {
        if (uIslandStart === null) uIslandStart = x;
        uIslandEnd = x;
      }
    }

    // In Target address bar:
    // y = 600. Center x = 204.
    let tAddrStart = null, tAddrEnd = null;
    for (let x = 38; x < 370; x++) {
      const hex = getHex(ctxt, x, 600);
      if (hex.startsWith('#e8') || hex.startsWith('#e5') || hex.startsWith('#e7')) {
        if (tAddrStart === null) tAddrStart = x;
        tAddrEnd = x;
      }
    }

    // In User address bar:
    // y = 515. Center x = 218.
    let uAddrStart = null, uAddrEnd = null;
    for (let x = 59; x < 378; x++) {
      const hex = getHex(ctxu, x, 515);
      if (hex.startsWith('#e8') || hex.startsWith('#e5') || hex.startsWith('#e7')) {
        if (uAddrStart === null) uAddrStart = x;
        uAddrEnd = x;
      }
    }

    return {
      tIsland: { start: tIslandStart, end: tIslandEnd, width: tIslandEnd - tIslandStart },
      uIsland: { start: uIslandStart, end: uIslandEnd, width: uIslandEnd - uIslandStart },
      tAddr: { start: tAddrStart, end: tAddrEnd, width: tAddrEnd - tAddrStart },
      uAddr: { start: uAddrStart, end: uAddrEnd, width: uAddrEnd - uAddrStart },
    };
  });

  console.log('Inspection report:', report);
  await browser.close();
}

inspectPairs().catch(console.error);
