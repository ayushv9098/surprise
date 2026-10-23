import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkMockupToolbarColors() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 200 });

  const bToolbar = fs.readFileSync('test/crop_toolbar.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="333" height="50"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${bToolbar}";
        im.onload = () => {
          document.getElementById('c').getContext('2d').drawImage(im, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);

  const colors = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // 5 icons are roughly at x = 30, 95, 166, 237, 303
    return {
      icon1_back: getHex(30, 25),
      icon2_forward: getHex(95, 25),
      icon3_share: getHex(166, 25),
      icon4_bookmark: getHex(237, 25),
      icon5_tabs: getHex(303, 25),
      bg: getHex(10, 10)
    };
  });

  console.log('Mockup Toolbar Colors:', colors);
  await browser.close();
}

checkMockupToolbarColors().catch(console.error);
