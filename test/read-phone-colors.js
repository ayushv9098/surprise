import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('test/crop-full-phone.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function inspectPhone() {
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

    // Let's sample along vertical center of the phone screen
    const cx = Math.round(canvas.width / 2);
    const verticalColors = [];
    for (let y = 50; y < canvas.height - 50; y += 40) {
      verticalColors.push({ y, color: getHex(cx, y) });
    }

    // Also sample the 4 corners of the inner screen
    return {
      width: canvas.width,
      height: canvas.height,
      verticalColors
    };
  });

  console.log('Phone sample colors:', JSON.stringify(result, null, 2));
  await browser.close();
}

inspectPhone().catch(console.error);
