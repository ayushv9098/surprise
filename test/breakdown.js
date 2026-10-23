import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function breakdown() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1000 });

  const bPhone = fs.readFileSync('test/exact-target-phone-only.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="im" src="data:image/png;base64,${bPhone}" />
      <canvas id="c"></canvas>
    </body>
    </html>
  `);

  const res = await page.evaluate(() => {
    const im = document.getElementById('im');
    const c = document.getElementById('c');
    c.width = im.naturalWidth;
    c.height = im.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(im, 0, 0);

    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Find dynamic island vertical boundaries at center x = 166
    let islandTop = null, islandBottom = null;
    for (let y = 0; y < 100; y++) {
      const hex = getHex(166, y);
      if (hex === '#000000' || hex === '#020202' || hex === '#070707') {
        if (islandTop === null) islandTop = y;
        islandBottom = y;
      }
    }

    // Find dynamic island horizontal width at y = (islandTop + islandBottom)/2
    let islandLeft = null, islandRight = null;
    const midY = Math.round((islandTop + islandBottom) / 2);
    for (let x = 50; x < 280; x++) {
      const hex = getHex(x, midY);
      if (hex === '#000000' || hex === '#020202' || hex === '#070707') {
        if (islandLeft === null) islandLeft = x;
        islandRight = x;
      }
    }

    // Find address bar boundaries:
    // It's a rounded rect between y=550 and y=630
    let addrTop = null, addrBottom = null, addrLeft = null, addrRight = null;
    for (let y = 540; y < 630; y++) {
      const hex = getHex(166, y);
      // address bar is ~ #e8e8e9
      if (hex.startsWith('#e8') || hex.startsWith('#e5') || hex.startsWith('#e7')) {
        if (addrTop === null) addrTop = y;
        addrBottom = y;
      }
    }
    const addrMidY = Math.round((addrTop + addrBottom) / 2);
    for (let x = 10; x < 320; x++) {
      const hex = getHex(x, addrMidY);
      if (hex.startsWith('#e8') || hex.startsWith('#e5') || hex.startsWith('#e7')) {
        if (addrLeft === null) addrLeft = x;
        addrRight = x;
      }
    }

    // Find Safari bottom chrome top edge:
    // Scan up from y=660 to y=550 to see where #f9f9f9 starts
    let safariChromeTop = null;
    for (let y = 540; y < 600; y++) {
      const hex = getHex(30, y);
      if (hex === '#f9f9f9' || hex === '#f8f8f8' || hex === '#fafafa') {
        if (safariChromeTop === null) safariChromeTop = y;
      }
    }

    // Home bar at bottom
    let homeBarY = null;
    for (let y = 640; y < 670; y++) {
      const hex = getHex(166, y);
      if (hex === '#000000') homeBarY = y;
    }

    return {
      phoneSize: { width: im.naturalWidth, height: im.naturalHeight },
      island: {
        top: islandTop,
        bottom: islandBottom,
        height: islandBottom - islandTop + 1,
        left: islandLeft,
        right: islandRight,
        width: islandRight - islandLeft + 1
      },
      safariChromeTop,
      addressBar: {
        top: addrTop,
        bottom: addrBottom,
        height: addrBottom - addrTop + 1,
        left: addrLeft,
        right: addrRight,
        width: addrRight - addrLeft + 1
      },
      homeBarY
    };
  });

  console.log('Phone Breakdown:', JSON.stringify(res, null, 2));

  await browser.close();
}

breakdown().catch(console.error);
