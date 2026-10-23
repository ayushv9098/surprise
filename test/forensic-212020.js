import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function forensic212020() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000 });

  const bTarget = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');
  const b212020 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="imT" src="data:image/png;base64,${bTarget}" />
      <img id="im2" src="data:image/png;base64,${b212020}" />
      <canvas id="cT"></canvas>
      <canvas id="c2"></canvas>
    </body>
    </html>
  `);

  const report = await page.evaluate(() => {
    const imT = document.getElementById('imT');
    const im2 = document.getElementById('im2');

    const cT = document.getElementById('cT');
    cT.width = imT.naturalWidth; cT.height = imT.naturalHeight;
    cT.getContext('2d').drawImage(imT, 0, 0);

    const c2 = document.getElementById('c2');
    c2.width = im2.naturalWidth; c2.height = im2.naturalHeight;
    c2.getContext('2d').drawImage(im2, 0, 0);

    const getHex = (ctx, x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Let's compare:
    // 1. In 212020, what is the address bar background and border?
    // 2. What is the status bar time text and position?
    // 3. Are the side buttons visible on left and right?
    // In 212020: phoneBounds: { minX: 59, maxX: 378, minY: 46, maxY: 601, width: 320, height: 556 }
    const phoneX = 59;
    const phoneW = 320;
    const phoneY = 46;
    const phoneH = 556;

    // Check side buttons in 212020:
    // Buttons should be outside phoneX (e.g. x = 56 to 58)
    const leftButtons = [];
    for (let y = phoneY; y < phoneY + phoneH; y += 10) {
      const hex = getHex(c2.getContext('2d'), phoneX - 2, y);
      if (hex !== '#fafafa' && hex !== '#ffffff') {
        leftButtons.push({ y, hex });
      }
    }

    const rightButtons = [];
    for (let y = phoneY; y < phoneY + phoneH; y += 10) {
      const hex = getHex(c2.getContext('2d'), phoneX + phoneW + 2, y);
      if (hex !== '#fafafa' && hex !== '#ffffff') {
        rightButtons.push({ y, hex });
      }
    }

    return {
      leftButtonsCount: leftButtons.length,
      rightButtonsCount: rightButtons.length,
      leftButtons,
      rightButtons
    };
  });

  console.log('Forensic report:', JSON.stringify(report, null, 2));
  await browser.close();
}

forensic212020().catch(console.error);
