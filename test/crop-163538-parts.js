import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crop163538Parts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 800 });

  const b16 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 163538.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="cTop" width="386" height="120"></canvas>
      <canvas id="cBottom" width="386" height="150"></canvas>
      <script>
        const im = new Image();
        im.src = "data:image/png;base64,${b16}";
        im.onload = () => {
          const ctxTop = document.getElementById('cTop').getContext('2d');
          ctxTop.drawImage(im, 0, 0, 386, 120, 0, 0, 386, 120);

          const ctxBottom = document.getElementById('cBottom').getContext('2d');
          ctxBottom.drawImage(im, 0, 558, 386, 150, 0, 0, 386, 150);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  const cTop = await page.$('#cTop');
  await cTop.screenshot({ path: 'test/163538_top.png' });
  const cBottom = await page.$('#cBottom');
  await cBottom.screenshot({ path: 'test/163538_bottom.png' });

  console.log('Saved 163538_top.png and 163538_bottom.png');
  await browser.close();
}

crop163538Parts().catch(console.error);
