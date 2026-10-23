import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractDetails() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const b2 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="m" src="data:image/png;base64,${b1}" />
      <img id="c" src="data:image/png;base64,${b2}" />
      <canvas id="can"></canvas>
    </body>
    </html>
  `);

  await page.evaluate(() => {
    const m = document.getElementById('m');
    const can = document.getElementById('can');
    can.width = m.naturalWidth;
    can.height = m.naturalHeight;
    const ctx = can.getContext('2d');
    ctx.drawImage(m, 0, 0);

    // Let's sample key areas in the target mockup:
    // Status Bar Time: left side, y ~ 32-38
    // Dynamic island: center x ~ 150-260, y ~ 24-50
    // Address bar: center x ~ 100-300, y ~ 585-620
    // Toolbar: y ~ 625-660
  });

  // Let's create an artifact report image of 4 crops:
  // 1. Status bar crop
  // 2. Dynamic island crop
  // 3. Address bar crop
  // 4. Toolbar crop
  await page.evaluate(() => {
    const m = document.getElementById('m');
    function cropCanvas(x, y, w, h, id) {
      const c = document.createElement('canvas');
      c.id = id;
      c.width = w;
      c.height = h;
      c.getContext('2d').drawImage(m, x, y, w, h, 0, 0, w, h);
      document.body.appendChild(c);
    }
    // Target is width 409, height 715
    cropCanvas(38, 18, 333, 50, 'target_status');
    cropCanvas(38, 570, 333, 50, 'target_addr');
    cropCanvas(38, 620, 333, 50, 'target_toolbar');
  });

  const st = await page.$('#target_status');
  await st.screenshot({ path: 'test/crop_status.png' });
  const sa = await page.$('#target_addr');
  await sa.screenshot({ path: 'test/crop_addr.png' });
  const stbar = await page.$('#target_toolbar');
  await stbar.screenshot({ path: 'test/crop_toolbar.png' });

  console.log('Saved crops: status, addr, toolbar');

  await browser.close();
}

extractDetails().catch(console.error);
