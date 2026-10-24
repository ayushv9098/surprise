import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\screenshot_180514.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function inspect() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1919, height: 969 });
  await page.setContent(`<body style="margin:0"><img id="shot" src="${dataUrl}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

  // Let's divide into several crops to understand the entire screen:
  // 1. Top left (tabs, header, category): x:0-800, y:0-300
  await page.screenshot({ path: 'test/crop-180514-header.png', clip: { x: 0, y: 0, width: 900, height: 250 } });
  
  // 2. Center Left (Template cards or inputs): x:0-1000, y:200-700
  await page.screenshot({ path: 'test/crop-180514-center-left.png', clip: { x: 0, y: 200, width: 1000, height: 500 } });

  // 3. Center Right (Phone simulator): x:900-1919, y:100-900
  await page.screenshot({ path: 'test/crop-180514-phone.png', clip: { x: 950, y: 80, width: 900, height: 850 } });

  // 4. Any highlighted/red circled area or cursor
  // Let's check color histogram or find where mouse cursor or agentation pin is!
  const pinInfo = await page.evaluate(() => {
    const img = document.getElementById('shot');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;

    // Search for distinct pink/purple/red circle, or agentation pin (e.g. #e11d48, #ef4444, #f43f5e)
    const redPins = [];
    for (let y = 0; y < h; y += 4) {
      for (let x = 0; x < w; x += 4) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Agentation pin or bright red highlight
        if (r > 220 && g < 50 && b < 100) {
          redPins.push({ x, y, r, g, b });
        }
      }
    }
    return { redPinsCount: redPins.length, samplePins: redPins.slice(0, 10) };
  });

  console.log('Pin detection:', pinInfo);

  // Copy crops to brain
  fs.copyFileSync('test/crop-180514-header.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-180514-header.png');
  fs.copyFileSync('test/crop-180514-center-left.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-180514-center-left.png');
  fs.copyFileSync('test/crop-180514-phone.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-180514-phone.png');

  await browser.close();
}

inspect().catch(console.error);
