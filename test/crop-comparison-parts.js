import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function cropComparisonParts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bUser = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #111; color: #fff; font-family: system-ui; padding: 20px; }
        .row { display: flex; gap: 20px; margin-bottom: 20px; align-items: center; }
        .box { background: #222; padding: 10px; border-radius: 8px; }
        h4 { margin: 0 0 6px; font-size: 13px; }
        img { border: 1px solid #444; border-radius: 4px; }
      </style>
    </head>
    <body>
      <canvas id="cT" width="409" height="715" style="display:none;"></canvas>
      <canvas id="cU" width="454" height="602" style="display:none;"></canvas>
      <div id="results"></div>
      <script>
        const iT = new Image();
        iT.src = 'data:image/png;base64,' + "${bTarget}";
        const iU = new Image();
        iU.src = 'data:image/png;base64,' + "${bUser}";

        let tLoaded = false, uLoaded = false;
        function checkReady() {
          if (!tLoaded || !uLoaded) return;
          const ctxT = document.getElementById('cT').getContext('2d');
          ctxT.drawImage(iT, 0, 0);
          const ctxU = document.getElementById('cU').getContext('2d');
          ctxU.drawImage(iU, 0, 0);

          function makePair(label, cropT, cropU) {
            const row = document.createElement('div');
            row.className = 'row';

            // Target crop
            const canT = document.createElement('canvas');
            canT.width = cropT.w; canT.height = cropT.h;
            canT.getContext('2d').drawImage(iT, cropT.x, cropT.y, cropT.w, cropT.h, 0, 0, cropT.w, cropT.h);

            // User crop
            const canU = document.createElement('canvas');
            canU.width = cropU.w; canU.height = cropU.h;
            canU.getContext('2d').drawImage(iU, cropU.x, cropU.y, cropU.w, cropU.h, 0, 0, cropU.w, cropU.h);

            row.innerHTML = '<h4>' + label + '</h4>';
            const b1 = document.createElement('div'); b1.className = 'box'; b1.innerHTML = '<b>Target (204201)</b><br/>'; b1.appendChild(canT);
            const b2 = document.createElement('div'); b2.className = 'box'; b2.innerHTML = '<b>User (212020)</b><br/>'; b2.appendChild(canU);
            row.appendChild(b1); row.appendChild(b2);
            document.getElementById('results').appendChild(row);
          }

          // Pair 1: Top Status Bar
          makePair('1. Top Status Bar', { x: 38, y: 18, w: 333, h: 55 }, { x: 65, y: 46, w: 310, h: 55 });

          // Pair 2: Address Bar
          makePair('2. Safari Address Bar', { x: 38, y: 570, w: 333, h: 48 }, { x: 65, y: 485, w: 310, h: 48 });

          // Pair 3: Bottom Toolbar
          makePair('3. Bottom Toolbar', { x: 38, y: 620, w: 333, h: 70 }, { x: 65, y: 533, w: 310, h: 65 });

          window.allReady = true;
        }

        iT.onload = () => { tLoaded = true; checkReady(); };
        iU.onload = () => { uLoaded = true; checkReady(); };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.allReady);
  await page.screenshot({ path: 'test/exact-part-by-part-diff.png', fullPage: true });
  console.log('Saved test/exact-part-by-part-diff.png');

  await browser.close();
}

cropComparisonParts().catch(console.error);
