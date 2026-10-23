import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect163538() {
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
    <body style="margin: 0; background: #000;">
      <canvas id="c" width="386" height="708"></canvas>
      <script>
        const im = new Image();
        im.src = "data:image/png;base64,${b16}";
        im.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          ctx.drawImage(im, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  await page.screenshot({ path: 'test/inspect-163538.png' });
  console.log('Saved test/inspect-163538.png');

  // Let's sample colors and elements from 163538
  const report = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      topChassis: getHex(193, 5),
      island: getHex(193, 25),
      statusBarTime: getHex(50, 25),
      bgUpper: getHex(193, 100),
      cardBg: getHex(193, 250),
      bottomChrome: getHex(193, 620),
      bottomRim: getHex(193, 700),
    };
  });

  console.log('163538 report:', report);

  await browser.close();
}

inspect163538().catch(console.error);
