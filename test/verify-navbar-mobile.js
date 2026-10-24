import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const OUTPUT_FILE = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-navbar-mobile-font.png';

async function verifyNavbarMobile() {
  console.log('📱 DEARLY MOBILE NAVBAR & HERO QA VERIFICATION');
  console.log(`Loading ${BASE_URL} at 393x852...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 393,
      height: 852,
      deviceScaleFactor: 2
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('header', { timeout: 10000 });

    // Wait a moment for web fonts to fully render
    await page.evaluateHandle('document.fonts.ready');

    const brandDetails = await page.evaluate(() => {
      const brandSpan = document.querySelector('header button span');
      const header = document.querySelector('header');
      if (!brandSpan) return null;
      const computed = window.getComputedStyle(brandSpan);
      const headerRect = header.getBoundingClientRect();
      const brandRect = brandSpan.getBoundingClientRect();
      return {
        text: brandSpan.innerText,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        color: computed.color,
        headerHeight: headerRect.height,
        brandTop: brandRect.top,
        brandHeight: brandRect.height
      };
    });

    console.log('Brand Details:', JSON.stringify(brandDetails, null, 2));

    // Focused screenshot of navbar and top hero section (0 to ~480px)
    await page.screenshot({
      path: OUTPUT_FILE,
      clip: {
        x: 0,
        y: 0,
        width: 393,
        height: 480
      }
    });

    console.log(`✅ Saved focused screenshot to: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('QA Error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

verifyNavbarMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
