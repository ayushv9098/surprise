import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('test/crop-180514-center-left.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function inspectLeft() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(`<body style="margin:0"><img id="shot" src="${dataUrl}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

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

    // Let's sample colors in card 1, card 2, card 3
    // Card 1 is roughly x: 100-300, y: 50-250
    // Card 2 is roughly x: 400-600, y: 50-250
    // Card 3 is roughly x: 700-900, y: 50-250
    return {
      card1Bg: getHex(180, 100),
      card2Bg: getHex(480, 100),
      card3Bg: getHex(780, 100),
    };
  });

  console.log('Cards in user screenshot:', result);
  await browser.close();
}

inspectLeft().catch(console.error);
