import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function compareBars() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const bNew = fs.readFileSync('test/vp-1440x900-sim.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="cT" width="409" height="715"></canvas>
      <canvas id="cN" width="370" height="697"></canvas>
      <script>
        const iT = new Image();
        iT.src = 'data:image/png;base64,' + "${bTarget}";
        iT.onload = () => {
          document.getElementById('cT').getContext('2d').drawImage(iT, 0, 0);
          window.tReady = true;
        };
        const iN = new Image();
        iN.src = 'data:image/png;base64,' + "${bNew}";
        iN.onload = () => {
          document.getElementById('cN').getContext('2d').drawImage(iN, 0, 0);
          window.nReady = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.tReady && window.nReady);

  // Crop top 100px and bottom 150px of each and save as image
  await page.evaluate(() => {
    function crop(srcId, y, h, outId) {
      const src = document.getElementById(srcId);
      const out = document.createElement('canvas');
      out.id = outId;
      out.width = src.width;
      out.height = h;
      out.getContext('2d').drawImage(src, 0, y, src.width, h, 0, 0, src.width, h);
      document.body.appendChild(out);
    }
    // Target:
    crop('cT', 18, 80, 't_top');
    crop('cT', 560, 130, 't_bot');
    // New:
    crop('cN', 10, 80, 'n_top');
    crop('cN', 540, 130, 'n_bot');
  });

  const tTop = await page.$('#t_top');
  await tTop.screenshot({ path: 'test/cmp_t_top.png' });
  const nTop = await page.$('#n_top');
  await nTop.screenshot({ path: 'test/cmp_n_top.png' });
  const tBot = await page.$('#t_bot');
  await tBot.screenshot({ path: 'test/cmp_t_bot.png' });
  const nBot = await page.$('#n_bot');
  await nBot.screenshot({ path: 'test/cmp_n_bot.png' });

  console.log('Saved top and bot crops for both');
  await browser.close();
}

compareBars().catch(console.error);
