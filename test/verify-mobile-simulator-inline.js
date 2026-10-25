import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function runVerification() {
  console.log('🚀 Starting Verification: Mobile Phone Simulator placed directly beneath cards and form section...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Mobile 393x852 (User viewport)
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    
    console.log('Navigating to http://localhost:5174/?view=builder...');
    await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('h2', { timeout: 10000 });

    // Step 1: Scroll to show both the cards and the phone simulator directly below
    console.log('Checking Step 1: Cards and Mobile Simulator below...');
    await page.evaluate(() => {
      // Scroll down so the bottom of cards and top of phone simulator are nicely framed
      window.scrollTo({ top: 380, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const step1ScreenshotPath = path.join(artifactsDir, 'qa-mobile-simulator-below-cards.png');
    await page.screenshot({ path: step1ScreenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${step1ScreenshotPath}`);

    // Click "Proceed to Form" to test Step 2
    console.log('Clicking "Proceed to Form"...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const proceedBtn = buttons.find(b => b.innerText.includes('Proceed to Form'));
      if (proceedBtn) proceedBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to check simulator beneath the form
    console.log('Checking Step 2: Form section and Mobile Simulator below...');
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    const step2ScreenshotPath = path.join(artifactsDir, 'qa-mobile-simulator-below-form.png');
    await page.screenshot({ path: step2ScreenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${step2ScreenshotPath}`);

    console.log('🎉 Inline Mobile Simulator verification completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
