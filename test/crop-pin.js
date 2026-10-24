import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\screenshot_180514.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function cropPin() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1919, height: 969 });
  await page.setContent(`<body style="margin:0"><img id="shot" src="${dataUrl}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

  // Crop zoomed-in around the pin: x: 1148, y: 572
  await page.screenshot({
    path: 'test/crop-pin-zoom.png',
    clip: { x: 1000, y: 400, width: 400, height: 400 }
  });
  console.log('Saved test/crop-pin-zoom.png');

  // Also crop the entire phone simulator in the screenshot: x: 900 to 1600, y: 50 to 950
  await page.screenshot({
    path: 'test/crop-full-phone.png',
    clip: { x: 900, y: 50, width: 700, height: 900 }
  });
  console.log('Saved test/crop-full-phone.png');

  // Copy to brain
  fs.copyFileSync('test/crop-pin-zoom.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-pin-zoom.png');
  fs.copyFileSync('test/crop-full-phone.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-full-phone.png');

  await browser.close();
}

cropPin().catch(console.error);
