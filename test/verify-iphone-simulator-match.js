import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function verifyIPhoneSimulator() {
  console.log('🚀 Verifying Redesigned iPhone 15/16 Pro Simulator...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // 1. Desktop Test (1280x900)
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Evaluate hardware elements
    const desktopInfo = await page.evaluate(() => {
      const chassis = document.querySelector('.relative.shrink-0.select-none');
      const timeSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('9:08') || s.textContent.includes('8:41'));
      const homeBar = document.querySelector('.w-36.bg-black\\/80, .w-32.bg-black, .w-28.bg-black, [class*="Home Indicator"], [class*="home-bar"]');
      const safariAddressBar = document.querySelector('.bg-\\[\\#e8e8e9\\]');

      return {
        hasChassis: !!chassis,
        timeText: timeSpan ? timeSpan.textContent.trim() : null,
        hasSafariAddressBar: !!safariAddressBar,
      };
    });

    console.log('Desktop Hardware Audit:', desktopInfo);

    // Capture desktop phone simulator screenshot
    const phoneDesktop = await page.$('.relative.shrink-0.select-none');
    const desktopPath = path.join(ARTIFACT_DIR, 'qa-redesigned-iphone-desktop.png');
    if (phoneDesktop) {
      await phoneDesktop.screenshot({ path: desktopPath });
      console.log(`📸 Desktop screenshot saved: ${desktopPath}`);
    }

    // 2. Mobile View Test (393x852)
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to mobile phone simulator
    await page.evaluate(() => {
      const sim = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Live Phone Preview'));
      if (sim) sim.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 400));

    const mobilePath = path.join(ARTIFACT_DIR, 'qa-redesigned-iphone-mobile.png');
    await page.screenshot({ path: mobilePath });
    console.log(`📸 Mobile screenshot saved: ${mobilePath}`);

    console.log('✅ iPhone simulator verification script ready.');
  } finally {
    await browser.close();
  }
}

verifyIPhoneSimulator().catch(err => {
  console.error(err);
  process.exit(1);
});
