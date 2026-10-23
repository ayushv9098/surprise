import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function deepAnalyze() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bOurs = fs.readFileSync('test/vp-1440x900-sim.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="cTarget" width="409" height="715"></canvas>
      <canvas id="cOurs"></canvas>
      <script>
        const imTarget = new Image();
        imTarget.src = "data:image/png;base64,${bTarget}";
        imTarget.onload = () => {
          const ctx = document.getElementById('cTarget').getContext('2d');
          ctx.drawImage(imTarget, 0, 0);
          window.targetReady = true;
        };

        const imOurs = new Image();
        imOurs.src = "data:image/png;base64,${bOurs}";
        imOurs.onload = () => {
          const c = document.getElementById('cOurs');
          c.width = imOurs.naturalWidth;
          c.height = imOurs.naturalHeight;
          const ctx = c.getContext('2d');
          ctx.drawImage(imOurs, 0, 0);
          window.oursReady = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.targetReady && window.oursReady);

  const report = await page.evaluate(() => {
    const cT = document.getElementById('cTarget');
    const ctxT = cT.getContext('2d');

    const getPixel = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Let's sample key coordinates of Target:
    // Target phone bounds: x from 38 to 370 (width 333), y from 18 to 693 (height 676)
    // 1. Top status bar clock area: (80, 40)
    // 2. Dynamic island: (204, 40)
    // 3. Signal/battery area: (330, 40)
    // 4. Background behind card: (70, 150)
    // 5. Card center: (204, 300)
    // 6. Address bar: (204, 600)
    // 7. Area between address bar and bottom: (204, 630), (204, 650)
    // 8. Home indicator: (204, 680)

    const samples = {
      clockArea: getPixel(ctxT, 80, 40),
      dynamicIsland: getPixel(ctxT, 204, 40),
      batteryArea: getPixel(ctxT, 330, 40),
      screenBgUpper: getPixel(ctxT, 70, 120),
      cardArea: getPixel(ctxT, 204, 250),
      addressBarCenter: getPixel(ctxT, 204, 600),
      toolbarArea: getPixel(ctxT, 204, 640),
      toolbarLeft: getPixel(ctxT, 65, 640),
      toolbarRight: getPixel(ctxT, 340, 640),
      homeBar: getPixel(ctxT, 204, 680),
      homeBarBg: getPixel(ctxT, 204, 670),
    };

    // Check if bottom toolbar has a solid background across the bottom
    const bottomRow = [];
    for (let x = 45; x < 365; x += 15) {
      bottomRow.push({ x, hex: getPixel(ctxT, x, 640) });
    }

    return { samples, bottomRow };
  });

  console.log('Deep analysis of Target Mockup:', JSON.stringify(report, null, 2));

  await browser.close();
}

deepAnalyze().catch(console.error);
