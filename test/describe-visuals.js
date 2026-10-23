import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function describeVisuals() {
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
      <img id="img1" src="data:image/png;base64,${b1}" />
      <img id="img2" src="data:image/png;base64,${b2}" />
      <canvas id="c1"></canvas>
      <canvas id="c2"></canvas>
    </body>
    </html>
  `);

  const report = await page.evaluate(() => {
    const im1 = document.getElementById('img1');
    const im2 = document.getElementById('img2');
    
    // Draw both
    const c1 = document.getElementById('c1');
    c1.width = im1.naturalWidth; c1.height = im1.naturalHeight;
    c1.getContext('2d').drawImage(im1, 0, 0);

    const c2 = document.getElementById('c2');
    c2.width = im2.naturalWidth; c2.height = im2.naturalHeight;
    c2.getContext('2d').drawImage(im2, 0, 0);

    const getHex = (c, x, y) => {
      const p = c.getContext('2d').getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      img1Size: { w: im1.naturalWidth, h: im1.naturalHeight },
      img2Size: { w: im2.naturalWidth, h: im2.naturalHeight },
      // Check colors in target:
      targetChassisBorder: getHex(c1, 45, 100),
      targetChassisShadow: getHex(c1, 35, 100),
      targetIsland: getHex(c1, 204, 35),
      targetAddressBar: getHex(c1, 204, 600),
      targetToolbar: getHex(c1, 204, 645),
      // Check colors in produced:
      producedChassisBorder: getHex(c2, 105, 100),
      producedIsland: getHex(c2, 207, 45),
      producedAddressBar: getHex(c2, 207, 505),
      producedToolbar: getHex(c2, 207, 545),
    };
  });

  console.log('Visual report:', report);
  await browser.close();
}

describeVisuals().catch(console.error);
