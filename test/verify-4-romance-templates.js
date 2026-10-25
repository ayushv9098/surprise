import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function runVerification() {
  console.log('🚀 Starting Verification for 4 Romance (Special Someone) Templates...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Test on Mobile 393x852 (Pixel/iPhone viewport matching user)
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    
    console.log('Navigating to http://localhost:5174/?view=builder&category=romance&template=velvet-romance...');
    await page.goto('http://localhost:5174/?view=builder&category=romance&template=velvet-romance', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the styles grid to render
    await page.waitForSelector('h2', { timeout: 10000 });

    // Inspect template cards in the style selector
    const templateCards = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      return headings.map(h => h.innerText.trim());
    });

    console.log('Found romance template headings:', templateCards);

    // Scroll to style selector area
    await page.evaluate(() => {
      const el = document.querySelector('h2');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot of mobile view with 4 romance templates
    const mobileScreenshotPath = path.join(artifactsDir, 'qa-4-romance-templates-mobile.png');
    await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
    console.log(`Saved mobile screenshot: ${mobileScreenshotPath}`);

    // Now test desktop 1280x720
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 600));

    const desktopScreenshotPath = path.join(artifactsDir, 'qa-4-romance-templates-desktop.png');
    await page.screenshot({ path: desktopScreenshotPath, fullPage: false });
    console.log(`Saved desktop screenshot: ${desktopScreenshotPath}`);

    // Click on Amethyst Dream template to verify selection state
    const clickedAmethyst = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const amethystCard = cards.find(h => h.innerText.includes('Amethyst'));
      if (amethystCard) {
        const cardParent = amethystCard.closest('.group');
        if (cardParent) {
          cardParent.click();
          return true;
        }
      }
      return false;
    });

    console.log('Clicked Amethyst Dream card:', clickedAmethyst);
    await new Promise(r => setTimeout(r, 800));

    const selectedAmethystScreenshot = path.join(artifactsDir, 'qa-amethyst-selected-desktop.png');
    await page.screenshot({ path: selectedAmethystScreenshot, fullPage: false });
    console.log(`Saved selected amethyst screenshot: ${selectedAmethystScreenshot}`);

    console.log('🎉 Romance verification completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
