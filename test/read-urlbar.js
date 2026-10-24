import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const imgBuffer = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\screenshot_180514.png');
const dataUrl = `data:image/png;base64,${imgBuffer.toString('base64')}`;

async function inspectUrlBar() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1919, height: 969 });
  await page.setContent(`<body style="margin:0"><img id="shot" src="${dataUrl}" /></body>`);
  await new Promise(r => setTimeout(r, 600));

  // The browser address bar in Windows / Chrome is typically at y: 35 to 85, x: 150 to 900
  await page.screenshot({ path: 'test/crop-urlbar.png', clip: { x: 100, y: 30, width: 900, height: 60 } });
  
  // The tab bar is at y: 0 to 45
  await page.screenshot({ path: 'test/crop-tabs.png', clip: { x: 0, y: 0, width: 1200, height: 45 } });

  // And the in-page header at y: 80 to 220
  await page.screenshot({ path: 'test/crop-inpage-header.png', clip: { x: 50, y: 80, width: 800, height: 140 } });

  fs.copyFileSync('test/crop-urlbar.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-urlbar.png');
  fs.copyFileSync('test/crop-tabs.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-tabs.png');
  fs.copyFileSync('test/crop-inpage-header.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\crop-inpage-header.png');

  console.log('Saved crops');
  await browser.close();
}

inspectUrlBar().catch(console.error);
