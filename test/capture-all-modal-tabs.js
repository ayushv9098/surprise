import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });

  // Open Privacy modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('footer button'));
    const btn = btns.find(b => b.textContent.includes('Privacy Policy'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click Terms
  await page.evaluate(() => {
    const modal = document.querySelector('div[role="dialog"]');
    const termsBtn = Array.from(modal.querySelectorAll('.grid button')).find(b => b.textContent.includes('Terms'));
    if (termsBtn) termsBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-footer-modal-tabs-terms.png') });

  // Click Security
  await page.evaluate(() => {
    const modal = document.querySelector('div[role="dialog"]');
    const secBtn = Array.from(modal.querySelectorAll('.grid button')).find(b => b.textContent.includes('Security'));
    if (secBtn) secBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'qa-footer-modal-tabs-security.png') });

  console.log('✅ Terms and Security screenshots captured successfully!');
  await browser.close();
})();
