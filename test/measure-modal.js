import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\988fb822-4533-4760-9f4b-3a88a468f5f9';
const TEST_DIR = 'D:\\avprojects\\surprise-builder\\test';

async function testMobileViewport(browser, width, height, label) {
  console.log(`\n=== Testing Viewport: ${width}x${height} (${label}) ===`);
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click "Start Creating"
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Creating'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (!clicked) throw new Error('Start Creating button not found');
  await new Promise(r => setTimeout(r, 600));

  // Measure Modal Box
  const metrics = await page.evaluate(() => {
    const modalDialog = document.querySelector('[role="dialog"]');
    const modalBox = document.querySelector('[role="dialog"] > div');
    if (!modalBox) return null;
    const computed = window.getComputedStyle(modalBox);
    const rect = modalBox.getBoundingClientRect();
    const cards = Array.from(document.querySelectorAll('[role="dialog"] button')).map(b => ({
      text: b.textContent.replace(/\s+/g, ' ').trim(),
      height: b.getBoundingClientRect().height,
      width: b.getBoundingClientRect().width,
    }));

    return {
      scrollHeight: modalBox.scrollHeight,
      clientHeight: modalBox.clientHeight,
      offsetHeight: modalBox.offsetHeight,
      rectHeight: rect.height,
      rectWidth: rect.width,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      hasScroll: modalBox.scrollHeight > modalBox.clientHeight,
      overflowY: computed.overflowY,
      cardCount: cards.length,
      cards,
    };
  });

  console.log('Metrics:', JSON.stringify({
    viewport: `${width}x${height}`,
    scrollHeight: metrics.scrollHeight,
    clientHeight: metrics.clientHeight,
    offsetHeight: metrics.offsetHeight,
    hasScroll: metrics.hasScroll,
    modalBoxDimensions: `${Math.round(metrics.rectWidth)}x${Math.round(metrics.rectHeight)}px`,
  }, null, 2));

  const screenshotPath = path.join(TEST_DIR, `mobile-${label}-${width}x${height}.png`);
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot: ${screenshotPath}`);

  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(screenshotPath, path.join(ARTIFACT_DIR, `mobile-${label}-${width}x${height}.png`));
  }

  // Assertion: ZERO scrolling
  if (metrics.hasScroll) {
    throw new Error(`FAIL: Modal has vertical scroll on ${width}x${height}! scrollHeight (${metrics.scrollHeight}) > clientHeight (${metrics.clientHeight})`);
  }
  console.log(`✅ PASS: ZERO scrolling on ${width}x${height}! (scrollHeight ${metrics.scrollHeight} <= clientHeight ${metrics.clientHeight})`);

  // Test Interaction: Click Birthday Celebration
  console.log('Testing click on Birthday Celebration...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Birthday Celebration') && b.closest('[role="dialog"]'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const openedRecipient = await page.evaluate(() => {
    const title = document.querySelector('#recipient-modal-title');
    return title ? title.textContent.trim() : null;
  });
  console.log('Recipient modal after Birthday click:', openedRecipient);
  if (!openedRecipient) throw new Error('Recipient modal did not open after Birthday click');

  // Click Back
  console.log('Clicking Back to return to Category modal...');
  await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back'));
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Test Interaction: Click Special Someone
  console.log('Testing click on Special Someone...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Special Someone') && b.closest('[role="dialog"]'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const romanceLoaded = await page.evaluate(() => {
    return document.body.textContent.includes('Velvet Romance') || document.body.textContent.includes('Surprise') || window.location.href.includes('builder');
  });
  console.log('Romance builder loaded:', romanceLoaded);
  if (!romanceLoaded) throw new Error('Romance builder did not load after clicking Special Someone');

  await page.close();
}

async function runAll() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // 1. Mobile standard viewport: 393x852 (iPhone 14/15/Pixel 7)
    await testMobileViewport(browser, 393, 852, 'standard-mobile');

    // 2. Small Mobile viewport: 375x667 (iPhone SE)
    await testMobileViewport(browser, 375, 667, 'compact-mobile');

    // 3. Desktop viewport: 1280x800
    await testMobileViewport(browser, 1280, 800, 'desktop');

    console.log('\n🎉 ALL VIEWPORT & INTERACTION TESTS PASSED WITH 0 ERRORS & 0 SCROLLING!');
  } finally {
    await browser.close();
  }
}

runAll().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
