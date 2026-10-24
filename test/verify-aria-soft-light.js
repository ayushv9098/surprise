import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyAriaSite() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  // Viewport matching user's exact screen: 1280x800 and 1280x551
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5174/?v=aria-s91z4', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Intro / Landing view of Aria's site
  await page.screenshot({ path: 'test/aria-new-intro.png' });
  console.log('Saved test/aria-new-intro.png');

  // Click "Open" or "Tap to Open" to go into the scenes
  const clickedOpen = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const openBtn = btns.find(b => (b.textContent || '').includes('Open') || (b.textContent || '').includes('Tap'));
    if (openBtn) {
      openBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Open button:', clickedOpen);
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 2: Photos / Main keepsake scene
  await page.screenshot({ path: 'test/aria-new-photos.png' });
  console.log('Saved test/aria-new-photos.png');

  // Click navigation tabs: Letter
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const letterBtn = btns.find(b => (b.textContent || '').includes('Letter') || (b.textContent || '').includes('Khat'));
    if (letterBtn) letterBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 3: Letter scene
  await page.screenshot({ path: 'test/aria-new-letter.png' });
  console.log('Saved test/aria-new-letter.png');

  // Inspect the background color of body and container
  const colorCheck = await page.evaluate(() => {
    const appEl = document.querySelector('.soft-app') || document.body;
    const computed = window.getComputedStyle(appEl);
    return {
      backgroundColor: computed.backgroundColor,
      backgroundImage: computed.backgroundImage ? computed.backgroundImage.substring(0, 100) : '',
      color: computed.color
    };
  });
  console.log('Color check:', colorCheck);

  // Copy screenshots to brain directory
  fs.copyFileSync('test/aria-new-intro.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\aria-new-intro.png');
  fs.copyFileSync('test/aria-new-photos.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\aria-new-photos.png');
  fs.copyFileSync('test/aria-new-letter.png', 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\aria-new-letter.png');

  await browser.close();
}

verifyAriaSite().catch(console.error);
