import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectTargetDetails() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c1" width="409" height="715"></canvas>
      <script>
        const img1 = new Image();
        img1.src = "data:image/png;base64,${b1}";
        img1.onload = () => {
          const ctx = document.getElementById('c1').getContext('2d');
          ctx.drawImage(img1, 0, 0);
          window.ready1 = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready1);

  // Let's crop target mockup into high-res slices and save to disk
  await page.evaluate(() => {
    const c1 = document.getElementById('c1');
    const ctx = c1.getContext('2d');

    // Create 3 debug canvases: top, middle, bottom
    function makeSlice(name, y, h) {
      const sc = document.createElement('canvas');
      sc.id = name;
      sc.width = 409;
      sc.height = h;
      const sctx = sc.getContext('2d');
      sctx.drawImage(c1, 0, y, 409, h, 0, 0, 409, h);
      document.body.appendChild(sc);
    }

    makeSlice('slice_top', 18, 120);       // Status bar, Dynamic Island, top
    makeSlice('slice_mid', 138, 380);      // Center card
    makeSlice('slice_bottom', 518, 180);   // Address bar, toolbar, home bar
  });

  // Save slices as images
  const sliceTop = await page.$('#slice_top');
  await sliceTop.screenshot({ path: 'test/target_slice_top.png' });

  const sliceBottom = await page.$('#slice_bottom');
  await sliceBottom.screenshot({ path: 'test/target_slice_bottom.png' });

  console.log('Saved test/target_slice_top.png and test/target_slice_bottom.png');

  // Let's inspect features of target
  const details = await page.evaluate(() => {
    const c1 = document.getElementById('c1');
    const ctx = c1.getContext('2d');

    const getPixel = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return [p[0], p[1], p[2], p[3]];
    };

    // Find dynamic island position (pure black block near top center)
    let islandY = null, islandMinX = 409, islandMaxX = 0, islandHeight = 0;
    for (let y = 20; y < 70; y++) {
      let blackInRow = 0;
      for (let x = 150; x < 260; x++) {
        const [r, g, b] = getPixel(x, y);
        if (r < 15 && g < 15 && b < 15) {
          blackInRow++;
          if (x < islandMinX) islandMinX = x;
          if (x > islandMaxX) islandMaxX = x;
        }
      }
      if (blackInRow > 40) {
        if (islandY === null) islandY = y;
        islandHeight++;
      }
    }

    // Find address bar (near bottom, grayish pill)
    let addressBarY = null, addressBarHeight = 0;
    for (let y = 520; y < 650; y++) {
      const [r, g, b] = getPixel(204, y);
      // Address bar is light gray ~ 220-240
      if (r > 210 && r < 245 && g > 210 && g < 245 && b > 215 && b < 250) {
        if (addressBarY === null) addressBarY = y;
        addressBarHeight++;
      }
    }

    return {
      island: { y: islandY, height: islandHeight, minX: islandMinX, maxX: islandMaxX, width: islandMaxX - islandMinX },
      addressBar: { y: addressBarY, height: addressBarHeight }
    };
  });

  console.log('Target details:', details);

  await browser.close();
}

inspectTargetDetails().catch(console.error);
