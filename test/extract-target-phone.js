import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractTargetCenter() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 800 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; background: #fff;">
      <canvas id="c" width="333" height="676"></canvas>
      <script>
        const im = new Image();
        im.src = "data:image/png;base64,${bTarget}";
        im.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          // draw only phone bounds
          ctx.drawImage(im, 38, 18, 333, 676, 0, 0, 333, 676);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  await page.screenshot({ path: 'test/exact-target-phone-only.png' });
  console.log('Saved test/exact-target-phone-only.png');

  // Also let's extract our current phone only from test/vp-1440x900-sim.png
  await page.close();
  await browser.close();
}

extractTargetCenter().catch(console.error);
