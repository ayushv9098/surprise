import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crop212020Parts() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 700 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:#000;">
      <canvas id="cTop" width="454" height="150"></canvas>
      <canvas id="cMid" width="454" height="300"></canvas>
      <canvas id="cBot" width="454" height="160"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${b}";
        im.onload = () => {
          document.getElementById('cTop').getContext('2d').drawImage(im, 0, 0, 454, 150, 0, 0, 454, 150);
          document.getElementById('cMid').getContext('2d').drawImage(im, 0, 150, 454, 300, 0, 0, 454, 300);
          document.getElementById('cBot').getContext('2d').drawImage(im, 0, 442, 454, 160, 0, 0, 454, 160);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  const cTop = await page.$('#cTop');
  await cTop.screenshot({ path: 'test/user_crop_top.png' });
  const cMid = await page.$('#cMid');
  await cMid.screenshot({ path: 'test/user_crop_mid.png' });
  const cBot = await page.$('#cBot');
  await cBot.screenshot({ path: 'test/user_crop_bot.png' });

  console.log('Saved user_crop_top, mid, bot');
  await browser.close();
}

crop212020Parts().catch(console.error);
