import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\screenshot_180514.png');
const base64Data = imgBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64Data}`;

async function analyze() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <img id="shot" src="${dataUrl}" />
      </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 1000));

  const dims = await page.evaluate(() => {
    const img = document.getElementById('shot');
    return {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    };
  });

  console.log('Screenshot dimensions:', dims);

  // Resize viewport to match image natural size
  if (dims.naturalWidth > 0 && dims.naturalHeight > 0) {
    await page.setViewport({ width: dims.naturalWidth, height: dims.naturalHeight });
  }

  // Save full view
  await page.screenshot({ path: 'test/view-180514-full.png' });
  console.log('Saved test/view-180514-full.png');

  // Let's divide into regions
  // 1. Left panel: Template Selector & Cards (x: 0 to 60%)
  const w = dims.naturalWidth;
  const h = dims.naturalHeight;
  
  const leftClip = { x: 0, y: 0, width: Math.round(w * 0.58), height: h };
  await page.screenshot({ path: 'test/view-180514-left.png', clip: leftClip });
  console.log('Saved test/view-180514-left.png');

  // 2. Right panel: Phone Simulator (x: 55% to 100%)
  const rightClip = { x: Math.round(w * 0.52), y: 0, width: Math.round(w * 0.48), height: h };
  await page.screenshot({ path: 'test/view-180514-right.png', clip: rightClip });
  console.log('Saved test/view-180514-right.png');

  // 3. Grid of Cards specific zoom
  // Usually around y: 15% to 65% on the left side
  const cardsClip = {
    x: Math.round(w * 0.05),
    y: Math.round(h * 0.15),
    width: Math.round(w * 0.50),
    height: Math.round(h * 0.70)
  };
  await page.screenshot({ path: 'test/view-180514-cards.png', clip: cardsClip });
  console.log('Saved test/view-180514-cards.png');

  // Also sample colors from the Royal Sapphire card area in the screenshot
  const info = await page.evaluate(() => {
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
      topLeft: getHex(10, 10),
      centerLeft: getHex(Math.round(canvas.width * 0.25), Math.round(canvas.height * 0.35)),
      centerRight: getHex(Math.round(canvas.width * 0.75), Math.round(canvas.height * 0.5)),
    };
  });
  console.log('Color info:', info);

  await browser.close();
}

analyze().catch(console.error);
