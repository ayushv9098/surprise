import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_PATH = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-ig-trimmer-mobile.png';
const LOCAL_PATH = 'D:\\avprojects\\surprise-builder\\test\\qa-ig-trimmer-mobile.png';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  // Click Start Creating
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Creating'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Select Birthday
  await page.evaluate(() => {
    const cat = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Birthday'));
    if (cat) cat.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Advance to Form if in mobile toggle mode
  await page.evaluate(() => {
    const proceed = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Form'));
    if (proceed) proceed.click();
    const formToggle = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Form');
    if (formToggle) formToggle.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Switch to Photos & Music tab
  await page.evaluate(() => {
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Photo') || b.textContent.includes('Photos'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Scroll the AudioTrimmer container into view
  const result = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const cropperHeader = allDivs.find(d => d.textContent.trim() === 'Instagram Story Cropper');
    if (cropperHeader) {
      cropperHeader.parentElement.parentElement.scrollIntoView({ behavior: 'instant', block: 'center' });
      return { found: true, text: cropperHeader.textContent };
    }
    // Fallback: scroll window by 650px
    window.scrollBy(0, 650);
    return { found: false };
  });
  console.log('Cropper element scroll result:', result);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: LOCAL_PATH });
  fs.copyFileSync(LOCAL_PATH, ARTIFACT_PATH);
  console.log('Mobile screenshot saved and copied successfully!');
  await browser.close();
}

main().catch(console.error);
