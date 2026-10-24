import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkColors() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const buf = fs.readFileSync('test/final-prod-aria.png');
  await page.setContent(`<body style="margin:0"><img id="shot" src="data:image/png;base64,${buf.toString('base64')}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

  const colors = await page.evaluate(() => {
    const img = document.getElementById('shot');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(c => c.toString(16).padStart(2, '0')).join('');
    };

    return {
      topCorner: getHex(20, 20),
      centerLeft: getHex(100, 300),
      bottomRight: getHex(1200, 750)
    };
  });

  console.log('Final Live Prod Colors for aria-s91z4:', colors);
  await browser.close();
}

checkColors().catch(console.error);
