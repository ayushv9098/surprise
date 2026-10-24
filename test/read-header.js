import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('test/crop-180514-header.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function inspectHeader() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(`<body style="margin:0"><img id="shot" src="${dataUrl}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

  // Let's sample colors in the header area
  const result = await page.evaluate(() => {
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
      w: canvas.width,
      h: canvas.height,
      c1: getHex(100, 50),
      c2: getHex(100, 100),
      c3: getHex(100, 150),
      c4: getHex(100, 200),
    };
  });

  console.log('Header colors:', result);
  await browser.close();
}

inspectHeader().catch(console.error);
