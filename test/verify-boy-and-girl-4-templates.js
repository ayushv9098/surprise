import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function runVerification() {
  console.log('🚀 Starting Verification for 4 Boy & 4 Girl Birthday Templates...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Test on Mobile 393x852
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    
    console.log('Navigating to http://localhost:5174/?view=builder...');
    await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('h2', { timeout: 10000 });

    // 1. Verify Boy Templates (Should be 4, with Midnight Onyx replacing Emerald Luxe)
    const boyHeadings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim());
    });
    console.log('Boy Template Headings:', boyHeadings);

    // Scroll to style selector
    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const boyScreenshotPath = path.join(artifactsDir, 'qa-4-boy-templates-midnight.png');
    await page.screenshot({ path: boyScreenshotPath, fullPage: false });
    console.log(`Saved boy screenshot: ${boyScreenshotPath}`);

    // 2. Switch to Girl Birthday
    console.log('Switching to Girl Birthday...');
    await page.evaluate(() => {
      // Find toggle button containing "Switch to Girl" or "For a Boy"
      const buttons = Array.from(document.querySelectorAll('button'));
      const toggle = buttons.find(b => b.innerText.includes('Girl') || b.innerText.includes('Boy'));
      if (toggle) toggle.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Inspect Girl Templates (Should be 4: Blush Blossom, Princess Peach, Lavender Dream, Cinderella Sky)
    const girlHeadings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim());
    });
    console.log('Girl Template Headings:', girlHeadings);

    const girlScreenshotPath = path.join(artifactsDir, 'qa-4-girl-templates-cinderella.png');
    await page.screenshot({ path: girlScreenshotPath, fullPage: false });
    console.log(`Saved girl screenshot: ${girlScreenshotPath}`);

    // 3. Desktop verification with Phone Simulator
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 600));

    // Select Cinderella Sky
    const clickedCinderella = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const card = cards.find(h => h.innerText.includes('Cinderella'));
      if (card) {
        const parent = card.closest('.group');
        if (parent) {
          parent.click();
          return true;
        }
      }
      return false;
    });
    console.log('Clicked Cinderella Sky:', clickedCinderella);
    await new Promise(r => setTimeout(r, 800));

    const cinderellaScreenshotPath = path.join(artifactsDir, 'qa-cinderella-selected-desktop.png');
    await page.screenshot({ path: cinderellaScreenshotPath, fullPage: false });
    console.log(`Saved Cinderella desktop screenshot: ${cinderellaScreenshotPath}`);

    console.log('🎉 Verification completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
